import request from "request-promise";
import path from "path";
import FileManager from "../utils/file-manager";
import GroupsData from "../db/repos/groups";
import ServiceResponse from "../models/service-response";
import FileAction from "../models/files/file-action";
import UsersData from "../db/repos/users";
import FileData from "../models/files/file-data";
import ConvertStatus from "../models/files/convert-status";
import ConverterResponse from "../models/converter-response";

const {UPLOAD_LIMIT, CONVERTER_URL} = require(process.cwd() + '/config.json');

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

const convertQueue: Array<{filepath: string, to: string}> = [];

function fileIsInConvertQueue(filepath: string): boolean {
    return convertQueue.find(x => x.filepath === filepath) !== undefined;
}

async function convertModel(filepath: string, to: string): Promise<ConverterResponse> {
    // Adds convert request to the end of the queue
    convertQueue.push({filepath, to});
    // Waits until it's the last one in the queue to start converting
    while (convertQueue[0].filepath !== filepath || convertQueue[0].to !== to) {
        await new Promise(r => setTimeout(r, 100));
    }
    return new Promise(async (resolve, reject) => {
        // Converts it
        try {
            const res = await request({
                method: "POST",
                url: `${CONVERTER_URL}/model`,
                headers: {'Content-Type': 'multipart/form-data'},
                formData: {
                    'from': path.parse(filepath).ext.slice(1),
                    'to': to,
                    'file': await FileManager.getFileBuffer(filepath)
                }
            });
            resolve(JSON.parse(res) as ConverterResponse);
        } catch {
            reject();
        }
        convertQueue.shift();
    });
}

export async function getFile(userId: number, groupId: number|undefined, filepath: string, extension: string,
                              response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Read);
    if (!hasAccess) {
        response(404, {message: 'Указанный файл не найден.'});
        return;
    }

    filepath = path.join(basePath, filepath);
    if (!await FileManager.pathExists(filepath)) {
        response(404, {message: 'Указанный файл не найден.'});
        return;
    }

    extension = extension.toLowerCase();
    const parsedPath = path.parse(filepath);
    if (parsedPath.ext.slice(1).toLowerCase() === extension) {
        const file = await FileManager.getFileBuffer(filepath);
        response(200, file);
    } else {
        if (parsedPath.base[0] === '$') {
            response(400, {message: 'Нельзя конвертировать файлы из скрытой папки.'});
            return;
        }
        if (fileIsConvertibleModel(filepath)) {
            const requestedFile = path.join(parsedPath.dir, `$${parsedPath.base}`, extension);
            let wasInQueue = false;
            // Checks converter queue for requested extension
            while (convertQueue.find(x => x.filepath === filepath && x.to === extension) !== undefined) {
                wasInQueue = true;
                await new Promise(r => setTimeout(r, 100));
            }
            // Wait for it to save on disk
            if (wasInQueue) {
                await new Promise(r => setTimeout(r, 1500));
            }
            if (!await FileManager.pathExists(requestedFile)) {
                try {
                    const data = await convertModel(filepath, extension);
                    await FileManager.createFile(requestedFile, Buffer.from(data.output, 'base64'));
                    const file = await FileManager.getFileBuffer(requestedFile);
                    response(200, file);
                } catch (err) {
                    response(500, {message: 'Не удалось конвертировать модель.'});
                }
            } else {
                const file = await FileManager.getFileBuffer(requestedFile);
                response(200, file);
            }
        } else {
            response(400, {message: 'Указанный файл не может быть конвертирован.'});
        }
    }
}

