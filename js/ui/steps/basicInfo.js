// Step 1: Basic Info
function renderBasicInfoStep(character, container, onUpdate) {
    container.innerHTML = `
        <div class="section-header">
            <h2 class="section-title">Step 1: Character Basics</h2>
            <p class="section-description">Enter your character's basic information.</p>
        </div>
        <div class="form-group">
            <label class="form-label">Character Name</label>
            <input type="text" class="form-input" id="charName" value="${character.name || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Player Name</label>
            <input type="text" class="form-input" id="playerName" value="${character.playerName || ''}">
        </div>
    `;
    
    document.getElementById('charName').addEventListener('input', (e) => {
        character.name = e.target.value;
        onUpdate();
    });
    
    document.getElementById('playerName').addEventListener('input', (e) => {
        character.playerName = e.target.value;
        onUpdate();
    });
}
