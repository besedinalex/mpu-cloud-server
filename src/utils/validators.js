const {query} = require("express-validator");
const {PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX} = require(process.cwd() + '/config.json');

exports.registerValidators = [
    query("email")
        .isEmail()
        .withMessage("Email не соответствует правилам сервера.")
        .trim(),
    query("lastName")
        .custom((value, {}) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
                throw new Error("Имя не соответствует правилам сервера.");
            }
            return true;
        })
        .trim(),
    query("lastName")
        .custom((value, {}) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
                throw new Error("Фамилия не соответствует правилам сервера.");
            }
            return true;
        })
        .trim()
];

exports.passwordValidator = [
    query("password")
        .isLength({min: PASSWORD_LENGTH_MIN, max: PASSWORD_LENGTH_MAX})
        .withMessage(`Пароль должен содержать от ${PASSWORD_LENGTH_MIN} до ${PASSWORD_LENGTH_MAX} символов.`)
        .trim()
];
