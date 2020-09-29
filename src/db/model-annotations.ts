import path from "path";
import {setDatabaseFilePath, selectData, changeData} from "sqlite3-simple-api";

const {DATA_PATH} = require(process.cwd() + '/config.json');
setDatabaseFilePath(path.join(DATA_PATH, 'database.sqlite3'));

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

export function getAnnotations(modelId: number) {
    const sql = `SELECT * FROM ModelAnnotations WHERE modelId = ${modelId}`;
    return selectData(sql);
}

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
