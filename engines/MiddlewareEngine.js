// @ts-check
const fs = require('fs');
let RequestResponseInterceptor = require('./RequestEngine.js');


class MiddlewareEngine {
    /**
     * @param {object} middleware
     * @param {string} action
     */
    constructor(middleware, action = 'allow') {
        // @ts-ignore
        return this.processMiddleware(middleware[action]);
    }

    /**
     * @param {function} middleware
     */
    processMiddleware(middleware) {
        return async function (req, res, next) {
            let middlewareReturns = middleware(new RequestResponseInterceptor(req, res, next));

            if ($.fn.isPromise(middlewareReturns)) {
                middlewareReturns = await middlewareReturns;
            }

            if (middlewareReturns === true) {
                next();
            }
        }
    }
}

/**
 * @param {string} middlewarePath
 * @param {*} action
 */
let middleware = function (middlewarePath, action = undefined) {

    middlewarePath = $.backendPath('middlewares/' + middlewarePath + '.js');
    if (!fs.existsSync(middlewarePath)) {
        $.logErrorAndExit('File: ' + middlewarePath + ' not found!');
    }

    const middlewareFile = require(middlewarePath);

    if (typeof middlewareFile === 'object' && typeof middlewareFile[action] === 'undefined') {
        $.logErrorAndExit('Method {' + action + '} not found in middleware: ' + middlewarePath);
    }

    return new MiddlewareEngine(middlewareFile, action);
};

module.exports = middleware;