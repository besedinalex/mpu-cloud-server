const path = require('path');
const {setDatabaseFilePath, changeData} = require('sqlite3-simple-api');
const {DATA_PATH} = require(process.cwd() + '/config.json');

setDatabaseFilePath(path.join(DATA_PATH, 'database.sqlite3'));

const createFilesTable =
    `CREATE TABLE IF NOT EXISTS 'Files' (
    'file_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'filename' TEXT,
    'title' TEXT,
    'desc' TEXT,
    'code' TEXT,
    'createdTime' TEXT DEFAULT CURRENT_TIMESTAMP,
    'ownerUser' TEXT,
    'ownerGroup' INTEGER,
    'type' TEXT,
    'sizeKB' INTEGER,
    'status' TEXT,
    FOREIGN KEY('ownerUser') REFERENCES 'Users'('user_id')
    );`;
changeData(createFilesTable);

exports.addFile = function(title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup) {
    const sql =
        `INSERT INTO Files (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup, status) 
        VALUES ('${title}','${desc}', '${filename}', '${code}', '${sizeKB}', '${type}', '${ownerUser}', '${ownerGroup}', 'success')`;
    return changeData(sql);
};

exports.updateStatus = function(id, status) {
    const sql = `UPDATE Files SET status='${status}' WHERE file_id=${id}`;
    return changeData(sql);
}

exports.removeFile = function(fileId, ownerId) {
    const sql = `DELETE FROM Files WHERE file_id = ${fileId} AND ownerUser = ${ownerId}`;
    return changeData(sql);
};
