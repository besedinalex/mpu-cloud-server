const db = require('../db');

exports.getGroups = function (userId, res) {
    db.getGroups(userId).then(data => res.json(data));
};

exports.getGroupModels = function (groupId, res) {
    db.getGroupModels(groupId).then(data => res.json(data));
};

exports.getGroupUsers = function (groupId, res) {
    db.getUsersByGroup(groupId).then(data => res.json(data));
};

exports.createGroup = function (title, description, image, userId) {
    db.addGroup(title, description, image, userId)
        .then(res => db.addGroupUser(userId, res, 'ADMIN'));
};

exports.addUserToGroup = function (adminId, groupId, email, access, resolve) {
    db.getUserAccess(groupId, adminId).then(res => {
        if (res[0].access === 'ADMIN' || res[0].access === 'MODERATOR') {
            db.getIdByEmail(email.toLowerCase()).then(id => {
                db.getUsersByGroup(groupId).then(res => {
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
                        db.addGroupUser(id[0].user_id, groupId, access);
                    } else {
                        resolve.send(false);
                    }
                });
            });
        } else {
            resolve.send(false);
        }
    });
};

exports.removeUserFromGroup = function (adminId, groupId, userId, resolve) {
    db.getUserAccess(groupId, adminId).then(res => {
        switch (res[0].access) {
            case 'ADMIN':
                db.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access !== 'ADMIN') {
                        db.removeUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            case 'MODERATOR':
                db.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access === 'USER') {
                        db.removeUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            default:
                resolve.send(false);
                // TODO: Послать нормальную ошибку.
                break;
        }
    });
};