export async function getFileInfo(userId: number, groupId: number|undefined, filepath: string,
                                  response: ServiceResponse) {
    const {basePath, hasAccess, groupRequest} = await fileAccess(userId, groupId, FileAction.Read);
    if (!hasAccess) {
        response(404, {message: 'Указанный файл не найден.'});
        return;
    }
    try {
        filepath = path.join(basePath, filepath);
        const fileInfo = await FileManager.getFileInfo(filepath);
        if (fileIsConvertibleModel(filepath)) {
            const fileData = await getFileData(filepath);
            if (groupRequest && fileInfo.isFile) {
                const userData = await UsersData.getUserDataById(fileData.userId!);
                fileInfo.ownerName = userData.firstName + ' ' + userData.lastName;
            }
            if (fileIsConvertibleModel(filepath)) {
                fileInfo.convertStatus =
                    fileData.convertStatus === ConvertStatus.error && fileIsInConvertQueue(filepath)
                ? ConvertStatus.pending : fileData.convertStatus;
            }
        }
        response(200, fileInfo);
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

export async function getFiles(userId: number, groupId: number|undefined, folder: string, response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Read);
    if (!hasAccess) {
        response(404, {message: 'Указанный файл не найден.'});
        return;
    }
    try {
        let files = await FileManager.getFolderContent(path.join(basePath, folder));
        files = files.filter(value => value[0] !== '.' && value[0] !== '$');
        response(200, files);
    } catch {
        response(404, {message: 'Указанный путь не найден.'});
    }
}

export async function uploadFile(userId: number, groupId: number|undefined, currentPath: string, filename: string,
                                 file: Express.Multer.File, response: ServiceResponse) {
    const {basePath, hasAccess, groupRequest} = await fileAccess(userId, groupId, FileAction.Create);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете загрузить файл.'});
        return;
    }

    if (!file) {
        response(400, {message: 'Необходимо выбрать файл.'});
        return;
    }

    while (filename[0] === ' ') {
        filename = filename.slice(1);
    }
    if (filename.length < 1) {
        response(400, {message: 'Имя файла не может быть пустым.'});
        return;
    }

    if (reserved.test(currentPath) || reserved.test(file.originalname)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }

    // Checks file limit in Megabytes
    if (file.size / 1024 / 1024 > UPLOAD_LIMIT) {
        response(400, {message: `Невозможно загрузить файл. Ограничение по размеру файла: ${UPLOAD_LIMIT}Мб.`});
        return;
    }

    currentPath = path.join(basePath, currentPath);
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Папка, в которую вы пытаетесь загрузить файл, не найдена.'});
        return;
    }
    filename = filename === undefined ? file.originalname : filename + path.parse(file.originalname).ext;
    const filepath = path.join(currentPath, filename);
    if (await FileManager.pathExists(filepath)) {
        response(400, {message: 'Файл с таким именем уже существует.'});
        return;
    }
    try {
        await FileManager.createFile(filepath, file.buffer);
        response(201, {message: 'Файл был успешно загружен.'});
        try {
            const reservedFolder = path.join(currentPath, `$${filename}`);
            await FileManager.createFolder(reservedFolder);
            const obj = groupRequest ? {userId} : {};
            const buffer = Buffer.from(JSON.stringify(obj));
            await FileManager.createFile(path.join(reservedFolder, 'data'), buffer);
            if (fileIsConvertibleModel(filepath)) {
                const fileData = await getFileData(filepath);
                fileData.convertStatus = ConvertStatus.error;
                await updateFileData(filepath, fileData);
                try {
                    const data = await convertModel(filepath, 'glb');
                    await FileManager.createFile(path.join(reservedFolder, 'glb'), Buffer.from(data.output, 'base64'));
                    await FileManager.createFile(path.join(reservedFolder, 'png'), Buffer.from(data.thumbnail, 'base64'));
                    fileData.convertStatus = ConvertStatus.success;
                    await updateFileData(filepath, fileData);
                } catch (err) {
                    await updateFileData(filepath, fileData);
                }
            }
        } catch {
            console.log(`Не удалось создать дополнительные файлы для файла ${filepath}.`);
        }
    } catch {
        response(500, {message: 'Не удалось загрузить файл.'});
    }
}

export async function createFolder(userId: number, groupId: number|undefined, currentPath: string, folderName: string,
                                   response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Create);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете создавать папки.'});
        return;
    }

    if (reserved.test(currentPath) || reserved.test(folderName)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = path.join(basePath, currentPath);
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Папка, в которой вы пытаетесь создать папку, не найдена.'});
        return;
    }
    if (await FileManager.pathExists(path.join(currentPath, folderName))) {
        response(400, {message: 'Папка с таким именем уже существует.'});
        return;
    }
    try {
        await FileManager.createFolder(path.join(currentPath, folderName));
        response(201, {message: 'Папка создана.'});
    } catch {
        response(500, {message: 'Не удалось создать папку.'});
    }
}

