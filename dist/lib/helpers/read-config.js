'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('path');
var fail = require('./fail.js');
var findFile = require('./find-file.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const CONFIG_FILE_NAMES = ["viteshot.config.js", "viteshot.config.cjs"];
async function readConfig(customConfigFilePath) {
    const configFilePath = customConfigFilePath
        ? path__default['default'].resolve(customConfigFilePath)
        : await findFile.findFileUpwards(...CONFIG_FILE_NAMES);
    if (!configFilePath) {
        return fail.fail(`Could not find viteshot config file. Please run \`viteshot init\` to set it up.`);
    }
    try {
        const stat = await fs__default['default'].stat(configFilePath);
        if (!stat.isFile()) {
            return fail.fail(`Expected to find a valid config file: ${configFilePath}`);
        }
    }
    catch {
        return fail.fail(`Unable to access config file: ${configFilePath}`);
    }
    const config = require(configFilePath);
    const configFileName = path__default['default'].basename(configFilePath);
    if (!config.framework) {
        return fail.fail(`Please specify \`framework\` in ${configFileName}`);
    }
    if (!config.shooter) {
        return fail.fail(`Please specify \`shooter\` in ${configFileName}`);
    }
    if (!config.filePathPattern) {
        return fail.fail(`Please specify \`filePathPattern\` in ${configFileName}`);
    }
    return {
        framework: config.framework,
        shooter: config.shooter,
        projectPath: config.projectPath || path__default['default'].dirname(configFilePath),
        filePathPattern: config.filePathPattern,
        vite: config.vite,
        wrapper: config.wrapper,
    };
}

exports.readConfig = readConfig;
