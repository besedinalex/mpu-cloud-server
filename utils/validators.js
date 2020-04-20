const { query } = require('express-validator');

exports.registerValidators = [
    query('email').isEmail().withMessage('Некорректный email'),
    query('password').isLength({min: 6, max: 56}).isAlphanumeric().withMessage('Некорректный пароль'),
    query('lastName').custom((value, {req}) => {
        if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
            throw new Error('Некоректное имя')
        }
        return true
    }),
    query('lastName').custom((value, {req}) => {
        if (!value.match(/(?=.*[а-я])(?=.*[А-Я])[а-яА-Я]{3,}/g)) {
            throw new Error('Некоректная фамилия')
        }
        return true
    })
]