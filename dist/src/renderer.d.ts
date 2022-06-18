import * as vite from "vite";
import { FrameworkOptions, WrapperConfig } from "./config";
export declare function startRenderer(options: {
    framework: FrameworkOptions;
    projectPath: string;
    filePathPattern: string;
    port: number;
    wrapper?: WrapperConfig;
    vite?: vite.UserConfig;
}): Promise<() => Promise<void>>;
