'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var svgrPlugin = require('../plugins/svgr-plugin.js');

function reactConfiguration(config, viteConfig) {
    var _a, _b;
    const alias = (_a = viteConfig === null || viteConfig === void 0 ? void 0 : viteConfig.resolve) === null || _a === void 0 ? void 0 : _a.alias;
    return {
        packages: ["react", "react-dom"],
        defaultImports: false,
        plugins: [
            {
                name: "react",
                transform(code, id) {
                    // Since React 17, importing React is optional when building with webpack.
                    // We do need the import with Vite, however.
                    const reactImportRegExp = /import (\* as )?React[ ,]/;
                    if ((id.endsWith(".js") || id.endsWith("sx")) &&
                        !reactImportRegExp.test(code)) {
                        return `import React from "react";${code}`;
                    }
                    return null;
                },
            },
            svgrPlugin.svgrPlugin(
            // Only record aliases are supported, not arrays.
            alias && !Array.isArray(alias) ? alias : {}, (_b = config.svgr) === null || _b === void 0 ? void 0 : _b.componentName),
        ],
    };
}

exports.reactConfiguration = reactConfiguration;
