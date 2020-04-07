const db = require('./db-connection');

exports.getAnnotations = function (modelId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MA.x, MA.y, MA.z, MA.name, MA.text FROM ModelAnnotations as MA WHERE modelId = ${modelId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.addAnnotation = function (modelId, x, y, z, name, text) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO ModelAnnotations (modelId, x, y, z, name, text)
        VALUES ('${modelId}', '${x}', '${y}', '${z}', '${name}', '${text}')`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.deleteAnnotations = function (modelId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ModelAnnotations WHERE modelId = ${modelId}`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};
