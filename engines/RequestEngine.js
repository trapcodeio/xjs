const requestHelpers = require('./functions/request.fn.js');
const ObjectCollection = require('./helpers/ObjectCollection');


class RequestEngine {
    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    constructor(req, res, next = null) {
        if (req.params) this.params = req.params;
        this.res = res;
        this.req = req;

        if (next !== null) this.next = next;

        this.session = req.session;
        this.bothData = this.all();
        this.locals = new ObjectCollection(res.locals);
        this.fn = _.extend({}, $.helpers, requestHelpers(this));
    }


    async auth() {
        let x = this;

        if (!x.isLogged()) return null;

        let User = $.backendPath('models/User.js', true);
        let email = $.base64.decode(x.session.email);

        let user = await User.query().where('email', email).first();
        return user
    }

    /**
     * Get Auth User Object
     * @returns {*}
     */
    authUser() {
        return this.res.locals[$.config.auth.templateVariable];
    }

    /**
     * Route
     * @returns {*}
     * @param {string} route
     * @param {array} keys
     * @param query
     */
    route(route, keys = [], query = {}) {
        return $.helpers.route(route, keys, query);
    }

    /**
     * get Request Data
     * @param key
     * @param $default
     * @returns {*}
     */
    get(key, $default) {
        if (this.bothData.hasOwnProperty(key)) {
            return this.bothData[key]
        }
        return $default;
    }

    /**
     * Get all or pluck keys
     * @param pluck
     * @returns {*}
     */
    all(pluck = []) {
        let all = _.extend({}, this.req.query, this.req.body);
        if (pluck.length) {
            return _.pick(all, pluck);
        }
        return all;
    }

    /**
     * Pluck data from Request data
     * @param items
     * @returns {*}
     */
    pluck(items = []) {
        return this.all(items);
    }

    /**
     * To API format
     * @param {{}} data
     * @param {boolean} proceed
     * @param {number} status
     */
    toApi(data = {}, proceed = true, status = 200) {
        let d = {};
        d['proceed'] = proceed;

        if (data.hasOwnProperty('__say')) {
            d['__say'] = data['__say'];
            delete data['__say'];
        }

        d['data'] = data;

        this.res.status(status).send(d);
        this.res.end();
    }

    /**
     * Return false to Api
     * @param {object} data
     * @param {number} status
     */
    toApiFalse(data = {}, status = 200) {
        return this.toApi(data, false, status);
    }

    /**
     * Say something to your front end!
     * @param {string} message
     * @param {boolean} proceed
     * @param {number} status
     */
    sayToApi(message, proceed = true, status = 200) {
        return this.toApi({
            __say: message
        }, proceed, status);
    }

    /**
     * Redirect to url.
     * @param {string} path
     * @returns {*}
     */
    redirect(path = '/') {
        this.res.redirect(path);
        return this.res.end();
    }

    /**
     * Redirect Back
     */
    redirectBack() {
        let backURL = this.req.header('Referer') || '/';
        this.redirect(backURL);
    }

    /**
     * Redirect to route
     * @param {string} route
     * @param {Array|string} keys
     * @returns {*}
     */
    redirectToRoute(route, keys = []) {
        return this.redirect(this.route(route, keys))
    }

    /**
     * Render View
     * @param {string} file
     * @param {Object} data
     * @param {boolean} fullPath
     * @returns {*}
     */
    renderView(file, data = {}, fullPath = false) {

        let path = file + '.' + $.config.template.extension;

        this.res.locals['__currentView'] = file;
        this.res.locals['__stackedScripts'] = [];
        this.res.locals['__session'] = this.session;
        data = _.extend({}, this.fn, data);

        if (typeof fullPath === "function")
            return this.res.render(path, data, fullPath);

        return this.res.render(path, data);
    }

    /**
     * Render View From Engine
     * @param {string} file
     * @param {Object} data
     * @returns {*}
     */
    renderViewFromEngine(file, data) {
        const view = $.engine('backend/views/' + file);
        return this.renderView(view, data, true);
    }

    /**
     * If User is logged
     * @returns {boolean}
     */
    isLogged() {
        let x = this;

        if (typeof x.session.email === 'undefined' || typeof x.session.loginKey === 'undefined') {
            return false;
        }

        let email = $.base64.decode(x.session.email);
        let hash = $.base64.decode(x.session.loginKey);

        return !!$.bcrypt.compareSync(email, hash);
    }

    /**
     * Send Message to view
     * @param {Object|string} data
     * @param {*} value
     * @returns {RequestEngine}
     */
    with(data, value = null) {
        if (typeof data === 'string') {
            this.req.flash(data, value)
        } else {
            let dataKeys = Object.keys(data);

            for (let i = 0; i < dataKeys.length; i++) {
                this.req.flash(dataKeys[i], data[dataKeys[i]])
            }
        }

        return this;
    }

    /**
     * Return old values to view after redirect
     * @returns {RequestEngine}
     */
    withOld() {
        let data = this.all();
        let dataKeys = Object.keys(data);

        for (let i = 0; i < dataKeys.length; i++) {
            this.req.flash('old:' + dataKeys[i], data[dataKeys[i]])
        }

        return this;
    }
}

RequestEngine.prototype.req = null;
RequestEngine.prototype.res = null;
RequestEngine.prototype.next = null;
RequestEngine.prototype.params = {};

RequestEngine.prototype.bothData = {};
RequestEngine.prototype.session = {};
RequestEngine.prototype.fn = {};

module.exports = RequestEngine;