'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function solidConfiguration(projectPath) {
    // Note: This package is an optional peer dependency.
    const solidPlugin = require(require.resolve("vite-plugin-solid", {
        paths: [projectPath],
    }));
    return {
        packages: ["solid-js"],
        defaultImports: false,
        plugins: [solidPlugin()],
    };
}

exports.solidConfiguration = solidConfiguration;
