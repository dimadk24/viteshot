#!/usr/bin/env node
'use strict';

var yargs = require('yargs');
var helpers = require('yargs/helpers');
var debug = require('./commands/debug.js');
var init = require('./commands/init.js');
var shoot = require('./commands/shoot.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var yargs__default = /*#__PURE__*/_interopDefaultLegacy(yargs);

yargs__default['default'](helpers.hideBin(process.argv))
    .command("init", "set up an initial config", {}, async (args) => {
    await init.initCommand();
})
    .command(["*", "shoot"], "captures screenshots", (yargs) => {
    return yargs
        .option("config", {
        alias: "c",
        describe: "Path of a config file",
        type: "string",
    })
        .option("push", {
        alias: "p",
        describe: "Automatically create a commit with updated screenshots and push it",
        type: "boolean",
    });
}, async (args) => {
    await shoot.shootCommand(args);
})
    .command(["debug"], "starts the component server for debugging purposes", (yargs) => {
    return yargs
        .option("config", {
        alias: "c",
        describe: "Path of a config file",
        type: "string",
    })
        .option("port", {
        alias: "p",
        describe: "Port on which to run the server",
        type: "number",
    });
}, async (args) => {
    await debug.debugCommand(args);
})
    .demandCommand().argv;
