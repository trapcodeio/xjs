// Find XjsConfig
if (typeof XjsConfig === 'undefined') {
    console.log('=====> XjsConfig not found!');
    process.exit();
}

// Require Xpresser
global['$isConsole'] = true;
require('./x');

$['console:args'] = process.argv;
if ($['console:args'][2] === '--from-tinker') {
    $.isTinker = true;
    $['console:args'].splice(2, 1);
}

$['console:colors'] = require('./objects/consoleColors.obj');

const args = $['console:args'];

require($.engine('objects/commands.obj'));

// Require artisan helper functions
let argCommand = args[2];
let commands = $['console:commands'];

const fs = require('fs');
const loadJobs = function (path) {
    if (fs.existsSync(path)) {
        let jobFiles = fs.readdirSync(path);
        for (let i = 0; i < jobFiles.length; i++) {
            let jobFile = jobFiles[i];
            let jobFullPath = path + '/' + jobFile;

            if (fs.lstatSync(jobFullPath).isDirectory()) {
                loadJobs(jobFullPath);
            } else if (fs.lstatSync(jobFullPath).isFile()) {

                let job = require(jobFullPath);
                if (typeof job !== 'object') {
                    $.logErrorAndExit('Job: {' + jobFile + '} did not return object!');

                    if (job.hasOwnProperty('command') || !job.hasOwnProperty('handler')) {
                        $.logErrorAndExit('Job: {' + jobFile + '} is not structured properly!')
                    }
                }

                let jobCommand = '@' + job.command;
                commands[jobCommand] = job;
            }
        }
    }
};

class JobHelper {
    static end() {
        process.exit();
    };
}

const jobPath = $.backendPath('jobs');
if (argCommand.substr(0, 1) === '@') {
    loadJobs(jobPath);
}

if (typeof commands[argCommand] === 'undefined') {

    if (typeof $.isTinker === 'boolean' && $.isTinker) {
        $.log('Console Command not found!');
    } else {
        $.logAndExit('Command not found!')
    }

} else {
    // Send only command args to function
    args.splice(0, 3);
    const runFn = commands[argCommand];
    let afterRun = null;
    if (typeof runFn === 'object' && typeof runFn['handler'] === 'function') {
        afterRun = runFn['handler'](args, JobHelper);
    } else {
        afterRun = runFn(args, JobHelper);
    }
}