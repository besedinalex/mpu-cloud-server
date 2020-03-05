const jwt = require('jsonwebtoken');
const userData = require('../db/user');
const groupData = require('../db/group');

const secret = 'Hello World!';

// Checks if token is valid
exports.tokenCheck = function (req, res, next) {
    const token = req.query.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else if (Date.now() >= decoded.exp * 1000) {
                res.status(401).send('Unauthorized: Token expired');
            } else {
                req.user_id = decoded.id;
                next();
            }
        });
    }
};

// Checks if it's user file or from his groups
exports.checkAccess = function (userId, groupId, fileId, res, callback) {
    userData.getUserFiles(userId).then(userFiles => {
        let found = false;
        for (let file of userFiles) {
            if (file.file_id == fileId && file.ownerUser == userId) {
                found = true;
                callback(file);
            }
        }
        if (!found) {
            groupData.getGroup(userId, groupId).then(group => {
                if (group.length === 0) {
                    res.status(401).send();
                } else {
                    groupData.getGroupFiles(groupId).then(groupFiles => {
                        for (let file of groupFiles) {
                            if (file.file_id == fileId && file.ownerGroup == groupId) {
                                callback(file);
                            }
                        }
                    })
                }
            })
        }
    })
};
