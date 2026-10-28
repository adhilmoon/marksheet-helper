/**
 * MarksheetView.js
 * MVC - View Layer: Marksheet grid, Boys/Girls/Combined tabs, quick daily mark entry, inline navigation.
 */

class MarksheetView {
    constructor() {
        this.container = document.getElementById('app-root');
        this.activeTab = 'boys'; // 'boys' | 'girls' | 'all' | 'analytics'
        this.currentClass = null;
    }

    render(cls, activeTab = null) {
        this.currentClass = cls;
        if (activeTab) this.activeTab = activeTab;

        const students = cls.students || [];
        const topics = cls.topics || [];
        const boys = students.filter(s => s.gender === 'boy');
        const girls = students.filter(s => s.gender === 'girl');

        const stats = window.marksheetModel.calculateStats(cls);

        this.container.innerHTML = `
            <div class="app-layout">
                <!-- Top Breadcrumb & Navbar -->
                <header class="navbar marksheet-navbar">
                    <div class="nav-left">
                        <button class="btn btn-ghost btn-sm" id="btn-back-dashboard">
                            ← ഡാഷ്‌ബോർഡിലേക്ക്
                        </button>
                        <div class="nav-class-info">
                            <span class="nav-madrasa-sub">${cls.madrasaName || 'മദ്രസ / സ്കൂൾ'}</span>
                            <h3 class="nav-class-main-title">${cls.className} • ${cls.examName}</h3>
                        </div>
                    </div>
                    <div class="nav-actions">
                        <div class="autosave-badge" id="autosave-status">
                            <span class="save-dot"></span> സേവ് ആയി
                        </div>
                        <button class="btn btn-outline btn-sm" id="btn-print-view" title="പ്രിന്റ് എടുക്കുക">
                            🖨️ പ്രിന്റ്
                        </button>
                        <button class="btn btn-outline btn-sm" id="btn-export-excel" title="എക്സൽ ഫയലായി ഡൗൺലോഡ് ചെയ്യുക">
                            📊 Excel (.xlsx)
                        </button>
                        <button class="btn btn-primary btn-sm" id="btn-export-pdf" title="പിഡിഎഫ് റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക">
                            📄 PDF ഡൗൺലോഡ്
                        </button>
                    </div>
                </header>

                <main class="main-content marksheet-content">
                    <!-- Class Details & Action Bar -->
                    <div class="marksheet-toolbar">
                        <div class="toolbar-left">
                            <!-- Sheets Tabs -->
                            <div class="sheet-tabs">
                                <button class="sheet-tab ${this.activeTab === 'boys' ? 'active' : ''}" data-tab="boys">
                                    👦 ആൺകുട്ടികൾ (Boys) <span class="tab-badge">${boys.length}</span>
                                </button>
                                <button class="sheet-tab ${this.activeTab === 'girls' ? 'active' : ''}" data-tab="girls">
                                    👧 പെൺകുട്ടികൾ (Girls) <span class="tab-badge">${girls.length}</span>
                                </button>
                                <button class="sheet-tab ${this.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                                    👥 എല്ലാവരും (All) <span class="tab-badge">${students.length}</span>
                                </button>
                                <button class="sheet-tab ${this.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
                                    📈 റിസൾട്ട് വിശകലനം
                                </button>
                            </div>
                        </div>

                        <div class="toolbar-right">
                            <button class="btn btn-outline btn-sm" id="btn-manage-topics">
                                📚 വിഷയങ്ങൾ (${topics.length})
                            </button>
                            <button class="btn btn-primary btn-sm" id="btn-add-student">
                                ＋ വിദ്യാർത്ഥിയെ ചേർക്കുക
                            </button>
                        </div>
                    </div>

                    <!-- Active Tab Content -->
                    <div class="sheet-content-wrapper">
                        ${this.activeTab === 'analytics' 
                            ? this._renderAnalyticsTab(stats, cls) 
                            : this._renderSheetTable(cls, stats)}
                    </div>
                </main>
            </div>

            <!-- Modals Placeholder -->
            <div id="modal-container"></div>
        `;

        this._bindEvents();
    }

