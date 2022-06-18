'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chalk = require('chalk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

function info(message) {
    console.log(message);
}
function success(message) {
    console.log(chalk__default['default'].green(message));
}
function warn(message) {
    console.warn(chalk__default['default'].yellow(message));
}

exports.info = info;
exports.success = success;
exports.warn = warn;