export async function copyFile(userId: number, groupId: number|undefined, currentPath: string, newPath: string,
                               response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Copy);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете копировать файлы.'});
        return;
    }

    if (reserved.test(currentPath) || reserved.test(newPath)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = path.join(basePath, currentPath);
    newPath = path.join(basePath, newPath);
    if (FileManager.getFullPath(`${basePath}/`) === FileManager.getFullPath(currentPath)) {
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
        const parsedCurrentPath = path.parse(currentPath);
        const parsedNewPath = path.parse(newPath);
        const oldReservedPath = path.join(parsedCurrentPath.dir, `$${parsedCurrentPath.base}`);
        const newReservedPath = path.join(parsedNewPath.dir, `$${parsedNewPath.base}`);
        if (await FileManager.pathExists(oldReservedPath)) {
            await FileManager.copy(oldReservedPath, newReservedPath);
        }
        response(200, {message: 'Файл или папка успешно скопирован(а).'});
    } catch {
        response(500, {message: 'Не удалось скопировать файл или папку.'});
    }
}

export async function renameFile(userId: number, groupId: number|undefined, currentPath: string, currentName: string,
                                 newName: string, response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Rename);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете переименовывать файлы.'});
        return;
    }

    while (newName[0] === ' ') {
        newName = newName.slice(1);
    }
    if (newName.length < 1) {
        response(400, {message: 'Имя файла не может быть пустым.'});
        return;
    }

    if (reserved.test(currentPath) || reserved.test(currentName) || reserved.test(newName)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }

    currentPath = path.join(basePath, currentPath);
    const oldPath = path.join(currentPath, currentName);
    const newPath = path.join(currentPath, newName);
    if (!await FileManager.pathExists(oldPath)) {
        response(404, {message: 'Объект, который вы пытаетесь переименовать, не найден.'});
        return;
    }

    if (fileIsInConvertQueue(oldPath)) {
        response(409, {message: 'Файл не может быть переименован во время его конвертации.'});
        return;
    }

    if (await FileManager.pathExists(newPath)) {
        response(400, {message: 'Файл или папка с таким именем уже существует.'});
        return;
    }

    try {
        await FileManager.rename(oldPath, newPath);
        const oldReservedFolder = path.join(currentPath, `$${currentName}`);
        const newReservedFolder = path.join(currentPath, `$${newName}`);
        if (await FileManager.pathExists(oldReservedFolder)) {
            await FileManager.rename(oldReservedFolder, newReservedFolder);
        }
        response(200, {message: 'Имя файла или папки изменено.'});
    } catch {
        response(500, {message: 'Не удалось изменить имя.'});
    }
}

export async function removeFile(userId: number, groupId: number|undefined, currentPath: string,
                                 response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Remove);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете копировать файлы.'});
        return;
    }

    if (reserved.test(currentPath)) {
        response(400, {message: `Символ '$' зарезервирован для системных файлов.`});
        return;
    }
    currentPath = path.join(basePath, currentPath);
    if (FileManager.getFullPath(`${basePath}/`) === FileManager.getFullPath(currentPath)) {
        response(400, {message: 'Нельзя удалить корневую папку.'});
        return;
    }
    if (!await FileManager.pathExists(currentPath)) {
        response(404, {message: 'Объект, который вы пытаетесь удалить, не найден.'});
        return;
    }

    if (fileIsInConvertQueue(currentPath)) {
        response(409, {message: 'Файл не может быть удален во время его конвертации.'});
        return;
    }

    try {
        await FileManager.remove(currentPath);
        const parsedCurrentPath = path.parse(currentPath);
        const currentReservedPath = path.join(parsedCurrentPath.dir, `$${parsedCurrentPath.base}`);
        if (await FileManager.pathExists(currentReservedPath)) {
            await FileManager.remove(currentReservedPath);
        }
        response(200, {message: 'Удаление файла или папки прошло успешно.'});
    } catch {
        response(500, {message: 'Не удалось удалить файл или папку.'});
    }
}

