// ts-check
global["moment"] = require("moment");

// Packages to be reused by your xjs project
$.pkgs = {
    buildUrl: require('build-url')

};

// Use Base64 and Object-validator-pro
$.base64 = require('./helpers/Base64');
$.ovp = require('./helpers/ObjectValidatorPro');

/**
 * If database.startOnBoot,
 * Start Database on boot and set to $.db else set undefined
 */
if ($.config.database.startOnBoot) {
    const DB = require('./database/Db');
    $.db = new DB();
} else {
    $.db = undefined;
}

// Use Engine
$.use = require('./UseEngine');

$.bcrypt = require('bcrypt');
$.helpers = require('./helpers.js');

// Assign Functions to $.fn
$.fn = require("./functions/x.fn.js");
