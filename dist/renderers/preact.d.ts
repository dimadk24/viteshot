import * as Preact from "preact";
export declare function renderScreenshots(components: Array<[
    string,
    Preact.ComponentType<{}> & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
    }
]>, Wrapper: Preact.ComponentType<{}> | null): Promise<void>;
