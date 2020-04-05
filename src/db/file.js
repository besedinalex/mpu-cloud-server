const db = require('./db-connection').db;

exports.addFile = function (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO Files (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup) 
        VALUES ('${title}','${desc}', '${filename}', '${code}', '${sizeKB}', '${type}', '${ownerUser}', '${ownerGroup}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
};

exports.removeFile = function(fileId, ownerId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Files WHERE file_id = ${fileId} AND ownerUser = ${ownerId}`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        })
    })
};
