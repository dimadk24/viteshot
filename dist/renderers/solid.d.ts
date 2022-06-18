import { JSX } from "solid-js/jsx-runtime";
export declare function renderScreenshots(components: Array<[
    string,
    ((props: {}) => JSX.Element) & {
        beforeScreenshot?: (element: HTMLElement) => Promise<void>;
    }
]>, Wrapper: ((props: {
    children: JSX.Element;
}) => JSX.Element) | null): Promise<void>;
