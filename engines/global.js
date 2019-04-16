// ts-check
$.base64 = require('./helpers/Base64');
$.ovp = require('./helpers/ObjectValidatorPro');

if ($.config.database.startOnBoot) {
    let DB = require('./database/Db');
    $.db = new DB();
} else {
    $.db = undefined;
}

$.bcrypt = require('bcrypt');
$.helpers = require('./helpers.js');
