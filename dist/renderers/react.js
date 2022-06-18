import React from 'react';
import ReactDOM from 'react-dom';

async function renderScreenshots(components, Wrapper) {
    Wrapper || (Wrapper = React.Fragment);
    const root = document.getElementById("root");
    for (const [name, Component] of components) {
        if (typeof Component !== "function") {
            // This is not a component.
            continue;
        }
        root.innerHTML = "";
        try {
            ReactDOM.render(React.createElement(Wrapper, {}, React.createElement(Component, Component.args || {})), root);
            const beforeScreenshot = Component.beforeScreenshot;
            if (beforeScreenshot) {
                await beforeScreenshot(root);
            }
        }
        catch (e) {
            root.innerHTML = `<pre class="viteshot-error">${e.stack || e}</pre>`;
        }
        await window.__takeScreenshot__(name);
        ReactDOM.unmountComponentAtNode(root);
    }
}

export { renderScreenshots };
