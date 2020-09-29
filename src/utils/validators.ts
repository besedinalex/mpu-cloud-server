const {body} = require("express-validator");
const {PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX} = require(process.cwd() + '/config.json');

exports.registerValidators = [
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

exports.passwordValidator = [
    body("password")
        .isLength({min: PASSWORD_LENGTH_MIN, max: PASSWORD_LENGTH_MAX})
        .withMessage(`Пароль должен содержать от ${PASSWORD_LENGTH_MIN} до ${PASSWORD_LENGTH_MAX} символов.`)
        .trim()
];
