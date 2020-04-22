const {selectData, changeData} = require('./run-query');

exports.getGroups = function (userId) {
    const sql =
        `SELECT G.title, G.image, G.owner, G.group_id, G.createdTime
         FROM Groups AS G
         JOIN GroupUsers AS GU, Users AS U
         ON U.user_id = GU.user_id AND G.group_id = GU.group_id
         WHERE U.user_id = ${userId}`;
    return selectData(sql);
};

exports.getGroup = function (userId, groupId) {
    const sql =
        `SELECT G.title, G.description, G.image, G.owner, G.group_id, G.createdTime,
        GU.user_id, GU.access, GU.userJoinedDate
        FROM Groups as G JOIN GroupUsers AS GU, Users AS U
        ON U.user_id = GU.user_id AND G.group_id = GU.group_id
        WHERE U.user_id = ${userId} AND G.group_id = ${groupId}`;
    return selectData(sql, true);
};

exports.getGroupFiles = function (groupId) {
    const sql = `SELECT * FROM Files WHERE ownerGroup = '${groupId}'`;
    return selectData(sql);
};

exports.getGroupUsers = function (group_id) {
    const sql =
        `SELECT GU.user_id,  GU.access, U.firstName, U.lastName, U.email 
        FROM GroupUsers AS GU
        JOIN Users AS U
        ON U.user_id = GU.user_id 
        WHERE GU.group_id ='${group_id}'`;
    return selectData(sql);
};

exports.getUserAccess = function (group_id, user_id) {
    const sql = `SELECT GU.access FROM GroupUsers AS GU WHERE group_id = ${group_id} AND user_id = ${user_id}`;
    return selectData(sql, true);
};

exports.addGroup = function (title, description, image, owner) {
    const sql =
        `INSERT INTO Groups (title, description, image, owner) 
        VALUES ('${title}', '${description}', '${image}', '${owner}')`;
    return changeData(sql);
};

exports.addGroupUser = function (user_id, groupId, access) {
    const sql = `INSERT INTO GroupUsers (group_id, user_id, access) VALUES (${groupId}, ${user_id}, '${access}')`;
    return changeData(sql);
};

exports.removeGroupUser = function(groupId, userId) {
    const sql = `DELETE FROM GroupUsers WHERE group_id = ${groupId} AND user_id = ${userId}`;
    return changeData(sql);
};
