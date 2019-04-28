// @ts-check

const express = require('express');
let RequestEngine = require('./RequestEngine.js');
let MiddleWareEngine = require('./MiddlewareEngine');
let ErrorEngine = require('./ErrorEngine');

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
            let error = new ErrorEngine(x);

            try {
                let boot = undefined;

                if (typeof controller.boot === 'function') {
                    boot = controller.boot(x);
                    if ($.fn.isPromise(boot)) {
                        boot = await boot;
                    }
                }

                let controllerName = '';
                if (typeof controllerName.constructor !== "undefined") {
                    controllerName = controller.constructor.name;
                }

                try {
                    if (typeof controller[method] !== 'function') {
                        return error.controllerMethodNotFound('', method, controllerName)
                    }

                    const $return = controller[method](x, boot);

                    if ($.fn.isPromise($return)) {
                        await $return;
                    }
                } catch (e) {
                    return error.view({
                        error: {
                            message: `Error in Controller:  <code>${controllerName}</code>, Method: <code>${method}</code>`,
                            log: e.stack
                        },
                    })
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

            if (typeof middleware === 'string') {
                if (middleware.includes('.')) {
                    let m = middleware.split('.');
                    m[0] = _.upperFirst(m[0]) + 'Middleware';
                    middlewareFile = m;
                } else {
                    middleware = _.upperFirst(middleware) + 'Middleware';
                    middlewareFile = [middleware, 'allow'];
                }
            }


            if (middlewareMethod === '*' || middlewareMethod === method || (Array.isArray(middlewareMethod) && middlewareMethod.indexOf(method) >= 0)) {
                let path = route.path;

                if (path.trim() === '/') {
                    path = new RegExp('^\/$');
                }

                // @ts-ignore
                if (typeof middleware === "function") {
                    $.app.use(path, middleware);
                } else {
                    $.app.use(path, MiddleWareEngine(middlewareFile[0], middlewareFile[1]));
                }
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