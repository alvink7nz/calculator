const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const colorInputs = document.querySelectorAll('[data-color-variable]');
const defaults = {
    '--accent': '#e85d45',
    '--ink': '#152333',
    '--paper': '#f5f1e9',
    '--panel': '#fffdf8'
};

function applyColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
    if (variable === '--accent') {
        document.documentElement.style.setProperty('--accent-dark', value);
    }
}

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('mathegraphical-colors') || '{}');
    colorInputs.forEach(input => {
        const variable = input.dataset.colorVariable;
        const value = saved[variable] || defaults[variable];
        input.value = value;
        applyColor(variable, value);
    });
}

settingsToggle.addEventListener('click', () => {
    const isOpen = settingsPanel.hidden;
    settingsPanel.hidden = !isOpen;
    settingsToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) colorInputs[0].focus();
});

colorInputs.forEach(input => input.addEventListener('input', event => {
    const variable = event.target.dataset.colorVariable;
    const value = event.target.value;
    applyColor(variable, value);
    const saved = JSON.parse(localStorage.getItem('mathegraphical-colors') || '{}');
    saved[variable] = value;
    localStorage.setItem('mathegraphical-colors', JSON.stringify(saved));
}));

document.getElementById('settings-reset').addEventListener('click', () => {
    localStorage.removeItem('mathegraphical-colors');
    loadSettings();
});

loadSettings();
