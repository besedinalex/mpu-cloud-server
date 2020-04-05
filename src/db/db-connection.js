const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data/database.sqlite3', err => {
    if (err) {
        return console.error(err.message);
    }
    for (const query of createQueries) {
        db.run(query, err => {
            if (err) {
                console.error(err);
            }
        })
    }
    console.log('Выполнено подключение к Базе Данных.');
});

const createQueries = [
    `CREATE TABLE IF NOT EXISTS 'Users' (
    'user_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'firstName' TEXT,
    'lastName' TEXT,
    'email' TEXT NOT NULL UNIQUE,
    'password' TEXT,
    'createdTime' TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS 'Files' (
    'file_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'filename' TEXT,
    'title' TEXT,
    'desc' TEXT,
    'code' TEXT,
    'createdTime' TEXT DEFAULT CURRENT_TIMESTAMP,
    'ownerUser' TEXT,
    'ownerGroup' INTEGER,
    'type' TEXT,
    'sizeKB' INTEGER,
    FOREIGN KEY('ownerUser') REFERENCES 'Users'('user_id')
    );`,
    `CREATE TABLE IF NOT EXISTS 'Groups' (
    'title' TEXT NOT NULL,
    'description' TEXT,
    'image' TEXT NOT NULL,
    'owner' TEXT NOT NULL,
    'createdTime' TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    'group_id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    FOREIGN KEY('owner') REFERENCES 'Users'('user_id')
    );`,
    `CREATE TABLE IF NOT EXISTS 'GroupUsers' (
    'group_id' INTEGER NOT NULL,
    'user_id' INTEGER NOT NULL,
    'access' TEXT NOT NULL,
    'userJoinedDate' TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    'id' INTEGER NOT NULL,
    PRIMARY KEY('id'),
    FOREIGN KEY('user_id') REFERENCES 'Users'('user_id'),
    FOREIGN KEY('group_id') REFERENCES 'Groups'('group_id')
    );`
];

module.exports = db;
