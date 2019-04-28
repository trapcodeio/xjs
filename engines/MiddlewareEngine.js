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
            middleware(new RequestResponseInterceptor(req, res, next));
        }
    }
}

/**
 * @param {string} middlewarePath
 * @param {*} action
 */
let middleware = function (middlewarePath, action = undefined) {
    let middlewareFile = $.use.middleware(middlewarePath, false);

    if (middlewareFile === false) {
        return $.logErrorAndExit('Middleware: ' + middlewarePath + ' not found!');
    }

    if (typeof middlewareFile === 'object' && typeof middlewareFile[action] === 'undefined') {
        return $.logErrorAndExit('Method {' + action + '} not found in middleware: ' + middlewarePath);
    }

    return new MiddlewareEngine(middlewareFile, action);
};

module.exports = middleware;