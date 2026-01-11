/**
 * DEPRECATED: combined ebon/equipment/drugs/summary file.
 * This file has been split into:
 *  - js/ui/steps/ebon.js
 *  - js/ui/steps/equipment.js
 *  - js/ui/steps/drugs.js
 *  - js/ui/steps/summary.js
 *
 * For backward compatibility we provide thin wrappers that forward to the
 * new functions if present. This file can be removed once all references
 * are confirmed to use the new split files.
 */

if (typeof renderEbonStep === 'function') {
    // already provided by js/ui/steps/ebon.js
} else {
    function renderEbonStep(character, container, onUpdate) {
        if (typeof window.renderEbonStep === 'function') return window.renderEbonStep(character, container, onUpdate);
        container.innerHTML = '<div class="info-box">Ebon step module missing.</div>';
    }
}

if (typeof renderEquipmentStep === 'function') {
    // provided by js/ui/steps/equipment.js
} else {
    function renderEquipmentStep(character, container, onUpdate) {
        if (typeof window.renderEquipmentStep === 'function') return window.renderEquipmentStep(character, container, onUpdate);
        container.innerHTML = '<div class="info-box">Equipment step module missing.</div>';
    }
}

if (typeof renderDrugsStep === 'function') {
    // provided by js/ui/steps/drugs.js
} else {
    function renderDrugsStep(character, container, onUpdate) {
        if (typeof window.renderDrugsStep === 'function') return window.renderDrugsStep(character, container, onUpdate);
        container.innerHTML = '<div class="info-box">Drugs step module missing.</div>';
    }
}

if (typeof renderSummaryStep === 'function') {
    // provided by js/ui/steps/summary.js
} else {
    function renderSummaryStep(character, container, onUpdate) {
        if (typeof window.renderSummaryStep === 'function') return window.renderSummaryStep(character, container, onUpdate);
        container.innerHTML = '<div class="info-box">Summary step module missing.</div>';
    }
}
