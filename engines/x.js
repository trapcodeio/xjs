'use strict'

const packageName = "@trapcode/xjs";

global["$"] = {};
global['_'] = require("lodash");
global["moment"] = require("moment");

// Add Re-usable packages
$.pkgs = {
    os: require('os'),
    buildUrl: require('build-url')
};

/**
 * .Env File Reader Helper
 * @param {string | number} key
 * @param {*} $default
 */
$.env = (key, $default = undefined) => {
    if (typeof process.env[key] === "undefined") {
        return $default;
    }

    return process.env[key];
};

// @ts-ignore
if (typeof XjsConfig["isTinker"] !== "undefined") {
    // @ts-ignore
    $.isTinker = XjsConfig["isTinker"];
} else {
    $.isTinker = false;
}

// Set isConsole if found in global variable.
$.isConsole = typeof global["$isConsole"] !== "undefined";

const DefaultXConfig = require("./config");
$.config = DefaultXConfig;
// @ts-ignore
$.config = _.merge(DefaultXConfig, XjsConfig);

// Delete global config;
delete global["XjsConfig"];

const consoleColors = require("./objects/consoleColors.obj");

/**
 * Log Function
 * @param {*} args
 */
$.log =
    function (...args) {
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

// Display Start Message!
$.logIfNotConsole("Starting Xjs...");

const ObjectCollection = require("./helpers/ObjectCollection");
// add a shortcut to modify $.config
$.myConfig = new ObjectCollection($.config);

const PATH = require("path");
const FS = require("fs-extra");
const paths = $.config.paths;
const baseFiles = paths.base + "/";
const backendFiles = baseFiles + paths.backend + "/";

if (!FS.existsSync(".env")) {
    $.logAndExit(".env file not found!");
}

let EnginePath = baseFiles + "engines/";
if (typeof paths.engine === "string") {
    EnginePath = baseFiles + paths.engine + "/";
} else {
    let nodeModulesEngine = baseFiles + "node_modules/" + packageName + "/engines";
    if (FS.existsSync(nodeModulesEngine)) {
        EnginePath = nodeModulesEngine + "/";
    }
}

if (!FS.existsSync(EnginePath)) {
    $.logAndExit("No Engine Found @ " + EnginePath);
}

if (typeof $.config.server === "undefined") {
    $.logAndExit("Server config not found!");
}

/**
 * @param {string} path
 * @param {boolean} returnRequire
 */
$.basePath = function (path = '', returnRequire = false) {
    if (path[0] === '/') path = path.substr(1);
    const base = baseFiles + path;
    return returnRequire ? require(base) : base;
};

/**
 * @param {string} path
 * @param {boolean} returnRequire
 */
$.backendPath = function (path = '', returnRequire = false) {
    if (path[0] === '/') path = path.substr(1);
    const backend = backendFiles + path;
    return returnRequire ? require(backend) : backend;
};

/**
 * @param {string} path
 * @param {boolean} returnRequire
 */
$.engine = function (path = '', returnRequire = false) {
    if (path[0] === '/') path = path.substr(1);
    const engine = EnginePath + path;
    return returnRequire ? require(engine) : engine;
};

$.engineData = new ObjectCollection();

// Require global variables
require("./global.js");

// Run Http Server if app is not running in console.
if (!$.isConsole) {
    const express = require("express");
    const app = express();

    app.use(function (req, res, next) {
        res.set("X-Powered-By", "Xjs");
        if ($.config.response.overrideServerName) res.set("Server", "Xjs");
        next();
    });

    app.use(
        express.static(paths.public, {
            setHeaders(res, path) {
                const responseConfig = $.config.response;
                if ($.config.response.cacheFiles) {
                    if (responseConfig.cacheIfMatch.length) {
                        const match = $.fn.findWordsInString(
                            path,
                            responseConfig.cacheIfMatch
                        );
                        if (match !== null && match.length) {
                            res.set("Cache-Control", "max-age=" + responseConfig.cacheMaxAge);
                        }
                    } else if (responseConfig.cacheFileExtensions.length) {
                        let files = $.fn.extArrayRegex(responseConfig.cacheFileExtensions);
                        files = path.match(files);

                        if (files !== null && files.length) {
                            res.set("Cache-Control", "max-age=" + responseConfig.cacheMaxAge);
                        }
                    }
                }
            }
        })
    );

    const flash = require("express-flash");
    const bodyParser = require("body-parser");
    const cors = require("cors");
    const session = require("express-session");
    const KnexSessionStore = require("connect-session-knex")(session);
    const knexSessionConfig = {
        client: "sqlite3",
        connection: {
            filename: $.basePath($.config.paths.storage + "/app/db/sessions.sqlite")
        },
        useNullAsDefault: true
    };

    const sessionFilePath = knexSessionConfig.connection.filename;
    if (!FS.existsSync(sessionFilePath)) {
        FS.mkdirpSync(PATH.dirname(sessionFilePath));
    }

    const store = new KnexSessionStore({
        knex: require("knex")(knexSessionConfig),
        tablename: "sessions"
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(
        session(
            _.extend({}, $.config.session, {
                store: store
            })
        )
    );

    app.use(flash());

    app.locals["appData"] = {};
    app.locals["engineData"] = {};

    $.appData = new ObjectCollection(app.locals["appData"]);

    $.app = app;

    // Require Request Engine
    const RequestEngine = require("./RequestEngine");

    app.use(async function (req, res, next) {

        // Convert Empty Strings to Null
        if (req.body && Object.keys(req.body).length) {
            req.body = Object.assign(
                ...Object.keys(req.body).map(key => ({
                    [key]: req.body[key].trim() !== '' ? req.body[key] : null
                }))
            );
        }

        let x = new RequestEngine(req, res);

        if (x.isLogged()) {
            const user = await x.auth();
            res.locals[$.config.auth.templateVariable] = user;
        } else {
            res.locals[$.config.auth.templateVariable] = undefined;
        }

        next()
    });

    // Not Tinker? Require Controllers
    if (!$.isTinker) {
        $.controller = require("./classes/Controller.js");
    }

    // Require Model Engine
    $.model = require("./ModelEngine.js");

    /**
     * Include xjs/cycles/beforeRoutes.js if exists
     * */
    const beforeRoutesPath = $.basePath($.config.paths.xjs + '/cycles/beforeRoutes.js');

    if (FS.existsSync(beforeRoutesPath)) {
        require(beforeRoutesPath);
    }

    // Require and process Application Routes.
    $.router = require("./RouterEngine.js");
    // Require Routes
    $.backendPath("routers/router", true);
    // Process Routes
    $.router.processRoutes();


    app.use(function (req, res, next) {
        let x = new RequestEngine(req, res, next);
        let error = new (require('./ErrorEngine'))(x);
        res.status(404);

        // respond with json
        if (req.xhr) {
            return res.send({error: 'Not found'});
        } else {
            return error.pageNotFound(req);
        }
    });


    /**
     * Include xjs/cycles/afterRoutes.js if exists
     * */
    const afterRoutesPath = $.basePath($.config.paths.xjs + '/cycles/afterRoutes.js');

    if (FS.existsSync(afterRoutesPath)) {
        require(afterRoutesPath);
    }

    // Start server if not tinker
    if (!$.isTinker && $.config.server.startOnBoot) {
        app.set("views", $.backendPath($.config.template.viewsFolder));
        app.set("view engine", $.config.template.engine);

        // @ts-ignore
        const http = require("http").createServer(app);
        const port = $.myConfig.get('server.port', 80);

        http.on('error', $.logError);

        http.listen(port, function () {
            $.log("Server started and available on " + $.helpers.url());
            $.log("PORT:" + port);
        });

        // Start ssl server if server.ssl is available
        if ($.myConfig.has('server.ssl.enabled') && $.config.server.ssl.enabled === true) {
            const https = require("https");
            const httpsPort = $.myConfig.get('server.ssl.port', 443);

            if (!$.myConfig.has('server.ssl.files')) {
                $.logErrorAndExit('Ssl enabled but has no {server.ssl.files} config found.')
            }

            let files = $.myConfig.get('server.ssl.files');

            if (typeof files.key === "undefined" || typeof files.cert === 'undefined') {
                $.logErrorAndExit('Config {server.ssl.files} not configured properly!')
            }

            files.key = PATH.resolve(files.key);
            files.cert = PATH.resolve(files.cert);

            if (!FS.existsSync(files.key)) {
                $.logErrorAndExit('Key file {' + files.key + '} not found!')
            }

            if (!FS.existsSync(files.cert)) {
                $.logErrorAndExit('Cert file {' + files.key + '} not found!')
            }

            files.key = FS.readFileSync(files.key);
            files.cert = FS.readFileSync(files.cert);

            https.createServer(files, app).listen(httpsPort, function () {
                $.log("Server started and available on " + $.helpers.url());
                $.log("PORT:" + httpsPort);
            });
        }
    }
} else {
    $.model = require("./ModelEngine.js");
    $.router = require("./RouterEngine.js");
    $.backendPath("routers/router", true);
    $.router.processRoutes();
}