require('dotenv').config();
let config = require('./config');

/*let migrations = {
    tableName: 'migrations'
};

let dbConnection = {
    client: process.env.DATABASE_CLIENT,
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    },
    migrations
};*/

let dbConnection = config.database.config;

module.exports = {
    development: dbConnection,

    staging: dbConnection,

    production: dbConnection
};