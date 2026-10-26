/**
 * DashboardView.js
 * MVC - View Layer: Class listing, quick overview, class creation modal, backup/restore.
 */

class DashboardView {
    constructor() {
        this.container = document.getElementById('app-root');
    }

    render(classes = [], user = {}) {
        let totalStudents = 0;
        let totalBoys = 0;
        let totalGirls = 0;

        classes.forEach(c => {
            const studs = c.students || [];
            totalStudents += studs.length;
            totalBoys += studs.filter(s => s.gender === 'boy').length;
            totalGirls += studs.filter(s => s.gender === 'girl').length;
        });

        this.container.innerHTML = `
            <div class="app-layout">
                <header class="navbar">
                    <div class="nav-brand">
                        <span class="nav-logo-badge">MH</span>
                        <div class="nav-titles">
                            <span class="nav-title">Marksheet Helper</span>
                            <span class="nav-tagline">മാർക്ക്ഷീറ്റ് സഹായി</span>
                        </div>
                    </div>
                    <div class="nav-actions">
                        <div class="user-pill">
                            <span class="user-avatar">${(user.fullName || 'T')[0].toUpperCase()}</span>
                            <span class="user-name">${user.fullName || user.userId}</span>
                        </div>
                        <button class="btn btn-outline btn-sm" id="btn-backup" title="ഡാറ്റ ബാക്കപ്പ് / റീസ്റ്റോർ ചെയ്യുക">
                            ബാക്കപ്പ് & ഡാറ്റ
                        </button>
                        <button class="btn btn-ghost btn-sm" id="btn-logout" title="ലോഗ് ഔട്ട് ചെയ്യുക">
                            പുറത്തിറങ്ങുക
                        </button>
                    </div>
                </header>

                <main class="main-content">
                    <div class="dashboard-hero">
                        <div class="hero-left">
                            <h2 class="hero-title">സ്വാഗതം, ${user.fullName || 'അധ്യാപകരെ'}</h2>
                            <p class="hero-desc">
                                നിങ്ങളുടെ ക്ലാസുകൾ ക്രമീകരിക്കുക, വിദ്യാർത്ഥികളുടെ മാർക്കുകൾ രേഖപ്പെടുത്തുക, പിഡിഎഫും എക്സലും ഡൗൺലോഡ് ചെയ്യുക.
                            </p>
                        </div>
                        <div class="hero-right">
                            <button class="btn btn-primary btn-lg" id="btn-add-class">
                                ＋ പുതിയ ക്ലാസ് ചേർക്കുക
                            </button>
                        </div>
                    </div>

                    <!-- Summary Stats Bar -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">ആകെ ക്ലാസുകൾ</div>
                            <div class="stat-value">${classes.length}</div>
                            <div class="stat-sub">സജീവ ക്ലാസ്റൂമുകൾ</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">ആകെ വിദ്യാർത്ഥികൾ</div>
                            <div class="stat-value">${totalStudents}</div>
                            <div class="stat-sub">${totalBoys} ആൺകുട്ടികൾ • ${totalGirls} പെൺകുട്ടികൾ</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">സ്റ്റോറേജ് നില</div>
                            <div class="stat-value text-success">ലോക്കൽ</div>
                            <div class="stat-sub">പൂർണ്ണ സ്വകാര്യത (Offline Ready)</div>
                        </div>
                    </div>

                    <!-- Classes Section -->
                    <div class="section-header">
                        <h3 class="section-title">എന്റെ ക്ലാസുകൾ (${classes.length})</h3>
                    </div>

                    ${classes.length === 0 ? this._renderEmptyState() : this._renderClassGrid(classes)}
                </main>
            </div>

            <!-- Modal Container -->
            <div id="modal-container"></div>
        `;

        this._bindEvents();
    }

