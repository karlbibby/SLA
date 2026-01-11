// SLA Industries Character Generator - Main Application

// Global state
let currentCharacter = null;

// Initialize the application
function initApp() {
    // Create new character
    currentCharacter = new Character();

    // Initialize wizard
    WIZARD.init(currentCharacter, onCharacterUpdate);

    // Setup event listeners
    setupEventListeners();

    // Load any saved character from localStorage
    loadAutoSave();

    console.log('SLA Industries Character Generator initialized');
}

// Character update callback
function onCharacterUpdate() {
    // Auto-save to localStorage
    saveAutoSave();
    updatePageTitle();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevStepBtn').addEventListener('click', () => {
        WIZARD.prevStep();
    });

    document.getElementById('nextStepBtn').addEventListener('click', () => {
        const currentStepKey = WIZARD.steps[WIZARD.currentStep].key;
        if (currentStepKey === 'summary') {
            if (WIZARD.finish()) {
                // Character creation complete
                console.log('Character created:', currentCharacter.toJSON());
            }
        } else {
            WIZARD.nextStep();
        }
    });

    // Header buttons
    document.getElementById('newCharacterBtn').addEventListener('click', () => {
        if (confirm('Start a new character? Any unsaved progress will be lost.')) {
            createNewCharacter();
        }
    });

    document.getElementById('saveCharacterBtn').addEventListener('click', () => {
        saveCharacter();
    });

    document.getElementById('loadCharacterBtn').addEventListener('click', () => {
        showLoadDialog();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
            WIZARD.prevStep();
        } else if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
            WIZARD.nextStep();
        }
    });
}

// Create a new character
function createNewCharacter() {
    currentCharacter = new Character();
    WIZARD.init(currentCharacter, onCharacterUpdate);
    UI.showToast('New character created', 'success');
}

// Save character to localStorage
function saveAutoSave() {
    try {
        const json = JSON.stringify(currentCharacter.toJSON());
        localStorage.setItem('sla_autosave', json);
    } catch (e) {
        console.error('Auto-save failed:', e);
    }
}

// Load character from localStorage
function loadAutoSave() {
    try {
        const json = localStorage.getItem('sla_autosave');
        if (json) {
            const data = JSON.parse(json);
            currentCharacter.fromJSON(data);
            WIZARD.init(currentCharacter, onCharacterUpdate);
            UI.showToast('Auto-saved character loaded', 'success');
        }
    } catch (e) {
        console.error('Auto-load failed:', e);
    }
}

// Save character to named slot
function saveCharacter() {
    const name = currentCharacter.name || 'Unnamed';
    const timestamp = new Date().toISOString();

    try {
        // Get existing saved characters
        const saved = JSON.parse(localStorage.getItem('sla_characters') || '{}');

        // Add new character
        saved[name] = {
            name: name,
            savedAt: timestamp,
            data: currentCharacter.toJSON()
        };

        localStorage.setItem('sla_characters', JSON.stringify(saved));
        UI.showToast(`Character "${name}" saved!`, 'success');
    } catch (e) {
        UI.showToast('Save failed: ' + e.message, 'error');
    }
}

// Show load dialog
function showLoadDialog() {
    try {
        const saved = JSON.parse(localStorage.getItem('sla_characters') || '{}');
        const list = document.getElementById('savedCharactersList');

        list.innerHTML = '';

        const characters = Object.values(saved);
        if (characters.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No saved characters found.</p>';
        } else {
            characters.forEach((char, index) => {
                const div = document.createElement('div');
                div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 10px;';
                div.innerHTML = `
                    <div>
                        <strong>${char.name}</strong><br>
                        <small style="color: var(--text-muted);">Saved: ${new Date(char.savedAt).toLocaleString()}</small>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary btn-sm" onclick="loadCharacterByName('${char.name}')">Load</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCharacterByName('${char.name}')">Delete</button>
                    </div>
                `;
                list.appendChild(div);
            });
        }

        UI.showModal('loadModal');
    } catch (e) {
        UI.showToast('Load failed: ' + e.message, 'error');
    }
}

// Load character by name
function loadCharacterByName(name) {
    try {
        const saved = JSON.parse(localStorage.getItem('sla_characters') || '{}');
        if (saved[name]) {
            currentCharacter.fromJSON(saved[name].data);
            WIZARD.init(currentCharacter, onCharacterUpdate);
            UI.closeModal('loadModal');
            UI.showToast(`Character "${name}" loaded!`, 'success');
        }
    } catch (e) {
        UI.showToast('Load failed: ' + e.message, 'error');
    }
}

// Delete character by name
function deleteCharacterByName(name) {
    if (confirm(`Delete character "${name}"?`)) {
        try {
            const saved = JSON.parse(localStorage.getItem('sla_characters') || '{}');
            delete saved[name];
            localStorage.setItem('sla_characters', JSON.stringify(saved));
            showLoadDialog(); // Refresh list
            UI.showToast(`Character "${name}" deleted`, 'success');
        } catch (e) {
            UI.showToast('Delete failed: ' + e.message, 'error');
        }
    }
}

// Update page title with character name
function updatePageTitle() {
    const name = currentCharacter.name || 'SLA Industries';
    document.title = `${name} - SLA Industries Character Generator`;
}

// Import character from file
function importCharacter(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = e.target.result;
            const data = JSON.parse(json);
            currentCharacter.fromJSON(data);
            WIZARD.init(currentCharacter, onCharacterUpdate);
            UI.showToast('Character imported successfully!', 'success');
        } catch (err) {
            UI.showToast('Import failed: Invalid file format', 'error');
        }
    };
    reader.readAsText(file);
}

// Make functions globally available
window.loadCharacterByName = loadCharacterByName;
window.deleteCharacterByName = deleteCharacterByName;
window.importCharacter = importCharacter;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
}