    _renderSheetTable(cls, stats) {
        const topics = cls.topics || [];
        let studentsToDisplay = [];
        let sheetResults = [];

        if (this.activeTab === 'boys') {
            studentsToDisplay = (cls.students || []).filter(s => s.gender === 'boy');
            sheetResults = stats.boysResults;
        } else if (this.activeTab === 'girls') {
            studentsToDisplay = (cls.students || []).filter(s => s.gender === 'girl');
            sheetResults = stats.girlsResults;
        } else {
            studentsToDisplay = cls.students || [];
            sheetResults = stats.allResults;
        }

        if (studentsToDisplay.length === 0) {
            const genderLabel = this.activeTab === 'boys' ? 'ആൺകുട്ടികൾ' : (this.activeTab === 'girls' ? 'പെൺകുട്ടികൾ' : 'വിദ്യാർത്ഥികൾ');
            return `
                <div class="empty-state">
                    <div class="empty-illustration">📝</div>
                    <h4>${genderLabel} ആരെയും ചേർത്തിട്ടില്ല</h4>
                    <p>വിദ്യാർത്ഥികളെ ചേർക്കാൻ മുകളിലെ '＋ വിദ്യാർത്ഥിയെ ചേർക്കുക' ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.</p>
                    <button class="btn btn-primary btn-sm" id="btn-empty-add-st">＋ പുതിയ വിദ്യാർത്ഥിയെ ചേർക്കുക</button>
                </div>
            `;
        }

        // Map computed results by student ID for fast lookup
        const resultMap = {};
        sheetResults.forEach(r => { resultMap[r.student.id] = r; });

        return `
            <div class="table-responsive-container">
                <table class="marksheet-table" id="marksheet-grid">
                    <thead>
                        <tr>
                            <th class="th-roll">റോൾ</th>
                            <th class="th-name">വിദ്യാർത്ഥിയുടെ പേര്</th>
                            ${topics.map((t, idx) => {
                                const passMark = Math.ceil(Number(t.maxMarks) * (Number(cls.passPercentage) || 36) / 100);
                                return `
                                <th class="th-topic" data-topic-id="${t.id}" title="${t.name}">
                                    <div class="th-topic-inner">
                                        <span class="topic-name-header">${t.name}</span>
                                        <span class="topic-max-badge">Max: ${t.maxMarks} • Min: ${passMark}</span>
                                    </div>
                                </th>
                            `}).join('')}
                            <th class="th-calc th-total">ആകെ മാർക്ക്</th>
                            <th class="th-calc th-pct">%</th>
                            <th class="th-calc th-grade">ഗ്രേഡ്</th>
                            <th class="th-calc th-rank">റാങ്ക്</th>
                            <th class="th-calc th-status">നില</th>
                            <th class="th-action">നീക്കം</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentsToDisplay.map((st, rowIdx) => {
                            const res = resultMap[st.id] || window.marksheetModel.computeStudentResult(st, topics, cls.marks, cls.passPercentage);
                            return `
                                <tr class="student-row" data-student-id="${st.id}" data-row-idx="${rowIdx}">
                                    <td class="td-roll">
                                        <span class="roll-badge">${st.rollNo || (rowIdx + 1)}</span>
                                    </td>
                                    <td class="td-name">
                                        <div class="student-name-box">
                                            <span class="st-gender-dot ${st.gender}"></span>
                                            <span class="st-name-text">${st.name}</span>
                                        </div>
                                    </td>
                                    ${topics.map((t, colIdx) => {
                                        const scoreObj = (res.topicScores && res.topicScores[t.id]) || { value: '', colorClass: '' };
                                        const val = scoreObj.value !== undefined ? scoreObj.value : '';
                                        const colorClass = scoreObj.colorClass || '';
                                        const passMark = Math.ceil(Number(t.maxMarks) * (Number(cls.passPercentage) || 36) / 100);
                                        const tooltip = scoreObj.value !== '' 
                                            ? `${t.name}: ${scoreObj.value}/${t.maxMarks} (${scoreObj.percentage}%) - ${scoreObj.isPassed ? 'പാസ്സ്' : 'തോറ്റു'}` 
                                            : `${t.name} (Max: ${t.maxMarks}, Min: ${passMark})`;
                                        return `
                                            <td class="td-mark-input">
                                                <input 
                                                    type="text" 
                                                    class="mark-input ${colorClass}" 
                                                    value="${val}" 
                                                    data-student-id="${st.id}" 
                                                    data-topic-id="${t.id}"
                                                    data-max="${t.maxMarks}"
                                                    data-row="${rowIdx}" 
                                                    data-col="${colIdx}"
                                                    placeholder="-"
                                                    maxlength="4"
                                                    autocomplete="off"
                                                    title="${tooltip}"
                                                >
                                            </td>
                                        `;
                                    }).join('')}
                                    <td class="td-calc td-total font-mono" id="total-${st.id}">
                                        <strong>${res.hasAnyMark ? res.totalScored : '-'}</strong>
                                        <span class="text-muted">/${res.totalMax}</span>
                                    </td>
                                    <td class="td-calc td-pct font-mono" id="pct-${st.id}">
                                        ${res.hasAnyMark ? res.percentage + '%' : '-'}
                                    </td>
                                    <td class="td-calc td-grade" id="grade-${st.id}">
                                        ${res.hasAnyMark ? `<span class="grade-pill" style="border-color:${res.gradeColor}; color:${res.gradeColor}">${res.grade}</span>` : '-'}
                                    </td>
                                    <td class="td-calc td-rank font-mono" id="rank-${st.id}">
                                        ${res.hasAnyMark ? res.rank : '-'}
                                    </td>
                                    <td class="td-calc td-status" id="status-${st.id}">
                                        ${res.hasAnyMark ? `<span class="badge ${res.statusClass}">${res.status === 'Pass' ? 'പാസ്സ്' : 'തോറ്റു'}</span>` : '-'}
                                    </td>
                                    <td class="td-action">
                                        <button class="btn-icon btn-del-student" data-id="${st.id}" title="വിദ്യാർത്ഥിയെ നീക്കം ചെയ്യുക">&times;</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="sheet-quick-footer">
                <div class="marks-legend-strip">
                    <span class="legend-badge legend-green">
                        <span class="legend-dot green"></span> 90%+ (പച്ച - Excellent)
                    </span>
                    <span class="legend-badge legend-blue">
                        <span class="legend-dot blue"></span> 50% - 89% (നീല - Good)
                    </span>
                    <span class="legend-badge legend-amber">
                        <span class="legend-dot amber"></span> 36% - 49% (പാസ്സ്)
                    </span>
                    <span class="legend-badge legend-red">
                        <span class="legend-dot red"></span> 36% ൽ താഴെ / Ab (തോറ്റു)
                    </span>
                </div>
                <div class="sheet-rules-hint">
                    <span class="text-muted font-sm">
                        💡 ഏതെങ്കിലും ഒരു വിഷയത്തിൽ 36% ൽ താഴെ മാർക്ക് വന്നാൽ (അല്ലെങ്കിൽ Absent ആയാൽ) ആ വിദ്യാർത്ഥി ആകെ ഫലത്തിൽ <strong>'തോറ്റു' (F)</strong> ആയി കണക്കാക്കും. ടാബിലോ എന്റർ കീയിലോ അമർത്തി അടുത്ത കോളത്തിലേക്കും റോയിലേക്കും പോകാം.
                    </span>
                </div>
            </div>
        `;
    }

    _renderAnalyticsTab(stats, cls) {
        return `
            <div class="analytics-container">
                <div class="analytics-cards-grid">
                    <div class="stat-card">
                        <div class="stat-label">ആകെ വിദ്യാർത്ഥികൾ</div>
                        <div class="stat-value">${stats.totalStudents}</div>
                        <div class="stat-sub">${stats.boysCount} ആൺകുട്ടികൾ • ${stats.girlsCount} പെൺകുട്ടികൾ</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">പാസ്സ് ശതമാനം</div>
                        <div class="stat-value text-success">${stats.passRate}%</div>
                        <div class="stat-sub">${stats.passedCount} പാസ്സായി • ${stats.failedCount} തോറ്റു</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">ശരാശരി മാർക്ക് (Class Avg)</div>
                        <div class="stat-value">${stats.avgScore} <span class="font-sm text-muted">/ ${stats.totalMaxMarks}</span></div>
                        <div class="stat-sub">ശരാശരി ${stats.avgPercentage}%</div>
                    </div>
                </div>

                <!-- Topic Breakdown -->
                <div class="analytics-section">
                    <h4 class="section-title">വിഷയ തിരിച്ചുള്ള വിശകലനം (Subject-Wise Statistics)</h4>
                    <div class="topic-stats-grid">
                        ${stats.topicStats.map(ts => `
                            <div class="topic-stat-box">
                                <div class="topic-stat-title">${ts.topic.name}</div>
                                <div class="topic-stat-row">
                                    <span>പരമാവധി മാർക്ക്:</span>
                                    <strong>${ts.topic.maxMarks}</strong>
                                </div>
                                <div class="topic-stat-row">
                                    <span>വിഷയ ശരാശരി:</span>
                                    <strong class="text-primary">${ts.avg}</strong>
                                </div>
                                <div class="topic-stat-row">
                                    <span>ഏറ്റവും ഉയർന്ന മാർക്ക്:</span>
                                    <strong class="text-success">${ts.highest}</strong>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Top Rankers Table -->
                <div class="analytics-section">
                    <h4 class="section-title">റാങ്ക് പട്ടിക (Overall Rankings)</h4>
                    <div class="table-responsive-container">
                        <table class="marksheet-table">
                            <thead>
                                <tr>
                                    <th>റാങ്ക്</th>
                                    <th>റോൾ</th>
                                    <th>വിദ്യാർത്ഥി</th>
                                    <th>ലിംഗഭേദം</th>
                                    <th>ആകെ മാർക്ക്</th>
                                    <th>ശതമാനം</th>
                                    <th>ഗ്രേഡ്</th>
                                    <th>നില</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[...stats.allResults]
                                    .filter(r => r.hasAnyMark)
                                    .sort((a, b) => b.totalScored - a.totalScored)
                                    .map(res => `
                                        <tr>
                                            <td><span class="rank-badge">${res.rank}</span></td>
                                            <td>${res.student.rollNo}</td>
                                            <td><strong>${res.student.name}</strong></td>
                                            <td>${res.student.gender === 'boy' ? '👦 ആൺ' : '👧 പെൺ'}</td>
                                            <td>${res.totalScored} / ${res.totalMax}</td>
                                            <td>${res.percentage}%</td>
                                            <td><span class="grade-pill" style="border-color:${res.gradeColor}; color:${res.gradeColor}">${res.grade}</span></td>
                                            <td><span class="badge ${res.statusClass}">${res.status === 'Pass' ? 'പാസ്സ്' : 'തോറ്റു'}</span></td>
                                        </tr>
                                    `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Modal for adding a student (Single or Bulk)
    showAddStudentModal() {
        const modalContainer = document.getElementById('modal-container');
        const students = this.currentClass.students || [];
        const nextRoll = students.length > 0 
            ? (Math.max(...students.map(s => Number(s.rollNo) || 0)) + 1)
            : 1;

        modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-box">
                    <div class="modal-header">
                        <h3 class="modal-title">വിദ്യാർത്ഥിയെ ചേർക്കുക</h3>
                        <button class="btn-close" id="btn-close-st-modal">&times;</button>
                    </div>

                    <div class="modal-tabs">
                        <button type="button" class="modal-tab active" id="tab-single-st">ഒറ്റയായി ചേർക്കുക</button>
                        <button type="button" class="modal-tab" id="tab-bulk-st">കൂട്ടമായി ചേർക്കുക (Bulk Add)</button>
                    </div>

                    <div class="modal-body">
                        <!-- Single Student Form -->
                        <form id="single-student-form">
                            <div class="form-group">
                                <label class="form-label">ലിംഗഭേദം (Gender) *</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="st-gender" value="boy" ${this.activeTab === 'girls' ? '' : 'checked'}>
                                        <span>👦 ആൺകുട്ടി (Boy)</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="st-gender" value="girl" ${this.activeTab === 'girls' ? 'checked' : ''}>
                                        <span>👧 പെൺകുട്ടി (Girl)</span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label class="form-label">റോൾ നമ്പർ (Roll No) *</label>
                                    <input type="number" id="st-roll" class="form-control" value="${nextRoll}" required>
                                </div>
                                <div class="form-group flex-2">
                                    <label class="form-label">വിദ്യാർത്ഥിയുടെ പേര് (Name) *</label>
                                    <input type="text" id="st-name" class="form-control" placeholder="ഉദാ: മുഹമ്മദ് സിനാൻ" required autofocus>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">ചേർക്കുക</button>
                        </form>

                        <!-- Bulk Add Form -->
                        <form id="bulk-student-form" style="display:none;">
                            <div class="form-group">
                                <label class="form-label">ലിംഗഭേദം (Gender for these students) *</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="bulk-gender" value="boy" ${this.activeTab === 'girls' ? '' : 'checked'}>
                                        <span>👦 ആൺകുട്ടികൾ (Boys)</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="bulk-gender" value="girl" ${this.activeTab === 'girls' ? 'checked' : ''}>
                                        <span>👧 പെൺകുട്ടികൾ (Girls)</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">തുടക്ക റോൾ നമ്പർ (Starting Roll No)</label>
                                <input type="number" id="bulk-start-roll" class="form-control" value="${nextRoll}" style="max-width:140px;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">പേരുകൾ നൽകുക (ഓരോ വരിയിലും ഓരോ പേര്) *</label>
                                <textarea id="bulk-names" class="form-control" rows="6" placeholder="മുഹമ്മദ് ഫാസിൽ&#10;അബ്ദുല്ല&#10;മുഹമ്മദ് റയ്യാൻ"></textarea>
                                <span class="field-hint">ഓരോ വരിയിലുമുള്ള പേര് ഓരോ കുട്ടിയായി ചേർക്കപ്പെടും.</span>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">എല്ലാവരെയും ഒന്നിച്ച് ചേർക്കുക</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const closeModal = () => { modalContainer.innerHTML = ''; };
        document.getElementById('btn-close-st-modal').addEventListener('click', closeModal);

        const singleTab = document.getElementById('tab-single-st');
        const bulkTab = document.getElementById('tab-bulk-st');
        const singleForm = document.getElementById('single-student-form');
        const bulkForm = document.getElementById('bulk-student-form');

        singleTab.addEventListener('click', () => {
            singleTab.classList.add('active');
            bulkTab.classList.remove('active');
            singleForm.style.display = 'block';
            bulkForm.style.display = 'none';
        });

        bulkTab.addEventListener('click', () => {
            bulkTab.classList.add('active');
            singleTab.classList.remove('active');
            singleForm.style.display = 'none';
            bulkForm.style.display = 'block';
        });

        singleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const roll = document.getElementById('st-roll').value.trim();
            const name = document.getElementById('st-name').value.trim();
            const gender = document.querySelector('input[name="st-gender"]:checked').value;

            if (name) {
                window.marksheetController.addStudent(this.currentClass.id, {
                    rollNo: roll,
                    name,
                    gender
                });
                closeModal();
            }
        });

        bulkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawNames = document.getElementById('bulk-names').value.trim();
            const gender = document.querySelector('input[name="bulk-gender"]:checked').value;
            let startRoll = Number(document.getElementById('bulk-start-roll').value) || nextRoll;

            if (!rawNames) return;

            const lines = rawNames.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const newStudents = lines.map(name => {
                const s = {
                    rollNo: startRoll.toString(),
                    name,
                    gender
                };
                startRoll++;
                return s;
            });

            window.marksheetController.addBulkStudents(this.currentClass.id, newStudents);
            closeModal();
        });
    }

    // Modal to Manage Topics / Subjects
    showManageTopicsModal() {
        const modalContainer = document.getElementById('modal-container');
        const cls = this.currentClass;
        const topics = cls.topics || [];

        modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-box modal-lg">
                    <div class="modal-header">
                        <h3 class="modal-title">വിഷയങ്ങൾ ക്രമീകരിക്കുക (Manage Topics)</h3>
                        <button class="btn-close" id="btn-close-topics-modal">&times;</button>
                    </div>
                    <form id="manage-topics-form">
                        <div class="modal-body">
                            <p class="text-muted">
                                ഇവിടെ ചേർക്കുന്ന വിഷയങ്ങൾ മാർക്ക്ഷീറ്റിൽ കോളങ്ങളായി വരുന്നതാണ്.
                            </p>
                            
                            <div class="topic-rows-container" id="modal-topics-list">
                                ${topics.map((t, idx) => `
                                    <div class="topic-input-row" data-topic-id="${t.id}">
                                        <input 
                                            type="text" 
                                            class="form-control topic-name-input" 
                                            placeholder="വിഷയം (Subject Name)" 
                                            value="${t.name}" 
                                            required
                                        >
                                        <input 
                                            type="number" 
                                            class="form-control topic-max-input" 
                                            placeholder="Max Mark" 
                                            value="${t.maxMarks}" 
                                            min="1" 
                                            max="1000" 
                                            style="max-width: 130px;" 
                                            required
                                        >
                                        <button type="button" class="btn-icon btn-remove-topic" title="വിഷയം നീക്കുക">&times;</button>
                                    </div>
                                `).join('')}
                            </div>

                            <button type="button" class="btn btn-outline btn-sm mt-3" id="btn-add-more-topic">
                                ＋ മറ്റൊരു വിഷയം ചേർക്കുക
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-ghost" id="btn-cancel-topics">റദ്ദാക്കുക</button>
                            <button type="submit" class="btn btn-primary">സൂക്ഷിക്കുക</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const closeModal = () => { modalContainer.innerHTML = ''; };
        document.getElementById('btn-close-topics-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel-topics').addEventListener('click', closeModal);

        const listContainer = document.getElementById('modal-topics-list');
        document.getElementById('btn-add-more-topic').addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'topic-input-row';
            row.innerHTML = `
                <input type="text" class="form-control topic-name-input" placeholder="വിഷയം (Subject Name)" required>
                <input type="number" class="form-control topic-max-input" placeholder="Max" value="50" min="1" max="1000" style="max-width:130px;" required>
                <button type="button" class="btn-icon btn-remove-topic" title="വിഷയം നീക്കുക">&times;</button>
            `;
            listContainer.appendChild(row);
            row.querySelector('.btn-remove-topic').addEventListener('click', () => row.remove());
        });

        listContainer.querySelectorAll('.btn-remove-topic').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (listContainer.children.length > 1) {
                    e.target.closest('.topic-input-row').remove();
                } else {
                    alert('കുറഞ്ഞത് ഒരു വിഷയമെങ്കിലും ഉണ്ടായിരിക്കണം.');
                }
            });
        });

        document.getElementById('manage-topics-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedTopics = [];
            listContainer.querySelectorAll('.topic-input-row').forEach((row, i) => {
                const id = row.getAttribute('data-topic-id') || ('top_' + Date.now() + '_' + i);
                const name = row.querySelector('.topic-name-input').value.trim();
                const maxMarks = Number(row.querySelector('.topic-max-input').value) || 50;
                if (name) {
                    updatedTopics.push({ id, name, maxMarks });
                }
            });

            window.marksheetController.updateTopics(cls.id, updatedTopics);
            closeModal();
        });
    }

    _bindEvents() {
        // Back to dashboard
        const backBtn = document.getElementById('btn-back-dashboard');
        if (backBtn) {
            backBtn.addEventListener('click', () => window.classController.showDashboard());
        }

        // Tabs
        document.querySelectorAll('.sheet-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                this.activeTab = targetTab;
                this.render(this.currentClass, targetTab);
            });
        });

        // Add Student buttons
        const addStBtn = document.getElementById('btn-add-student');
        const emptyAddStBtn = document.getElementById('btn-empty-add-st');
        if (addStBtn) addStBtn.addEventListener('click', () => this.showAddStudentModal());
        if (emptyAddStBtn) emptyAddStBtn.addEventListener('click', () => this.showAddStudentModal());

        // Manage Topics button
        const manageTopBtn = document.getElementById('btn-manage-topics');
        if (manageTopBtn) manageTopBtn.addEventListener('click', () => this.showManageTopicsModal());

        // Export Actions
        const btnPdf = document.getElementById('btn-export-pdf');
        if (btnPdf) {
            btnPdf.addEventListener('click', () => {
                window.exportView.exportPDF(this.currentClass, this.activeTab);
            });
        }

        const btnExcel = document.getElementById('btn-export-excel');
        if (btnExcel) {
            btnExcel.addEventListener('click', () => {
                window.exportView.exportExcel(this.currentClass, this.activeTab);
            });
        }

        const btnPrint = document.getElementById('btn-print-view');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                window.exportView.triggerPrint();
            });
        }

        // Delete student buttons
        document.querySelectorAll('.btn-del-student').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = e.currentTarget.getAttribute('data-id');
                if (confirm('ഈ കുട്ടിയെ മാർക്ക്ഷീറ്റിൽ നിന്നും ഒഴിവാക്കണോ?')) {
                    window.marksheetController.deleteStudent(this.currentClass.id, studentId);
                }
            });
        });

        // ==========================================
        // Daily Inline Mark Inputs & Keyboard Navigation
        // ==========================================
        const markInputs = document.querySelectorAll('.mark-input');
        markInputs.forEach(input => {
            // Live update on input or change
            input.addEventListener('input', (e) => {
                this._handleMarkInput(e.target);
            });

            // Keyboard navigation for lightning-fast daily entry
            input.addEventListener('keydown', (e) => {
                this._handleKeyboardNavigation(e);
            });

            // Auto-select text on focus
            input.addEventListener('focus', (e) => {
                e.target.select();
            });
        });
    }

    _handleMarkInput(inputElem) {
        const studentId = inputElem.getAttribute('data-student-id');
        const topicId = inputElem.getAttribute('data-topic-id');
        const maxMarks = Number(inputElem.getAttribute('data-max')) || 100;
        const passPercentage = Number(this.currentClass.passPercentage) || 36;
        let rawVal = inputElem.value.trim();

        // Allow 'ab' for absent
        if (rawVal.toLowerCase() === 'ab' || rawVal.toLowerCase() === 'a') {
            rawVal = 'Ab';
            inputElem.value = 'Ab';
        } else if (rawVal !== '') {
            let num = Number(rawVal);
            if (isNaN(num)) {
                num = 0;
            } else if (num > maxMarks) {
                // Flash alert or cap
                num = maxMarks;
                inputElem.value = num;
            } else if (num < 0) {
                num = 0;
                inputElem.value = num;
            }
            rawVal = num;
        }

        // Dynamically update the input element's color class immediately
        inputElem.classList.remove('mark-fail', 'mark-pass', 'mark-good', 'mark-excellent');
        if (rawVal === 'Ab') {
            inputElem.classList.add('mark-fail');
            inputElem.title = `Ab (Absent - തോറ്റു)`;
        } else if (rawVal !== '') {
            const num = Number(rawVal);
            const pct = maxMarks > 0 ? (num / maxMarks) * 100 : 0;
            const roundedPct = Math.round(pct * 10) / 10;
            if (roundedPct >= 90) {
                inputElem.classList.add('mark-excellent');
            } else if (roundedPct >= 50) {
                inputElem.classList.add('mark-good');
            } else if (roundedPct >= passPercentage) {
                inputElem.classList.add('mark-pass');
            } else {
                inputElem.classList.add('mark-fail');
            }
            inputElem.title = `${rawVal}/${maxMarks} (${roundedPct}%) - ${roundedPct >= passPercentage ? 'പാസ്സ്' : 'തോറ്റു'}`;
        } else {
            inputElem.title = '';
        }

        // Save to StorageModel
        window.storageModel.updateStudentMark(this.currentClass.id, studentId, topicId, rawVal);

        // Update local object
        if (!this.currentClass.marks) this.currentClass.marks = {};
        if (!this.currentClass.marks[studentId]) this.currentClass.marks[studentId] = {};
        if (rawVal === '') {
            delete this.currentClass.marks[studentId][topicId];
        } else {
            this.currentClass.marks[studentId][topicId] = rawVal;
        }

        // Live recalculate entire sheet rankings and student row displays
        this._updateAllCalculations();

        // Flash autosave indicator
        const autoSave = document.getElementById('autosave-status');
        if (autoSave) {
            autoSave.innerHTML = `<span class="save-dot saving"></span> സൂക്ഷിക്കുന്നു...`;
            setTimeout(() => {
                autoSave.innerHTML = `<span class="save-dot"></span> സേവ് ആയി`;
            }, 300);
        }
    }

    _updateAllCalculations() {
        const students = this.currentClass.students || [];
        const topics = this.currentClass.topics || [];
        const passPct = Number(this.currentClass.passPercentage) || 36;
        const results = window.marksheetModel.processSheet(students, topics, this.currentClass.marks, passPct);

        results.forEach(res => {
            const studentId = res.student.id;
            const totalCell = document.getElementById(`total-${studentId}`);
            const pctCell = document.getElementById(`pct-${studentId}`);
            const gradeCell = document.getElementById(`grade-${studentId}`);
            const rankCell = document.getElementById(`rank-${studentId}`);
            const statusCell = document.getElementById(`status-${studentId}`);

            if (totalCell) {
                totalCell.innerHTML = `<strong>${res.hasAnyMark ? res.totalScored : '-'}</strong> <span class="text-muted">/${res.totalMax}</span>`;
            }
            if (pctCell) {
                pctCell.innerText = res.hasAnyMark ? `${res.percentage}%` : '-';
            }
            if (gradeCell) {
                gradeCell.innerHTML = res.hasAnyMark ? `<span class="grade-pill" style="border-color:${res.gradeColor}; color:${res.gradeColor}">${res.grade}</span>` : '-';
            }
            if (rankCell) {
                rankCell.innerText = res.hasAnyMark ? res.rank : '-';
            }
            if (statusCell) {
                statusCell.innerHTML = res.hasAnyMark ? `<span class="badge ${res.statusClass}">${res.status === 'Pass' ? 'പാസ്സ്' : 'തോറ്റു'}</span>` : '-';
            }
        });
    }

    _updateStudentRowDisplay(studentId) {
        this._updateAllCalculations();
    }

    _handleKeyboardNavigation(e) {
        const currentInput = e.target;
        const row = parseInt(currentInput.getAttribute('data-row'), 10);
        const col = parseInt(currentInput.getAttribute('data-col'), 10);

        let targetInput = null;

        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            targetInput = document.querySelector(`.mark-input[data-row="${row + 1}"][data-col="${col}"]`);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            targetInput = document.querySelector(`.mark-input[data-row="${row - 1}"][data-col="${col}"]`);
        } else if (e.key === 'ArrowRight' && currentInput.selectionStart === currentInput.value.length) {
            targetInput = document.querySelector(`.mark-input[data-row="${row}"][data-col="${col + 1}"]`);
        } else if (e.key === 'ArrowLeft' && currentInput.selectionStart === 0) {
            targetInput = document.querySelector(`.mark-input[data-row="${row}"][data-col="${col - 1}"]`);
        }

        if (targetInput) {
            targetInput.focus();
            targetInput.select();
        }
    }
}

window.marksheetView = new MarksheetView();
