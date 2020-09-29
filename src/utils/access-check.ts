const jwt = require('jsonwebtoken');
const userData = require('../db/users');
const groupData = require('../db/groups');
const {SECRET} = require(process.cwd() + '/config.json');

// Checks if token is valid
exports.jwtAuth = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
        return;
    }
    const authData = authorization.split(' ');
    if (authData[0] !== 'Bearer') {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
        return;
    }
    const token = authData[1];
    if (!token) {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
    } else {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).send({message: 'Токен недействителен.'});
            } else if (Date.now() >= decoded.exp * 1000) {
                res.status(401).send({message: 'Токен истек. Необходимо перезайти в систему.'});
            } else {
                try {
                    const userEmail = await userData.getEmailById(decoded.id);
                    if (userEmail !== decoded.email) {
                        res.status(401).send({message: 'Этот токен не принадлежит вам. Необходимо перезайти в систему.'});
                    } else {
                        req.user_id = decoded.id;
                        next();
                    }
                } catch {
                    res.status(401).send({message: 'Ваш токен недействителен. Необходимо перезайти в систему.'});
                }
            }
        });
    }
};

// Checks if it's user file or from his groups
exports.checkAccess = function (userId, groupId, fileId, res, callback) {
    userData.getUserFiles(userId)
        .then(userFiles => {
            let found = false;
            for (const file of userFiles) {
                if (+file.file_id === +fileId && +file.ownerUser === +userId) {
                    found = true;
                    callback(file);
                }
            }
            if (!found) {
                groupData.getGroup(userId, groupId)
                    .then(() => {
                        groupData.getGroupFiles(groupId)
                            .then(groupFiles => {
                                for (const file of groupFiles) {
                                    if (+file.file_id === +fileId && +file.ownerGroup === +groupId) {
                                        callback(file);
                                    }
                                }
                            })
                            .catch(() => res.status(404).send({message: 'Не удалось найти файлы группы.'}));
                    })
                    .catch(() => res.status(404).send({message: 'Не удалось найти группу.'}));
            }
        })
        .catch(() => res.status(500).send({message: 'Не удалось найти файлы пользователя.'}));
};
