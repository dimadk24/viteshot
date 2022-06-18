import * as vite from "vite";
import { FrameworkConfiguration } from "./config";
export declare function reactConfiguration(config: {
    type: "react";
    svgr?: {
        componentName: string;
    };
}, viteConfig?: vite.UserConfig): FrameworkConfiguration;
