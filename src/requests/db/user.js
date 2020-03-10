const db = require('./db-connection').db;

exports.signUp = function (firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO Users (firstName, lastName, email, password)
        VALUES ('${firstName}','${lastName}','${email}','${password}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
};

exports.signIn = function (email, password) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Users.user_id, Users.password FROM Users WHERE email = '${email}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    })
};

exports.getUser = function (user_id) {
    return new Promise((resolve, reject) => {
        const sql =
        `SELECT Users.user_id,  Users.createdTime, Users.firstName, Users.lastName, Users.email
        FROM Users
        WHERE Users.user_id ='${user_id}'`;
        db.all(sql, [], function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};

exports.getIdByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Users.user_id FROM Users WHERE Users.email = '${email}'`;
        db.all(sql, [], function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};

exports.getUserFiles = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Files WHERE ownerUser = '${userId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
};
