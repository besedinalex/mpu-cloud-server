const express = require('express');
const token = require('../http/token');
const userData = require('../db/user');
const groupData = require('../db/group');

const group = express.Router();

group.get('/group', token.check, function (req, res) {
    groupData.getGroup(req.user_id, req.query.groupId).then(data => res.json(data));
});

group.get('/groups', token.check, function (req, res) {
    groupData.getGroups(req.user_id).then(data => res.json(data));
});

group.post('/create', token.check, function (req) {
    groupData.addGroup(req.query.title, req.query.description, req.query.image, req.user_id)
        .then(res => groupData.addGroupUser(req.user_id, res, 'ADMIN'));
});

group.post('/user', token.check, function (req, res) {
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

group.delete('/user', token.check, (req, res) => {
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

group.get('/users', token.check, function (req, res) {
    const groupId = req.query.groupId;
    groupData.getGroup(req.user_id, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupUsers(groupId).then(data => res.json(data));
        }
    });
});

group.get('/models', token.check, function (req, res) {
    const groupId = req.query.groupId;
    groupData.getGroup(req.user_id, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupModels(groupId).then(data => res.json(data));
        }
    });
});

module.exports = group;
