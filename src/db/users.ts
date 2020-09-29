import path from "path";
import {setDatabaseFilePath, selectData, changeData} from "sqlite3-simple-api";

const {DATA_PATH} = require(process.cwd() + '/config.json');

setDatabaseFilePath(path.join(DATA_PATH, 'database.sqlite3'));

const createUserTable =
    `CREATE TABLE IF NOT EXISTS 'Users' (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'firstName' TEXT,
    'lastName' TEXT,
    'email' TEXT NOT NULL UNIQUE,
    'password' TEXT NOT NULL,
    'createdTime' TEXT DEFAULT CURRENT_TIMESTAMP
    );`;
changeData(createUserTable);

type UserLoginData = {
    id: number;
    password: string;
};

type UserData = {
    id: number;
    createdTime: Date;
    firstName: string;
    lastName: string;
    email: string;
};

export function getUserLoginData(email: string): Promise<UserLoginData> {
    const sql = `SELECT U.password, U.id FROM Users AS U WHERE email='${email}'`;
    return selectData(sql, true) as Promise<UserLoginData>;
}

export function addUser(firstName: string, lastName: string, email: string, password: string): Promise<number> {
    const sql =
        `INSERT INTO Users (firstName, lastName, email, password)
        VALUES ('${firstName}','${lastName}','${email}','${password}')`;
    return changeData(sql);
}

export function getUserData(id: number): Promise<UserData> {
    const sql = `SELECT U.id, U.createdTime, U.firstName, U.lastName, U.email FROM Users AS U WHERE id='${id}'`;
    return selectData(sql, true) as Promise<UserData>;
}

export async function getIdByEmail(email: string): Promise<number> {
    const sql = `SELECT Users.id FROM Users WHERE Users.email='${email}'`;
    const data = await selectData(sql, true) as { id: number };
    return data.id;
}

export async function getEmailById(id: number): Promise<string> {
    const sql = `SELECT Users.email FROM Users WHERE Users.id='${id}'`;
    const data = await selectData(sql, true) as { email: string };
    return data.email;
}

export function updatePassword(id: number, password: string): Promise<number> {
    const sql = `UPDATE Users SET password="${password}" WHERE id=${id}`;
    return changeData(sql);
}

export function getUserFiles(id: number) {
    const sql =
        `SELECT F.file_id, F.title, F.createdTime, F.ownerUser, F.ownerGroup, F.type, F.sizeKB, F.code, F.status
        FROM Files AS F WHERE ownerUser = '${id}'`;
    return selectData(sql);
}
