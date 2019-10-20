const userData = require('../db/user');
const groupData = require('../db/group');

exports.getGroup = function(userId, groupId, res) {
    groupData.getGroup(userId, groupId).then(data => res.json(data));
};

exports.getGroups = function (userId, res) {
    groupData.getGroups(userId).then(data => res.json(data));
};

exports.getGroupModels = function (userId, groupId, res) {
    groupData.getGroup(userId, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupModels(groupId).then(data => res.json(data));
        }
    });
};

exports.getGroupUsers = function (userId, groupId, res) {
    groupData.getGroup(userId, groupId).then(group => {
        if (group.length === 0) {
            res.status(401).send();
        } else {
            groupData.getGroupUsers(groupId).then(data => res.json(data));
        }
    });
};

exports.createGroup = function (title, description, image, userId) {
    groupData.addGroup(title, description, image, userId)
        .then(res => groupData.addGroupUser(userId, res, 'ADMIN'));
};

exports.addUserToGroup = function (adminId, groupId, email, access, resolve) {
    groupData.getUserAccess(groupId, adminId).then(res => {
        if (res[0].access === 'ADMIN' || res[0].access === 'MODERATOR') {
            userData.getIdByEmail(email.toLowerCase()).then(id => {
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
                        resolve.status(409).send();
                    }
                });
            });
        } else {
            resolve.status(401).send();
        }
    });
};

exports.removeUserFromGroup = function (adminId, groupId, userId, resolve) {
    groupData.getUserAccess(groupId, adminId).then(res => {
        switch (res[0].access) {
            case 'ADMIN':
                groupData.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access !== 'ADMIN') {
                        groupData.removeGroupUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            case 'MODERATOR':
                groupData.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access === 'USER') {
                        groupData.removeGroupUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            default:
                resolve.status(401).send();
                break;
        }
    });
};
