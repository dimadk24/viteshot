'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chalk = require('chalk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

function fail(message) {
    console.error(chalk__default['default'].red(message));
    return process.exit(1);
}

exports.fail = fail;
