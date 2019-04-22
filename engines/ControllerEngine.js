// @ts-check

const express = require('express');
const fs = require('fs');

let RequestEngine = require('./RequestEngine.js');
let MiddleWareEngine = require('./MiddlewareEngine');

class ControllerEngine {
    /**
     * @param {function} controller
     * @param {string} method
     */
    constructor(controller, method) {
        return this.processController(controller, method);
    }

    /**
     * @param {function|object} controller
     * @param {string} method
     */
    processController(controller, method) {

        if (typeof controller === 'function') {
            try {
                controller = new controller();
            } catch (e) {
                let router = express.Router();
                return controller(router);
            }
        }

        return async function (req, res) {
            let x = new RequestEngine(req, res);

            try {
                let boot = undefined;

                if (typeof controller.boot === 'function') {
                    boot = controller.boot(x);
                    if ($.fn.isPromise(boot)) {
                        await boot;
                    }
                }

                const $return = controller[method](x, boot);
                if ($.fn.isPromise($return)) {
                    await $return;
                }
            } catch (e) {
                $.logError(e)
            }


        }
    }

    /**
     * @param {object} $middleware
     * @param {string} method
     * @param {object} route
     */
    static addMiddlewares($middleware, method, route) {
        let middlewareKeys = Object.keys($middleware);

        for (let i = 0; i < middlewareKeys.length; i++) {
            let middleware = middlewareKeys[i];
            let middlewareFile = [];
            let middlewareMethod = $middleware[middleware];


            if (middleware.substr(0, 1) === '@') {
                let oldMiddlewareMethod = middlewareMethod;
                middlewareMethod = middleware.substr(1);
                middleware = oldMiddlewareMethod;
            }

            if (middleware.includes('.')) {
                let m = middleware.split('.');
                m[0] = _.upperFirst(m[0]) + 'Middleware';
                middlewareFile = m;
            } else {
                middleware = _.upperFirst(middleware) + 'Middleware';
                middlewareFile = [middleware, 'allow'];
            }

            if (middlewareMethod === '*' || middlewareMethod === method || (Array.isArray(middlewareMethod) && middlewareMethod.indexOf(method) >= 0)) {
                let path = route.path;

                if (path.trim() === '/') {
                    path = new RegExp('^\/$');
                }

                // @ts-ignore
                $.app.use(path, MiddleWareEngine(middlewareFile[0], middlewareFile[1]));
            }
        }
    }
}

ControllerEngine.prototype.controller = function () {
};


/**
 * @param {string | Object | Function} controller
 * @param {string |null} method
 */
let controller = function (controller, method = null) {
    let route = undefined;
    let controllerPath = null;
    if (typeof controller === 'object' && controller.hasOwnProperty('controller')) {
        route = controller;
        controller = controller.controller;

    }

    if (typeof controller === 'string' && controller.includes('@')) {
        let split = controller.split('@');
        controller = split[0];
        method = split[1];


        controllerPath = $.backendPath('controllers/' + controller + '.js');

        controller = require(controllerPath);
    }

    if (typeof controller !== 'function') {
        if (typeof controller === 'string') {
            return $.logErrorAndExit("Controller: {" + controller + "} not found!");
        }
        return $.logErrorAndExit('Controller not found!');
    }

    if (route !== undefined && typeof controller.middleware === 'function') {
        let middleware = controller.middleware();
        ControllerEngine.addMiddlewares(middleware, method, route);
    }

    return new ControllerEngine(controller, method);
};


module.exports = controller;