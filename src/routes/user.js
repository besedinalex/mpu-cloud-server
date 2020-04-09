const express = require('express');
const jwt = require('jsonwebtoken');
const accessCheck = require('../access-check');
const userData = require('../db/user');
const crypto = require('../crypto');
const regEmail = require('../../emails/registration')
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require("../../keys")

const user = express.Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth:{api_key: keys.SENDGRID_API_KEY}
}))

user.get('/token', function (req, res) {
    userData.signIn(req.query.email, req.query.password)
        .then(data => {
            if (crypto.decrypt(data.password) !== req.query.password) {
                res.sendStatus(401);
            } else {
                const payload = {id: data.user_id, email: req.query.email.toLowerCase()};
                const token = jwt.sign(payload, keys.SECRET, {expiresIn: '7d'});
                let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000;
                res.json({token, expiresAt: expiresAt, userId: data.user_id});
            }
        })
        .catch(() => res.sendStatus(500));
});

user.get('/data', function (req, res) {
    userData.getUser(req.query.userId).then(data => res.json(data));
});

user.post('/data', function (req, res) {
    const {firstName, lastName, email, password} = req.query;

    userData.signUp(firstName, lastName, email.toLowerCase(), crypto.encrypt(password))
        .then(async userId => {
            const payload = {id: userId, email: email.toLowerCase()};
            const token = jwt.sign(payload, keys.SECRET, {expiresIn: '7d'});
            let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000; 
            await transporter.sendMail(regEmail(email.toLowerCase()));
            res.json({token, expiresAt: expiresAt, userId: userId});
        })
        .catch(() => res.sendStatus(401));
});

user.get('/files', accessCheck.tokenCheck, function (req, res) {
    userData.getUserFiles(req.user_id).then(data => res.json(data));
});

module.exports = user;
