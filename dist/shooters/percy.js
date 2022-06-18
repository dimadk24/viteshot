'use strict';

var percySnapshot = require('@percy/puppeteer');
var puppeteer = require('puppeteer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var percySnapshot__default = /*#__PURE__*/_interopDefaultLegacy(percySnapshot);
var puppeteer__default = /*#__PURE__*/_interopDefaultLegacy(puppeteer);

var percy = () => ({
    shoot: async (url) => {
        let browser;
        try {
            browser = await puppeteer__default['default'].launch();
            const page = await browser.newPage();
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
            await page.exposeFunction("__takeScreenshot__", async (name) => {
                console.log(`Capturing: ${name}`);
                await percySnapshot__default['default'](page, name);
            });
            await page.exposeFunction("__done__", done);
            await page.goto(url);
            await donePromise;
            if (errorMessage) {
                throw new Error(errorMessage);
            }
            return [];
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    },
});

module.exports = percy;
