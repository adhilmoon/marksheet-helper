/**
 * ClassController.js
 * MVC - Controller Layer: Managing classes on the dashboard.
 */

class ClassController {
    constructor() {}

    showDashboard() {
        const session = window.storageModel.getSession();
        if (!session) {
            window.authController.showLogin();
            return;
        }

        const classes = window.storageModel.getClasses();
        window.dashboardView.render(classes, session);
    }

    saveClass(classData) {
        try {
            const saved = window.storageModel.saveClass(classData);
            // Open the created/updated class directly or refresh dashboard
            if (saved && saved.id) {
                window.marksheetController.openClass(saved.id);
            } else {
                this.showDashboard();
            }
        } catch (err) {
            alert('ക്ലാസ് സൂക്ഷിക്കുന്നതിൽ പിഴവ് സംഭവിച്ചു: ' + err.message);
        }
    }

    deleteClass(classId) {
        try {
            window.storageModel.deleteClass(classId);
            this.showDashboard();
        } catch (err) {
            alert('ക്ലാസ് നീക്കം ചെയ്യുന്നതിൽ പിഴവ്: ' + err.message);
        }
    }
}

window.classController = new ClassController();
