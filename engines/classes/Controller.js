/**
 * Controller
 * @class
 */
class Controller {
    setRequestEngine(requestEngine) {
        this.request = requestEngine;
    }
}

Controller.prototype.request = null;

module.exports = Controller;