import axios from "axios";
import {token} from "./authentication";

export function getGroups() {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/groups?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function addGroup(title, desc, file, date) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:4000/group-create?token=${token}&title=${title}&description=${desc}&image=${file}&dateOfCreation=${date}`)
            .then(resolve, reject);
    })
}

export function getGroupUsers(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/group-users?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    })
}