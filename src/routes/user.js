const express = require("express");
const jwt = require("jsonwebtoken");
const accessCheck = require("../utils/access-check");
const userData = require("../db/user");
const { decrypt, encrypt } = require("../utils/crypto");
const crypto = require("crypto");
const regEmail = require("../../emails/registration");
const resetEmail = require("../../emails/reset");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../../config.json");
const { validationResult } = require("express-validator");
const { registerValidators } = require("../utils/validators");
const bcrypt = require("bcryptjs");

let lastPasswordResetId = 0;
const resetRequests = [];

function addResetRequest(request) {
    // Makes previous token invalid
    for (const obj of resetRequests) {
        if (obj.email === request.email) {
            obj.valid = false;
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
            }
        }
    }, 1000 * 60 * 60);
    // Update sequence
    lastPasswordResetId += 1;
}

const user = express.Router();

user.get("/token", function (req, res) {
    const email = req.query.email.toLowerCase();
    const { password } = req.query;
    userData
        .signIn(email, password)
        .then(async (data) => {
            let areSame;
            try {
                areSame = await bcrypt.compare(password, data.password);
            } catch (error) {
                throw error
            }
            if (!areSame) {
                res.status(401).send({ message: "Неверный email или пароль." });
            } else {
                const payload = {
                    id: data.user_id,
                    email: email,
                };
                res.json({
                    token: jwt.sign(payload, keys.SECRET, { expiresIn: "7d" }),
                    expiresAt: Date.now() + +7 * 24 * 60 * 60 * 1000,
                    userId: data.user_id,
                });
            }
        })
        .catch(() =>
            res
                .status(404)
                .send({ message: "Пользователь с таким email не найден." })
        );
});

user.get("/data", function (req, res) {
    userData
        .getUser(req.query.userId)
        .then((data) => res.json(data))
        .catch(() =>
            res.status(404).send({ message: "Такой пользователь не найден." })
        );
});

user.post("/data", registerValidators, async function (req, res) {
    const { firstName, lastName, email, password } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send({ errors: errors.array() });
    } else {
        try {
            //Шифратор паролей, второй параметр - точность шифратора - чем больше, тем лучше шифрование, но дольше времени занимает
            const hashPassword = await bcrypt.hash(password, 10);
            userData
                .signUp(firstName, lastName, email, hashPassword)
                .then((userId) => {
                    const payload = {
                        id: userId,
                        email: email,
                    };
                    const token = jwt.sign(payload, keys.SECRET, {
                        expiresIn: "7d",
                    });
                    let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000;
                    //await transporter.sendMail(regEmail(email));
                    res.json({
                        token,
                        expiresAt: expiresAt,
                        userId: userId,
                    });
                })
                .catch(() =>
                    res
                        .status(409)
                        .send({
                            message:
                                "Пользователь с таким email уже существует.",
                        })
                );
        } catch (error) {
            throw error;
        }
    }
});

user.get("/files", accessCheck.tokenCheck, function (req, res) {
    userData
        .getUserFiles(req.user_id)
        .then((data) => {
            if (data.length === 0) {
                res.status(404).send({ message: "У вас нет файлов." });
            } else {
                res.json(data);
            }
        })
        .catch(() =>
            res.status(500).send({ message: "Неизвестная ошибка сервера." })
        );
});

user.post("/reset-password", function (req, res) {
    const email = req.query.email.toLowerCase();
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            res.status(500).send({ message: "Не удалось сбросить пароль." });
        } else {
            const resetToken = buffer.toString("hex");
            userData
                .getIdByEmail(email)
                .then(() => {
                    const resetRequest = {
                        token: resetToken,
                        email: email,
                    };
                    addResetRequest(resetRequest);
                    const transporter = nodemailer.createTransport(
                        sendgrid({
                            auth: { api_key: keys.SENDGRID_API_KEY },
                        })
                    );
                    transporter
                        .sendMail(resetEmail(email, resetToken))
                        .then(() => res.sendStatus(200))
                        .catch(() =>
                            res
                                .status(500)
                                .send({
                                    message: "Не удалось отправить email.",
                                })
                        );
                })
                .catch(() =>
                    res
                        .status(404)
                        .send({
                            message: "Пользователь с таким email не найден.",
                        })
                );
        }
    });
});

user.post("/password", function (req, res) {
    const { password, token } = req.query;
    let tokenFound = false;
    for (const request of resetRequests) {
        if (request.token === token) {
            tokenFound = true;
            if (!request.valid) {
                res.status(403).send({
                    message: "Данный запрос на восстановление пароля устарел.",
                });
            } else {
                userData
                    .signIn(request.email)
                    .then((data) => {
                        if (decrypt(data.password) === password) {
                            res.send(403).send({
                                message:
                                    "Нельзя использовать предыдущий пароль.",
                            });
                        } else {
                            userData
                                .updatePassword(password, data.user_id)
                                .then(() => res.sendStatus(200))
                                .catch(() =>
                                    res
                                        .status(500)
                                        .send({
                                            message:
                                                "Не удалось обновить пароль.",
                                        })
                                );
                        }
                    })
                    .catch(() =>
                        res
                            .status(404)
                            .send({ message: "Пользователь не найден." })
                    );
            }
            break;
        }
    }
    if (!tokenFound) {
        res.status(401).send({
            message: "Такого запроса на восстановление пароля не существует.",
        });
    }
});

module.exports = user;
