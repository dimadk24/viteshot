'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function svelteConfiguration(projectPath) {
    // Note: This package is an optional peer dependency.
    const { svelte } = require(require.resolve("@sveltejs/vite-plugin-svelte", {
        paths: [projectPath],
    }));
    return {
        packages: ["svelte"],
        defaultImports: true,
        plugins: [svelte()],
    };
}

exports.svelteConfiguration = svelteConfiguration;
