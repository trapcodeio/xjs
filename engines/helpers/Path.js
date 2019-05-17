const Path = require('path');
const pathHelpers = {
    base: 'base://',
    backend: 'backend://',
    frontend: 'frontend://',
    npm: 'npm://',
    migrations: 'migrations://',
    public: 'public://'
};

module.exports = {
    resolve($path) {

        if ($path.includes('://')) {
            let pathHelperKeys = Object.keys(pathHelpers);

            for (let i = 0; i < pathHelperKeys.length; i++) {

                const key = pathHelperKeys[i];

                if ($path.substr(0, key.length) === key) {

                    return this.helperToPath($path, pathHelpers[key])

                }

            }

        }

        return Path.resolve($path);

    },

    helperToPath($path, $helper) {
        $path = $path.substr($helper.length);


        if ($helper === pathHelpers.base) {
            return $.basePath($path)
        } else if ($helper === pathHelpers.npm) {
            return $.basePath(`node_modules/${$path}`);
        } else {

            $helper = $helper.replace('://', '');

            return $.basePath(`${$helper}/${$path}`)
        }
    }
};