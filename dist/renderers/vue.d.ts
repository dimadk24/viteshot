import { Component } from "vue";
export declare function renderScreenshots(components: Array<[
    string,
    Component & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
    }
]>): Promise<void>;
