const db = require('./db-connection');

/**
 * Detects type of passed query.
 * @param sqlQuery {string} SQL query.
 * @returns {string} Type of SQL query in lower case (select, update, ...)
 */
function detectQueryType(sqlQuery) {
    return sqlQuery.split(' ')[0].toLowerCase();
}

/**
 * Selects data from database.
 * @param sqlQuery {string} SQL query to execute. Expects SELECT query.
 * @param firstValueOnly {boolean} By default returns array of objects. Pass 'true' to return first element only.
 * @returns {Promise<any>}
 */
exports.selectData = function(sqlQuery, firstValueOnly = false) {
    if (detectQueryType(sqlQuery) !== 'select') {
        console.error('\nERROR: selectData() expects sql SELECT query\n');
        return;
    }
    return new Promise((resolve, reject) => {
        db.all(sqlQuery, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                if (firstValueOnly) {
                    if (rows.length === 0) {
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                } else {
                    resolve(rows);
                }
            }
        });
    });
}

/**
 * Insert, update or delete data.
 * @param sqlQuery {string} SQL query to execute. Expects INSERT, UPDATE or DELETE query.
 * @returns {Promise<number>}
 */
exports.changeData = function (sqlQuery) {
    const queryType = detectQueryType(sqlQuery);
    if (queryType !== 'insert' && queryType !== 'update' && queryType !== 'delete') {
        console.error('\nERROR: changeData() expects sql INSERT or UPDATE or DELETE query\n');
        return;
    }
    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [], function (err) {
            if (err) {
                reject(err);
            } else if (queryType === 'insert') {
                resolve(this.lastID);
            } else { // update or delete
                resolve(this.changes);
            }
        })
    });
}
