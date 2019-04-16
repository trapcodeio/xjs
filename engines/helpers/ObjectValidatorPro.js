let Validator = require('object-validator-pro');
let ovp = new Validator();

ovp.setEventHandler({
    onEachError: (param, msg) => {
        $.logError('Database: ' + msg);
    }
});


// Set Validation Rules
ovp.addValidator('checkDbConfig', (connection) => {
    return ovp.validate(connection, {
        '*': {must: true},
        password: {must: false}
    });
}, 'Check connection config in knexFile.js');

module.exports = ovp;
