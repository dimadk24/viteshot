'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var svgr = require('@svgr/core');
var esbuild = require('esbuild');
var fs = require('fs-extra');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var svgr__default = /*#__PURE__*/_interopDefaultLegacy(svgr);
var esbuild__namespace = /*#__PURE__*/_interopNamespace(esbuild);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

// @ts-ignore untyped (pending https://github.com/gregberge/svgr/pull/555)
function svgrPlugin(alias, componentName) {
    componentName = componentName || "ReactComponent";
    return {
        name: "vite:svgr",
        async transform(code, id) {
            if (!id.endsWith(".svg")) {
                return;
            }
            let filePath = id;
            for (const [mapFrom, mapTo] of Object.entries(alias)) {
                const matchStart = path__default['default'].join(path__default['default'].sep, mapFrom);
                if (id.startsWith(matchStart)) {
                    filePath = path__default['default'].join(mapTo, path__default['default'].relative(matchStart, id));
                }
            }
            if (!(await fs__default['default'].pathExists(filePath))) {
                console.warn(`Unable to resolve SVG file: ${id}`);
                return;
            }
            const svg = await fs__default['default'].readFile(filePath, "utf8");
            const generatedSvgrCode = await svgr__default['default'](svg, {}, { componentName: "ReactComponent" });
            const componentCode = generatedSvgrCode.replace("export default ReactComponent", `export { ReactComponent as ${componentName} }`);
            const res = await esbuild__namespace.transform((componentName !== "default" ? code : "") + "\n" + componentCode, {
                loader: "jsx",
            });
            return {
                code: res.code,
            };
        },
    };
}

exports.svgrPlugin = svgrPlugin;
