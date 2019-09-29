import axios from "axios";

import {token} from "./authentication";

export function uploadModel(title, desc, model, groupId) {
    return new Promise((resolve, reject) => {
        let bodyFormData = new FormData();

        bodyFormData.append('title', title);
        bodyFormData.append('desc', desc);
        bodyFormData.append('model', model);
        bodyFormData.append('groupId', groupId);

        axios({
            method: 'post',
            url: `http://127.0.0.1:4000/models?token=${token}`,
            data: bodyFormData,
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        }).then(resolve).catch(reject);
    });
}

export function deleteModel(id) {
    return new Promise((resolve, reject) => {
        axios.delete(`http://127.0.0.1:4000/model/${id}?token=${token}`)
            .then(resolve).catch(reject);
    })
}

export function getUserModels() {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/models-user?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function getGroupModels(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/models-group?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    })
}
