import GroupsData from "../db/groups";
import UsersData from "../db/users";
import FileManager from "../utils/file-manager";
import {ServiceResponse} from "../types";

export async function getAllGroups(userId: number, response: ServiceResponse) {
    try {
        const groups = await GroupsData.getGroups(userId);
        if (groups.length === 0) {
            response(404, {message: 'Вы не состоите в группах.'})
        }
        response(200, groups);
    } catch {
        response(404, {message: 'Не удалось найти группы.'});
    }
}

export async function getGroupData(userId: number, groupId: number, response: ServiceResponse) {
    try {
        const groupData = await GroupsData.getGroup(groupId, userId);
        response(200, groupData);
    } catch {
        response(404, {message: 'Данная группа не найдена.'});
    }
}

export async function createGroup(userId: number, title: string, description: string, response: ServiceResponse) {
    try {
        const groupId = await GroupsData.addGroup(title, description, userId);
        await FileManager.createFolder(`g${groupId.toString()}`);
        try {
            await GroupsData.addGroupUser(groupId, userId, 'ADMIN');
            response(201, {groupId, message: 'Группа успешно создана.'});
        } catch {
            response(500, {message: 'Не удалось добавить пользователя в группу.'});
        }
    } catch {
        response(500, {message: 'Не удалось создать группу.'});
    }
}

export async function getGroupUsers(userId: number, groupId: number, response: ServiceResponse) {
    try {
        await GroupsData.getGroup(groupId, userId);
        try {
            const users = await GroupsData.getGroupUsers(groupId);
            response(200, users);
        } catch {
            response(404, {message: 'Не удалось найти пользователей группы.'});
        }
    } catch {
        response(404, {message: 'Данная группа не найдена.'});
    }
}

export async function addGroupUser(userId: number, groupId: number, email: string, access: string,
                                   response: ServiceResponse) {
    try {
        const requesterAccess = await GroupsData.getUserAccess(groupId, userId);
        if (requesterAccess !== 'ADMIN' && requesterAccess !== 'MODERATOR') {
            response(403, {messsage: 'Вы не можете приглашать людей в группу.'});
        } else {
            try {
                const user = await UsersData.getUserDataByEmail(email);
                try {
                    await GroupsData.getUserAccess(groupId, user.id);
                    response(409, {message: 'Пользователь уже состоит в группе.'});
                } catch {
                    access = access === 'ADMIN' ? 'MODERATOR' : access === 'MODERATOR' ? access : 'USER';
                    await GroupsData.addGroupUser(groupId, user.id, access);
                    response(201, {message: 'Пользователь успешно добавлен в группу.'});
                }
            } catch {
                response(404, {message: 'Пользователь с указанным email не найден.'});
            }
        }
    } catch {
        response(404, {message: 'Данная группа не найдена.'});
    }
}

export async function removeGroupUser(requesterId: number, groupId: number, userId: number, response: ServiceResponse) {
    try {
        const requesterAccess = await GroupsData.getUserAccess(groupId, requesterId);
        try {
            const toBeRemovedUserAccess = await GroupsData.getUserAccess(groupId, userId);
            switch (requesterAccess) {
                case 'ADMIN':
                    if (toBeRemovedUserAccess !== 'ADMIN') {
                        await GroupsData.removeGroupUser(groupId, userId);
                        response(200, {message: 'Пользователь удален из группы.'});
                    } else {
                        response(403, {message: 'Вы не можете удалить администратора.'});
                    }
                    break;
                case 'MODERATOR':
                    if (toBeRemovedUserAccess !== 'USER') {
                        await GroupsData.removeGroupUser(groupId, userId);
                        response(200, {message: 'Пользователь удален из группы.'});
                    } else {
                        response(403, {message: 'Вы не можете удалить модератора или администратора.'});
                    }
                    break;
                default:
                    if (requesterId === userId) {
                        await GroupsData.removeGroupUser(groupId, userId);
                        response(200, {message: 'Пользователь удален из группы.'});
                        return;
                    }
                    response(403, {message: 'Вы не можете удалять пользователей из группы.'});
            }
        } catch {
            response(404, {message: 'Такой пользователь в данной группе не найден.'});
        }
    } catch {
        response(404, {message: 'Данная группа не найдена.'});
    }
}