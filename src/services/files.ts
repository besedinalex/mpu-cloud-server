import request from "request";
import path from "path";
import {ServiceResponse} from "../types";
import FileManager from "../utils/file-manager";
import getFileBuffer = FileManager.getFileBuffer;

// TODO: Implement UPLOAD_LIMIT usage
const {UPLOAD_LIMIT, CONVERTER_URL} = require(process.cwd() + '/config.json');

// Defines whether it's user or group file
type Flag = 'u' | 'g';

type ConverterResponse = {
    output: string;
    thumbnail: string;
}

// RegExp to check for reserved files and folders
const reserved = /\$/;

// Checks if it is 3D-model that can be converted
function fileIsConvertibleModel(filepath: string): boolean {
    const extension = path.parse(filepath).ext.slice(1).toLowerCase();
    const modelsToConvert = [
        'acis', 'sat', 'iges', 'igs', 'jt', 'x_t',
        'x_b', 'xmt_txt', 'xmt_bin', 'xmp_txt', 'xpm_bin',
        'stp', 'step', 'c3d'
    ];
    return modelsToConvert.includes(extension);
}

function convertModel(filepath: string, to: string): Promise<ConverterResponse> {
    return new Promise(async (resolve, reject) => {
        request({
            method: "POST",
            url: `${CONVERTER_URL}/model`,
            headers: {'Content-Type': 'multipart/form-data'},
            formData: {
                'from': path.parse(filepath).ext.slice(1),
                'to': to,
                'file': await getFileBuffer(filepath)
            }
        }, (err, res) => {
            if (err) {
                reject();
            } else {
                resolve(JSON.parse(res.body) as ConverterResponse);
            }
        });
    });
}

export async function getFile(id: number, filepath: string, flag: Flag, response: ServiceResponse) {
    try {
        const file = await FileManager.getFileBuffer(`/${flag}${id}/${filepath}`);
        response(200, file);
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

export async function getFileInfo(id: number, filepath: string, flag: Flag, response: ServiceResponse) {
    try {
        const fileInfo = await FileManager.getFileInfo(`${flag}${id}/${filepath}`);
        response(200, {fileInfo});
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

export async function getFiles(id: number, folder: string, flag: Flag, response: ServiceResponse) {
    try {
        const files = await FileManager.getFolderContent(`/${flag}${id}/${folder}`);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (reserved.test(file)) {
                files.splice(i, 1);
            }
        }
        response(200, {ls: files});
    } catch {
        response(404, {message: 'Указанный путь не найден.'});
    }
}

export async function uploadFile(userId: number, groupId: number | undefined, currentPath: string, filename: string,
                                 file: Express.Multer.File, response: ServiceResponse) {
    if (reserved.test(currentPath) || reserved.test(file.originalname)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    const groupRequest = groupId === undefined;
    const id = !groupRequest ? userId : groupId;
    const flag: Flag = !groupRequest ? 'u' : 'g';
    currentPath = `/${flag}${id}/${currentPath}/`;
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Папка, в которую вы пытаетесь загрузить файл, не найдена.'});
        return;
    }
    filename = filename === undefined ? file.originalname : filename + path.parse(file.originalname).ext;
    const filepath = `${currentPath}/${filename}`;
    if (await FileManager.pathExists(filepath)) {
        response(400, {message: 'Файл с таким именем уже существует.'});
        return;
    }
    try {
        await FileManager.createFile(filepath, file.buffer);
        response(201, {message: 'Файл был успешно загружен.'});
        try {
            const reservedFolder = `${currentPath}/$${filename}`;
            await FileManager.createFolder(reservedFolder);
            if (fileIsConvertibleModel(filepath)) {
                const data = await convertModel(filepath, 'glb');
                await FileManager.createFile(path.join(reservedFolder, 'glb'), Buffer.from(data.output, 'base64'));
                await FileManager.createFile(path.join(reservedFolder, 'png'), Buffer.from(data.thumbnail, 'base64'));
            }
        } catch {
            console.log(`Не удалось создать дополнительные файлы для файла ${filepath}.`);
        }
    } catch {
        response(500, {message: 'Не удалось загрузить файл.'});
    }
}

export async function createFolder(id: number, currentPath: string, folderName: string, flag: Flag,
                                   response: ServiceResponse) {
    if (reserved.test(currentPath) || reserved.test(folderName)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = `/${flag}${id}/${currentPath}/`;
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Папка, в которой вы пытаетесь создать папку, не найдена.'});
        return;
    }
    if (await FileManager.pathExists(`${currentPath}/${folderName}`)) {
        response(400, {message: 'Папка с таким именем уже существует.'});
        return;
    }
    try {
        await FileManager.createFolder(`${currentPath}/${folderName}`);
        response(201, {message: 'Папка создана.'});
    } catch {
        response(500, {message: 'Не удалось создать папку.'});
    }
}

export async function copyFile(id: number, currentPath: string, newPath: string, flag: Flag,
                               response: ServiceResponse) {
    if (reserved.test(currentPath) || reserved.test(newPath)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = `${flag}${id}/${currentPath}`;
    newPath = `${flag}${id}/${newPath}`;
    if (FileManager.getFullPath(`/${flag}${id}/`) === FileManager.getFullPath(currentPath)) {
        response(400, {message: 'Нельзя скопировать корневую папку.'});
        return;
    }
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Объект, который вы пытаетесь скопировать, не найден.'});
        return;
    }
    if (await FileManager.pathExists(newPath)) {
        response(400, {message: 'В данной папке уже есть файл или папка с таким именем.'});
        return;
    }
    try {
        await FileManager.copy(currentPath, newPath);
        response(200, {message: 'Файл или папка успешно скопирован(а).'});
    } catch {
        response(500, {message: 'Не удалось скопировать файл или папку.'});
    }
}

export async function renameFile(id: number, currentPath: string, currentName: string, newName: string, flag: Flag,
                                 response: ServiceResponse) {
    if (reserved.test(currentPath) || reserved.test(currentName) || reserved.test(newName)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = `/${flag}${id}/${currentPath}/`;
    const oldPath = `${currentPath}/${currentName}`;
    const newPath = `${currentPath}/${newName}`
    if (!await FileManager.pathExists(oldPath)) {
        response(404, {message: 'Объект, который вы пытаетесь переименовать, не найден.'});
        return;
    }
    if (await FileManager.pathExists(newPath)) {
        response(400, {message: 'Файл или папка с таким именем уже существует.'});
        return;
    }
    try {
        await FileManager.rename(oldPath, newPath);
        response(200, {message: 'Имя файла или папки изменено.'});
    } catch {
        response(500, {message: 'Не удалось изменить имя.'});
    }
}

export async function removeFile(id: number, path: string, flag: Flag, response: ServiceResponse) {
    if (reserved.test(path)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    path = `/${flag}${id}/${path}/`;
    if (FileManager.getFullPath(`/${flag}${id}/`) === FileManager.getFullPath(path)) {
        response(400, {message: 'Нельзя удалить корневую папку.'});
        return;
    }
    if (!await FileManager.pathExists(path)) {
        response(404, {message: 'Объект, который вы пытаетесь удалить, не найден.'});
        return;
    }
    try {
        await FileManager.remove(path);
        response(200, {message: 'Удаление файла или папки прошло успешно.'});
    } catch {
        response(500, {message: 'Не удалось удалить файл или папку.'});
    }
}