import express from "express";
import jwtAuth from "../utils/jwt-auth";
const userData = require('../db/users');
const groupData = require('../db/groups');

const groups = express.Router();

groups.get('/groups', jwtAuth, function (req, res) {
    // @ts-ignore
    groupData.getGroup(req.user_id, req.query.groupId)
        .then(data => res.json(data))
        .catch(() => res.status(404).send({message: 'Данная группа не найдена.'}))
});

groups.get('/groups', jwtAuth, function (req, res) {
    // @ts-ignore
    groupData.getGroups(req.user_id)
        .then(data => {
            if (data.length === 0) {
                res.status(404).send({message: 'Вы не состоите в группах.'});
            } else {
                res.json(data);
            }
        })
        .catch(() => res.status(500).send({message: 'Не удалось найти ваши группы.'}))
});

groups.post('/create', jwtAuth, function (req, res) {
    // @ts-ignore
    groupData.addGroup(req.query.title, req.query.description, req.query.image, req.user_id)
        .then(groupId => {
            // @ts-ignore
            groupData.addGroupUser(req.user_id, groupId, 'ADMIN')
                .then(() => res.sendStatus(200))
                .catch(() => res.status(500).send({message: 'Не удалось добавить пользователя в группу.'}));
        })
        .catch(() => res.status(500).send({message: 'Не удалось создать группу.'}));
});

groups.post('/user', jwtAuth, async function (req, res) {
    const {groupId} = req.query;
    // @ts-ignore
    groupData.getUserAccess(groupId, req.user_id)
        .then(accessRes => {
            if (accessRes.access === 'ADMIN' || accessRes.access === 'MODERATOR') {
                // @ts-ignore
                userData.getIdByEmail(req.query.email.toLowerCase())
                    .then(idRes => {
                        groupData.getUserAccess(groupId, idRes)
                            .then(() => res.status(409).send({message: 'Пользователь уже состоит в группе.'}))
                            .catch(() => {
                                const access = req.query.access === 'ADMIN' ? 'MODERATOR' : req.query.access;
                                groupData.addGroupUser(idRes.user_id, groupId, access)
                                    .then(() => res.sendStatus(200))
                                    .catch(() => res.status(500).send({message: 'Не удалось добавить пользователя.'}));
                            });
                    })
                    .catch(() => res.status(404).send({message: 'Не удалось найти пользователя с таким email.'}));
            } else {
                res.status(403).send({message: 'Вы не можете приглашать людей в группу.'});
            }
        })
        .catch(() => res.status(404).send({message: 'Вы не состоите в данной группе.'}));
});

groups.delete('/user', jwtAuth, (req, res) => {
    const {groupId, userId} = req.query;
    // @ts-ignore
    groupData.getUserAccess(groupId, req.user_id)
        .then(accessRes => {
            groupData.getUserAccess(groupId, userId)
                .then(deletedUser => {
                    switch(accessRes.access) {
                        case 'ADMIN':
                            if (deletedUser.access !== 'ADMIN') {
                                groupData.removeGroupUser(groupId, userId)
                                    .then(() => res.sendStatus(200))
                                    .catch(() => res.status(500).send({message: 'Не удалось удалить пользователя.'}));
                            } else {
                                res.status(403).send({message: 'Нельзя удалить администратора.'});
                            }
                            break;
                        case 'MODERATOR':
                            if (deletedUser.access === 'USER') {
                                groupData.removeGroupUser(groupId, userId)
                                    .then(() => res.sendStatus(200))
                                    .catch(() => res.status(500).send({message: 'Не удалось удалить пользователя.'}));
                            } else {
                                res.status(403).send({message: 'Вы не можете удалять администраторов и модераторов.'});
                            }
                            break;
                        default:
                            res.status(403).send({message: 'Вы не можете удалять пользователей из группы.'});
                    }
                })
                .catch(() => res.status(404).send({message: 'Пользователь не состоит в данной группе.'}));
        })
        .catch(() => res.status(404).send({message: 'Вы не состоите в данной группе.'}));
});

groups.get('/users', jwtAuth, function (req, res) {
    const {groupId} = req.query;
    // @ts-ignore
    groupData.getGroup(req.user_id, groupId)
        .then(() => {
            groupData.getGroupUsers(groupId)
                .then(data => res.json(data))
                .catch(() => res.status(500).send({message: 'Не удалось найти пользователей группы.'}));
        })
        .catch(() => res.status(404).send({message: 'Данная группа не найдена.'}));
});

groups.get('/files', jwtAuth, function (req, res) {
    // const {groupId} = req.query;
    // // @ts-ignore
    // groupData.getGroup(req.user_id, groupId)
    //     .then(() => {
    //         groupData.getGroupFiles(groupId)
    //             .then(data => res.json(data))
    //             .catch(() => res.status(500).send({message: 'Не удалось найти файлы группы.'}));
    //     })
    //     .catch(() => res.status(404).send({message: 'Данная группа не найдена.'}));
});

export default groups;
