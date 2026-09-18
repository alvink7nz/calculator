const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const colorInputs = document.querySelectorAll('[data-color-variable]');
const fontFamilyInput = document.getElementById('font-family');
const fontSizeInput = document.getElementById('font-size');
const lineHeightInput = document.getElementById('line-height');
const decimalPlacesInput = document.getElementById('decimal-places');
const themeModeInput = document.getElementById('theme-mode');
const buttonStyleInput = document.getElementById('button-style');
const settingsClose = document.getElementById('settings-close');
const defaults = {
    '--accent': '#e85d45',
    '--ink': '#152333',
    '--paper': '#f5f1e9',
    '--panel': '#fffdf8',
    '--font-family': 'Georgia',
    '--font-size': '16px',
    '--line-height': '1.4',
    '--decimal-places': 'auto',
    '--theme-mode': 'system',
    '--button-style': 'rounded'
};

const CUSTOM_FONT_STORAGE_KEY = 'mathegraphical-custom-font';

const fallbackFontFamilies = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Lucida Console',
    'Palatino Linotype',
    'Garamond',
    'Impact',
    'Comic Sans MS',
    'Segoe UI',
    'Calibri'
];

const themeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function readSavedSettings() {
    try {
        return JSON.parse(localStorage.getItem('mathegraphical-colors') || '{}');
    } catch {
        return {};
    }
}

function writeSavedSettings(saved) {
    localStorage.setItem('mathegraphical-colors', JSON.stringify(saved));
}

window.mathegraphicalSettings = {
    get(key, fallback = null) {
        const saved = readSavedSettings();
        return Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : fallback;
    },
    set(key, value) {
        const saved = readSavedSettings();
        saved[key] = value;
        writeSavedSettings(saved);
    }
};

function applyColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
    if (variable === '--accent') {
        document.documentElement.style.setProperty('--accent-dark', value);
    }
}

