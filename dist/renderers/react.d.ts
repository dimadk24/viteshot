import React from "react";
export declare function renderScreenshots(components: Array<[
    string,
    React.ComponentType<{}> & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
    }
]>, Wrapper: React.ComponentType<{}> | null): Promise<void>;
