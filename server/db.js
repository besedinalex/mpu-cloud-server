
////////////////////////////
////// Модуль для работы с БД SQLite
////////////////////////////

const sqlite3 = require('sqlite3').verbose();
const crypto = require('./crypto.js');

let db = new sqlite3.Database('data.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Выполнено подключение к Базе Данных!');
});

exports.addUser = function (firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        let cryptedPassword = crypto.encrypt(password);
        let sql = `INSERT INTO Users (firstName, lastName, email, password) VALUES ('${firstName}','${lastName}','${email}','${cryptedPassword}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

exports.login = function (email, password) {
    return new Promise((resolve, reject) => {
        let cryptedPassword = crypto.encrypt(password);
        let sql = `SELECT * FROM Users WHERE email = '${email}' AND password = '${cryptedPassword}'`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                const err = new Error('Неверный логин или пароль');
                reject(err);
            } else {
                delete rows[0].email;
                delete rows[0].password;
                rows[0].createdTime = new Date(rows[0].createdTime);
                resolve(rows[0]);
            }
        });
    })
}

exports.getModels = function (userId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Models WHERE owner = '${userId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach((row, i, arr) => {
                    row.createdTime = new Date(row.createdTime);
                    if (arr.length - 1 === i) resolve(rows);
                })
            }
        });
    })
}

exports.addModel = function (title, desc, filepath, owner) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Models (title, desc, filepath, owner) VALUES  ('${title}','${desc}','${filepath}','${owner}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}