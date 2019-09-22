import axios from "axios";

let session;

export let isAuthenticated;
export let token;

updateAuthData();

export function handleSigningUp(firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        (axios.post(`http://127.0.0.1:4000/user?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}`)
            .then(res => {
                if (res.status === 200)
                    handleAuthentication(res.data);
            })).then(resolve).catch(reject);
    });
}

export function handleSigningIn(email, password) {
    return new Promise((resolve, reject) => {
        (axios.get(`http://127.0.0.1:4000/token?email=${email}&password=${password}`)
            .then(res => {
                if (res.status === 200)
                    handleAuthentication(res.data);
        })).then(resolve).catch(reject);
    })

}

export function handleSigningOut() {
    localStorage.removeItem('session');
    window.location.reload();
}

function handleAuthentication(session) {
    localStorage.setItem('session', JSON.stringify(session));
    updateAuthData();
}

function updateAuthData() {
    session = JSON.parse(localStorage.getItem('session'));
    isAuthenticated = session !== null && Date.now() <= session.expiresAt;
    token = session !== null ? session['token'] : undefined;
}
