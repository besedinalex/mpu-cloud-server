import fs from "fs-extra";
import path from "path";
import FileInfo from "../models/file-info";

const {DATA_PATH} = require(process.cwd() + '/config.json');

namespace FileManager {

    const basePath = path.join(DATA_PATH, 'storage');

    export function getFullPath(requestPath: string): string {
        return path.join(basePath, requestPath);
    }

    export function pathExists(filepath: string): Promise<boolean> {
        return fs.pathExists(path.join(basePath, filepath));
    }

    export function getFolderContent(folder: string): Promise<string[]> {
        return fs.readdir(path.join(basePath, folder));
    }

    export function createFolder(folder: string): Promise<void> {
        return fs.mkdir(path.join(basePath, folder));
    }

    export function createFile(filepath: string, data: Buffer): Promise<void> {
        return fs.outputFile(path.join(basePath, filepath), data);
    }

    export function getFileBuffer(filepath: string): Promise<Buffer> {
        return fs.readFile(path.join(basePath, filepath));
    }

    export async function getFileInfo(filepath: string): Promise<FileInfo> {
        filepath = path.join(basePath, filepath);
        const parsedPath = path.parse(filepath);
        const stat = await fs.stat(filepath);
        return {
            name: parsedPath.name,
            extension: parsedPath.ext.slice(1),
            size: stat.size,
            createdTime: stat.ctime
        };
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