    _renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-illustration">📋</div>
                <h4 class="empty-title">ഇതുവരെ ക്ലാസുകളൊന്നും ചേർത്തിട്ടില്ല</h4>
                <p class="empty-text">
                    നിങ്ങളുടെ മദ്രസ അല്ലെങ്കിൽ സ്കൂൾ ക്ലാസ് ചേർത്ത് മാർക്കുകൾ രേഖപ്പെടുത്താൻ ആരംഭിക്കുക.
                </p>
                <button class="btn btn-primary" id="btn-empty-add-class">
                    ＋ ആദ്യ ക്ലാസ് സൃഷ്ടിക്കുക
                </button>
            </div>
        `;
    }

    _renderClassGrid(classes) {
        return `
            <div class="class-grid">
                ${classes.map(cls => {
                    const students = cls.students || [];
                    const boys = students.filter(s => s.gender === 'boy').length;
                    const girls = students.filter(s => s.gender === 'girl').length;
                    const topics = cls.topics || [];

                    return `
                        <div class="class-card" data-class-id="${cls.id}">
                            <div class="class-card-header">
                                <span class="class-badge">${cls.academicYear || '2025-26'}</span>
                                <div class="class-actions-menu">
                                    <button class="btn-icon btn-edit-class" title="ക്ലാസ് എഡിറ്റ് ചെയ്യുക" data-id="${cls.id}">✏️</button>
                                    <button class="btn-icon btn-delete-class" title="ക്ലാസ് നീക്കം ചെയ്യുക" data-id="${cls.id}">🗑️</button>
                                </div>
                            </div>
                            <div class="class-card-body">
                                <div class="class-org-name">${cls.madrasaName || 'സ്ഥാപനത്തിന്റെ പേര്'}</div>
                                <h4 class="class-name-title">${cls.className || 'ക്ലാസ്'}</h4>
                                <div class="class-exam-tag">${cls.examName || 'പരീക്ഷ'}</div>

                                <div class="class-metrics">
                                    <div class="metric-item">
                                        <span class="metric-num">${students.length}</span>
                                        <span class="metric-label">വിദ്യാർത്ഥികൾ</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-num">${boys} / ${girls}</span>
                                        <span class="metric-label">ആൺ / പെൺ</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="metric-num">${topics.length}</span>
                                        <span class="metric-label">സബ്ജക്റ്റുകൾ</span>
                                    </div>
                                </div>
                            </div>
                            <div class="class-card-footer">
                                <button class="btn btn-primary btn-block btn-open-class" data-id="${cls.id}">
                                    മാർക്ക്ഷീറ്റ് തുറക്കുക →
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    showClassModal(classData = null) {
        const modalContainer = document.getElementById('modal-container');
        const isEdit = !!classData;

        // Default topics if creating new
        const defaultTopics = isEdit ? classData.topics : [
            { id: 'top_1', name: 'ഖുർആൻ (Quran)', maxMarks: 50 },
            { id: 'top_2', name: 'തജ്‌വീദ് (Thajweed)', maxMarks: 50 },
            { id: 'top_3', name: 'ഫിഖ്ഹ് (Fiqh)', maxMarks: 50 },
            { id: 'top_4', name: 'താരീഖ് (Tareekh)', maxMarks: 50 }
        ];

        modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-box modal-lg">
                    <div class="modal-header">
                        <h3 class="modal-title">${isEdit ? 'ക്ലാസ് വിവരങ്ങൾ പുതുക്കുക' : 'പുതിയ ക്ലാസ് ചേർക്കുക'}</h3>
                        <button class="btn-close" id="btn-close-modal">&times;</button>
                    </div>
                    <form id="class-form">
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group flex-2">
                                    <label class="form-label">മദ്രസയുടെ / സ്കൂളിന്റെ പേര് (Madrasa / School Name) *</label>
                                    <input 
                                        type="text" 
                                        id="modal-madrasa" 
                                        class="form-control" 
                                        placeholder="ഉദാ: ദാറുൽ ഉലൂം മദ്രസ, താനൂർ" 
                                        value="${isEdit ? (classData.madrasaName || '') : ''}" 
                                        required
                                    >
                                </div>
                                <div class="form-group flex-1">
                                    <label class="form-label">അക്കാദമിക് വർഷം (Year)</label>
                                    <input 
                                        type="text" 
                                        id="modal-year" 
                                        class="form-control" 
                                        placeholder="2025-2026" 
                                        value="${isEdit ? (classData.academicYear || '') : '2025-2026'}"
                                    >
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label class="form-label">ക്ലാസ്സ് / സ്റ്റാൻഡേർഡ് (Class / Standard) *</label>
                                    <input 
                                        type="text" 
                                        id="modal-classname" 
                                        class="form-control" 
                                        placeholder="ഉദാ: 5-ാം ക്ലാസ്സ് / Class 5-A" 
                                        value="${isEdit ? (classData.className || '') : ''}" 
                                        required
                                    >
                                </div>
                                <div class="form-group flex-1">
                                    <label class="form-label">പരീക്ഷയുടെ പേര് (Exam Name) *</label>
                                    <input 
                                        type="text" 
                                        id="modal-examname" 
                                        class="form-control" 
                                        placeholder="ഉദാ: ഒന്നാം പാദവാർഷിക പരീക്ഷ / First Term" 
                                        value="${isEdit ? (classData.examName || '') : 'അർദ്ധവാർഷിക പരീക്ഷ (Mid-Term)'}" 
                                        required
                                    >
                                </div>
                                <div class="form-group flex-1">
                                    <label class="form-label">പാസ്സ് മാർക്ക് ശതമാനം (Pass %)</label>
                                    <input 
                                        type="number" 
                                        id="modal-passpct" 
                                        class="form-control" 
                                        min="1" 
                                        max="100" 
                                        value="${isEdit ? (classData.passPercentage || 40) : 40}"
                                    >
                                </div>
                            </div>

                            <div class="topics-builder-section">
                                <div class="section-sub-header">
                                    <div>
                                        <h5 class="builder-title">വിഷയങ്ങൾ / ടോപ്പിക്സ് (Subjects / Topics)</h5>
                                        <span class="field-hint">ഓരോ വിഷയത്തിനും പരമാവധി മാർക്ക് നൽകുക (ഇവ മാർക്ക്ഷീറ്റിൽ കോളംസ് ആയി വരും)</span>
                                    </div>
                                    <button type="button" class="btn btn-outline btn-sm" id="btn-add-topic-row">＋ വിഷയം ചേർക്കുക</button>
                                </div>

                                <div class="topic-rows-container" id="topic-rows-container">
                                    ${defaultTopics.map((top, idx) => `
                                        <div class="topic-input-row" data-index="${idx}">
                                            <input 
                                                type="text" 
                                                class="form-control topic-name-input" 
                                                placeholder="വിഷയത്തിന്റെ പേര് (Subject Name)" 
                                                value="${top.name || ''}" 
                                                required
                                            >
                                            <input 
                                                type="number" 
                                                class="form-control topic-max-input" 
                                                placeholder="പരമാവധി മാർക്ക്" 
                                                value="${top.maxMarks || 50}" 
                                                min="1" 
                                                max="1000" 
                                                style="max-width: 130px;" 
                                                required
                                            >
                                            <button type="button" class="btn-icon btn-remove-topic" title="നീക്കം ചെയ്യുക">&times;</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-ghost" id="btn-cancel-modal">റദ്ദാക്കുക</button>
                            <button type="submit" class="btn btn-primary">
                                ${isEdit ? 'മാറ്റങ്ങൾ സൂക്ഷിക്കുക' : 'ക്ലാസ് സൃഷ്ടിക്കുക'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this._bindModalEvents(isEdit, classData);
    }

    _bindModalEvents(isEdit, classData) {
        const closeModal = () => {
            const container = document.getElementById('modal-container');
            if (container) container.innerHTML = '';
        };

        const closeBtn = document.getElementById('btn-close-modal');
        const cancelBtn = document.getElementById('btn-cancel-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        const addTopicBtn = document.getElementById('btn-add-topic-row');
        const topicsContainer = document.getElementById('topic-rows-container');

        if (addTopicBtn && topicsContainer) {
            addTopicBtn.addEventListener('click', () => {
                const newRow = document.createElement('div');
                newRow.className = 'topic-input-row';
                newRow.innerHTML = `
                    <input 
                        type="text" 
                        class="form-control topic-name-input" 
                        placeholder="വിഷയത്തിന്റെ പേര് (Subject Name)" 
                        required
                    >
                    <input 
                        type="number" 
                        class="form-control topic-max-input" 
                        placeholder="മാർക്ക്" 
                        value="50" 
                        min="1" 
                        max="1000" 
                        style="max-width: 130px;" 
                        required
                    >
                    <button type="button" class="btn-icon btn-remove-topic" title="നീക്കം ചെയ്യുക">&times;</button>
                `;
                topicsContainer.appendChild(newRow);
                newRow.querySelector('.btn-remove-topic').addEventListener('click', () => newRow.remove());
            });

            // Bind existing remove buttons
            topicsContainer.querySelectorAll('.btn-remove-topic').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const row = e.target.closest('.topic-input-row');
                    if (topicsContainer.children.length > 1) {
                        row.remove();
                    } else {
                        alert('കുറഞ്ഞത് ഒരു വിഷയമെങ്കിലും ആവശ്യമാണ്.');
                    }
                });
            });
        }

        const form = document.getElementById('class-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const madrasaName = document.getElementById('modal-madrasa').value.trim();
                const className = document.getElementById('modal-classname').value.trim();
                const examName = document.getElementById('modal-examname').value.trim();
                const academicYear = document.getElementById('modal-year').value.trim();
                const passPercentage = Number(document.getElementById('modal-passpct').value) || 40;

                const topicRows = document.querySelectorAll('.topic-input-row');
                const topics = [];
                topicRows.forEach((row, i) => {
                    const name = row.querySelector('.topic-name-input').value.trim();
                    const max = Number(row.querySelector('.topic-max-input').value) || 50;
                    if (name) {
                        // Keep existing topic ID if editing existing position
                        const existingId = (isEdit && classData.topics && classData.topics[i]) ? classData.topics[i].id : ('top_' + Date.now() + '_' + i);
                        topics.push({ id: existingId, name, maxMarks: max });
                    }
                });

                if (topics.length === 0) {
                    alert('ദയവായി കുറഞ്ഞത് ഒരു വിഷയമെങ്കിലും ചേർക്കുക.');
                    return;
                }

                const payload = {
                    ...(isEdit ? classData : {}),
                    madrasaName,
                    className,
                    examName,
                    academicYear,
                    passPercentage,
                    topics
                };

                window.classController.saveClass(payload);
                closeModal();
            });
        }
    }

    showBackupModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-box">
                    <div class="modal-header">
                        <h3 class="modal-title">ഡാറ്റ ബാക്കപ്പ് & റീസ്റ്റോർ</h3>
                        <button class="btn-close" id="btn-close-backup">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-desc">
                            നിങ്ങളുടെ എല്ലാ ക്ലാസുകളും വിദ്യാർത്ഥികളുടെ വിവരങ്ങളും മാർക്കുകളും നിങ്ങളുടെ ബ്രൗസറിന്റെ ലോക്കൽ സ്റ്റോറേജിലാണ് സൂക്ഷിച്ചിരിക്കുന്നത്.
                            ഫോൺ മാറുമ്പോഴോ സുരക്ഷിതമായി സൂക്ഷിക്കാനോ ബാക്കപ്പ് ഫയൽ ഡൗൺലോഡ് ചെയ്യാം.
                        </p>
                        
                        <div class="backup-actions">
                            <div class="backup-card">
                                <h5>📥 ബാക്കപ്പ് ഡൗൺലോഡ് ചെയ്യുക</h5>
                                <p class="text-muted">എല്ലാ ഡാറ്റയും ഒരു JSON ഫയലായി സുരക്ഷിതമായി സേവ് ചെയ്യുക.</p>
                                <button class="btn btn-primary" id="btn-download-backup">ബാക്കപ്പ് ഫയൽ ഡൗൺലോഡ് ചെയ്യുക</button>
                            </div>

                            <div class="backup-card">
                                <h5>📤 ബാക്കപ്പ് റീസ്റ്റോർ ചെയ്യുക</h5>
                                <p class="text-muted">മുമ്പ് എടുത്ത ബാക്കപ്പ് ഫയൽ സെലക്ട് ചെയ്ത് തിരിച്ചെടുക്കുക.</p>
                                <input type="file" id="file-restore" accept=".json" style="display:none;">
                                <button class="btn btn-outline" id="btn-trigger-restore">ഫയൽ തെരഞ്ഞെടുക്കുക</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-ghost" id="btn-cancel-backup">അടയ്ക്കുക</button>
                    </div>
                </div>
            </div>
        `;

        const closeModal = () => { modalContainer.innerHTML = ''; };
        document.getElementById('btn-close-backup').addEventListener('click', closeModal);
        document.getElementById('btn-cancel-backup').addEventListener('click', closeModal);

        document.getElementById('btn-download-backup').addEventListener('click', () => {
            window.storageModel.exportBackup();
        });

        const fileInput = document.getElementById('file-restore');
        document.getElementById('btn-trigger-restore').addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    window.storageModel.importBackup(event.target.result);
                    alert('ബാക്കപ്പ് വിജയകരമായി റീസ്റ്റോർ ചെയ്തു!');
                    closeModal();
                    window.classController.showDashboard();
                } catch (err) {
                    alert('റീസ്റ്റോർ ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    _bindEvents() {
        // Add class button
        const addBtn = document.getElementById('btn-add-class');
        const emptyAddBtn = document.getElementById('btn-empty-add-class');
        if (addBtn) addBtn.addEventListener('click', () => this.showClassModal());
        if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => this.showClassModal());

        // Logout
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('തീർച്ചയായും ലോഗ് ഔട്ട് ചെയ്യണമെന്നുണ്ടോ?')) {
                    window.authController.handleLogout();
                }
            });
        }

        // Backup
        const backupBtn = document.getElementById('btn-backup');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.showBackupModal());
        }

        // Open class cards
        document.querySelectorAll('.btn-open-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const classId = e.currentTarget.getAttribute('data-id');
                window.marksheetController.openClass(classId);
            });
        });

        // Edit class
        document.querySelectorAll('.btn-edit-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const classId = e.currentTarget.getAttribute('data-id');
                const cls = window.storageModel.getClass(classId);
                if (cls) this.showClassModal(cls);
            });
        });

        // Delete class
        document.querySelectorAll('.btn-delete-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const classId = e.currentTarget.getAttribute('data-id');
                if (confirm('ഈ ക്ലാസും ഇതിലെ എല്ലാ മാർക്കുകളും സ്ഥിരമായി ഒഴിവാക്കണോ?')) {
                    window.classController.deleteClass(classId);
                }
            });
        });
    }
}

window.dashboardView = new DashboardView();
