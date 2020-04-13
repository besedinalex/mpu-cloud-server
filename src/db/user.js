const db = require("./db-connection");

exports.signUp = function (firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Users (firstName, lastName, email, password)
        VALUES ('${firstName}','${lastName}','${email}','${password}')`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

exports.signIn = function (email) {
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
    });
};

exports.getUser = function (user_id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Users.user_id,  Users.createdTime, Users.firstName, Users.lastName, Users.email
        FROM Users
        WHERE Users.user_id ='${user_id}'`;
        db.all(sql, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getIdByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Users.user_id FROM Users WHERE Users.email = '${email}'`;
        db.all(sql, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.getEmailById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Users.email FROM Users WHERE Users.user_id = '${id}'`;
        db.all(sql, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
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
    });
};

exports.insertResetToken = function (userId, resetToken, resetTokenExp) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Users SET resetToken="${resetToken}", resetTokenExp="${resetTokenExp}" WHERE user_id=${userId}`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

/* Функция поиска в таблице Users, по заданным параметрам.
Принимает: объект, содержащий поля: название столбца в таблице БД, как КЛЮЧ поля и значения для поиска в этом поле

{ field1: <value>, field2: <value> ... } 

Возвращает массив пользователей, которые соотвествуют параметрам

    userData.find({
        firstName: "Всеволод",
        lastName: "Кочнев"
    });
    
Найдет всех пользователей с именем "Всеволод" и фамилией "Кочнев"
*/

exports.find = function (params) {
    const paramsKeys = Object.keys(params);
    return new Promise((resolve, reject) => {
        try {
            let sql = `SELECT * FROM Users WHERE`;
            paramsKeys.forEach((value, i) => {
                if (i != 0) {
                    sql += ` AND`;
                }
                sql += ` ${value} = "${params[value]}"`;
            });
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        } catch (error) {
            throw error;
        }
    });
};
