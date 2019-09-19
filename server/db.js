
////////////////////////////
////// Модуль для работы с БД SQLite
////////////////////////////

const sqlite3 = require('sqlite3').verbose();
const crypto = require('./crypto.js');

let db = new sqlite3.Database('server/data.db', (err) => {
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
    })
}

exports.getGroups = function (userId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT Groups.title, Groups.image, Groups.owner, Groups.dateOfCreation, Users.firstName, Users.lastName FROM Groups
        JOIN Users ON Groups.owner = Users.user_id
        WHERE Groups.owner = '${userId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

exports.addGroup = function (title, image, owner, dateOfCreation) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Groups (title, image, owner, dateOfCreation) 
        VALUES  ('${title}','${image}', '${owner}', '${dateOfCreation}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

exports.addModel = function (title, desc, filename, gltfPath, originalPath, sizeKB, type, owner) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Models (title, desc, filename, gltfPath, originalPath, sizeKB, type, owner) 
        VALUES  ('${title}','${desc}', '${filename}', '${gltfPath}', '${originalPath}', '${sizeKB}', '${type}', '${owner}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

exports.removeModel = function(modelId, ownerId) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM Models WHERE model_id = ${modelId} AND owner = ${ownerId}`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        })
    })
}