const express = require("express");
const jwt = require("jsonwebtoken");
const accessCheck = require("../access-check");
const userData = require("../db/user");
const crypto = require("../crypto");
const crpt = require("crypto");
const regEmail = require("../../emails/registration");
const resetEmail = require('../../emails/reset')
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../../keys");

const user = express.Router();

const transporter = nodemailer.createTransport(
    sendgrid({
        auth: { api_key: keys.SENDGRID_API_KEY },
    })
);

user.get("/token", function (req, res) {
    userData
        .signIn(req.query.email, req.query.password)
        .then((data) => {
            if (crypto.decrypt(data.password) !== req.query.password) {
                res.sendStatus(401);
            } else {
                const payload = {
                    id: data.user_id,
                    email: req.query.email.toLowerCase(),
                };
                const token = jwt.sign(payload, keys.SECRET, {
                    expiresIn: "7d",
                });
                let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000;
                res.json({ token, expiresAt: expiresAt, userId: data.user_id });
            }
        })
        .catch(() => res.sendStatus(500));
});

user.get("/data", function (req, res) {
    userData.getUser(req.query.userId).then((data) => res.json(data));
});

user.post("/data", function (req, res) {
    const { firstName, lastName, email, password } = req.query;

    userData
        .signUp(
            firstName,
            lastName,
            email.toLowerCase(),
            crypto.encrypt(password)
        )
        .then(async (userId) => {
            const payload = { id: userId, email: email.toLowerCase() };
            const token = jwt.sign(payload, keys.SECRET, { expiresIn: "7d" });
            let expiresAt = Date.now() + +7 * 24 * 60 * 60 * 1000;
            await transporter.sendMail(regEmail(email.toLowerCase()));
            res.json({ token, expiresAt: expiresAt, userId: userId });
        })
        .catch(() => res.sendStatus(401));
});

user.get("/files", accessCheck.tokenCheck, function (req, res) {
    userData.getUserFiles(req.user_id).then((data) => res.json(data));
});

//Reset-pass
user.post("/reset-pass", (req, res) => {
    const email = req.query.email.toLowerCase();
    try {
        crpt.randomBytes(32, async (err, buffer) => {
            if (err) res.sendStatus(401);
            const token = buffer.toString("hex");
            const isExist = await userData.getIdByEmail(email);
            if (isExist.length) {
                const resetToken = token;
                const resetTokenExp = Date.now() + 60 * 60 * 1000; //1 час
                const userId = Number(isExist[0].user_id);
                await userData.updateResetToken(userId, resetToken, resetTokenExp);
                await transporter.sendMail(resetEmail(email, token));
            } else {
                //Пользователя не существует в БД
                res.sendStatus(401);
            }
        });
    } catch (error) {
        res.sendStatus(401);
    }
});

user.post("/password", async (req, res) => {
    const { password, token } = req.query;

    try {
        const data = await userData.find({
            resetToken: token,
        });
        const candidate = data[0];

        if (!candidate) {
            //Пользователь не найден
            console.log(1);
            return res.sendStatus(401).send("Пользователь не найден")
        }
        if (crypto.decrypt(candidate.password) === password) {
            //Одинаковые пароли
            console.log(2);
            return res.sendStatus(401).send("Одинаковые пароли");
        }
        if (+Date.now() > +candidate.resetTokenExp) {
            //Прошло больше часа с момента создания токена
            console.log(3);
            return res.sendStatus(401).send("Прошло больше часа с момента создания токена");
        }
        await userData.updatePassword(
            crypto.encrypt(password),
            candidate.user_id
        );

        await userData.updateResetToken(candidate.user_id, null, null)
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(401);
    }
});

module.exports = user;
