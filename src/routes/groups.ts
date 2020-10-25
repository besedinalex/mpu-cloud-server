import express from "express";
import multer from "multer";
import {validationResult} from "express-validator";
import jwtAuth from "../utils/jwt-auth";
import {
    addGroupUser,
    createGroup,
    getAllGroups,
    getGroupData,
    getGroupUsers,
    removeGroupUser
} from "../services/groups";
import {
    copyFile,
    createFolder,
    getFile,
    getFileInfo,
    getFiles,
    removeFile,
    renameFile,
    uploadFile
} from "../services/files";

const {groupValidators} = require("../utils/validators");

const groups = express.Router();
const upload = multer({storage: multer.memoryStorage()});

groups.get('/all', jwtAuth, async (req, res) => {
    await getAllGroups(req['user_id'],
        (code, data) => res.status(code).send(data));
});

groups.get('/group/:id', jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getGroupData(req['user_id'], +id,
        (code, data) => res.status(code).send(data));
});

groups.post('/new', [jwtAuth, groupValidators], async (req, res) => {
    const {title, description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = '';
        for (const err of errors.array()) {
            message += err.msg + ' ';
        }
        res.status(422).send({message: message.slice(0, -1)});
    }
    await createGroup(req['user_id'], title, description,
        (code, data) => res.status(code).send(data));
});

groups.get('/group/:id/users', jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getGroupUsers(req['user_id'], +id,
        (code, data) => res.status(code).send(data));
});

groups.post('/group/:id/user', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {email, access} = req.body;
    await addGroupUser(req['user_id'], +id, email, access,
        (code, data) => res.status(code).send(data));
});

groups.delete('/group/:groupId/user/:userId', jwtAuth, async (req, res) => {
    const {groupId, userId} = req.params;
    await removeGroupUser(req['user_id'], +groupId, +userId,
        (code, data) => res.status(code).send(data));
});

groups.get('/group/:id/files', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {path} = req.query;
    await getFiles(req['user_id'], +id, path as string,
        (code, data) => res.status(code).send(data));
});

groups.get('/group/:id/file', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {path, extension} = req.query;
    await getFile(req['user_id'], +id, path as string, extension as string,
        (code, data) => res.status(code).send(data));
});

groups.get('/group/:id/file/info', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {path} = req.query;
    await getFileInfo(req['user_id'], +id, path as string,
        (code, data) => res.status(code).send(data));
})

groups.post('/group/:id/file', [jwtAuth, upload.single('file')], async (req, res) => {
    const {id} = req.params;
    const {file} = req;
    const {currentPath, filename} = req.body;
    await uploadFile(req['user_id'], +id, currentPath, filename, file,
        (code, data) => res.status(code).send(data));
});

groups.post('/group/:id/folder', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {currentFolder, newFolder} = req.body;
    await createFolder(req['user_id'], +id, currentFolder, newFolder,
        (code, data) => res.status(code).send(data));
});

groups.put('/group/:id/file/rename', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {currentFolder, oldName, newName} = req.body;
    await renameFile(req['user_id'], +id, currentFolder, oldName, newName,
        (code, data) => res.status(code).send(data));
});

groups.put('/group/:id/file/copy', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {currentPath, newPath} = req.body;
    await copyFile(req['user_id'], +id, currentPath, newPath,
        (code, data) => res.status(code).send(data));
});

groups.delete('/group/:id/file', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {path} = req.query;
    await removeFile(req['user_id'], +id, path as string,
        (code, data) => res.status(code).send(data));
});

export default groups;
