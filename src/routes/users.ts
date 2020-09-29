const express = require("express");
const jwt = require("jsonwebtoken");
const accessCheck = require("../utils/access-check");
const userData = require("../db/users");
const bcrypt = require("bcryptjs");
import crypto from "crypto";
const readline = require('readline');
const {getUserToken} = require("../services/users");
const {validationResult} = require('express-validator')
const {registerValidators, passwordValidator} = require('../utils/validators')
const {SECRET, RESET_PASSWORD_CODE_LENGTH, PASSWORD_ENCRYPT_SECURITY, RESET_PASSWORD_EXPIRE} = require(process.cwd() + '/config.json');

let passwordResetMode = false;
let lastPasswordResetId = 0;
const resetRequests = [];

function addResetRequest(request) {
    // Makes previous token invalid
    for (const obj of resetRequests) {
        // @ts-ignore
        if (obj.email === request.email && obj.valid) {
            // @ts-ignore
            obj.valid = false;
            break;
        }
    }
    // Adds new token
    request.id = lastPasswordResetId;
    request.valid = true;
    // @ts-ignore
    resetRequests.push(request);
    // Adds timer for added token
    const sequenceId = lastPasswordResetId;
    setTimeout(() => {
        for (const obj of resetRequests) {
            // @ts-ignore
            if (obj.id === sequenceId) {
                // @ts-ignore
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

const users = express.Router();

users.get("/token", async (req, res) => {
    const {email, password} = req.query;
    await getUserToken(email.toLowerCase(), password, (code, data) => res.status(code).send(data));
});

users.get("/data", accessCheck.jwtAuth, function (req, res) {
    userData.getUserData(req.query.userId)
        .then((data) => res.send(data))
        .catch(() => res.status(404).send({message: "Такой пользователь не найден."}));
});

users.post("/user", [registerValidators, passwordValidator], async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = '';
        for (const err of errors.array()) {
            message += err.msg + ' ';
        }
        res.status(422).send({message: message.slice(0, -1)});
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, PASSWORD_ENCRYPT_SECURITY);
            try {
                const userId = await userData.addUser(firstName, lastName, email, hashedPassword);
                const payload = {id: userId, email: email};
                res.send({token: jwt.sign(payload, SECRET, {expiresIn: "7d"})});
            } catch {
                res.status(409).send({message: "Пользователь с таким email уже существует."})
            }
        } catch {
            res.status(500).send({message: "Произошла ошибка при обработке паролей."});
        }
    }
});

users.get("/files", accessCheck.jwtAuth, function (req, res) {
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

users.post("/password", passwordValidator, function (req, res) {
    const {password, token} = req.query;
    for (const request of resetRequests) {
        // @ts-ignore
        if (request.token === token) {
            // @ts-ignore
            if (!request.valid) {
                res.status(403).send({message: "Данный запрос на восстановление пароля не действителен."});
            } else {
                // @ts-ignore
                userData.getUserLoginData(request.email)
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
                                                        // @ts-ignore
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

export default users;
