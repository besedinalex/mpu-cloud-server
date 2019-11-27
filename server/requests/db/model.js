const db = require('./main').db;

exports.addModel = function (title, desc, filename, gltfPath, originalPath, previewPath, sizeKB, type, ownerUser, ownerGroup) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO Models (title, desc, filename, gltfPath, originalPath, previewPath, sizeKB, type, ownerUser, ownerGroup) 
        VALUES ('${title}','${desc}', '${filename}', '${gltfPath}', '${originalPath}', '${previewPath}', '${sizeKB}', '${type}', '${ownerUser}', '${ownerGroup}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        })
    })
};

exports.removeModel = function(modelId, ownerId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Models WHERE model_id = ${modelId} AND ownerUser = ${ownerId}`;
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        })
    })
};
