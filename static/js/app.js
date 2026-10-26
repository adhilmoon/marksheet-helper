/**
 * app.js
 * MVC Bootstrap & Entrypoint: Initializes the application router and auth listener.
 */

document.addEventListener('DOMContentLoaded', () => {
    // If there is sample data needed on first visit, we can provide a quick demo prompt or clean slate
    window.authController.init();
});
