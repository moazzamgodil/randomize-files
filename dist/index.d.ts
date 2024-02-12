#! /usr/bin/env node
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
declare const fs: any;
declare class RandomizeFiles {
    argObj: {
        [key: string]: string;
    };
    EXPORT_DIR: string;
    imgExt: string | undefined;
    completed: string[];
    arr: number[];
    arrKeys: number[];
    constructor();
    getArgs: () => {
        [key: string]: string;
    };
    validateArgs: () => void;
    validateFolders: () => void;
    shuffle: (array: number[]) => number[];
    checkFolder: (path: string) => Promise<void>;
    actionPerform: (from: string, to: string, callback: (err: NodeJS.ErrnoException | null) => void) => void;
    randomizeImages: () => Promise<void>;
    randomizeJson: () => Promise<void>;
    writeFile: (data: string, arr: number, ext: string, dirJson: string, name?: string, description?: string, image?: string) => Promise<void>;
    startMessage: () => void;
    endMessage: () => void;
    log: (data: string) => void;
    randomize: () => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map