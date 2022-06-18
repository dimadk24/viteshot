import { render, createComponent } from 'solid-js/web';

async function renderScreenshots(components, Wrapper) {
    Wrapper || (Wrapper = (props) => props.children);
    const root = document.getElementById("root");
    for (const [name, Component] of components) {
        if (typeof Component !== "function") {
            // This is not a component.
            continue;
        }
        root.innerHTML = "";
        let detach = () => { };
        try {
            detach = render(() => createComponent(Wrapper, {
                children: createComponent(Component, Component.args || {}),
            }), root);
            const beforeScreenshot = Component.beforeScreenshot;
            if (beforeScreenshot) {
                await beforeScreenshot(root);
            }
        }
        catch (e) {
            root.innerHTML = `<pre class="viteshot-error">${e}\n${e.stack}</pre>`;
        }
        await window.__takeScreenshot__(name);
        detach();
    }
}

export { renderScreenshots };
