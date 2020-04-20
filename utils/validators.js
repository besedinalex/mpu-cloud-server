const { query } = require("express-validator");
const { find } = require("../src/db/user");

exports.registerValidators = [
    query("email")
        .isEmail()
        .withMessage("Некорректный email")
        .custom(async (value, { req }) => {
            try {
                const user = await find({ email: value });
                if (user.length) {
                    return Promise.reject("Такой email уже занят");
                }
            } catch (error) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    query("password")
        .isLength({ min: 6, max: 56 })
        .withMessage("Некорректный пароль")
        .isAlphanumeric()
        .trim(),
    query("lastName")
        .custom((value, { req }) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
                throw new Error("Некоректное имя");
            }
            return true;
        })
        .trim(),
    query("lastName")
        .custom((value, { req }) => {
            if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
                throw new Error("Некоректная фамилия");
            }
            return true;
        })
        .trim(),
];
