let session;

export let isAuthenticated;
export let token;

updateAuthData();

export function handleAuthentication(session) {
    localStorage.setItem('session', JSON.stringify(session));
    updateAuthData();
}

export function handleLoggingOut() {
    localStorage.removeItem('session');
    window.location.reload();
}

function updateAuthData() {
    session = JSON.parse(localStorage.getItem('session'));
    isAuthenticated  = session !== null && Date.now() <= session.expiresAt;
    token = session !== null ? session['token'] : undefined;
}