function readSavedCustomFont() {
    try {
        const saved = localStorage.getItem(CUSTOM_FONT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function writeSavedCustomFont(fontData) {
    if (!fontData) {
        localStorage.removeItem(CUSTOM_FONT_STORAGE_KEY);
        return;
    }
    localStorage.setItem(CUSTOM_FONT_STORAGE_KEY, JSON.stringify(fontData));
}

function sanitizeFontName(fileName) {
    const baseName = fileName.replace(/\.[^/.]+$/, '').trim();
    const sanitized = baseName.replace(/[^a-zA-Z0-9\s_-]/g, '') || 'CustomFont';
    return sanitized.trim() || 'CustomFont';
}

function ensureCustomFontControl() {
    const existing = document.getElementById('custom-font-file');
    if (existing) return;

    if (!fontFamilyInput) return;

    const fontRow = fontFamilyInput.closest('.font-setting');
    if (!fontRow) return;

    const customControl = document.createElement('label');
    customControl.className = 'font-setting upload-font-setting';
    customControl.innerHTML = `
        <span>Upload font</span>
        <input id="custom-font-file" type="file" accept=".ttf,.otf,.ttc,font/ttf,font/otf,application/x-font-ttf" />
    `;

    fontRow.insertAdjacentElement('afterend', customControl);
}

async function registerCustomFont(fontData) {
    if (!fontData || !fontData.familyName || !fontData.dataUrl) return;

    const fontFormat = fontData.fontFormat === 'opentype' ? 'opentype' : 'truetype';
    if (document.fonts && typeof FontFace !== 'undefined') {
        const fontFace = new FontFace(fontData.familyName, `url(${fontData.dataUrl}) format("${fontFormat}")`);
        try {
            await fontFace.load();
            document.fonts.add(fontFace);
        } catch {
            // Ignore invalid or unsupported local font files.
        }
    }

    if (fontFamilyInput) {
        const alreadyExists = Array.from(fontFamilyInput.options).some(option => option.value === fontData.familyName);
        if (!alreadyExists) {
            fontFamilyInput.appendChild(new Option(fontData.familyName, fontData.familyName));
        }
        fontFamilyInput.value = fontData.familyName;
    }

    document.documentElement.style.setProperty('--font-family', fontData.familyName);
    window.mathegraphicalSettings?.set('--font-family', fontData.familyName);
}

async function loadCustomFont() {
    const customFont = readSavedCustomFont();
    if (!customFont || !customFont.familyName || !customFont.dataUrl) return;
    registerCustomFont(customFont);
}

async function handleCustomFontUpload(event) {
    const [file] = event.target.files || [];
    if (!file) return;

    const familyName = sanitizeFontName(file.name);
    const extension = file.name.toLowerCase();
    const fontFormat = extension.endsWith('.otf') || extension.endsWith('.otc') ? 'opentype' : 'truetype';

    const readAsDataUrl = () => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read the selected font file.'));
        reader.readAsDataURL(file);
    });

    try {
        const dataUrl = await readAsDataUrl();
        const customFont = { familyName, dataUrl, fontFormat };
        writeSavedCustomFont(customFont);
        registerCustomFont(customFont);
    } catch {
        event.target.value = '';
    }
}

function populateFontFamilyOptions(fontFamilies = fallbackFontFamilies) {
    if (!fontFamilyInput) return;

    const customFont = readSavedCustomFont();
    const selectedFont = fontFamilyInput.value || window.mathegraphicalSettings?.get('--font-family', defaults['--font-family']) || defaults['--font-family'];
    const familyList = customFont && customFont.familyName ? [...fontFamilies, customFont.familyName] : fontFamilies;
    const uniqueFonts = [...new Set(familyList.filter(Boolean))];

    if (!uniqueFonts.length) return;

    fontFamilyInput.innerHTML = uniqueFonts
        .map(font => `<option value="${font}">${font}</option>`)
        .join('');

    const validSelection = uniqueFonts.includes(selectedFont) ? selectedFont : defaults['--font-family'];
    fontFamilyInput.value = validSelection;
}

async function loadFontFamilies() {
    if (!fontFamilyInput) return;

    const selectedFont = window.mathegraphicalSettings?.get('--font-family', defaults['--font-family']) || defaults['--font-family'];
    let resolvedFonts = fallbackFontFamilies;

    try {
        const response = await fetch('fonts.json', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            const jsonFonts = Array.isArray(data.fonts) ? data.fonts.map(item => item.family).filter(Boolean) : [];
            if (jsonFonts.length) resolvedFonts = jsonFonts;
        }
    } catch {
        resolvedFonts = fallbackFontFamilies;
    }

    populateFontFamilyOptions(resolvedFonts);

    if (resolvedFonts.includes(selectedFont) || (readSavedCustomFont() && readSavedCustomFont().familyName === selectedFont)) {
        fontFamilyInput.value = selectedFont;
    }
}

function applyTypography() {
    if (!fontFamilyInput || !fontSizeInput || !lineHeightInput) return;
    document.documentElement.style.setProperty('--font-family', fontFamilyInput.value);
    document.documentElement.style.setProperty('--font-size', `${fontSizeInput.value}px`);
    document.documentElement.style.setProperty('--line-height', lineHeightInput.value);
    const sizeValue = document.getElementById('font-size-value');
    const lineValue = document.getElementById('line-height-value');
    if (sizeValue) sizeValue.textContent = `${fontSizeInput.value}px`;
    if (lineValue) lineValue.textContent = lineHeightInput.value;
}

function applyTheme(mode = defaults['--theme-mode']) {
    const resolvedMode = mode === 'system' && themeMedia && themeMedia.matches ? 'dark' : mode;
    const themeValue = resolvedMode === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = themeValue;
    if (themeModeInput) themeModeInput.value = mode || defaults['--theme-mode'];
}

function applyButtonStyle(style = defaults['--button-style']) {
    const radiusMap = { rounded: '12px', square: '0px', pill: '999px' };
    document.documentElement.style.setProperty('--button-radius', radiusMap[style] || radiusMap.rounded);
    if (buttonStyleInput) buttonStyleInput.value = style || defaults['--button-style'];
}

function loadSettings() {
    const saved = readSavedSettings();
    colorInputs.forEach(input => {
        const variable = input.dataset.colorVariable;
        const value = saved[variable] || defaults[variable];
        input.value = value;
        applyColor(variable, value);
    });
    if (fontFamilyInput) fontFamilyInput.value = saved['--font-family'] || defaults['--font-family'];
    if (fontSizeInput) fontSizeInput.value = parseInt(saved['--font-size'] || defaults['--font-size'], 10);
    if (lineHeightInput) lineHeightInput.value = saved['--line-height'] || defaults['--line-height'];
    if (decimalPlacesInput) decimalPlacesInput.value = saved['--decimal-places'] || defaults['--decimal-places'];
    if (themeModeInput) themeModeInput.value = saved['--theme-mode'] || defaults['--theme-mode'];
    if (buttonStyleInput) buttonStyleInput.value = saved['--button-style'] || defaults['--button-style'];
    applyTypography();
    applyTheme(saved['--theme-mode'] || defaults['--theme-mode']);
    applyButtonStyle(saved['--button-style'] || defaults['--button-style']);
}

if (fontFamilyInput) {
    loadFontFamilies();
}

function saveTypography() {
    const saved = readSavedSettings();
    if (fontFamilyInput) saved['--font-family'] = fontFamilyInput.value;
    if (fontSizeInput) saved['--font-size'] = `${fontSizeInput.value}px`;
    if (lineHeightInput) saved['--line-height'] = lineHeightInput.value;
    writeSavedSettings(saved);
}

function savePreference(key, value) {
    const saved = readSavedSettings();
    saved[key] = value;
    writeSavedSettings(saved);
}

function closeSettings() {
    if (!settingsPanel || !settingsToggle) return;
    settingsPanel.hidden = true;
    settingsToggle.setAttribute('aria-expanded', 'false');
}

if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
        const isOpen = settingsPanel.hidden;
        settingsPanel.hidden = !isOpen;
        settingsToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && fontFamilyInput) fontFamilyInput.focus();
    });
}

