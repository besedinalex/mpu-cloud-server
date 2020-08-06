const jwt = require('jsonwebtoken');
const userData = require('../db/user');
const groupData = require('../db/group');
const SECRET = require(process.cwd() + '/config.json').SECRET;

// Checks if token is valid
exports.tokenCheck = function (req, res, next) {
    const {token} = req.query;
    if (!token) {
        res.status(401).send({message: 'Запрос не содержит токен.'});
    } else {
        jwt.verify(token, SECRET, function (err, decoded) {
            if (err) {
                res.status(401).send({message: 'Неверный токен.'});
            } else if (Date.now() >= decoded.exp * 1000) {
                res.status(401).send({message: 'Токен истек. Необходимо перезайти в систему.'});
            } else if (decoded.email === undefined) {
                res.status(401).send({message: 'Старый формат токена. Необходимо перезайти в систему.'})
            } else {
                userData.getEmailById(decoded.id)
                    .then(data => {
                        if (data.email !== decoded.email) {
                            res.status(401).send({message: 'Этот токен не принадлежит вам.'});
                        } else {
                            req.user_id = decoded.id;
                            next();
                        }
                    })
                    .catch(() => res.status(401).send({message: 'Ваш токен недействителен.'}));
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
