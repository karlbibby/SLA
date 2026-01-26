/* Client-side single-page PDF generator for SLA Operative Security Clearance Card
   - Generates a single-page A4 PDF containing the character clearance card
   - Displays only purchased items (quantity > 0) for all inventory categories
   - Non-fillable PDF rendered with html2canvas and jsPDF
   - For legacy 4-page multi-section export, see pdfExport.legacy.js
*/
(function () {
  'use strict';

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#39;');
  }

  function renderPurchasedWeapons(character) {
    const wi = character.weaponInventory || {};
    const ai = character.armamentInventory || {};
    const weaponEntries = Object.entries(wi).filter(([, qty]) => (Number(qty) || 0) > 0);
    const armamentEntries = Object.entries(ai).filter(([, qty]) => (Number(qty) || 0) > 0);
    
    if (!weaponEntries.length && !armamentEntries.length) {
      return '<tr><th style="border:1px solid #000;padding:2px">Weapon</th><th style="border:1px solid #000;padding:2px">Size</th><th style="border:1px solid #000;padding:2px">Pen</th><th style="border:1px solid #000;padding:2px">DMG</th><th style="border:1px solid #000;padding:2px">AD</th><th style="border:1px solid #000;padding:2px">ROF</th><th style="border:1px solid #000;padding:2px">Clip</th><th style="border:1px solid #000;padding:2px">Cal</th><th style="border:1px solid #000;padding:2px">RCL</th></tr>';
    }
    const headers = '<thead><tr><th style="border:1px solid #000;padding:2px">Weapon</th><th style="border:1px solid #000;padding:2px">Size</th><th style="border:1px solid #000;padding:2px">Pen</th><th style="border:1px solid #000;padding:2px">DMG</th><th style="border:1px solid #000;padding:2px">AD</th><th style="border:1px solid #000;padding:2px">ROF</th><th style="border:1px solid #000;padding:2px">Clip</th><th style="border:1px solid #000;padding:2px">Cal</th><th style="border:1px solid #000;padding:2px">RCL</th></tr></thead>';
    const rows = weaponEntries.slice(0, 8).map(([name]) => {
      let weaponData = {};
      if (typeof WEAPONS !== 'undefined' && Array.isArray(WEAPONS)) {
        const found = WEAPONS.find(w => w.type === name);
        if (found) weaponData = found;
      }
      return `<tr><td style="border:1px solid #000;padding:2px">${escapeHtml(name)}</td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(weaponData.pen || ''))}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(weaponData.dmg || ''))}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(weaponData.armourDmg || ''))}</td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px"></td></tr>`;
    }).join('');
    let armamentRows = '';
    if (armamentEntries.length) {
      armamentRows = armamentEntries.map(([name, qty]) => {
        let armData = {};
        if (typeof ARMAMENTS !== 'undefined' && Array.isArray(ARMAMENTS)) {
          const found = ARMAMENTS.find(a => a.type === name);
          if (found) armData = found;
        }
        return `<tr><td style="border:1px solid #000;padding:2px">${escapeHtml(name)}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(armData.size || ''))}</td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px"></td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(armData.rof || ''))}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(armData.clip || ''))}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(armData.cal || ''))}</td><td style="border:1px solid #000;padding:2px"></td></tr>`;
      }).join('');
    }
    return headers + '<tbody>' + rows + armamentRows + '</tbody>';
  }

  function renderPurchasedAmmo(character) {
    const ai = character.ammoInventory || {};
    const entries = Object.entries(ai).filter(([, qty]) => (Number(qty) || 0) > 0);
    if (!entries.length) {
      return 'None';
    }
    return '<div style="font-size:9px;display:grid;grid-template-columns:1fr 28px;gap:4px 8px;">' +
      entries.slice(0, 12).map(([name, qty]) => {
        return '<div>' + escapeHtml(name) + '</div><div style="text-align:right">' + escapeHtml(String(qty)) + '</div>';
      }).join('') +
      '</div>';
  }

  function renderPurchasedArmour(character) {
    const armoury = character.armourInventory || {};
    const entries = Object.entries(armoury).filter(([, qty]) => (Number(qty) || 0) > 0);
    if (!entries.length) {
      return 'None';
    }
    return entries.map(([name, qty]) => {
      let armourData = {};
      if (typeof ARMOUR !== 'undefined' && Array.isArray(ARMOUR)) {
        const found = ARMOUR.find(a => a.type === name);
        if (found) armourData = found;
      }
      return '<div style="font-size:9px;margin-bottom:4px;"><strong>' + escapeHtml(name) + '</strong> (' + escapeHtml(String(qty)) + ')</div>';
    }).join('');
  }

  function renderArmourProtectionTable(character) {
    // If a DeathSuit is owned, override with its base values; otherwise use selected armour fields
    const hasDS = (() => {
      const inv = character.ebonEquipmentInventory || {};
      return (inv['Ebon Guard — DeathSuit'] || 0) > 0;
    })();

    let pv, id;
    if (hasDS && typeof DEATHSUIT_TYPES !== 'undefined') {
      const dtype = (typeof character.getDeathSuitTypeFromProtectRank === 'function')
        ? character.getDeathSuitTypeFromProtectRank()
        : (Object.keys(DEATHSUIT_TYPES)[0] || 'Light');
      const ds = DEATHSUIT_TYPES[dtype];
      pv = {
        head: ds.pv.base,
        torso: ds.pv.base,
        lArm: ds.pv.base,
        rArm: ds.pv.base,
        lLeg: ds.pv.base,
        rLeg: ds.pv.base
      };
      id = {
        head: ds.head.base,
        torso: ds.torso.base,
        lArm: ds.arms.base,
        rArm: ds.arms.base,
        lLeg: ds.legs.base,
        rLeg: ds.legs.base
      };
    } else {
      pv = {
        head: character.armourHead,
        torso: character.armourTorso,
        lArm: character.armourLArm,
        rArm: character.armourRArm,
        lLeg: character.armourLLeg,
        rLeg: character.armourRLeg
      };
      id = {
        head: character.idHead,
        torso: character.idTorso,
        lArm: character.idLArm,
        rArm: character.idRArm,
        lLeg: character.idLLeg,
        rLeg: character.idRLeg
      };
    }

    const row = (label, pvVal, idVal) => {
      return `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(String(pvVal ?? '--'))}</td><td>${escapeHtml(String(idVal ?? '--'))}</td></tr>`;
    };

    return [
      row('Head', pv.head, id.head),
      row('Torso', pv.torso, id.torso),
      row('L.Arm', pv.lArm, id.lArm),
      row('R.Arm', pv.rArm, id.rArm),
      row('L.Leg', pv.lLeg, id.lLeg),
      row('R.Leg', pv.rLeg, id.rLeg),
    ].join('');
  }

  function renderDeathSuitStats(character) {
    const key = 'Ebon Guard — DeathSuit';
    const owned = character.ebonEquipmentInventory && (character.ebonEquipmentInventory[key] || 0) > 0;
    if (!owned || typeof DEATHSUIT_TYPES === 'undefined') return '';
    const dtype = (typeof character.getDeathSuitTypeFromProtectRank === 'function')
      ? character.getDeathSuitTypeFromProtectRank()
      : (Object.keys(DEATHSUIT_TYPES)[0] || 'Light');
    const ds = DEATHSUIT_TYPES[dtype];
    const fmt = (o) => `${escapeHtml(String(o.base))}/${escapeHtml(String(o.max))}`;
    return `
      <div style="margin-top:4px">
        <div style="text-align:center;font-weight:bold;text-transform:uppercase;font-size:9px;margin:6px 0 2px 0;">DeathSuit — ${escapeHtml(dtype)}</div>
        <table style="width:100%;border-collapse:collapse;font-size:9px;">
          <tbody>
            <tr><td style="border:1px solid #000;padding:1px 2px">PV</td><td style="border:1px solid #000;padding:1px 2px;text-align:center">${fmt(ds.pv)}</td></tr>
            <tr><td style="border:1px solid #000;padding:1px 2px">Head</td><td style="border:1px solid #000;padding:1px 2px;text-align:center">${fmt(ds.head)}</td></tr>
            <tr><td style="border:1px solid #000;padding:1px 2px">Torso</td><td style="border:1px solid #000;padding:1px 2px;text-align:center">${fmt(ds.torso)}</td></tr>
            <tr><td style="border:1px solid #000;padding:1px 2px">Arms</td><td style="border:1px solid #000;padding:1px 2px;text-align:center">${fmt(ds.arms)}</td></tr>
            <tr><td style="border:1px solid #000;padding:1px 2px">Legs</td><td style="border:1px solid #000;padding:1px 2px;text-align:center">${fmt(ds.legs)}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderPurchasedDrugs(character) {
    const di = character.drugInventory || {};
    const entries = Object.entries(di).filter(([, qty]) => (Number(qty) || 0) > 0 || (typeof qty === 'object' && (qty.qty || qty.quantity || qty.amount)));
    if (!entries.length) {
      return '<tr><th style="border:1px solid #000;padding:2px">Drugs</th><th style="border:1px solid #000;padding:2px">Grouping</th><th style="border:1px solid #000;padding:2px">Qty</th></tr>';
    }
    const headers = '<thead><tr><th style="border:1px solid #000;padding:2px">Drugs</th><th style="border:1px solid #000;padding:2px">Grouping</th><th style="border:1px solid #000;padding:2px">Qty</th></tr></thead>';
    const rows = entries.slice(0, 8).map(([name, qty]) => {
      let grouping = '';
      let amount = '';
      
      // Look up drug grouping from DRUGS data
      if (typeof DRUGS !== 'undefined') {
        for (const groupKey in DRUGS) {
          const group = DRUGS[groupKey];
          if (Array.isArray(group.drugs)) {
            const drug = group.drugs.find(d => d.name === name);
            if (drug) {
              grouping = DRUGS[groupKey].name || groupKey;
              break;
            }
          }
        }
      }
      
      if (typeof qty === 'object') {
        amount = (qty.qty || qty.quantity || qty.amount || qty.usage || '') + (qty.unit ? ` ${qty.unit}` : '');
      } else {
        amount = String(qty || '');
      }
      return `<tr><td style="border:1px solid #000;padding:2px">${escapeHtml(name)}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(grouping))}</td><td style="border:1px solid #000;padding:2px">${escapeHtml(String(amount))}</td></tr>`;
    }).join('');
    return headers + '<tbody>' + rows + '</tbody>';
  }

  function renderPhaseBoxes(phases) {
    const activeSet = new Set(Array.isArray(phases) ? phases.map(p => Number(p)) : []);
    return [1, 2, 3, 4, 5].map((p) => {
      const active = activeSet.has(p);
      const style = [
        'display:inline-block',
        'width:14px',
        'height:14px',
        'border:1px solid #000',
        'text-align:center',
        'line-height:12px',
        'margin-right:2px',
        'font-size:8px',
        active ? 'background:#000;color:#fff' : ''
      ].join(';');
      return `<span style="${style}">${p}</span>`;
    }).join('');
  }

  function buildPages(character) {
    const pages = [];
    const nowStr = new Date().toLocaleDateString();
    const phaseData = (character.getPhaseData && typeof character.getPhaseData === 'function')
      ? character.getPhaseData()
      : { actions: '', phases: [] };

    const cover = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:0;background:#fff;font-family:Arial, Helvetica, sans-serif;position:relative;">
        <div class="sheet" style="width:100%;height:100%;padding:8px;box-sizing:border-box;color:#000;">
          <div class="grid-main" style="display:grid;grid-template-columns:50% 50%;column-gap:6px;height:100%;">
            <div class="left-col">
              <div class="panel" style="border:1px solid #000;margin-bottom:5px;position:relative;background:#fff;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">SLA OPERATIVE SECURITY CLEARANCE CARD</div>
                <div class="top-left-card" style="display:flex;padding:4px;">
                  <div class="top-left-fields" style="flex:1;margin-right:4px;">
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;min-width:35px;">Name</span><span style="border-bottom:1px solid #000;flex:1;padding:2px 4px;font-size:9px;">${escapeHtml(character.name||'')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;min-width:75px;">Classification</span><span style="border-bottom:1px solid #000;flex:1;padding:2px 4px;font-size:9px;">${escapeHtml(character.classification || character.class || '')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;min-width:50px;">Package</span><span style="border-bottom:1px solid #000;flex:1;padding:2px 4px;font-size:9px;">${escapeHtml((character.selectedTrainingPackage && typeof TRAINING_PACKAGES !== 'undefined' && TRAINING_PACKAGES[character.selectedTrainingPackage]) ? TRAINING_PACKAGES[character.selectedTrainingPackage].name : '')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;min-width:35px;">Squad</span><span style="border-bottom:1px solid #000;flex:1;padding:2px 4px;font-size:9px;">${escapeHtml(character.squad || '')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;min-width:30px;">Dept</span><span style="border-bottom:1px solid #000;flex:1;padding:2px 4px;font-size:9px;">${escapeHtml(character.department || character.departmentName || '')}</span></div>
                  </div>
                  <div class="photo-scl" style="width:80px;display:flex;flex-direction:column;align-items:stretch;">
                    <div class="photo-box" style="border:1px solid #000;height:80px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666">${character.photo ? `<img src="${escapeHtml(character.photo)}" style="width:100%;height:100%;object-fit:cover;"/>` : ''}</div>
                    <div style="display:flex;align-items:center;justify-content:center;font-size:10px;text-transform:uppercase;"><span style="font-weight:bold;">SCL</span><div style="border:1px solid #000;width:26px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;margin-left:2px">${escapeHtml(character.scl||'')}</div></div>
                  </div>
                </div>
              </div>

              <div class="panel weapons" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">WEAPON</div>
                <div class="panel-body" style="padding:3px 4px;">
                  <table style="width:100%;border-collapse:collapse;font-size:8px;">
                    ${renderPurchasedWeapons(character)}
                  </table>
                </div>
              </div>

              <div class="panel ammo" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">AMMUNITION</div>
                <div class="panel-body" style="padding:3px 4px;">
                  ${renderPurchasedAmmo(character)}
                </div>
              </div>

              <div class="panel" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">HIT POINTS & ARMOUR</div>
                <div class="hp-armour-body" style="display:grid;grid-template-columns:55% 45%;column-gap:4px;padding:3px 4px 4px 4px;">
                  <div class="hp-table">
                    <table style="width:100%;border-collapse:collapse;font-size:9px;border:1px solid #000;">
                      <tbody>
                        <tr style="border-bottom:2px solid #000;background:#f0f0f0;">
                          <td style="border:1px solid #000;padding:2px 4px;font-weight:bold;text-transform:uppercase;">Total</td>
                          <td style="border:1px solid #000;padding:2px 4px;text-align:center;font-weight:bold;font-size:14px;">${escapeHtml(String(character.hpTotal || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">Head</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpHead || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">Torso</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpTorso || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">L.Arm</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpLArm || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">R.Arm</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpRArm || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">L.Leg</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpLLeg || ''))}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #000;padding:1px 4px;">R.Leg</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.hpRLeg || ''))}</td>
                        </tr>
                        <tr style="border-top:1px solid #666;">
                          <td style="border:1px solid #000;padding:1px 4px;font-weight:bold;">Wounds</td>
                          <td style="border:1px solid #000;padding:1px 4px;text-align:center;">${escapeHtml(String(character.wounds || ''))}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div style="text-align:center;font-weight:bold;text-transform:uppercase;font-size:9px;margin-bottom:2px;">Armour</div>
                    <table style="width:100%;border-collapse:collapse;font-size:9px;">
                      <thead><tr><th style="border:1px solid #000;padding:1px 2px">Location</th><th style="border:1px solid #000;padding:1px 2px">PV</th><th style="border:1px solid #000;padding:1px 2px">ID</th></tr></thead>
                      <tbody>
                        ${renderArmourProtectionTable(character)}
                      </tbody>
                    </table>
                    ${renderDeathSuitStats(character)}
                  </div>
                </div>
              </div>

              <div class="panel drugs" style="border:1px solid #000;margin-bottom:5px;">
                <div style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">DRUGS</div>
                <div style="padding:3px 4px;">
                  <table style="width:100%;border-collapse:collapse;font-size:8px;">
                    ${renderPurchasedDrugs(character)}
                  </table>
                </div>
              </div>

              <div class="panel weapon-notes" style="border:1px solid #000;margin-bottom:5px;">
                <div style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">WEAPON NOTES</div>
                <div style="position:relative;height:40px;"></div>
              </div>

              <div class="panel initiative-strip" style="border:1px solid #000;display:flex;font-size:9px;align-items:center;gap:4px;padding:2px 4px;">
                <div style="display:flex;align-items:center;gap:4px;flex:1;"><span style="text-transform:uppercase;font-weight:bold;">Initiative Phase</span><div>${renderPhaseBoxes(phaseData.phases)}</div></div>
                <div style="display:flex;align-items:center;gap:4px;"><span style="text-transform:uppercase;font-weight:bold;white-space:nowrap;">Damage Bonus</span><div style="border:1px solid #000;padding:4px 8px;min-width:40px;text-align:center;font-weight:bold;">${escapeHtml(String((character.getDamageBonus ? character.getDamageBonus() : Math.floor((character.stats?.STR || 0) / 3))))}</div></div>
              </div>
            </div>

            <div class="right-col">
              <div style="border:1px solid #000;margin-bottom:5px;padding:3px 4px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;height:auto;">
                <div style="border-right:1px solid #000;">
                  <div style="font-size:8px;margin-bottom:2px;">Strength</div>
                  <div style="font-size:8px;margin-bottom:2px;">Dexterity</div>
                  <div style="font-size:8px;margin-bottom:2px;">Diagnose</div>
                  <div style="font-size:8px;margin-bottom:2px;">Concentration</div>
                  <div style="font-size:8px;margin-bottom:2px;">Charisma</div>
                  <div style="font-size:8px;margin-bottom:4px;"></div>
                  <div style="font-size:8px;margin-bottom:2px;">Physique</div>
                  <div style="font-size:8px;margin-bottom:2px;">Knowledge</div>
                  <div style="font-size:8px;margin-bottom:4px;"></div>
                  <div style="font-size:8px;">Cool</div>
                  ${(() => {
                    const flux = character.derivedStats?.FLUX;
                    if (flux && flux > 0) {
                      return '<div style="font-size:8px;margin-top:2px;">Flux</div>';
                    }
                    return '';
                  })()}
                </div>
                <div style="border-right:1px solid #000;text-align:right;padding-right:2px;">
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.stats?.STR || ''))}</div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.stats?.DEX || ''))}</div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.stats?.DIA || ''))}</div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.stats?.CONC || ''))}</div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.stats?.CHA || ''))}</div>
                  <div style="font-size:8px;margin-bottom:4px;"></div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.derivedStats?.PHYS || ''))}</div>
                  <div style="font-size:8px;margin-bottom:2px;">${escapeHtml(String(character.derivedStats?.KNOW || ''))}</div>
                  <div style="font-size:8px;margin-bottom:4px;"></div>
                  <div style="font-size:8px;">${escapeHtml(String(character.stats?.COOL || ''))}</div>
                  ${(() => {
                    const flux = character.derivedStats?.FLUX;
                    if (flux && flux > 0) {
                      return `<div style="font-size:8px;margin-top:2px;">${escapeHtml(String(flux))}</div>`;
                    }
                    return '';
                  })()}
                </div>
                <div style="display:flex;flex-direction:column;gap:3px;font-size:8px;">
                  <div style="border:1px solid #000;padding:2px;text-align:center;font-weight:bold;">MOVE RATE</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">WALK ${escapeHtml(String((character.getMoveRate ? character.getMoveRate().walk : character.move?.walk) || ''))}</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">RUN ${escapeHtml(String((character.getMoveRate ? character.getMoveRate().run : character.move?.run) || ''))}</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;margin-bottom:3px;">SPRINT ${escapeHtml(String((character.getMoveRate ? character.getMoveRate().sprint : character.move?.sprint) || ''))}</div>
                  <div style="border:1px solid #000;padding:2px;text-align:center;font-weight:bold;">ENCUMBRANCE</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">MOVEMENT ${escapeHtml(String(character.encumbrance?.movement || ''))}</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">HALF MOVEMENT _______</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;margin-bottom:3px;">NO MOVEMENT _______</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">LIFT _______</div>
                  <div style="border-bottom:1px solid #000;padding:2px 0;">THROW _______</div>
                </div>
              </div>

              <div class="panel skills" style="border:1px solid #000;height:auto;">
                <div style="background:#ddd;padding:4px;font-weight:bold;text-transform:uppercase;font-size:10px;">Skills</div>
                <div style="padding:4px;font-size:8px;color:#000;">
                  ${(() => {
                    const skills = Object.entries(character.skills || {});
                    if (!skills.length) return '<div style="color:#666">No skills</div>';
                    
                    // Header row
                    let html = '<div style="display:grid;grid-template-columns:1fr 32px 40px 40px;gap:4px;padding:2px 0;border-bottom:2px solid #000;margin-bottom:2px;font-weight:bold;"><div>Skill</div><div style="text-align:center">Rank</div><div style="text-align:center">Stat</div><div style="text-align:center">Max</div></div>';
                    
                    // Skill rows
                    html += skills.map(([skillName, rank]) => {
                      // Common aliases -> canonical SKILLS keys
                      const skillAliases = {
                        'SLA Info': 'SLA Information',
                        'Paramedic': 'Medical, Paramedic',
                        'Medical Practice': 'Medical, Practice',
                        'Mechanics Repair': 'Mechanics, Repair',
                        'Mechanics Industrial': 'Mechanics, Industrial',
                        'Electronics Repair': 'Electronics, Repair',
                        'Electronics Industrial': 'Electronics, Industrial',
                        'Intimidate': 'Intimidation'
                      };
                      const lookupName = skillAliases[skillName] || skillName;
                      let governingStat = '';
                      if (typeof SKILLS !== 'undefined') {
                        for (const category in SKILLS) {
                          if (SKILLS[category].skills[lookupName]) {
                            governingStat = SKILLS[category].skills[lookupName].governingStat || '';
                            break;
                          }
                        }
                      }
                      return `<div style="display:grid;grid-template-columns:1fr 32px 40px 40px;gap:4px;padding:2px 0;border-bottom:1px solid #eee;"><div>${escapeHtml(skillName)}</div><div style="text-align:center">${escapeHtml(String(rank))}</div><div style="text-align:center">${escapeHtml(governingStat)}</div><div style="text-align:center">${escapeHtml(String(Math.max(rank, 10)))}</div></div>`;
                    }).join('');
                    
                    return html;
                  })()}
                </div>
              </div>
            </div>
          </div>
          <footer style="position:absolute;left:8px;right:8px;bottom:8px;font-size:9px;color:#666;display:flex;justify-content:space-between;">Exported: ${nowStr}</footer>
        </div>
      </div>
    `;
    pages.push(cover);

    // Add flux abilities pages (paginated) if character is a flux user
    if (character.isFluxUser && character.isFluxUser()) {
      // Collect all ability sections
      const ranks = character.ebonRanks || {};
      const sections = [];

      // Render selected categories with full details (all lower ranks)
      if (ranks && Object.keys(ranks).length) {
        Object.keys(ranks).forEach(catKey => {
          const rank = Number(ranks[catKey] || 0);
          if (rank > 0) {
            const cat = (typeof EBON_ABILITIES !== 'undefined' && EBON_ABILITIES[catKey]) ? EBON_ABILITIES[catKey] : null;
            const title = cat ? (cat.name || catKey) : catKey;
            let tbl = '<div style="margin-bottom:10px">';
            tbl += '<div style="font-weight:700;margin-bottom:6px">' + escapeHtml(title) + ' — Rank ' + rank + '</div>';
            tbl += '<table style="width:100%;border-collapse:collapse;font-size:10px;border:1px solid #ddd">';
            tbl += '<thead><tr>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Rank</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Title</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Cost</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">DMG</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Arm</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Pen</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Range</th>' +
              '<th style="border:1px solid #ccc;padding:4px;text-align:left">Notes</th>' +
              '</tr></thead><tbody>';

            if (cat && Array.isArray(cat.ranks)) {
              for (let i = 0; i < Math.min(rank, cat.ranks.length); i++) {
                const rd = cat.ranks[i];
                tbl += '<tr>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.rank || (i + 1))) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(rd.title || '') + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(rd.cost === null || typeof rd.cost === "undefined" ? '-' : String(rd.cost)) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.dmg || '')) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.armDmg || '')) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.pen || '')) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.range || '')) + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.description || '')) + '</td>' +
                  '</tr>';
              }
            } else {
              // Fallback: list simple rank rows
              for (let i = 1; i <= rank; i++) {
                tbl += '<tr>' +
                  '<td style="border:1px solid #eee;padding:4px">' + i + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">Rank ' + i + '</td>' +
                  '<td style="border:1px solid #eee;padding:4px">-</td>' +
                  '<td style="border:1px solid #eee;padding:4px"></td>' +
                  '<td style="border:1px solid #eee;padding:4px"></td>' +
                  '<td style="border:1px solid #eee;padding:4px"></td>' +
                  '<td style="border:1px solid #eee;padding:4px"></td>' +
                  '<td style="border:1px solid #eee;padding:4px"></td>' +
                  '</tr>';
              }
            }

            tbl += '</tbody></table></div>';
            sections.push({ type: 'ability', html: tbl });
          }
        });
      }

      // Backwards-compat explicit list
      if (Array.isArray(character.ebonAbilities) && character.ebonAbilities.length) {
        sections.unshift({ type: 'header', html: '<div style="font-weight:700;margin-bottom:6px">Explicit Ebon Abilities</div>' });
        character.ebonAbilities.forEach(a => {
          sections.push({ type: 'item', html: '<div style="padding:2px 0">' + escapeHtml(typeof a === 'string' ? a : (a.name || JSON.stringify(a))) + '</div>' });
        });
      }

      // Formulae display
      if (Array.isArray(character.selectedFormulae) && character.selectedFormulae.length) {
        sections.push({ type: 'header', html: '<div style="font-weight:700;margin-top:6px">Formulae</div>' });
        character.selectedFormulae.forEach(f => {
          sections.push({ type: 'item', html: '<div style="padding:2px 0">' + escapeHtml(typeof f === 'string' ? f : (f.name || JSON.stringify(f))) + '</div>' });
        });
      }

      if (sections.length === 0) {
        // No abilities, add single page
        const p_flux = `
          <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Arial, Helvetica, sans-serif;">
            <h2 style="margin:0 0 8px 0">Flux Abilities</h2>
            <div style="font-size:11px;line-height:1.2;color:#666">No flux abilities selected</div>
            <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Flux</div></footer>
          </div>
        `;
        pages.push(p_flux);
      } else {
        // Paginate content: target ~65mm content height per page to avoid overflow
        const pageContentHeightMm = 200; // 297mm page - 24mm top/bottom margins - 24mm for header/footer
        const estimatedHeightPerAbility = 35; // mm per ability table
        const estimatedHeightPerItem = 8; // mm per list item
        
        let currentPageSections = [];
        let currentPageHeight = 20; // Start with header height
        let pageNumber = 1;
        
        sections.forEach(section => {
          const sectionHeight = section.type === 'ability' ? estimatedHeightPerAbility : estimatedHeightPerItem;
          
          // Check if adding this section would overflow
          if (currentPageHeight + sectionHeight > pageContentHeightMm && currentPageSections.length > 0) {
            // Create a page with current sections
            const p_flux = `
              <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Arial, Helvetica, sans-serif;">
                <h2 style="margin:0 0 8px 0">Flux Abilities${pageNumber > 1 ? ' (continued)' : ''}</h2>
                <div style="font-size:11px;line-height:1.2">
                  ${currentPageSections.map(s => s.html).join('')}
                </div>
                <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Flux - Page ${pageNumber}</div></footer>
              </div>
            `;
            pages.push(p_flux);
            
            // Reset for next page
            currentPageSections = [];
            currentPageHeight = 20;
            pageNumber++;
          }
          
          currentPageSections.push(section);
          currentPageHeight += sectionHeight;
        });
        
        // Add final page with remaining sections
        if (currentPageSections.length > 0) {
          const p_flux = `
            <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Arial, Helvetica, sans-serif;">
              <h2 style="margin:0 0 8px 0">Flux Abilities${pageNumber > 1 ? ' (continued)' : ''}</h2>
              <div style="font-size:11px;line-height:1.2">
                ${currentPageSections.map(s => s.html).join('')}
              </div>
              <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Flux - Page ${pageNumber}</div></footer>
            </div>
          `;
          pages.push(p_flux);
        }
      }
    }

    // Add racial abilities page if character's race has racial abilities
    if (character.race && RACES && RACES[character.race] && RACES[character.race].racialAbilities) {
      const abilities = RACES[character.race].racialAbilities;
      if (Array.isArray(abilities) && abilities.length > 0) {
        const raceName = RACES[character.race].name || character.race;
        const p_racial = `
          <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Arial, Helvetica, sans-serif;">
            <h2 style="margin:0 0 8px 0">Racial Abilities: ${escapeHtml(raceName)}</h2>
            <div style="font-size:11px;line-height:1.4">
              ${(() => {
                const sections = [];
                abilities.forEach(ability => {
                  let abilityHtml = '<div style="margin-bottom:12px;padding:8px;border:1px solid #ddd;border-radius:4px;background:#f9f9f9">';
                  abilityHtml += '<div style="font-weight:700;margin-bottom:4px">' + escapeHtml(ability.name || '') + '</div>';
                  if (ability.shortDesc) {
                    abilityHtml += '<div style="font-size:10px;color:#666;margin-bottom:4px;font-style:italic">' + escapeHtml(ability.shortDesc) + '</div>';
                  }
                  if (ability.description) {
                    // Render markdown description as plain text for PDF (fallback to escaped HTML)
                    const descText = escapeHtml(String(ability.description).replace(/[*#_\-\[\]]/g, '').substring(0, 500));
                    abilityHtml += '<div style="font-size:10px;color:#333;margin-bottom:4px">' + descText + '</div>';
                  }
                  if (ability.mechanics) {
                    const mech = ability.mechanics;
                    let mechStr = '';
                    if (mech.pv) mechStr += 'PV:' + escapeHtml(String(mech.pv)) + ' ';
                    if (mech.healing) mechStr += 'Healing:' + escapeHtml(String(mech.healing)) + ' ';
                    if (mech.cost) mechStr += 'Cost:' + escapeHtml(String(mech.cost)) + ' ';
                    if (mech.duration) mechStr += 'Duration:' + escapeHtml(String(mech.duration)) + ' ';
                    if (mechStr) {
                      abilityHtml += '<div style="font-size:9px;color:#555;margin-top:4px"><strong>Mechanics:</strong> ' + mechStr + '</div>';
                    }
                  }
                  abilityHtml += '</div>';
                  sections.push(abilityHtml);
                });
                return sections.join('');
              })()}
            </div>
            <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>${escapeHtml(raceName)}</div></footer>
          </div>
        `;
        pages.push(p_racial);
      }
    }

    return pages;
  }

  async function generatePdf() {
    if (!window.currentCharacter) {
      alert('No character loaded to export.');
      return;
    }
    const pages = buildPages(window.currentCharacter);

    const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
    if (!jsPDFCtor) {
      alert('jsPDF not loaded. Ensure jspdf UMD is included in index.html.');
      return;
    }

    const pdf = new jsPDFCtor('p', 'mm', 'a4');
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    try {
      for (let i = 0; i < pages.length; i++) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '-9999px';
        wrapper.innerHTML = pages[i];
        document.body.appendChild(wrapper);

        const pageEl = wrapper.querySelector('.print-page');
        const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/jpeg', 0.9);

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);

        document.body.removeChild(wrapper);
      }

      const filename = (window.currentCharacter && window.currentCharacter.name)
        ? `${window.currentCharacter.name.replace(/\s+/g, '_')}_SLA_Clearance_Card.pdf`
        : 'SLA_Clearance_Card.pdf';

      pdf.save(filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. See console for details.');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('downloadPdfBtn');
    if (btn) btn.addEventListener('click', generatePdf);
  });

  window.generateCharacterPdf = generatePdf;
})();
