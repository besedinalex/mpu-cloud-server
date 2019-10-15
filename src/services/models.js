import axios from "axios";

import {serverURL} from "./server-url";
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
            url: `${serverURL}/models?token=${token}`,
            data: bodyFormData,
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        }).then(resolve).catch(reject);
    });
}

export function deleteModel(id) {
    return new Promise((resolve, reject) => {
        axios.delete(`${serverURL}/model/${id}?token=${token}`)
            .then(resolve).catch(reject);
    })
}

export function getUserModels() {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/user-models?token=${token}`)
            .then(resolve).catch(reject);
    });
}

export function getGroupModels(groupId) {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/group-models?token=${token}&groupId=${groupId}`)
            .then(resolve).catch(reject);
    })
}
