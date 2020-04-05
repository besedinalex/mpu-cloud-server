const db = require('./db-connection').db;

exports.addGroup = function (title, description, image, owner) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO Groups (title, description, image, owner) 
        VALUES ('${title}', '${description}', '${image}', '${owner}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
};

exports.getGroup = function (userId, groupId) {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT
            Groups.title, Groups.description, Groups.image, Groups.owner, Groups.group_id, Groups.createdTime,
            GroupUsers.user_id, GroupUsers.access, GroupUsers.userJoinedDate
            FROM Groups
            JOIN GroupUsers, Users
            ON Users.user_id = GroupUsers.user_id AND Groups.group_id = GroupUsers.group_id
            WHERE Users.user_id = ${userId} AND Groups.group_id = ${groupId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
};

exports.getGroups = function (userId) {
    return new Promise((resolve, reject) => {
        const sql =
            `SELECT
            Groups.title, Groups.image, Groups.owner, Groups.group_id, Groups.createdTime
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
};

exports.getGroupFiles = function (groupId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Files WHERE ownerGroup = '${groupId}'`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    })
};

exports.getGroupUsers = function (group_id) {
    return new Promise((resolve, reject) => {
        const sql =
        `SELECT GroupUsers.user_id,  GroupUsers.access, Users.firstName, Users.lastName, Users.email 
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
};

exports.addGroupUser = function (user_id, groupId, access) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO "GroupUsers" ("group_id", "user_id", "access")
        VALUES (${groupId}, ${user_id}, '${access}');`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
};

exports.removeGroupUser = function(groupId, userId) {
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
};

exports.getUserAccess = function (group_id, user_id) {
    return new Promise((resolve, reject) => {
        const sql =
        `SELECT GroupUsers.access
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
};
