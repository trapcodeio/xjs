const fs = require('fs');
const StringHelper = require('./helpers/String');

let Use = {};
const UsePath = $.backendPath('Use.js');

if ($.engineData.has(UsePath)) {
    // If has usePath Before then Reuse
    Use = $.engineData.get(UsePath);

} else if (fs.existsSync(UsePath)) {
    // Process Use Data
    Use = require(UsePath);

    if (typeof Use['middlewares'] === "object") {
        let useMiddlewares = Use['middlewares'];
        let middlewareKeys = Object.keys(useMiddlewares);

        for (let i = 0; i < middlewareKeys.length; i++) {
            const middlewareKey = middlewareKeys[i];
            const middleware = useMiddlewares[middlewareKey];

            if (fs.existsSync(middleware + '.js')) {
                const suffix = 'Middleware';
                const hasSuffix = StringHelper.hasSuffix(middlewareKey, suffix);
                if (hasSuffix) {
                    Use['middlewares'][StringHelper.withoutSuffix(middlewareKey, suffix)] = middleware;
                    delete Use['middlewares'][middlewareKey];
                } else {
                    Use['middlewares'][middlewareKey] = middleware;
                }
            } else {
                delete Use['middlewares'][middlewareKey];
            }
        }
    }
    $.engineData.set(UsePath, Use);
}

// Functions
function parsePath(path, data = {}) {
    const dataKeys = Object.keys(data);

    if (dataKeys.length) {
        for (let i = 0; i < dataKeys.length; i++) {
            const dataKey = dataKeys[i];
            path = path.replace(`{${dataKey}}`, data[dataKey])
        }
    }
    return path
}

function fileExistsInPath(file, path, suffix = '') {

    if (suffix.length) {
        const hasSuffix = file.substr(-suffix.length) === suffix;

        if (!hasSuffix) {
            file += suffix;
        }
    }

    const fullPath = parsePath(path, {file});

    if (!fs.existsSync(fullPath)) {
        file = StringHelper.upperFirst(file);
        if (!fs.existsSync(parsePath(path, {file}))) {
            return [false, fullPath]
        }
    }

    return [true, fullPath];
}

class UseEngine {
    static file(path) {
        let fullPath = $.backendPath('{file}.js');
        const [hasPath, realPath] = fileExistsInPath(path, fullPath);
        if (!hasPath) {
            return $.logErrorAndExit(`File ${realPath} does not exist!`)
        }
        return require(realPath);
    }

    static model(model, handleError = true) {
        let fullPath = $.backendPath('models/{file}.js');
        const [hasPath, realPath] = fileExistsInPath(model, fullPath);

        if (!hasPath) {
            return !handleError ? false : $.logErrorAndExit(`Model ${realPath} does not exists`)
        }
        return require(realPath);
    }

    static middleware(middleware, handleError = true, suffix = true) {
        if (typeof Use.middlewares === 'object') {
            const useMiddlewares = Use.middlewares;
            const middleWithoutSuffix = StringHelper.withoutSuffix(middleware, 'Middleware');

            if (useMiddlewares.hasOwnProperty(middleWithoutSuffix)) {
                return require(useMiddlewares[middleWithoutSuffix]);
            }
        }

        let fullPath = $.backendPath('middlewares/{file}.js');

        const [hasPath, realPath] = fileExistsInPath(middleware, fullPath, suffix ? 'Middleware' : '');
        if (!hasPath) {
            return !handleError ? false : $.logErrorAndExit(new Error(`Middleware ${realPath} does not exits`));
        }

        return require(realPath);
    }
}

module.exports = UseEngine;