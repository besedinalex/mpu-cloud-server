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

const {groupValidators} = require("../utils/validators");

const groups = express.Router();
const upload = multer({storage: multer.memoryStorage()});

groups.get('/all', jwtAuth, async (req, res) => {
    await getAllGroups(req['user_id'], (code, data) => res.status(code).send(data));
});

groups.get('/group/:id', jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getGroupData(req['user_id'], +id, (code, data) => res.status(code).send(data));
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
    await createGroup(req['user_id'], title, description, (code, data) => res.status(code).send(data));
});

groups.get('/group/:id/users', jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getGroupUsers(req['user_id'], +id, (code, data) => res.status(code).send(data));
});

groups.post('/group/:id/user', jwtAuth, async (req, res) => {
    const {id} = req.params;
    const {email, access} = req.body;
    await addGroupUser(req['user_id'], +id, email, access, (code, data) => res.status(code).send(data));
});

groups.delete('/group/:groupId/user/:userId', jwtAuth, async (req, res) => {
    const {groupId, userId} = req.params;
    await removeGroupUser(req['user_id'], +groupId, +userId, (code, data) => res.status(code).send(data));
});

export default groups;
