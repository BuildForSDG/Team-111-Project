const auth = {
    isAuthenticated: false,
    authenticate(token) {
        auth.isAuthenticated = true;
        localStorage.setItem('token', token);
    },
    signout() {
        auth.isAuthenticated = false;
        localStorage.clear();
    }
};

export default auth;