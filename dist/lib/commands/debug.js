'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var print = require('../helpers/print.js');
var readConfig = require('../helpers/read-config.js');
var renderer = require('../renderer.js');

async function debugCommand(options) {
    const config = await readConfig.readConfig(options.config);
    const port = options.port || 3130;
    await renderer.startRenderer({
        ...config,
        port,
    });
    print.info(`Debug server running at http://localhost:${port}`);
}

exports.debugCommand = debugCommand;
