import fs from "fs-extra";
import path from "path";

const {DATA_PATH} = require(process.cwd() + '/config.json');

namespace FileManager {

    const basePath = path.join(DATA_PATH, 'storage');

    export function pathExists(filepath: string): boolean {
        return fs.pathExistsSync(path.join(basePath, filepath));
    }

    export function getFolderContent(folder: string): string[] {
        return fs.readdirSync(path.join(basePath, folder));
    }

    export function createFolder(folder: string): Promise<void> {
        return fs.mkdir(path.join(basePath, folder));
    }

    export function createFile(filepath: string, data: Buffer): Promise<void> {
        return fs.outputFile(path.join(basePath, filepath), data);
    }

    export function getFile(filepath: string): Promise<Buffer> {
        return fs.readFile(filepath);
    }
}

export default FileManager;