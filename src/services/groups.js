import axios from "axios";

import {serverURL} from "./server-url";
import {token} from "./authentication";

export function getGroup(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/group?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    });
}

export function getGroups() {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/groups?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function addGroup(title, desc, file) {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/group-create?token=${token}&title=${title}&description=${desc}&image=${file}`)
            .then(resolve, reject);
    });
}

export function getGroupUsers(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/group-users?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    });
}

export function addGroupUser(groupId, email, access) {
    return new Promise((resolve, reject) => {
        axios.post(`${serverURL}/group-user?token=${token}&groupId=${groupId}&email=${email}&access=${access}`)
            .then(resolve).catch(reject);
    });
}

export function deleteGroupUser(userId, groupId) {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/group-user/?token=${token}&userId=${userId}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    });
}
