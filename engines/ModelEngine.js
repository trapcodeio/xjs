// @ts-check
const {
    Model
} = require('objection');

if ($.config.database.startOnBoot) {
    Model.knex($.db.knex);
}

/**
 * @class ModelEngine
 * @member {string[]} $hidden
 * @extends Model
 */
class ModelEngine extends Model {
    /**
     * @param {*} json
     */
    $formatJson(json) {
        json = super.$formatJson(json);
        return _.omit(json, this.$hidden);
    }
}

ModelEngine.prototype.$hidden = [];
module.exports = ModelEngine;