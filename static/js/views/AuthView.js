/**
 * AuthView.js
 * MVC - View Layer: Authentication Interface (Login & Register)
 */

class AuthView {
    constructor() {
        this.container = document.getElementById('app-root');
    }

    render(isRegister = false, errorMsg = '') {
        this.container.innerHTML = `
            <div class="auth-wrapper">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="auth-brand-badge">Marksheet Helper</div>
                        <h1 class="auth-title">മാർക്ക്ഷീറ്റ് മാനേജർ</h1>
                    </div>

                    ${errorMsg ? `<div class="alert alert-danger" role="alert">${errorMsg}</div>` : ''}

                    <div class="auth-tabs">
                        <button class="auth-tab ${!isRegister ? 'active' : ''}" id="tab-login-btn">ലോഗിൻ</button>
                        <button class="auth-tab ${isRegister ? 'active' : ''}" id="tab-register-btn">രജിസ്റ്റർ</button>
                    </div>

                    ${!isRegister ? this._renderLoginForm() : this._renderRegisterForm()}
                </div>
            </div>
        `;

        this._bindEvents(isRegister);
    }

    _renderLoginForm() {
        return `
            <form id="login-form" class="auth-form" autocomplete="off">
                <div class="form-group">
                    <label class="form-label" for="login-userid">യൂസർ ഐഡി</label>
                    <input 
                        type="text" 
                        id="login-userid" 
                        class="form-control" 
                        placeholder="യൂസർ ഐഡി" 
                        required 
                        autofocus
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="login-password">പാസ്‌വേഡ്</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        class="form-control" 
                        placeholder="പാസ്‌വേഡ്" 
                        required
                    >
                </div>
                <button type="submit" class="btn btn-primary btn-block">ലോഗിൻ</button>
            </form>
        `;
    }

    _renderRegisterForm() {
        return `
            <form id="register-form" class="auth-form" autocomplete="off">
                <div class="form-group">
                    <label class="form-label" for="reg-fullname">പൂർണ്ണ നാമം</label>
                    <input 
                        type="text" 
                        id="reg-fullname" 
                        class="form-control" 
                        placeholder="പേര്" 
                        required 
                        autofocus
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="reg-userid">യൂസർ ഐഡി</label>
                    <input 
                        type="text" 
                        id="reg-userid" 
                        class="form-control" 
                        placeholder="യൂസർ ഐഡി" 
                        required
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="reg-password">പാസ്‌വേഡ്</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        class="form-control" 
                        placeholder="പാസ്‌വേഡ്" 
                        required
                    >
                </div>
                <button type="submit" class="btn btn-primary btn-block">രജിസ്റ്റർ</button>
            </form>
        `;
    }

    _bindEvents(isRegister) {
        const loginTabBtn = document.getElementById('tab-login-btn');
        const regTabBtn = document.getElementById('tab-register-btn');

        if (loginTabBtn) {
            loginTabBtn.addEventListener('click', () => {
                window.authController.showLogin();
            });
        }

        if (regTabBtn) {
            regTabBtn.addEventListener('click', () => {
                window.authController.showRegister();
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userId = document.getElementById('login-userid').value;
                const pass = document.getElementById('login-password').value;
                window.authController.handleLogin(userId, pass);
            });
        }

        const regForm = document.getElementById('register-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullName = document.getElementById('reg-fullname').value;
                const userId = document.getElementById('reg-userid').value;
                const pass = document.getElementById('reg-password').value;
                window.authController.handleRegister(userId, fullName, pass);
            });
        }
    }
}

window.authView = new AuthView();
