import path from "path";
import {setDatabaseFilePath, selectData, changeData} from '../connection';

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

export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdTime: Date;
};

namespace UsersData {

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

    export function getUserDataById(id: number): Promise<UserData> {
        const sql = `SELECT U.id, U.createdTime, U.firstName, U.lastName, U.email FROM Users AS U WHERE id='${id}'`;
        return selectData(sql, true) as Promise<UserData>;
    }

    export function getUserDataByEmail(email: string): Promise<UserData> {
        const sql =
            `SELECT U.id, U.createdTime, U.firstName, U.lastName, U.email FROM Users AS U WHERE email='${email}'`;
        return selectData(sql, true) as Promise<UserData>;
    }

    export function updatePassword(id: number, password: string): Promise<number> {
        const sql = `UPDATE Users SET password="${password}" WHERE id=${id}`;
        return changeData(sql);
    }
}

export default UsersData;