const express = require('express');
const accessCheck = require('./access-check');
const userData = require('../db/user');
const groupData = require('../db/group');

const group = express.Router();

group.get('/group', accessCheck.tokenCheck, function (req, res) {
    groupData.getGroup(req.user_id, req.query.groupId).then(data => res.json(data));
});

group.get('/groups', accessCheck.tokenCheck, function (req, res) {
    groupData.getGroups(req.user_id).then(data => res.json(data));
});

group.post('/create', accessCheck.tokenCheck, function (req) {
    groupData.addGroup(req.query.title, req.query.description, req.query.image, req.user_id)
        .then(res => groupData.addGroupUser(req.user_id, res, 'ADMIN'));
});

group.post('/user', accessCheck.tokenCheck, function (req, res) {
    const groupId = req.query.groupId;
    let access = req.query.access;
    groupData.getUserAccess(groupId, req.user_id).then(resolve => {
        if (resolve[0].access === 'ADMIN' || resolve[0].access === 'MODERATOR') {
            userData.getIdByEmail(req.query.email.toLowerCase()).then(id => {
                groupData.getGroupUsers(groupId).then(res => {
                    let userFound = false;
                    res.map(user => {
                        if (user.user_id === id[0].user_id) {
                            userFound = true;
                        }
                    });
                    if (!userFound) {
                        if (access === 'ADMIN') {
                            access = 'MODERATOR';
                        }
                        groupData.addGroupUser(id[0].user_id, groupId, access);
                    } else {
                        res.status(409).send();
                    }
                });
            });
        } else {
            res.status(401).send();
        }
    });
});

group.delete('/user', accessCheck.tokenCheck, (req, res) => {
    const groupId = req.query.groupId;
    const userId = req.query.userId;
    groupData.getUserAccess(groupId, req.user_id).then(resolve => {
        switch (resolve[0].access) {
            case 'ADMIN':
                groupData.getUserAccess(groupId, userId).then(data => {
                    if (data[0].access !== 'ADMIN') {
                        groupData.removeGroupUser(groupId, userId).then(deleted => res.json({deleted}));
                    }
                });
                break;
            case 'MODERATOR':
                groupData.getUserAccess(groupId, userId).then(data => {
                    if (data[0].access === 'USER') {
                        groupData.removeGroupUser(groupId, userId).then(deleted => res.json({deleted}));
                    }
                });
                break;
            default:
                res.status(401).send();
                break;
        }
    });
});

group.get('/users', accessCheck.tokenCheck, function (req, res) {
    const groupId = req.query.groupId;
    groupData.getGroup(req.user_id, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupUsers(groupId).then(data => res.json(data));
        }
    });
});

group.get('/files', accessCheck.tokenCheck, function (req, res) {
    const groupId = req.query.groupId;
    groupData.getGroup(req.user_id, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupFiles(groupId).then(data => res.json(data));
        }
    });
});

module.exports = group;
