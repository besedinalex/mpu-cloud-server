import path from 'path';
import {setDatabaseFilePath, changeData} from "sqlite3-simple-api";

const {DATA_PATH} = require(process.cwd() + '/config.json');
setDatabaseFilePath(path.join(DATA_PATH, 'database.sqlite3'));

const createFilesTable =
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
    'status' TEXT,
    FOREIGN KEY('ownerUser') REFERENCES 'Users'('user_id')
    );`;
changeData(createFilesTable);

export function addFile(title: string, desc: string, filename: string, code: string, sizeKB: string, type: string,
                        ownerUser: string, ownerGroup: string): Promise<number> {
    const sql =
        `INSERT INTO Files (title, desc, filename, code, sizeKB, type, ownerUser, ownerGroup, status) 
        VALUES ('${title}','${desc}','${filename}','${code}','${sizeKB}','${type}','${ownerUser}','${ownerGroup}','success')`;
    return changeData(sql);
}

export function updateStatus(id: number, status: string): Promise<number> {
    const sql = `UPDATE Files SET status='${status}' WHERE file_id=${id}`;
    return changeData(sql);
}

export function removeFile(fileId: number, ownerId: number): Promise<number> {
    const sql = `DELETE FROM Files WHERE file_id = ${fileId} AND ownerUser = ${ownerId}`;
    return changeData(sql);
}
