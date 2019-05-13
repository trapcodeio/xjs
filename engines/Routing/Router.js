const Route = require('./Route');
const AllRoutesKey = 'RouterEngine:allRoutes';

let AllRoutes = [];

if ($.engineData.has(AllRoutesKey)) {
    AllRoutes = $.engineData.get(AllRoutesKey);
}

/**
 * Push Route To AllRoutes
 * @param method
 * @param path
 * @param action
 * @function
 * @return {Route}
 */
function pushToRoute(method, path, action) {
    if (action === undefined && path.substr(0, 1) === '@') {
        path = path.substr(1);
        action = path;
    }

    let eachRoute = new Route(method, path, action);
    AllRoutes.push(eachRoute);

    // Update EngineData
    $.engineData.set(AllRoutesKey, AllRoutes);

    return eachRoute;
}

class Router {
    /**
     * Set path or grouped routes
     * @param {string} path
     * @param {function} routes
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static path(path, routes) {
        let oldRoutes = _.clone(AllRoutes);
        AllRoutes = [];
        routes(this);
        let thisRoutes = _.clone(AllRoutes);
        AllRoutes = oldRoutes;

        if (thisRoutes.length) {


            let eachRoute = new Route('children', path, thisRoutes);

            AllRoutes.push(eachRoute);
            $.engineData.set(AllRoutesKey, AllRoutes);

            return eachRoute;
        }

    }

    /**
     * Express Router All
     * @param {string} path
     * @param {string} [action]
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static all(path, action) {
        return pushToRoute('all', path, action);
    }

    /**
     * Express Router Delete
     * @param {string} path
     * @param {string} [action]
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static delete(path, action) {
        return pushToRoute('delete', path, action);
    }

    /**
     * Express Router Get
     * @param {string} path
     * @param {string} [action]
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static get(path, action) {
        return pushToRoute('get', path, action);
    }

    /**
     * Express Router Post
     * @param {string} path
     * @param {string} [action]
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static post(path, action) {
        return pushToRoute('post', path, action);
    }

    /**
     * Express Router Put
     * @param {string} path
     * @param {string} [action]
     *
     * @method
     * @static
     *
     * @returns {Route}
     */
    static put(path, action) {
        return pushToRoute('put', path, action);
    }
}

module.exports = Router;