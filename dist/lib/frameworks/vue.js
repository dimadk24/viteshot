'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function vueConfiguration(projectPath) {
    // Note: This package is an optional peer dependency.
    const vue = require(require.resolve("@vitejs/plugin-vue", {
        paths: [projectPath],
    }));
    return {
        packages: ["vue"],
        defaultImports: true,
        plugins: [vue()],
    };
}

exports.vueConfiguration = vueConfiguration;
