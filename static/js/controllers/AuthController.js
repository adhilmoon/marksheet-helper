/**
 * AuthController.js
 * MVC - Controller Layer: Handles authentication logic, registration, login sessions.
 */

class AuthController {
    constructor() {}

    init() {
        const session = window.storageModel.getSession();
        if (session) {
            window.classController.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin(errorMsg = '') {
        window.authView.render(false, errorMsg);
    }

    showRegister(errorMsg = '') {
        window.authView.render(true, errorMsg);
    }

    async handleLogin(userId, password) {
        try {
            await window.storageModel.login(userId, password);
            window.classController.showDashboard();
        } catch (err) {
            this.showLogin(err.message);
        }
    }

    async handleRegister(userId, fullName, password) {
        try {
            await window.storageModel.register(userId, fullName, password);
            window.classController.showDashboard();
        } catch (err) {
            this.showRegister(err.message);
        }
    }

    handleLogout() {
        window.storageModel.logout();
        this.showLogin();
    }
}

window.authController = new AuthController();
