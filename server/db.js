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

exports.signUp = function (firstName, lastName, email, password) {
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

exports.signIn = function (email, password) {
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

exports.getUser = function(user_id) {
    console.log("db");
    return new Promise((resolve, reject) => {
        let sql=`SELECT Users.user_id,  Users.createdTime, Users.firstName, Users.lastName, Users.email
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
}

exports.getUserModels = function (userId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Models WHERE ownerUser = '${userId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

exports.getGroupModels = function (groupId) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Models WHERE ownerGroup = '${groupId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

exports.getGroups = function (userId) {
    return new Promise((resolve, reject) => {
        let sql =
            `SELECT
            Groups.title, Groups.description, Groups.image, Groups.owner, Groups.dateOfCreation, Groups.group_id,
            GroupUsers.user_id, GroupUsers.access, GroupUsers.userJoinedDate,
            Users.firstName, Users.lastName, Users.email
            FROM Groups
            JOIN GroupUsers, Users
            ON Users.user_id = GroupUsers.user_id AND Groups.group_id = GroupUsers.group_id
            WHERE Users.user_id = ${userId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

exports.addGroup = function (title, description, image, owner, dateOfCreation) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Groups (title, description, image, owner, dateOfCreation) 
        VALUES ('${title}', '${description}', '${image}', '${owner}', '${dateOfCreation}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

exports.addGroupUser = function (user_id, groupId, access, dateOfCreation) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO "GroupUsers" ("group_id", "user_id", "access", "userJoinedDate")
        VALUES (${groupId}, ${user_id}, '${access}', '${dateOfCreation}');`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

exports.getUsersByGroup = function (group_id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT GroupUsers.user_id,  GroupUsers.access, Users.firstName, Users.lastName, Users.email 
        FROM GroupUsers
        JOIN Users
        ON Users.user_id = GroupUsers.user_id 
        WHERE GroupUsers.group_id ='${group_id}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
}

exports.getUserAccess = function (group_id, user_id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT GroupUsers.access
        FROM GroupUsers
        WHERE GroupUsers.group_id = ${group_id} AND GroupUsers.user_id = ${user_id}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.getIdByEmail = function (email) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT Users.user_id FROM Users WHERE Users.email = '${email}'`;
        db.all(sql, [], function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

exports.addModel = function (title, desc, filename, gltfPath, originalPath, sizeKB, type, ownerUser, ownerGroup) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO Models (title, desc, filename, gltfPath, originalPath, sizeKB, type, ownerUser, ownerGroup) 
        VALUES  ('${title}','${desc}', '${filename}', '${gltfPath}', '${originalPath}', '${sizeKB}', '${type}', '${ownerUser}', '${ownerGroup}')`;
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

exports.removeUser = function(groupId, userId) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM GroupUsers WHERE group_id = ${groupId} AND user_id = ${userId}`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        })
    })
}
