const {changeData} = require('./run-query');

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
