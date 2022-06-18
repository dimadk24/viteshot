import playwright from "playwright";
import { Shooter } from "../src/config";
declare const _default: (browserType: playwright.BrowserType<{}>, options?: {
    contexts?: Record<string, playwright.BrowserContextOptions>;
    output?: {
        prefixPath?: string;
        suffixPath?: string;
    };
}) => Shooter;
export default _default;
