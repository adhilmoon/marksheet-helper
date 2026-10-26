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
                        <p class="auth-subtitle">
                            മദ്രസകൾക്കും സ്കൂളുകൾക്കുമുള്ള ലളിതമായ മാർക്ക്ഷീറ്റ് തയ്യാറാക്കൽ സഹായി.
                            <br><span class="auth-sub-hint">സ്വന്തം ലോക്കൽ സ്റ്റോറേജ് വഴി പൂർണ്ണ സ്വകാര്യത. ക്ലൗഡ് ആവശ്യമില്ല.</span>
                        </p>
                    </div>

                    ${errorMsg ? `<div class="alert alert-danger" role="alert">${errorMsg}</div>` : ''}

                    <div class="auth-tabs">
                        <button class="auth-tab ${!isRegister ? 'active' : ''}" id="tab-login-btn">പ്രവേശിക്കുക (Login)</button>
                        <button class="auth-tab ${isRegister ? 'active' : ''}" id="tab-register-btn">പുതിയ അക്കൗണ്ട് (Register)</button>
                    </div>

                    ${!isRegister ? this._renderLoginForm() : this._renderRegisterForm()}

                    <div class="auth-footer">
                        <span>🔒 പൂർണ്ണമായും നിങ്ങളുടെ ബ്രൗസറിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.</span>
                    </div>
                </div>
            </div>
        `;

        this._bindEvents(isRegister);
    }

    _renderLoginForm() {
        return `
            <form id="login-form" class="auth-form" autocomplete="off">
                <div class="form-group">
                    <label class="form-label" for="login-userid">യൂസർ ഐഡി (User ID)</label>
                    <input 
                        type="text" 
                        id="login-userid" 
                        class="form-control" 
                        placeholder="ഉദാ: teacher1 അല്ലെങ്കിൽ adhil" 
                        required 
                        autofocus
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="login-password">പാസ്‌വേഡ് (Password)</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        class="form-control" 
                        placeholder="രഹസ്യവാക്ക് നൽകുക" 
                        required
                    >
                </div>
                <button type="submit" class="btn btn-primary btn-block">ലോഗിൻ ചെയ്യുക</button>
            </form>
        `;
    }

    _renderRegisterForm() {
        return `
            <form id="register-form" class="auth-form" autocomplete="off">
                <div class="form-group">
                    <label class="form-label" for="reg-fullname">പൂർണ്ണ നാമം (Full Name)</label>
                    <input 
                        type="text" 
                        id="reg-fullname" 
                        class="form-control" 
                        placeholder="ഉദാ: ഉസ്താദ് മുഹമ്മദ് / അധ്യാപകന്റെ പേര്" 
                        required 
                        autofocus
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="reg-userid">യൂസർ ഐഡി (User ID)</label>
                    <input 
                        type="text" 
                        id="reg-userid" 
                        class="form-control" 
                        placeholder="ഒരു പുതിയ യൂസർ ഐഡി നൽകുക (e.g. adhil2025)" 
                        required
                    >
                    <span class="field-hint">ഇംഗ്ലീഷ് അക്ഷരങ്ങളും അക്കങ്ങളും ഉപയോഗിക്കുക</span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="reg-password">പാസ്‌വേഡ് (Password)</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        class="form-control" 
                        placeholder="കുറഞ്ഞത് 4 അക്ഷരങ്ങൾ" 
                        required
                    >
                </div>
                <button type="submit" class="btn btn-primary btn-block">അക്കൗണ്ട് സൃഷ്ടിക്കുക</button>
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
