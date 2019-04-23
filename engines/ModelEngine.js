// @ts-check
const {Model, QueryBuilder} = require('objection');

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

class ModelQueryBuilder extends QueryBuilder {
    /**
     * CountRows
     * @param count
     * @return {Promise<number>}
     */
    async countRows(count='*') {
        return (await this.count(count))[0][`count(${count})`];
    }
}

class ModelEngine extends Model {
    static get QueryBuilder() {
        return ModelQueryBuilder;
    }

    $formatJson(json) {
        return _.omit(json, this.$hidden);
    };
}


ModelEngine.prototype.$hidden = [];

module.exports = ModelEngine;