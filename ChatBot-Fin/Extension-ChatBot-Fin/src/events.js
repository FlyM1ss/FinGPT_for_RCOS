export function addGlobalEventListeners() {
    document.addEventListener('click', function(event) {
        const settingsWindow = document.getElementById('settings_window');
        const settingsIcon = document.querySelector('#icon-container .icon');
        if (settingsWindow.style.display === 'block' && !settingsWindow.contains(event.target) && !settingsIcon.contains(event.target)) {
            settingsWindow.style.display = 'none';
        }
    });
}
