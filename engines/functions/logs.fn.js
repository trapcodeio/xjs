const consoleColors = require("../objects/consoleColors.obj");
const chalk = require('chalk');
/**
 * Log Function
 * @param {*} args
 */
$.log = function (...args) {
    if (!args.length) return console.log('');

    args.unshift("===>");


    if (args.length === 2 && typeof args[1] === 'string') {
        return console.log(chalk.cyanBright(...args));
    }

    return console.log(...args);
};

$.logInfo = function (...args) {
    if (!args.length) return console.log('');

    args.unshift("=>");

    if (args.length === 2 && typeof args[1] === 'string') {
        return console.log(chalk.magentaBright(...args));
    }

    return console.log(...args);
};

/**
 * Log only if not console
 * @param {*} args
 */
$.logIfNotConsole = function (...args) {
    if (!$.isConsole) {
        $.log(...args);
    }
};

/**
 * @param {*} args
 */
$.logAndExit = function (...args) {
    if (args.length) $.log(...args);
    process.exit();
};

/**
 * @param {*} args
 */
$.logError = function (...args) {
    let end = false;
    if (args[args.length - 1] === true) {
        args.splice(args.length - 1, 1);
        end = true
    }

    console.log(chalk.redBright(...args));


    if (end) {
        return process.exit();
    }
};

/**
 * @param {*} arg
 */
$.logErrorAndExit = function (arg) {
    return $.logError(arg, true);
};

$.logPerLine = function ($logs = [], $spacePerLine=false) {
    console.log();
    for (let i = 0; i < $logs.length; i++) {
        const $log = $logs[i];

        if (typeof $log === "function") {

            $log()

        } else if (typeof $log === "object") {
            const key = Object.keys($log)[0];


            $['log' + _.upperFirst(key)]($log[key]);

        } else {
            if (typeof $log === 'string' && !$log.length) {
                $.log();
            } else {
                $.log($log);
            }
        }

        if($spacePerLine) $.log();
    }
    console.log();
};