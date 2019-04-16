const knex = require('knex');
const Database = require($.basePath('knexfile.js'));



class DB {
    constructor() {
        const database = Database[$.config.env];
        

        let databaseConfigIsValid = $.ovp.validate(database, {
            'client': {must: true},
            connection: {checkDbConfig: true},
        });

        if (!databaseConfigIsValid)
            process.exit();

        try {
            this.knex = knex(Database[$.config.env]);
        } catch (e) {
            $.logAndExit(e);
        }
    }

    sql(arg) {
        if (arg == null) {
            return this.knex.queryBuilder();
        }
        return this.knex(arg);
    }
}

DB.prototype.knex = null;

module.exports = DB;