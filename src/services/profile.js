import axios from "axios";

import {serverURL} from "./server-url";

export function getUser(userId) {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/user/data?userId=${userId}`)
            .then(resolve).catch(reject);
    });
}
