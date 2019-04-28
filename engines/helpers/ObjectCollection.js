// @ts-check

/**
 * ObjectCollectionClass
 */
class ObjectCollection {
    /**
     * @param {object} data
     */
    constructor(data = {}) {
        this.___data = data;
        return this;
    }

    /**
     * Get path of object or return.
     * @method
     * @param {string} path
     * @param {*} $default
     * @return {*}
     */
    get(path, $default = undefined) {
        // @ts-ignore
        return _.get(this.___data, path, $default);
    }

    /**
     * Has path in object
     * @method
     * @param {string} path
     * @return {boolean}
     */
    has(path) {
        // @ts-ignore
        return _.has(this.___data, path);
    }

    /**
     * Set value to path of object.
     * @method
     * @param {string} path
     * @param {*} value
     * @return {object}
     */
    set(path, value) {
        // @ts-ignore
        return _.set(this.___data, path, value);
    }

    /**
     * Unset a path in object.
     * @method
     * @param {string} path
     * @return {boolean}
     */
    unset(path) {
        // @ts-ignore
        return _.unset(this.___data, path);
    }

    /**
     * Return all data.
     * @returns {*}
     */
    all() {
        return this.___data;
    }
}

ObjectCollection.prototype.___data = {};

module.exports = ObjectCollection;