import fs from "fs-extra";
import path from "path";

const {DATA_PATH} = require(process.cwd() + '/config.json');

namespace FileManager {

    const basePath = path.join(DATA_PATH, 'storage');

    export function pathExists(filepath: string): boolean {
        return fs.pathExistsSync(path.join(basePath, filepath));
    }

    export function getFullPath(requestPath: string): string {
        return path.join(basePath, requestPath);
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

    export function copy(currentPath: string, newPath: string): Promise<void> {
        currentPath = path.join(basePath, currentPath);
        newPath = path.join(basePath, newPath);
        return fs.copy(currentPath, newPath);
    }

    export function replace(oldPath: string, newPath: string): Promise<void> {
        oldPath = path.join(basePath, oldPath);
        newPath = path.join(basePath, newPath);
        return fs.move(oldPath, newPath);
    }

    export function rename(oldPath: string, newPath: string): Promise<void> {
        oldPath = path.join(basePath, oldPath);
        newPath = path.join(basePath, newPath);
        return fs.rename(oldPath, newPath);
    }

    export function remove(_path: string): Promise<void> {
        _path = path.join(basePath, _path);
        return fs.remove(_path);
    }
}

export default FileManager;