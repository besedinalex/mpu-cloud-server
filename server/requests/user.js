const jwt = require('jsonwebtoken');

const db = require('../db');

const secret = 'Hello World!';

exports.checkToken = function (req, res, next) {
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

exports.signInUser = function (email, password, res) {
    db.signIn(email, password)
        .then(data => {
            const payload = {id: data.user_id};
            const token = jwt.sign(payload, secret, {expiresIn: '365d'});
            let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
            res.json({token, expiresAt: expiresAt, userId: data.user_id});
            // TODO: Хранить токены в БД.
            // TODO: Дать юзеру возможность дропнуть токены.
            // TODO: Выдавать токен на несколько дней/месяцев в зависимости от галочки в поле "запомнить меня".
        })
        .catch(err => res.status(401).send(err.message));
};

exports.signUpUser = function (firstName, lastName, email, password, res) {
    db.signUp(firstName, lastName, email.toLowerCase(), password)
        .then(userId => {
            const payload = {id: userId};
            const token = jwt.sign(payload, secret, {expiresIn: '365d'});
            let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
            res.json({token, expiresAt: expiresAt});
        })
    // TODO: Выдавать ошибку в Front-End, если юзер уже существует.
};