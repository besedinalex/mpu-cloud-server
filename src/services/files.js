import axios from "axios";

import {serverURL} from "./server-url";
import {token} from "./authentication";

export function uploadFile(title, desc, file, groupId) {
    return new Promise((resolve, reject) => {
        const bodyFormData = new FormData();
        bodyFormData.append('title', title);
        bodyFormData.append('desc', desc);
        bodyFormData.append('model', file);
        bodyFormData.append('groupId', groupId);

        axios({
            method: 'post',
            url: `${serverURL}/file/original?token=${token}`,
            data: bodyFormData,
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        }).then(resolve).catch(reject);
    });
}

export function deleteFile(id) {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/file/original/${id}?token=${token}`)
            .then(resolve).catch(reject);
    })
}

export function getUserFiles() {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/user/files?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function getGroupFiles(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/group/files?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    })
}
