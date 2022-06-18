'use strict';

var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const DEFAULT_TIMEOUT_MILLIS = 2 * 60 * 1000;
var playwright = (browserType, options = {}) => {
    let prefixPath;
    let suffixPath;
    if (options.output) {
        prefixPath = options.output.prefixPath || "";
        suffixPath = options.output.suffixPath || "";
    }
    else {
        prefixPath = "";
        suffixPath = `__screenshots__/${process.platform}`;
    }
    return {
        shoot: async (url) => {
            const screenshotPaths = new Set();
            let browser;
            async function takeScreenshots(contextName, contextOptions) {
                const context = await browser.newContext(contextOptions);
                const page = await context.newPage();
                page.setDefaultTimeout(DEFAULT_TIMEOUT_MILLIS);
                await page.exposeFunction("__takeScreenshot__", async (name) => {
                    // Ensure all images are loaded.
                    // Source: https://stackoverflow.com/a/49233383
                    await page.evaluate(async () => {
                        const selectors = Array.from(document.querySelectorAll("img"));
                        await Promise.all(selectors.map((img) => {
                            if (img.complete) {
                                return;
                            }
                            return new Promise((resolve) => {
                                img.addEventListener("load", resolve);
                                // If an image fails to load, ignore it.
                                img.addEventListener("error", resolve);
                            });
                        }));
                    });
                    const dirPath = path__default['default'].dirname(name);
                    const baseName = path__default['default'].basename(name);
                    const screenshotPath = path__default['default'].resolve(prefixPath, dirPath, suffixPath, contextName, `${baseName}.png`);
                    const screenshotDirPath = path__default['default'].dirname(screenshotPath);
                    if (suffixPath && !screenshotPaths.has(screenshotDirPath)) {
                        // Ensure the directory is clean (delete old screenshots).
                        screenshotPaths.add(screenshotDirPath);
                        await fs__default['default'].promises.rm(screenshotDirPath, {
                            recursive: true,
                            force: true,
                        });
                    }
                    console.log(`Capturing: ${path__default['default'].relative(process.cwd(), screenshotPath)}`);
                    await page.locator('body').screenshot({
                        path: screenshotPath,
                    });
                });
                let errorMessage = null;
                let done;
                const donePromise = new Promise((resolve) => {
                    done = (receivedErrorMessage) => {
                        if (receivedErrorMessage) {
                            errorMessage = receivedErrorMessage;
                        }
                        resolve();
                    };
                });
                await page.exposeFunction("__done__", done);
                await page.goto(url);
                await donePromise;
                if (errorMessage) {
                    throw new Error(errorMessage);
                }
            }
            // Delete all old screenshots if they live in a top-level directory.
            if (prefixPath) {
                await fs__default['default'].promises.rm(prefixPath, {
                    recursive: true,
                    force: true,
                });
            }
            try {
                browser = await browserType.launch();
                const pendingScreenshots = [];
                for (const [contextName, contextOptions] of Object.entries(options.contexts || { "": {} })) {
                    pendingScreenshots.push(takeScreenshots(contextName, contextOptions));
                }
                await Promise.all(pendingScreenshots);
            }
            finally {
                if (browser) {
                    await browser.close();
                }
            }
            return [...screenshotPaths];
        },
    };
};

module.exports = playwright;
