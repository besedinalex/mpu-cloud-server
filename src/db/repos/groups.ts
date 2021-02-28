import path from "path";
import {setDatabaseFilePath, selectData, changeData} from '../connection';
import GroupData from "../../models/tables/group-data";
import GroupUser from "../../models/tables/group-user";

const {DATA_PATH} = require(process.cwd() + '/config.json');

setDatabaseFilePath(path.join(DATA_PATH, 'database.sqlite3'));

const createGroupTable =
    `CREATE TABLE IF NOT EXISTS 'Groups' (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'title' TEXT NOT NULL,
    'description' TEXT,
    'owner' INTEGER NOT NULL,
    'createdTime' TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY('owner') REFERENCES 'Users'('id')
    );`;
const createGroupUserTable =
    `CREATE TABLE IF NOT EXISTS 'GroupUsers' (
    'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    'groupId' INTEGER NOT NULL,
    'userId' INTEGER NOT NULL,
    'access' TEXT NOT NULL,
    'userJoinedDate' TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY('userId') REFERENCES 'Users'('id'),
    FOREIGN KEY('groupId') REFERENCES 'Groups'('id')
    );`;
changeData(createGroupTable);
changeData(createGroupUserTable);

namespace GroupsData {

    export function getGroups(userId: number): Promise<GroupData[]> {
        const sql =
            `SELECT G.id, G.title, G.owner, G.createdTime
            FROM Groups AS G JOIN GroupUsers AS GU ON G.id=GU.groupId WHERE GU.userId=${userId}`;
        return selectData(sql) as Promise<GroupData[]>;
    }

    export function getGroup(groupId: number, userId: number): Promise<GroupData> {
        const sql =
            `SELECT G.id, G.title, G.description, G.createdTime, GU.access, GU.userJoinedDate
            FROM Groups AS G JOIN GroupUsers AS GU ON G.id=GU.groupId
            WHERE GU.userId=${userId} AND G.id=${groupId}`;
        return selectData(sql, true) as Promise<GroupData>;
    }

    export function addGroup(title: string, description: string, userId: number): Promise<number> {
        const sql = `INSERT INTO Groups (title, description, owner) VALUES ('${title}', '${description}', '${userId}')`;
        return changeData(sql);
    }

    export function getGroupUsers(groupId: number): Promise<GroupUser[]> {
        const sql =
            `SELECT GU.userId, GU.access, U.firstName, U.lastName, U.email
            FROM GroupUsers AS GU JOIN Users AS U ON U.id=GU.userId
            WHERE GU.groupId =${groupId}`;
        return selectData(sql) as Promise<GroupUser[]>;
    }

    export async function getUserAccess(groupId: number, userId: number): Promise<string> {
        const sql = `SELECT GU.access FROM GroupUsers AS GU WHERE groupId=${groupId} AND userId=${userId}`;
        return (await selectData(sql, true) as { access: string }).access;
    }

    export function addGroupUser(groupId: number, userId: number, access: string): Promise<number> {
        const sql = `INSERT INTO GroupUsers (groupId, userId, access) VALUES (${groupId}, ${userId}, '${access}')`;
        return changeData(sql);
    }

    export function removeGroupUser(groupId: number, userId: number): Promise<number> {
        const sql = `DELETE FROM GroupUsers WHERE groupId = ${groupId} AND userId = ${userId}`;
        return changeData(sql);
    }
}

export default GroupsData;