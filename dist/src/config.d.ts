import * as vite from "vite";
export interface UserConfig {
    framework: FrameworkOptions;
    filePathPattern: string;
    projectPath: string;
    wrapper?: WrapperConfig;
    shooter: Shooter;
    vite?: vite.UserConfig;
}
export declare type FrameworkOptions = {
    type: "react";
    svgr?: {
        componentName: string;
    };
} | {
    type: "preact" | "solid" | "svelte" | "vue";
};
export interface WrapperConfig {
    path: string;
    componentName: string;
}
export interface Shooter {
    shoot(url: string): Promise<string[]>;
}
export declare type Framework = "preact" | "react" | "solid" | "svelte" | "vue";
