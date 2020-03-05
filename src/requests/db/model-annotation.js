const db = require('./db-connection').db;

exports.getAnnotations = function (modelId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT ModelAnnotations.data FROM ModelAnnotations WHERE ModelAnnotations.model_id = ${modelId}`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.addAnnotation = function (modelId, data) {
    return new Promise((resolve, reject) => {
        const sql =
        `INSERT INTO ModelAnnotations (model_id, data)
        VALUES ('${modelId}', '${data}')`;
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
        const sql = `DELETE FROM ModelAnnotations WHERE model_id = ${modelId}`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};
