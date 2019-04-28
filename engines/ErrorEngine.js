class ErrorEngine {
    constructor(x) {
        this.x = x;
    }

    view(data) {
        return this.x.renderViewFromEngine('__errors/index', data);
    }

    controllerMethodNotFound(e, method = '', controller = '') {
        method = `<code> {${method}} </code>`;
        if (controller.length) {
            controller = `<code>{${controller}}</code>`
        }

        let error = {
            message: `Controller ${controller} does not have method ${method}`,
            log: e
        };

        return this.view({error});
    }

    pageNotFound(req) {
        let error = {
            title: `404 Error!`,
            message: `<code>${req.method}: ${req.url}</code> <br><br> Route not found!`
        };

        return this.view({error});
    }
}

ErrorEngine.prototype.x = null;

module.exports = ErrorEngine;