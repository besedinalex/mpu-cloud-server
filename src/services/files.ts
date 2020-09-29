import {ServiceResponse} from "../types";
import FileManager from "../utils/file-manager";

type Flag = 'u' | 'g';

export async function getFiles(id: number, path: string, flag: Flag, response: ServiceResponse) {
    try {
        const files = await FileManager.getFolderContent(`/${flag}${id}/${path}`);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // These files and folders are considered hidden
            if (file[0] === '.' || file[0] === '$') {
                files.splice(i, 1);
            }
        }
        response(200, {ls: files});
    } catch {
        response(404, {message: 'Указанный путь не найден.'});
    }
}

export async function createFolder(id: number, currentPath: string, folderName: string, flag: 'u' | 'g',
                                   response: ServiceResponse) {
    currentPath = `/${flag}${id}/${currentPath}/`;
    if (!FileManager.pathExists(currentPath)) {
        response(404, {message: 'Папка, в которой вы пытаетесь создать папку, не найдена.'});
        return;
    }
    if (FileManager.pathExists(`${currentPath}/${folderName}`)) {
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
    currentPath = `${flag}${id}/${currentPath}`;
    newPath = `${flag}${id}/${newPath}`;
    if (FileManager.getFullPath(`/${flag}${id}/`) === FileManager.getFullPath(currentPath)) {
        response(400, {message: 'Нельзя скопировать корневую папку.'});
        return;
    }
    if (!FileManager.pathExists(currentPath)) {
        response(404, {message: 'Объект, который вы пытаетесь скопировать, не найден.'});
        return;
    }
    if (FileManager.pathExists(newPath)) {
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

export async function replaceFile(id: number, currentPath: string, newPath: string, flag: Flag,
                                  response: ServiceResponse) {
    currentPath = `${flag}${id}/${currentPath}`;
    newPath = `${flag}${id}/${newPath}`;
    if (FileManager.getFullPath(`/${flag}${id}/`) === FileManager.getFullPath(currentPath)) {
        response(400, {message: 'Нельзя переместить корневую папку.'});
        return;
    }
    if (!FileManager.pathExists(currentPath)) {
        response(404, {message: 'Объект, который вы пытаетесь переместить, не найден.'});
        return;
    }
    if (FileManager.pathExists(newPath)) {
        response(400, {message: 'В данной папке уже есть файл или папка с таким именем.'});
        return;
    }
    try {
        await FileManager.replace(currentPath, newPath);
        response(200, {message: 'Файл или папка успешно перемещен(а).'});
    } catch {
        response(500, {message: 'Не удалось переместить файл или папку.'});
    }
}

export async function renameFile(id: number, currentPath: string, currentName: string, newName: string, flag: Flag,
                                 response: ServiceResponse) {
    currentPath = `/${flag}${id}/${currentPath}/`;
    const oldPath = `${currentPath}/${currentName}`;
    const newPath = `${currentPath}/${newName}`
    if (!FileManager.pathExists(oldPath)) {
        response(404, {message: 'Объект, который вы пытаетесь переименовать, не найден.'});
        return;
    }
    if (FileManager.pathExists(newPath)) {
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
    path = `/${flag}${id}/${path}/`;
    if (FileManager.getFullPath(`/${flag}${id}/`) === FileManager.getFullPath(path)) {
        response(400, {message: 'Нельзя удалить корневую папку.'});
        return;
    }
    if (!FileManager.pathExists(path)) {
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