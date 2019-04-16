// @ts-check
const {Model} = require('objection');

if ($.config.database.startOnBoot) {
    Model.knex($.db.knex);
}

// A few helpers
/**
 * ShortHand to get required model.
 * @param {string} path
 * @returns {Model}
 */
$.requireModel = function (path) {
    path = _.upperFirst(path);
    return $.backendPath("models/" + path, true);
};

/**
 * Get Model Query
 * @param model
 * @returns {QueryBuilder}
 */
$.getModelQuery = (model) => {
    return $.requireModel(model).query();
};

Model.prototype.$formatJson = function(json) {
    return _.omit(json, this.$hidden);
};

Model.prototype.$hidden = [];

module.exports = Model;