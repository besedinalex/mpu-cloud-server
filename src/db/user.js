const {selectData, changeData} = require('./run-query');
const db = require("./db-connection");

exports.signIn = function (email) {
    const sql = `SELECT U.user_id, U.password FROM Users AS U WHERE email = '${email}'`;
    return selectData(sql, true);
};

exports.signUp = function (firstName, lastName, email, password) {
    const sql =
        `INSERT INTO Users (firstName, lastName, email, password)
        VALUES ('${firstName}','${lastName}','${email}','${password}')`;
    return changeData(sql);
};

exports.getUser = function (user_id) {
    const sql =
        `SELECT U.user_id, U.createdTime, U.firstName, U.lastName, U.email FROM Users AS U WHERE user_id ='${user_id}'`;
    return selectData(sql, true);
};

exports.getIdByEmail = function (email) {
    const sql = `SELECT Users.user_id FROM Users WHERE Users.email = '${email}'`;
    return selectData(sql, true);
};

exports.getEmailById = function (id) {
    const sql = `SELECT Users.email FROM Users WHERE Users.user_id = '${id}'`;
    return selectData(sql, true);
};

exports.getUserFiles = function (userId) {
    const query = `SELECT * FROM Files WHERE ownerUser = '${userId}'`;
    return selectData(query);
};

exports.updateResetToken = function (userId, resetToken, resetTokenExp) {
    const sql = `UPDATE Users SET resetToken='${resetToken}', resetTokenExp='${resetTokenExp}' WHERE user_id=${userId}`;
    return changeData(sql);
};

exports.updatePassword = function (password, user_id) {
    const sql = `UPDATE Users SET password="${password}" WHERE user_id=${user_id}`;
    return changeData(sql);
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
