import * as Preact from 'preact';

async function renderScreenshots(components, Wrapper) {
    Wrapper || (Wrapper = Preact.Fragment);
    const root = document.getElementById("root");
    for (const [name, Component] of components) {
        if (typeof Component !== "function") {
            // This is not a component.
            continue;
        }
        root.innerHTML = "";
        try {
            Preact.render(Preact.createElement(Wrapper, {}, Preact.createElement(Component, Component.args || {})), root);
            const beforeScreenshot = Component.beforeScreenshot;
            if (beforeScreenshot) {
                await beforeScreenshot(root);
            }
        }
        catch (e) {
            root.innerHTML = `<pre class="viteshot-error">${e.stack || e}</pre>`;
        }
        await window.__takeScreenshot__(name);
        Preact.render(null, root);
    }
}

export { renderScreenshots };
