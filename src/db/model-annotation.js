const db = require('./db-connection');

exports.getAnnotations = function (modelId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ModelAnnotations WHERE modelId = ${modelId}`;
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

exports.deleteAnnotation = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ModelAnnotations WHERE id = ${id}`;
        db.run(sql, [], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
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
