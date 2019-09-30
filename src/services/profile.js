import axios from "axios";

import {token} from "./authentication";

export function getUser() {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:4000/user?token=${token}`)
            .then(resolve).catch(reject);
    });
}