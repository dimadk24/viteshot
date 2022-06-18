'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function preactConfiguration() {
    return {
        packages: ["preact"],
        defaultImports: false,
        plugins: [
            {
                name: "preact",
                config() {
                    return {
                        esbuild: {
                            jsxFactory: "h",
                            jsxFragment: "Fragment",
                        },
                        resolve: {
                            alias: {
                                "react-dom": "preact/compat",
                                react: "preact/compat",
                            },
                        },
                    };
                },
                transform(code, id) {
                    if (id.endsWith("sx") && !code.includes(`from "preact"`)) {
                        return `import { h } from 'preact';\n${code}`;
                    }
                    return null;
                },
            },
        ],
    };
}

exports.preactConfiguration = preactConfiguration;
