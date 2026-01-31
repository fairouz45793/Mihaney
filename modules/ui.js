
console.log("ui starts");

export function showApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

export function updateHeader(user) {
    document.getElementById('currentUser').textContent = user.username;
    document.getElementById('roleBadge').textContent = user.role;
}
