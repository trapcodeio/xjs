/**
 * EachRoute Properties
 * @class
 */
class Route {
    /**
     * @param {string} method
     * @param {string} path
     * @param {string} controller
     * @returns {Route}
     */
    constructor(method, path, controller) {
        if (method === 'children') {
            this.data = {path, children: controller}
        } else {
            this.data = {method, path, controller}
        }
        return this;
    }

    /**
     * Set name this of route.
     * @param {string} name
     * @returns {Route}
     */
    name(name) {
        this.data['name'] = name;
        return this;
    }

    /**
     * Set group prefix name of this route.
     * @param {string} as
     * @returns {Route}
     */
    as(as) {
        this.data['as'] = as;
        return this;

    }

    /**
     * Set Controller of this route
     * @param {string|function} controller
     * @returns {Route}
     */
    controller(controller) {
        this.data['controller'] = controller;
        return this;
    }

    /**
     * Set name of this route using method name
     * @returns {Route}
     */
    actionAsName() {
        if (typeof this.data.children !== 'undefined') return this.actionsAsName();

        let controller = this.data.controller;
        if (!controller) throw new Error('Method: ' + controller + ' not found!');
        let name = '';
        if (controller.indexOf('@') >= 0) {
            name = controller.split('@')[1];
        } else {
            name = controller;
        }

        this.name(name);

        return this;
    }

    /**
     * Sets names of every route in group as their method name
     * @returns {Route}
     */
    actionsAsName() {
        this.data['useMethodAsName'] = true;
        return this;
    }
}

Route.prototype.data = {};
module.exports = Route;