'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

async function findFileUpwards(...possibleNames) {
    let dirPath = process.cwd();
    while (dirPath !== path__default['default'].dirname(dirPath)) {
        for (const name of possibleNames) {
            const filePath = path__default['default'].join(dirPath, name);
            if (await fs__default['default'].pathExists(filePath)) {
                return filePath;
            }
        }
        dirPath = path__default['default'].dirname(dirPath);
    }
    return null;
}

exports.findFileUpwards = findFileUpwards;
