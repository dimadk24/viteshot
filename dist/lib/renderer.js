'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var connect = require('connect');
var esbuild = require('esbuild');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var friendlyTypeImports = require('rollup-plugin-friendly-type-imports');
var util = require('util');
var vite = require('vite');
var tsconfigPaths = require('vite-tsconfig-paths');

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

var connect__default = /*#__PURE__*/_interopDefaultLegacy(connect);
var esbuild__namespace = /*#__PURE__*/_interopNamespace(esbuild);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var friendlyTypeImports__default = /*#__PURE__*/_interopDefaultLegacy(friendlyTypeImports);
var vite__namespace = /*#__PURE__*/_interopNamespace(vite);
var tsconfigPaths__default = /*#__PURE__*/_interopDefaultLegacy(tsconfigPaths);

async function startRenderer(options) {
    var _a;
    process.chdir(options.projectPath);
    const relativeFilePaths = await util.promisify(glob__default['default'])(options.filePathPattern, {
        ignore: "**/node_modules/**",
        cwd: options.projectPath,
    });
    if (relativeFilePaths.length === 0) {
        throw new Error(`No files found matching pattern: ${options.filePathPattern}`);
    }
    const frameworkConfig = await (async () => {
        const frameworkType = options.framework.type;
        switch (options.framework.type) {
            case "preact":
                const { preactConfiguration } = await Promise.resolve().then(function () { return require('./frameworks/preact.js'); });
                return preactConfiguration();
            case "react":
                const { reactConfiguration } = await Promise.resolve().then(function () { return require('./frameworks/react.js'); });
                return reactConfiguration(options.framework);
            case "solid":
                const { solidConfiguration } = await Promise.resolve().then(function () { return require('./frameworks/solid.js'); });
                return solidConfiguration(options.projectPath);
            case "svelte":
                const { svelteConfiguration } = await Promise.resolve().then(function () { return require('./frameworks/svelte.js'); });
                return svelteConfiguration(options.projectPath);
            case "vue":
                const { vueConfiguration } = await Promise.resolve().then(function () { return require('./frameworks/vue.js'); });
                return vueConfiguration(options.projectPath);
            default:
                throw new Error(`Invalid framework type: ${frameworkType}`);
        }
    })();
    const rendererDirPath = path__default['default'].join(__dirname, "../renderers");
    // Support both production (.js) and development (.ts).
    const extension = (await fs__default['default'].pathExists(path__default['default'].join(rendererDirPath, "main.js")))
        ? ".js"
        : ".ts";
    const mainContent = await fs__default['default'].readFile(path__default['default'].join(rendererDirPath, "main" + extension), "utf8");
    const rendererContent = `${await fs__default['default'].readFile(path__default['default'].join(rendererDirPath, options.framework.type + extension), "utf8")}
  ${options.wrapper
        ? `import { ${options.wrapper.componentName} as Wrapper } from '/${options.wrapper.path}';`
        : "const Wrapper = null;"}
  ${relativeFilePaths
        .map((componentFilePath, i) => `import ${frameworkConfig.defaultImports ? "" : "* as "} componentModule${i} from "/${componentFilePath}";`)
        .join("\n")}

  const components = [
    ${relativeFilePaths
        .map((componentFilePath, i) => {
        const [componentBaseName] = componentFilePath.split(".");
        if (frameworkConfig.defaultImports) {
            return `[\`${componentBaseName}\`, componentModule${i}],`;
        }
        else {
            return `...Object.entries(componentModule${i}[Object.keys(componentModule${i})[0]]).map(([name, component]) => {
              return [\`${componentBaseName}-\${name}\`, component];
            }),`;
        }
    })
        .join("\n")}
  ];

  renderScreenshots(components, Wrapper).then(__done__).catch(e => {
    __done__(e.stack || e.message || "Unknown error");
  });
  `;
    const viteServer = await vite__namespace.createServer({
        root: options.projectPath,
        configFile: false,
        server: {
            middlewareMode: true,
            hmr: {
                overlay: false,
            },
        },
        define: {
            "process.env": {},
        },
        optimizeDeps: {
            esbuildOptions: {
                plugins: [
                    // Ensure that esbuild doesn't crash when encountering JSX in .js files.
                    // Credit: https://github.com/vitejs/vite/discussions/3448#discussioncomment-749919
                    {
                        name: "load-js-files-as-jsx",
                        setup(build) {
                            build.onLoad({ filter: /.*\.js$/ }, async (args) => ({
                                loader: "jsx",
                                contents: await fs__default['default'].readFile(args.path, "utf8"),
                            }));
                        },
                    },
                ],
            },
            entries: [
                ...(options.wrapper ? [options.wrapper.path] : []),
                ...relativeFilePaths,
            ],
            include: [...frameworkConfig.packages],
        },
        ...options.vite,
        plugins: [
            ...frameworkConfig.plugins,
            tsconfigPaths__default['default'](),
            friendlyTypeImports__default['default'](),
            {
                name: "virtual",
                load: async (id) => {
                    if (id === "/__main__.tsx") {
                        return mainContent;
                    }
                    if (id === "/__renderer__.tsx") {
                        return rendererContent;
                    }
                    if (id.endsWith(".js")) {
                        const source = await fs__default['default'].readFile(id, "utf8");
                        const transformed = await esbuild__namespace.transform(source, {
                            loader: "jsx",
                            format: "esm",
                            sourcefile: id,
                        });
                        return transformed;
                    }
                    return null;
                },
            },
            ...(((_a = options.vite) === null || _a === void 0 ? void 0 : _a.plugins) || []),
        ],
    });
    const app = connect__default['default']();
    app.use(async (req, res, next) => {
        if (req.originalUrl !== "/") {
            return next();
        }
        const html = await viteServer.transformIndexHtml(req.originalUrl, `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
          * {
            transition: none !important;
            animation: none !important;
          }

          .viteshot-error {
            color: #e00;
          }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/__main__.tsx"></script>
          <script type="module" src="/__renderer__.tsx"></script>
        </body>
      </html>    
      `);
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    });
    app.use(viteServer.middlewares);
    let server;
    await new Promise((resolve) => (server = app.listen(options.port, resolve)));
    return async () => {
        await viteServer.close();
        await server.close();
    };
}

exports.startRenderer = startRenderer;
