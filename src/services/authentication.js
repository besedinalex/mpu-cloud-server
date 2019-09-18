export function handleLogOut() {
    localStorage.removeItem('session');
    window.location.reload();
}

export function isAuthenticated() {
    const session = JSON.parse(localStorage.getItem('session'));
    return session !== null && Date.now() <= session.expiresAt;
}

export function token() {
    const session = JSON.parse(localStorage.getItem('session'));
    return session !== null ? session['token'] : undefined;
}
