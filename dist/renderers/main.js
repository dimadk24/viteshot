/// <reference types="vite/client" />
var _a;
// Default implementation of functions normally injected by the browser.
//
// This is especially useful when running the `debug` command.
if (!window.__takeScreenshot__) {
    window.__takeScreenshot__ = (name) => {
        console.log(`Simulating screenshot: ${name}`);
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };
    window.__done__ = async (errorMessage) => {
        if (errorMessage) {
            console.error(`Done with error: ${errorMessage}`);
        }
        else {
            console.log(`Done without errors.`);
        }
    };
}
// Catch runtime errors and stop immediately.
window.onerror = (event, source, lineno, colno, error) => {
    window.__done__((error && (error.stack || error.message)) || "Unknown error");
};
// Catch Vite errors and also stop immediately.
// @ts-ignore Fixing this error would break ts-node-dev.
(_a = import.meta.hot) === null || _a === void 0 ? void 0 : _a.on("vite:error", (payload) => {
    window.__done__(payload.err.message);
});
