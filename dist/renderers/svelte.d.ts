import { SvelteComponent } from "svelte";
export declare function renderScreenshots(components: Array<[
    string,
    {
        new (options: {
            target: HTMLElement | null;
            props: any;
        }): SvelteComponent & {
            beforeScreenshot?: (element: HTMLElement) => Promise<void>;
        };
    }
]>): Promise<void>;
