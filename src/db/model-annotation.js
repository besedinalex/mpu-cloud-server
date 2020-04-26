const {selectData, changeData} = require('sqlite3-simple-api');

const createModelAnnotationsTable =
    `CREATE TABLE IF NOT EXISTS 'ModelAnnotations' (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'modelId' INTEGER NOT NULL,
    'x' INTEGER NOT NULL,
    'y' INTEGER NOT NULL,
    'z' INTEGER NOT NULL,
    'name' TEXT NOT NULL,
    'text' TEXT,
    FOREIGN KEY('modelId') REFERENCES 'Files'('file_id')
    );`;
changeData(createModelAnnotationsTable);

exports.getAnnotations = function (modelId) {
    const sql = `SELECT * FROM ModelAnnotations WHERE modelId = ${modelId}`;
    return selectData(sql);
};

exports.addAnnotation = function (modelId, x, y, z, name, text) {
    const sql =
        `INSERT INTO ModelAnnotations (modelId, x, y, z, name, text)
        VALUES ('${modelId}', '${x}', '${y}', '${z}', '${name}', '${text}')`;
    return changeData(sql);
};

exports.deleteAnnotation = function (id) {
    const sql = `DELETE FROM ModelAnnotations WHERE id = ${id}`;
    return changeData(sql);
};

exports.deleteAnnotations = function (modelId) {
    const sql = `DELETE FROM ModelAnnotations WHERE modelId = ${modelId}`;
    return changeData(sql);
};
