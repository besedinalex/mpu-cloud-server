import express from "express";
import {createUser, getUserData, updatePassword, getUserToken} from "../services/users";
import jwtAuth from "../utils/jwt-auth";
import {validationResult} from "express-validator";
const {registerValidators, passwordValidator} = require("../utils/validators");

const users = express.Router();

users.get("/token", async (req, res) => {
    const {email, password} = req.query;
    await getUserToken((email as string).toLowerCase(), password as string,
        (code, data) => res.status(code).send(data));
});

users.get("/user/:id", jwtAuth, async (req, res) => {
    const {id} = req.params;
    await getUserData(+id, (code, data) => res.status(code).send(data));
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
        await createUser(email.toLowerCase(), password, firstName, lastName,
            ((code, data) =>res.status(code).send(data)));
    }
});

users.get("/files", jwtAuth, function (req, res) {
    // userData
    //     .getUserFiles(req.user_id)
    //     .then((data) => {
    //         if (data.length === 0) {
    //             res.status(404).send({message: "У вас нет файлов."});
    //         } else {
    //             for (const file of data) {
    //                 delete file.code;
    //             }
    //             res.send(data);
    //         }
    //     })
    //     .catch(() =>
    //         res.status(500).send({message: "Неизвестная ошибка сервера."})
    //     );
});

users.post("/password", passwordValidator, async (req, res) => {
    const {password, token} = req.body;
    await updatePassword(token as string, password as string, (code, data) => res.status(code).send(data));
});

export default users;
