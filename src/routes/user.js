const express = require("express");
const jwt = require("jsonwebtoken");
const accessCheck = require("../utils/access-check");
const userData = require("../db/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const readline = require('readline');
const {validationResult} = require('express-validator')
const {registerValidators, passwordValidator} = require('../utils/validators')
const {SECRET, RESET_PASSWORD_CODE_LENGTH, PASSWORD_ENCRYPT_SECURITY, RESET_PASSWORD_EXPIRE} = require(process.cwd() + '/config.json');

let passwordResetMode = false;
let lastPasswordResetId = 0;
const resetRequests = [];

function addResetRequest(request) {
    // Makes previous token invalid
    for (const obj of resetRequests) {
        if (obj.email === request.email && obj.valid) {
            obj.valid = false;
            break;
        }
    }
    // Adds new token
    request.id = lastPasswordResetId;
    request.valid = true;
    resetRequests.push(request);
    // Adds timer for added token
    const sequenceId = lastPasswordResetId;
    setTimeout(() => {
        for (const obj of resetRequests) {
            if (obj.id === sequenceId) {
                obj.valid = false;
                break;
            }
        }
    }, 1000 * 60 * RESET_PASSWORD_EXPIRE);
    // Update sequence
    lastPasswordResetId += 1;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    if (input === 'reset-password-mode') {
        passwordResetMode = !passwordResetMode;
        const message = passwordResetMode
            ? '\nВы вошли в режим восстановления паролей.\n'
            : '\nВы вышли из режима восстановления паролей.\n';
        console.log(message);
    } else {
        if (passwordResetMode) {
            const email = input.toLowerCase();
            userData.getIdByEmail(email)
                .then(idResponse => {
                    userData.getUser(idResponse.user_id)
                        .then(data => {
                            crypto.randomBytes(RESET_PASSWORD_CODE_LENGTH / 2, (err, buffer) => {
                                if (err) {
                                    console.log('Не удалось сгенерировать код восстановления.');
                                } else {
                                    const token = buffer.toString("hex");
                                    const resetRequest = {token, email};
                                    addResetRequest(resetRequest);
                                    const message = `Пользователь ${data.lastName} ${data.firstName} ` +
                                        `ожидает следующий код восстановления:\n${token} (Время действия: ${RESET_PASSWORD_EXPIRE} минут)`;
                                    console.log(message);
                                }
                            });
                        })
                        .catch(() => console.log('Пользователь с таким ID не найден.'));
                })
                .catch(() => console.log('Пользователь с таким email не найден.'));
        }
    }
});

const user = express.Router();

user.get("/token", function (req, res) {
    const email = req.query.email.toLowerCase();
    const {password} = req.query;
    userData.signIn(email, password)
        .then(data => {
            bcrypt.compare(password, data.password)
                .then(areSame => {
                    if (!areSame) {
                        res.status(401).send({message: "Неверный email или пароль."});
                    } else {
                        const payload = {id: data.user_id, email: email};
                        res.send({
                            token: jwt.sign(payload, SECRET, {expiresIn: "7d"}),
                            expiresAt: Date.now() + +7 * 24 * 60 * 60 * 1000,
                            userId: data.user_id
                        });
                    }
                })
                .catch(() => res.status(500).send({message: "Произошла ошибка при обработке паролей."}));
        })
        .catch(() => res.status(404).send({message: "Пользователь с таким email не найден."}));
});

user.get("/data", accessCheck.tokenCheck, function (req, res) {
    userData.getUser(req.query.userId)
        .then((data) => res.send(data))
        .catch(() => res.status(404).send({message: "Такой пользователь не найден."}));
});

user.post("/data", [registerValidators, passwordValidator], function (req, res) {
    const {firstName, lastName, email, password} = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = '';
        for (const err of errors.array()) {
            message += err.msg + ' ';
        }
        res.status(422).send({message: message.slice(0, -1)});
    } else {
        // Шифратор паролей, второй параметр - точность шифратора - чем больше, тем лучше шифрование, но дольше времени занимает
        bcrypt.hash(password, PASSWORD_ENCRYPT_SECURITY)
            .then(hashPassword => {
                userData.signUp(firstName, lastName, email, hashPassword)
                    .then((userId) => {
                        const payload = {id: userId, email: email,};
                        const token = jwt.sign(payload, SECRET, {expiresIn: "7d"});
                        let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000;
                        res.send({token, expiresAt, userId});
                    })
                    .catch(() => res.status(409).send({message: "Пользователь с таким email уже существует."}));
            })
            .catch(() => res.status(500).send({message: "Произошла ошибка при обработке паролей."}))
    }
});

user.get("/files", accessCheck.tokenCheck, function (req, res) {
    userData
        .getUserFiles(req.user_id)
        .then((data) => {
            if (data.length === 0) {
                res.status(404).send({message: "У вас нет файлов."});
            } else {
                for (const file of data) {
                    delete file.code;
                }
                res.send(data);
            }
        })
        .catch(() =>
            res.status(500).send({message: "Неизвестная ошибка сервера."})
        );
});

user.post("/password", passwordValidator, function (req, res) {
    const {password, token} = req.query;
    for (const request of resetRequests) {
        if (request.token === token) {
            if (!request.valid) {
                res.status(403).send({message: "Данный запрос на восстановление пароля не действителен."});
            } else {
                userData.signIn(request.email)
                    .then(data => {
                        bcrypt.compare(password, data.password)
                            .then(areSame => {
                                if (areSame) {
                                    res.status(403).send({message: "Нельзя использовать предыдущий пароль."});
                                } else {
                                    const errors = validationResult(req);
                                    if (!errors.isEmpty()) {
                                        res.status(422).send({message: errors.array()[0].msg});
                                    } else {
                                        bcrypt.hash(password, PASSWORD_ENCRYPT_SECURITY)
                                            .then(hashPassword => {
                                                userData.updatePassword(hashPassword, data.user_id)
                                                    .then(() => {
                                                        request.valid = false;
                                                        res.send({message: "Новый пароль установлен."});
                                                    })
                                                    .catch(() => res.status(500).send({message: "Не удалось обновить пароль."}));
                                            })
                                            .catch(() => res.status(500).send({message: "Произошла ошибка при обработке паролей."}));
                                    }
                                }
                            })
                            .catch(() => res.status(500).send({message: "Произошла ошибка при обработке паролей."}));
                    })
                    .catch(() => res.status(404).send({message: "Пользователь не найден."}));
            }
            return;
        }
    }
    res.status(404).send({message: "Такого запроса на восстановление пароля не существует."});
});

module.exports = user;