export async function getModelAnnotations(userId: number, groupId: number|undefined, filepath: string,
                                          response: ServiceResponse) {
    const {basePath, hasAccess} = await fileAccess(userId, groupId, FileAction.Read);
    if (!hasAccess) {
        response(404, {message: 'Указанный файл не найден.'});
        return;
    }
    try {
        filepath = path.join(basePath, filepath);
        const fileData = await getFileData(filepath);
        const annotations = fileData.modelAnnotations!
        response(200, annotations);
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

export async function addModelAnnotation(userId: number, groupId: number|undefined, filepath: string, x: number,
                                         y: number, z: number, name: string, text: string, response: ServiceResponse) {
    const {basePath, hasAccess, groupRequest} = await fileAccess(userId, groupId, FileAction.Create);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете загрузить файл.'});
        return;
    }

    if (x === undefined || y === undefined || z === undefined) {
        response(400, {message: 'Необходимо указать x, y, z.'});
        return;
    }

    filepath = path.join(basePath, filepath);
    try {
        const fileData = await getFileData(filepath);
        const annotations = fileData.modelAnnotations!;
        if (annotations === undefined) {
            fileData.modelAnnotations = [];
        }
        fileData.modelAnnotations?.push({x, y, z, name, text});
        try {
            await updateFileData(filepath, fileData);
            response(201, {message: 'Аннотация успешно добавлена.'});
        } catch {
            response(500, {message: 'Не удалось добавить аннотацию.'});
        }
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

export async function deleteModelAnnotation(userId: number, groupId: number|undefined, filepath: string,
                                            x: number|undefined, y: number|undefined, z: number|undefined,
                                            response: ServiceResponse) {
    const {basePath, hasAccess, groupRequest} = await fileAccess(userId, groupId, FileAction.Remove);
    if (!hasAccess) {
        response(403, {message: 'Вы не можете загрузить файл.'});
        return;
    }

    if (x === undefined || y === undefined || z === undefined) {
        response(400, {message: 'Необходимо указать x, y, z.'});
        return;
    }

    filepath = path.join(basePath, filepath);
    try {
        const fileData = await getFileData(filepath);
        const annotations = fileData.modelAnnotations!;
        if (annotations === undefined) {
            response(404, {message: 'Аннотации не найдены.'});
        } else {
            let annotationFound = false;
            for (let i = 0; i < annotations.length; i++) {
                const annotation = annotations[i];
                if (annotation.x === x && annotation.y === y && annotation.z === z) {
                    fileData.modelAnnotations?.splice(i, 1);
                    annotationFound = true;
                    try {
                        await updateFileData(filepath, fileData);
                        response(200, {message: 'Аннотация удалена.'});
                        break;
                    } catch {
                        response(500, {message: 'Не удалось удалить аннотацию.'});
                        return;
                    }
                }
            }
            if (!annotationFound) {
                response(404, {message: 'Аннотация не найдена.'});
            }
        }
    } catch {
        response(404, {message: 'Указанный файл не найден.'});
    }
}

type FileAccessReturnObj = Promise<{ basePath: string, hasAccess: boolean, groupRequest: boolean }>;

async function fileAccess(userId: number, groupId: number|undefined, accessType: FileAction): FileAccessReturnObj {
    const groupRequest = groupId !== undefined;
    const id = !groupRequest ? userId : groupId;
    const flag = !groupRequest ? 'u' : 'g';
    const basePath = `/${flag}${id}`;
    let hasAccess = true;
    if (groupRequest) {
        try {
            const userAccess = await GroupsData.getUserAccess(groupId!, userId);
            if (accessType !== FileAction.Read && accessType !== FileAction.Create && !(userAccess === 'MODERATOR' || userAccess === 'ADMIN')) {
                hasAccess = false;
            }
        } catch {
            hasAccess = false;
        }
        return {basePath, hasAccess, groupRequest};
    }
    return {basePath, hasAccess, groupRequest};
}

async function getFileData(filepath: string): Promise<FileData> {
    const parsedPath = path.parse(filepath);
    const dataPath = path.join(parsedPath.dir, `$${parsedPath.base}`, 'data');
    const dataInfoBuffer = await FileManager.getFileBuffer(dataPath);
    return JSON.parse(Buffer.from(dataInfoBuffer).toString());
}

async function updateFileData(filepath: string, data: FileData): Promise<void> {
    const parsedPath = path.parse(filepath);
    const dataPath = path.join(parsedPath.dir, `$${parsedPath.base}`, 'data');
    const buffer = Buffer.from(JSON.stringify(data));
    await FileManager.createFile(dataPath, buffer);
}