const keys = require('../config.json')

module.exports = function (to, token) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: "Восстановление доступа",
        html: `
            <h1>Вы забыли пароль</h1>
            <p>если нет, то проигнорируйте данное письмо</p>
            <p>Иначе нажмите на ссылку ниже</p>
            <p><a href="${keys.BASE_URL}/password/${token}">Восстановить доступ</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">MPU CLOUD</a>
        `,
    };
};