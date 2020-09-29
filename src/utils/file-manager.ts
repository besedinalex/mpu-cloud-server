import fs from "fs-extra";

namespace FileManager {

    function pathExists(path: string): boolean {
        return fs.pathExistsSync(path);
    }

    export function getFolderContent(path: string): string[] {
        return fs.readdirSync(path);
    }

    function createFolder(path: string): Promise<void> {
        return fs.mkdir(path);
    }

    function createFile(path: string, file: Buffer): Promise<void> {
        return fs.outputFile(path, file);
    }

    function getFile(path: string): Promise<Buffer> {
        return fs.readFile(path);
    }
}

export default FileManager;