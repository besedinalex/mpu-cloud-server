const {selectData, changeData} = require('./run-query');

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
