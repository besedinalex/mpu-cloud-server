const sqlite3 = require('sqlite3').verbose();

exports.db = new sqlite3.Database('data/database.sqlite3', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Выполнено подключение к Базе Данных.');
});
