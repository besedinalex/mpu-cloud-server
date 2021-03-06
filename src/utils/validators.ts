import {body} from "express-validator";

const {PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX} = require(process.cwd() + '/config.json');

export const registerValidators = [
    body("email")
        .isEmail()
        .withMessage("Email не соответствует правилам сервера.")
        .trim(),
    body("firstName")
        .custom((value, {}) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{2,}/g)) {
                throw new Error("Имя не соответствует правилам сервера.");
            }
            return true;
        })
        .trim(),
    body("lastName")
        .custom((value, {}) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{2,}/g)) {
                throw new Error("Фамилия не соответствует правилам сервера.");
            }
            return true;
        })
        .trim()
];

export const passwordValidator = [
    body("password")
        .isLength({min: PASSWORD_LENGTH_MIN, max: PASSWORD_LENGTH_MAX})
        .withMessage(`Пароль должен содержать от ${PASSWORD_LENGTH_MIN} до ${PASSWORD_LENGTH_MAX} символов.`)
        .trim()
];

export const groupValidators = [
    body('title')
        .isLength({min: 2, max: 256})
        .withMessage('Название группы должно содержать от 2 до 256 символов.')
        .trim(),
    body('description')
        .isLength({min: 2, max: 256})
        .withMessage('Описание группы должно содержать от 2 до 256 символов.')
        .trim()
];