const {query} = require("express-validator");

exports.registerValidators = [
    query("email")
        .isEmail()
        .withMessage("Email не соответствует правилам сервера."),
    query("password")
        .isLength({ min: 6, max: 56 })
        .withMessage("Пароль не соответствует правилам сервера.")
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
