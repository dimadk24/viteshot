declare global {
    interface Window {
        __takeScreenshot__(name: string): Promise<void>;
        __done__(error?: string): Promise<void>;
    }
}
export {};
