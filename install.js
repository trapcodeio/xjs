const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const _extend = require('lodash/extend');
const shellJs = require('shelljs');

const xjsPath = path.resolve(__dirname);

const excludes = [
    'database.sqlite',
    'engines',
    'node_modules',
    'package.json',
    'install.js',
    'yarn.lock',
    'yarn-error.log'
];

const hasEngines = [
    'server.js',
    'xjs.js',
    'tinker.js',
];

const defaultConfig = {
    force: false,
    deleteMe: true
};

let deleteFiles = [];

module.exports = function (installationPath, config) {
    config = _extend({}, defaultConfig, config);

    if (fs.lstatSync(installationPath).isFile()) {
        if (config.deleteMe) deleteFiles.push(installationPath);
        installationPath = path.dirname(installationPath);
    } else {
        installationPath = path.resolve(installationPath);
    }

    if (!fs.existsSync(installationPath)) {
        console.log('===> Install path not found: ' + installationPath);
        process.exit();
    }

    console.log("===> Started Installation!");
    console.log("===> Moving files to " + installationPath);

    let xjsFiles = fs.readdirSync(xjsPath);
    for (let i = 0; i < xjsFiles.length; i++) {
        let xjsFile = xjsFiles[i];
        const fileExistsAlready = fs.existsSync(installationPath + '/' + xjsFile);

        if (!fileExistsAlready || (fileExistsAlready && config.force === true)) {

            if (xjsFile.substr(0, 1) !== '.' && excludes.indexOf(xjsFile) < 0) {
                if (hasEngines.indexOf(xjsFile) >= 0) {
                    let engineFilePath = xjsPath + '/' + xjsFile;
                    let engineFile = fs.readFileSync(engineFilePath).toString();

                    engineFile = engineFile.replace("require('./engines/", "require('@trapcode/xjs/engines/");

                    fs.writeFileSync(installationPath + '/' + xjsFile, engineFile);

                } else {

                    fse.copySync(xjsPath + '/' + xjsFile, installationPath + '/' + xjsFile);

                }
            }

        }
    }

    shellJs.exec('yarn add dotenv');

    if (deleteFiles.length) {
        for (let i = 0; i < deleteFiles.length; i++) {
            const deleteFile = deleteFiles[i];
            if (fs.existsSync(deleteFile)) {
                fse.removeSync(deleteFile);
            }
        }
    }

    console.log('===> Installation Finished!');
};