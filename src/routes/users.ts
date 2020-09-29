import express from "express";
import {createUser, getUserData, updatePassword, getUserToken} from "../services/users";
import {getFiles, createFolder, renameFile, removeFile, replaceFile, copyFile} from "../services/files";
import jwtAuth from "../utils/jwt-auth";
import {validationResult} from "express-validator";

const {registerValidators, passwordValidator} = require("../utils/validators");

const users = express.Router();

users.get('/token', async (req, res) => {
    const {email, password} = req.query;
    await getUserToken((email as string).toLowerCase(), password as string,
        (code, data) => res.status(code).send(data));
});

users.get('/user/:id', jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getUserData(+id, (code, data) => res.status(code).send(data));
});

users.post('/user', [registerValidators, passwordValidator], async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = '';
        for (const err of errors.array()) {
            message += err.msg + ' ';
        }
        res.status(422).send({message: message.slice(0, -1)});
    } else {
        await createUser(email.toLowerCase(), password, firstName, lastName,
            ((code, data) => res.status(code).send(data)));
    }
});

users.post('/password', passwordValidator, async (req, res) => {
    const {password, token} = req.body;
    await updatePassword(token as string, password as string, (code, data) => res.status(code).send(data));
});

users.get('/files', jwtAuth, async (req, res) => {
    const {path} = req.query;
    await getFiles(req['user_id'], path as string, 'u', (code, data) => res.status(code).send(data));
});

users.post('/folder', jwtAuth, async (req, res) => {
    const {currentFolder, newFolder} = req.body;
    await createFolder(req['user_id'], currentFolder, newFolder, 'u',
        (code, data) => res.status(code).send(data));
});

users.put('/file/rename', jwtAuth, async (req, res) => {
    const {currentFolder, oldName, newName} = req.body;
    await renameFile(req['user_id'], currentFolder, oldName, newName, 'u', (code, data) => res.status(code).send(data));
});

users.put('/file/copy', jwtAuth, async (req, res) => {
    const {currentPath, newPath} = req.body;
    await copyFile(req['user_id'], currentPath, newPath, 'u', (code, data) => res.status(code).send(data));
});

users.put('/file/cut', jwtAuth, async (req, res) => {
    const {oldPath, newPath} = req.body;
    await replaceFile(req['user_id'], oldPath, newPath, 'u', (code, data) => res.status(code).send(data));
});

users.delete('/file', jwtAuth, async (req, res) => {
    const {path} = req.query;
    await removeFile(req['user_id'], path as string, 'u', (code, data) => res.status(code).send(data));
});

export default users;
