const mysql = require('mysql')

var db = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "mpu-cloud"
});

exports.connect = function () {
    db.connect(function (err) {
        if (err) throw err;
        console.log("База данных подключена!");
    });
}

exports.addUser = function (name, surname, email, password) {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO Users (name, surname, email, password) VALUES ('${name}','${surname}','${email}','${password}')`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        })
    })
}

exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM Users WHERE email = '${email}' AND password = '${password}'`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else if (result.length === 0) {
                const err = new Error('Неверный логин или пароль');
                reject(err);
            } else {
                resolve(result[0]);
            }
        })
    })
}

exports.getModels = function (userId) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM Models WHERE owner = '${userId}'`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

exports.addModel = function (title, desc, filepath, owner) {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO Models (title, desc, filepath, owner) VALUES ('${title}','${desc}','${filepath}','${owner}')`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        })
    })
}