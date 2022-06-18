'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('path');
var fail = require('../helpers/fail.js');
var findFile = require('../helpers/find-file.js');
var print = require('../helpers/print.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

async function initCommand() {
    const packageJsonFilePath = await findFile.findFileUpwards("package.json");
    if (!packageJsonFilePath) {
        return fail.fail(`Unable to find package.json. Are you in the correct directory?`);
    }
    const packageInfo = JSON.parse(await fs__default['default'].readFile(packageJsonFilePath, "utf8"));
    const configFileName = packageInfo.type === "module"
        ? "viteshot.config.cjs"
        : "viteshot.config.js";
    const configFilePath = path__default['default'].join(path__default['default'].dirname(packageJsonFilePath), configFileName);
    if (await fs__default['default'].pathExists(configFilePath)) {
        return fail.fail(`${configFileName} already exists. Exiting early.`);
    }
    const dependencies = packageInfo.dependencies || {};
    let framework;
    if ("preact" in dependencies) {
        framework = "preact";
    }
    else if ("react" in dependencies) {
        framework = "react";
    }
    else if ("solid-js" in dependencies) {
        framework = "solid";
    }
    else if ("svelte" in dependencies) {
        framework = "svelte";
    }
    else if ("vue" in dependencies) {
        framework = "vue";
    }
    else {
        print.warn(`Unable to detect which framework is used in this project. Defaulting to react.`);
        framework = "react";
    }
    await fs__default['default'].writeFile(configFilePath, `const playwrightShooter = require("viteshot/shooters/playwright");
const playwright = require("playwright");

module.exports = {
  framework: {
    type: "${framework}",
  },
  shooter: playwrightShooter(playwright.chromium),
  filePathPattern: "**/*.screenshot.@(js|jsx|tsx|vue|svelte)",
};
`, "utf8");
    print.success(`${configFileName} was created successfully.`);
}

exports.initCommand = initCommand;
