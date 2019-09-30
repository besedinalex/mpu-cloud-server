import axios from "axios";

import {serverURL} from "./server-url";
import {token} from "./authentication";

export function getUser() {
    return new Promise((resolve, reject) => {
        axios.get(`${serverURL}/user?token=${token}`)
            .then(resolve).catch(reject);
    });
}