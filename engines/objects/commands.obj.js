const os = require('os');
const PATH = require('path');
const fs = require('fs-extra');
const artisan = require('../functions/artisan.fn');
const artisanConfig = $.config.artisan;
const colors = require('./consoleColors.obj');

let logThis = artisan.logThis;

$['console:commands'] = {
    'make:job': function (args) {
        let job = args[0];
        let command = args[1];

        if (typeof job === 'undefined') {
            return logThis('Job name not defined!');
        }

        if (typeof command === 'undefined') {
            command = job.trim();
        }

        let jobsPath = $.backendPath('jobs');
        artisan.copyFromFactoryToApp('job', job, jobsPath, {name: job, command}, false)
    },

    'make:controller': function (args) {
        let controller = args[0];

        if (typeof controller === 'undefined') {
            return logThis('Controller name not defined!');
        }

        let controllersPath = $.backendPath('controllers');
        artisan.copyFromFactoryToApp('controller', controller, controllersPath)
    },

    'make:middleware': function (args) {
        let middleware = args[0];
        if (typeof middleware === 'undefined') {
            return logThis('Middleware name not defined!');
        }

        const middlewaresPath = $.backendPath('middlewares');
        artisan.copyFromFactoryToApp('middleware', middleware, middlewaresPath)
    },

    'make:model': function (args) {
        let name = args[0];
        let table = args[1];

        if (typeof name === 'undefined') {
            return logThis('Model name not defined!');
        }

        if (typeof table === 'undefined') {
            table = artisan.pluralize(name);
        }

        if (artisanConfig.singleModelName) name = artisan.singular(name);
        if (artisanConfig.pluralizeModelTable) table = artisan.pluralize(name).toLowerCase();


        const modelPath = $.backendPath('models');
        artisan.copyFromFactoryToApp('model', name, modelPath, {name, table})
    },

    'make:view': function (args) {
        const config = $.config.template;
        let name = args[0];
        let defaultContent = '';


        if (typeof name === 'undefined') {
            return logThis('View name not defined!');
        }

        if (name === '--routes') {
            defaultContent = $.base64.encode($.router.nameToUrl());
            defaultContent = "<script>" + os.EOL +
                "window['--routes'] = '" + defaultContent + "';" + os.EOL +
                "</script>"
        }

        name += '.' + config.extension;

        const viewsPath = PATH.dirname($.backendPath('views/' + name));

        if (!fs.existsSync(viewsPath)) fs.mkdirpSync(viewsPath);
        const fullPath = $.backendPath('views/' + name);

        if (name.substr(0, 2) !== '--' && fs.existsSync(fullPath)) return artisan.logThisAndExit('view {' + colors.fgYellow + name + colors.fgCyan + '} already exits!');

        if (!defaultContent.length) {
            let defaultContentFile = $.backendPath('views/_.' + config.extension);
            if (fs.existsSync(defaultContentFile)) {
                defaultContent = fs.readFileSync(defaultContentFile).toString();
            }
        }

        fs.writeFileSync(fullPath, defaultContent);
        artisan.logThis("View created successfully!");
        artisan.logThisAndExit("Located @ " + fullPath);
    },

    'publish:views': function () {
        return artisan.copyFolder($.engine('backend/views'), $.backendPath('views'))
    },
};

module.exports = $['console:commands'];