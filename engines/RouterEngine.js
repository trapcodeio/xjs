const fs = require('fs');
const Route = require('./classes/Route');
const Router = $.app;
const ControllerEngine = require('./ControllerEngine');

let AllRoutes = [];
let NameToRoute = {};

let RouterEngine = {
    /**
     * Set path or grouped routes
     * @param {string} path
     * @param {function} routes
     * @returns {Route}
     */
    path(path, routes) {
        let oldRoutes = _.clone(AllRoutes);
        let thisRoutes = [];

        AllRoutes = [];
        routes(this);
        thisRoutes = _.clone(AllRoutes);
        AllRoutes = oldRoutes;

        if (thisRoutes.length) {
            let eachRoute = new Route('children', path, thisRoutes);
            AllRoutes.push(eachRoute);
            return eachRoute;
        }
    },

    /**
     * Express Router All
     * @param {string} path
     * @param {string} action
     * @returns {Route}
     */
    all(path, action) {
        let eachRoute = new Route('all', path, action);
        AllRoutes.push(eachRoute);
        return eachRoute;
    },

    /**
     * Express Router Delete
     * @param {string} path
     * @param {string} action
     * @returns {Route}
     */
    delete(path, action) {
        let eachRoute = new Route('delete', path, action);
        AllRoutes.push(eachRoute);
        return eachRoute;
    },

    /**
     * Express Router Get
     * @param {string} path
     * @param {string} action
     * @returns {Route}
     */
    get(path, action) {
        let eachRoute = new Route('get', path, action);
        AllRoutes.push(eachRoute);
        return eachRoute;
    },

    /**
     * Express Router Post
     * @param {string} path
     * @param {string} action
     * @returns {Route}
     */
    post(path, action) {
        let eachRoute = new Route('post', path, action);
        AllRoutes.push(eachRoute);
        return eachRoute;
    },

    /**
     * Express Router Put
     * @param {string} path
     * @param {string} action
     * @returns {Route}
     */
    put(path, action) {
        let eachRoute = new Route('put', path, action);
        AllRoutes.push(eachRoute);
        return eachRoute;
    },

    /**
     * Get All Registered Routes
     * @returns {AllRoutes}
     */
    allRoutes() {
        return AllRoutes;
    },

    /**
     * @private
     * @param format
     * @returns {string}
     */
    namedRoutes(format = false) {
        if (format !== false) {
            let names = Object.keys(NameToRoute);
            let newFormat = {};
            for (let i = 0; i < names.length; i++) {
                let name = names[i];
                let route = NameToRoute[name];

                newFormat[route.method + ' ' + route.path] = '{' + route.name + '} ===> ' + route.controller;

            }

            // noinspection JSValidateTypes
            if (typeof format === 'string' && format === "json") {
                return JSON.stringify(newFormat, null, 2);
            }

            return newFormat;
        }
        return NameToRoute;
    },

    nameToPath: function (returnKey = 'path') {
        let localVariableName = 'RouterEngine:nameToPath';

        if ($.engineData.has(localVariableName)) {
            return $.engineData.get([localVariableName])
        }

        let names = Object.keys(NameToRoute);
        let newRoutes = {};

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            newRoutes[name] = NameToRoute[name][returnKey];
        }

        if (returnKey !== 'path') return newRoutes;

        $.engineData.set(localVariableName, newRoutes);
        return newRoutes;
    },

    nameToUrl() {
        let localVariableName = 'RouterEngine:nameToUrl';

        if ($.engineData.has(localVariableName)) {
            return $.engineData.get([localVariableName])
        }

        let routes = this.nameToPath();
        let names = Object.keys(routes);
        let newRoutes = {};

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            newRoutes[name] = $.helpers.route(name, [], false);
        }

        $.engineData.set(localVariableName, newRoutes);
        return newRoutes;
    },

    processRoutes(routes = null, parent = {}) {
        if (!Array.isArray(routes)) {
            routes = AllRoutes;
        }

        for (let i = 0; i < routes.length; i++) {
            let route = routes[i]['data'];
            let nameWasGenerated = false;


            if (!route.children && parent.useMethodAsName && !route.name) {
                route.name = route.controller;
                nameWasGenerated = true;
            }

            if (parent.as && typeof route.name === 'string' && route.name.substr(0, 1) !== '/') {
                if (route.path === '' && nameWasGenerated) {
                    route.name = parent.as
                } else {
                    route.name = parent.as + '.' + route.name
                }

            }

            if (route.name) {
                if (route.name.substr(0, 1) === '/') {
                    route.name = route.name.substr(1);
                }
                route.name = route.name.toLowerCase();
            }

            if (parent.controller && route.controller && !route.controller.includes('@')) {
                route.controller = parent.controller + '@' + route.controller
            }


            if (parent.path) {

                if (route.path.length && parent.path.substr(-1) !== '/' && route.path.substr(0, 1) !== '/') {
                    route.path = '/' + route.path;
                }

                route.path = parent.path + route.path;
            }

            if (route.path.substr(0, 2) === '//') {
                route.path = route.path.substr(1);
            }


            if (typeof route.name !== 'undefined') {
                NameToRoute[route.name] = route
            }

            if (typeof route.controller === 'string' && route.controller.includes('@')) {
                let split = route.controller.split('@');
                let controller = split[0];
                let method = split[1];

                let controllerPath = $.backendPath('controllers/' + controller + '.js');

                if (!fs.existsSync(controllerPath)) {
                    if (!controller.toLowerCase().includes('controller')) {
                        controllerPath = $.backendPath('controllers/' + controller + 'Controller.js');
                        if (!fs.existsSync(controllerPath)) {
                            $.logErrorAndExit('Controller: ' + split.join('@') + ' not found');
                        }
                        controller = controller + 'Controller';
                    }
                }

                route.controller = controller + '@' + method;
            }


            if (typeof route.children !== 'undefined' && Array.isArray(route.children) && route.children.length) {
                this.processRoutes(route.children, route);
            } else {
                if (Router && (!$.isTinker && !$.isConsole)) {
                    Router[route.method](route.path, ControllerEngine(route))
                }
            }
        }
    }
};


module.exports = RouterEngine;