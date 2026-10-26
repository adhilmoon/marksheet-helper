/**
 * MarksheetController.js
 * MVC - Controller Layer: Managing student rows, topic columns, marks entry, and calculations.
 */

class MarksheetController {
    constructor() {}

    openClass(classId, tab = 'boys') {
        const cls = window.storageModel.getClass(classId);
        if (!cls) {
            alert('ക്ലാസ് കണ്ടെത്താനായില്ല.');
            window.classController.showDashboard();
            return;
        }

        window.marksheetView.render(cls, tab);
    }

    addStudent(classId, studentData) {
        const cls = window.storageModel.getClass(classId);
        if (!cls) return;

        if (!cls.students) cls.students = [];

        const newStudent = {
            id: 'st_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            rollNo: studentData.rollNo || (cls.students.length + 1).toString(),
            name: studentData.name,
            gender: studentData.gender || 'boy'
        };

        cls.students.push(newStudent);
        // Sort students naturally by roll number
        cls.students.sort((a, b) => (Number(a.rollNo) || 0) - (Number(b.rollNo) || 0));

        window.storageModel.saveClass(cls);

        // Render in the added student's gender tab
        const targetTab = newStudent.gender === 'girl' ? 'girls' : 'boys';
        this.openClass(classId, targetTab);
    }

    addBulkStudents(classId, studentsArray) {
        const cls = window.storageModel.getClass(classId);
        if (!cls) return;

        if (!cls.students) cls.students = [];

        studentsArray.forEach(st => {
            cls.students.push({
                id: 'st_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                rollNo: st.rollNo,
                name: st.name,
                gender: st.gender || 'boy'
            });
        });

        cls.students.sort((a, b) => (Number(a.rollNo) || 0) - (Number(b.rollNo) || 0));
        window.storageModel.saveClass(cls);

        const firstGender = studentsArray[0]?.gender === 'girl' ? 'girls' : 'boys';
        this.openClass(classId, firstGender);
    }

    deleteStudent(classId, studentId) {
        const cls = window.storageModel.getClass(classId);
        if (!cls) return;

        cls.students = (cls.students || []).filter(s => s.id !== studentId);
        if (cls.marks && cls.marks[studentId]) {
            delete cls.marks[studentId];
        }

        window.storageModel.saveClass(cls);
        this.openClass(classId, window.marksheetView.activeTab);
    }

    updateTopics(classId, topics) {
        const cls = window.storageModel.getClass(classId);
        if (!cls) return;

        cls.topics = topics;
        window.storageModel.saveClass(cls);
        this.openClass(classId, window.marksheetView.activeTab);
    }
}

window.marksheetController = new MarksheetController();