if (settingsClose) settingsClose.addEventListener('click', closeSettings);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && settingsPanel && !settingsPanel.hidden) closeSettings(); });

colorInputs.forEach(input => input.addEventListener('input', event => {
    const variable = event.target.dataset.colorVariable;
    const value = event.target.value;
    applyColor(variable, value);
    const saved = readSavedSettings();
    saved[variable] = value;
    writeSavedSettings(saved);
}));

if (decimalPlacesInput) {
    decimalPlacesInput.addEventListener('change', () => {
        savePreference('--decimal-places', decimalPlacesInput.value);
    });
}

if (themeModeInput) {
    themeModeInput.addEventListener('change', () => {
        savePreference('--theme-mode', themeModeInput.value);
        applyTheme(themeModeInput.value);
    });
}

if (buttonStyleInput) {
    buttonStyleInput.addEventListener('change', () => {
        savePreference('--button-style', buttonStyleInput.value);
        applyButtonStyle(buttonStyleInput.value);
    });
}

document.getElementById('settings-reset')?.addEventListener('click', () => {
    localStorage.removeItem('mathegraphical-colors');
    localStorage.removeItem(CUSTOM_FONT_STORAGE_KEY);
    if (customFontInput) customFontInput.value = '';
    loadSettings();
});

if (fontFamilyInput) fontFamilyInput.addEventListener('input', () => { applyTypography(); saveTypography(); });
if (fontSizeInput) fontSizeInput.addEventListener('input', () => { applyTypography(); saveTypography(); });
if (lineHeightInput) lineHeightInput.addEventListener('input', () => { applyTypography(); saveTypography(); });

ensureCustomFontControl();
const customFontInput = document.getElementById('custom-font-file');
if (customFontInput) customFontInput.addEventListener('change', handleCustomFontUpload);

if (themeMedia) {
    themeMedia.addEventListener('change', () => {
        const currentTheme = window.mathegraphicalSettings.get('--theme-mode', defaults['--theme-mode']);
        if (currentTheme === 'system') applyTheme('system');
    });
}

loadSettings();
loadCustomFont();
