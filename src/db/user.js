const {selectData, changeData} = require('sqlite3-simple-api');

const createUserTable =
    `CREATE TABLE IF NOT EXISTS 'Users' (
    'user_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'firstName' TEXT,
    'lastName' TEXT,
    'email' TEXT NOT NULL UNIQUE,
    'password' TEXT,
    'createdTime' TEXT DEFAULT CURRENT_TIMESTAMP
    );`;
changeData(createUserTable);

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
    const query =
        `SELECT F.file_id, F.title, F.createdTime, F.ownerUser, F.ownerGroup, F.type, F.sizeKB
        FROM Files AS F WHERE ownerUser = '${userId}'`;
    return selectData(query);
};

exports.updatePassword = function (password, user_id) {
    const sql = `UPDATE Users SET password="${password}" WHERE user_id=${user_id}`;
    return changeData(sql);
};
