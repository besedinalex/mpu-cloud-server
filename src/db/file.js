const {changeData} = require('sqlite3-simple-api');

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
    FOREIGN KEY('ownerUser') REFERENCES 'Users'('user_id')
    );`;
changeData(createFilesTable);

exports.addFile = function (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup) {
    const sql =
        `INSERT INTO Files (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup) 
        VALUES ('${title}','${desc}', '${filename}', '${code}', '${sizeKB}', '${type}', '${ownerUser}', '${ownerGroup}')`;
    return changeData(sql);
};

exports.removeFile = function(fileId, ownerId) {
    const sql = `DELETE FROM Files WHERE file_id = ${fileId} AND ownerUser = ${ownerId}`;
    return changeData(sql);
};
