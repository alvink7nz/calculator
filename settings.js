const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const colorInputs = document.querySelectorAll('[data-color-variable]');
const fontFamilyInput = document.getElementById('font-family');
const fontSizeInput = document.getElementById('font-size');
const lineHeightInput = document.getElementById('line-height');
const settingsClose = document.getElementById('settings-close');
const defaults = {
    '--accent': '#e85d45',
    '--ink': '#152333',
    '--paper': '#f5f1e9',
    '--panel': '#fffdf8',
    '--font-family': 'Georgia',
    '--font-size': '16px',
    '--line-height': '1.4'
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
    if (fontFamilyInput) fontFamilyInput.value = saved['--font-family'] || defaults['--font-family'];
    if (fontSizeInput) fontSizeInput.value = parseInt(saved['--font-size'] || defaults['--font-size'], 10);
    if (lineHeightInput) lineHeightInput.value = saved['--line-height'] || defaults['--line-height'];
    applyTypography();
}

function applyTypography() {
    if (!fontFamilyInput) return;
    document.documentElement.style.setProperty('--font-family', fontFamilyInput.value);
    document.documentElement.style.setProperty('--font-size', `${fontSizeInput.value}px`);
    document.documentElement.style.setProperty('--line-height', lineHeightInput.value);
    document.getElementById('font-size-value').textContent = `${fontSizeInput.value}px`;
    document.getElementById('line-height-value').textContent = lineHeightInput.value;
}

function saveTypography() {
    const saved = JSON.parse(localStorage.getItem('mathegraphical-colors') || '{}');
    saved['--font-family'] = fontFamilyInput.value;
    saved['--font-size'] = `${fontSizeInput.value}px`;
    saved['--line-height'] = lineHeightInput.value;
    localStorage.setItem('mathegraphical-colors', JSON.stringify(saved));
}

function closeSettings() {
    settingsPanel.hidden = true;
    settingsToggle.setAttribute('aria-expanded', 'false');
}

settingsToggle.addEventListener('click', () => {
    const isOpen = settingsPanel.hidden;
    settingsPanel.hidden = !isOpen;
    settingsToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) fontFamilyInput.focus();
});
settingsClose.addEventListener('click', closeSettings);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !settingsPanel.hidden) closeSettings(); });

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

fontFamilyInput.addEventListener('input', () => { applyTypography(); saveTypography(); });
fontSizeInput.addEventListener('input', () => { applyTypography(); saveTypography(); });
lineHeightInput.addEventListener('input', () => { applyTypography(); saveTypography(); });

loadSettings();
