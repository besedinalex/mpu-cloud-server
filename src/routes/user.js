const express = require('express');
const jwt = require('jsonwebtoken');
const accessCheck = require('../access-check');
const userData = require('../db/user');
const crypto = require('../crypto');

const user = express.Router();

const secret = 'Hello World!';

user.get('/token', function (req, res) {
    userData.signIn(req.query.email, req.query.password)
        .then(data => {
            if (crypto.decrypt(data.password) !== req.query.password) {
                res.status(401).send();
            } else {
                const payload = {id: data.user_id};
                const token = jwt.sign(payload, secret, {expiresIn: '365d'});
                let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
                res.json({token, expiresAt: expiresAt, userId: data.user_id});
            }
            // TODO: Хранить токены в БД.
            // TODO: Дать юзеру возможность дропнуть токены.
            // TODO: Выдавать токен на несколько дней/месяцев в зависимости от галочки в поле "запомнить меня".
        })
        .catch(() => res.status(500));
});

user.get('/data', function (req, res) {
    userData.getUser(req.query.userId).then(data => res.json(data));
});

user.post('/data', function (req, res) {
    userData.signUp(req.query.firstName, req.query.lastName, req.query.email.toLowerCase(), crypto.encrypt(req.query.password))
        .then(userId => {
            const payload = {id: userId};
            const token = jwt.sign(payload, secret, {expiresIn: '365d'});
            let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
            res.json({token, expiresAt: expiresAt, userId: userId});
        })
        .catch(() => res.status(401).send());
});

user.get('/files', accessCheck.tokenCheck, function (req, res) {
    userData.getUserFiles(req.user_id).then(data => res.json(data));
});

module.exports = user;
