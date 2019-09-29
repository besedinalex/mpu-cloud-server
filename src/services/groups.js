import axios from "axios";

import {token} from "./authentication";

export function getGroups() {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/groups?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function addGroup(title, desc, file) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:4000/group-create?token=${token}&title=${title}&description=${desc}&image=${file}`)
            .then(resolve, reject);
    });
}

export function getGroupUsers(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/group-users?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    });
}

export function addGroupUser(groupId, email, access) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:4000/group-user?token=${token}&groupId=${groupId}&email=${email}&access=${access}`)
            .then(resolve).catch(reject);
    });
}

export function deleteGroupUser(userId, groupId) {
    return new Promise((resolve, reject) => {
        axios.delete(`http://127.0.0.1:4000/group-user/?token=${token}&userId=${userId}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    });
}
