const consoleColors = require("../objects/consoleColors.obj");
/**
 * Log Function
 * @param {*} args
 */
$.log = function (...args) {
    args.unshift("===> ");
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

    console.log(consoleColors.fgRed);

    console.log(...args);

    console.log(consoleColors.reset);

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