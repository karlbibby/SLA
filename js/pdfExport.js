/* Client-side printable multi-page PDF generator
   - Renders a dedicated set of print pages from the currentCharacter data
   - Captures each page separately with html2canvas and adds to jsPDF A4 pages
   - Non-fillable PDF as requested
   - First page is the SLA Operative Security Clearance Card populated with character data
*/
(function () {
  'use strict';

  function formatStatBar(value, max) {
    const v = Number(value) || 0;
    const m = Number(max) || 1;
    const totalBlocks = 10;
    if (m <= 0) return `${v}/${m}`;
    const filledBlocks = Math.round((Math.max(0, Math.min(m, v)) / m) * totalBlocks);
    return '▰'.repeat(filledBlocks) + '▱'.repeat(totalBlocks - filledBlocks) + ` ${v}/${m}`;
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#39;');
  }

  function renderWeaponsRows(character) {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      rows.push('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    }
    return rows.join('');
  }

  function renderAmmoList(character) {
    return '<div style="color:#666">None</div>';
  }

  function renderNaturalWeapons(character) {
    const nw = character.naturalWeapons || [];
    if (!nw.length) {
      return `<tr><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td></tr>`;
    }
    return nw.slice(0,3).map(n => `<tr><td>${escapeHtml(n.name||n)}</td><td>${escapeHtml(String(n.pen||''))}</td><td>${escapeHtml(String(n.dmg||''))}</td><td>${escapeHtml(String(n.ad||''))}</td></tr>`).join('');
  }

  function renderDrugsTable(character) {
    const di = character.drugInventory || {};
    const entries = Object.entries(di);
    if (!entries.length) {
      return `<tr><td colspan="3" style="color:#666">None</td></tr>`;
    }
    return entries.slice(0,8).map(([name, qty]) => {
      let type = '';
      let amount = '';
      if (typeof qty === 'object') {
        type = qty.type || qty.form || '';
        amount = (qty.qty || qty.quantity || qty.amount || qty.usage || '') + (qty.unit ? ` ${qty.unit}` : '');
      } else {
        amount = String(qty || '');
      }
      return `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(String(type))}</td><td>${escapeHtml(String(amount))}</td></tr>`;
    }).join('');
  }

  function buildPages(character) {
    const pages = [];
    const nowStr = new Date().toLocaleDateString();

    const cover = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:0;background:#fff;font-family:Arial, Helvetica, sans-serif;position:relative;">
        <div class="sheet" style="width:100%;height:100%;padding:8px;box-sizing:border-box;color:#000;">
          <div class="grid-main" style="display:grid;grid-template-columns:40% 60%;column-gap:6px;height:100%;">
            <div class="left-col">
              <div class="panel" style="border:1px solid #000;margin-bottom:5px;position:relative;background:#fff;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">SLA OPERATIVE SECURITY CLEARANCE CARD</div>
                <div class="top-left-card" style="display:flex;padding:4px;">
                  <div class="top-left-fields" style="flex:1;margin-right:4px;">
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;">Name</span><span style="border-bottom:1px solid #000;flex:1;height:11px;display:inline-block;padding:0 4px;">${escapeHtml(character.name||'')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;">Classification</span><span>${escapeHtml(character.classification || character.class || '')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;">Squad</span><span>${escapeHtml(character.squad || '')}</span></div>
                    <div class="field-row" style="display:flex;align-items:center;margin-bottom:2px;"><span style="font-size:9px;text-transform:uppercase;margin-right:4px;">Dept</span><span>${escapeHtml(character.department || character.departmentName || '')}</span></div>
                  </div>
                  <div class="photo-scl" style="width:130px;display:flex;flex-direction:column;align-items:stretch;">
                    <div class="photo-box" style="border:1px solid #000;height:100px;margin-bottom:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666">${character.photo ? `<img src="${escapeHtml(character.photo)}" style="width:100%;height:100%;object-fit:cover;"/>` : 'Portrait'}</div>
                    <div style="display:flex;align-items:center;font-size:10px;text-transform:uppercase;"><span style="font-weight:bold;margin-right:4px;">SCL</span><div style="border:1px solid #000;width:26px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;">${escapeHtml(character.scl||'')}</div></div>
                  </div>
                </div>
              </div>

              <div class="panel weapons" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">WEAPON</div>
                <div class="panel-body" style="padding:3px 4px;">
                  <table style="width:100%;border-collapse:collapse;font-size:9px;">
                    <thead><tr><th style="border:1px solid #000;padding:2px">Weapon</th><th style="border:1px solid #000;padding:2px">Size</th><th style="border:1px solid #000;padding:2px">Pen</th><th style="border:1px solid #000;padding:2px">DMG</th><th style="border:1px solid #000;padding:2px">AD</th><th style="border:1px solid #000;padding:2px">ROF</th><th style="border:1px solid #000;padding:2px">Clip</th><th style="border:1px solid #000;padding:2px">Cal</th><th style="border:1px solid #000;padding:2px">RCL</th></tr></thead>
                    <tbody>
                      ${renderWeaponsRows(character)}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="panel ammo" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">AMMUNITION</div>
                <div class="panel-body" style="padding:3px 4px;">
                  ${renderAmmoList(character)}
                </div>
              </div>

              <div class="panel" style="border:1px solid #000;margin-bottom:5px;">
                <div class="panel-header" style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">HIT POINTS & ARMOUR</div>
                <div class="hp-armour-body" style="display:grid;grid-template-columns:55% 45%;column-gap:4px;padding:3px 4px 4px 4px;">
                  <div class="hp-table">
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span style="width:50px;text-transform:uppercase;">Total</span><span style="border-bottom:1px solid #000;flex:1;height:10px;display:inline-block;padding:0 4px;">${escapeHtml(String(character.hpTotal || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>Head</span><span style="flex:1">${escapeHtml(String(character.hpHead || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>Torso</span><span style="flex:1">${escapeHtml(String(character.hpTorso || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>L.Arm</span><span style="flex:1">${escapeHtml(String(character.hpLArm || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>R.Arm</span><span style="flex:1">${escapeHtml(String(character.hpRArm || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>L.Leg</span><span style="flex:1">${escapeHtml(String(character.hpLLeg || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>R.Leg</span><span style="flex:1">${escapeHtml(String(character.hpRLeg || ''))}</span></div>
                    <div style="display:flex;align-items:center;font-size:9px;margin-bottom:1px;"><span>Wounds</span><span style="flex:1">${escapeHtml(String(character.wounds || ''))}</span></div>
                  </div>
                  <div>
                    <div style="text-align:center;font-weight:bold;text-transform:uppercase;font-size:9px;margin-bottom:2px;">Armour</div>
                    <table style="width:100%;border-collapse:collapse;font-size:9px;">
                      <thead><tr><th style="border:1px solid #000;padding:1px 2px">Location</th><th style="border:1px solid #000;padding:1px 2px">PV</th><th style="border:1px solid #000;padding:1px 2px">ID</th></tr></thead>
                      <tbody>
                        <tr><td>Head</td><td>${escapeHtml(String(character.armourHead || '--'))}</td><td>${escapeHtml(String(character.idHead || '--'))}</td></tr>
                        <tr><td>Torso</td><td>${escapeHtml(String(character.armourTorso || '--'))}</td><td>${escapeHtml(String(character.idTorso || '--'))}</td></tr>
                        <tr><td>L.Arm</td><td>${escapeHtml(String(character.armourLArm || '--'))}</td><td>${escapeHtml(String(character.idLArm || '--'))}</td></tr>
                        <tr><td>R.Arm</td><td>${escapeHtml(String(character.armourRArm || '--'))}</td><td>${escapeHtml(String(character.idRArm || '--'))}</td></tr>
                        <tr><td>L.Leg</td><td>${escapeHtml(String(character.armourLLeg || '--'))}</td><td>${escapeHtml(String(character.idLLeg || '--'))}</td></tr>
                        <tr><td>R.Leg</td><td>${escapeHtml(String(character.armourRLeg || '--'))}</td><td>${escapeHtml(String(character.idRLeg || '--'))}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="panel natural-weapons" style="border:1px solid #000;margin-bottom:5px;">
                <div style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">NATURAL WEAPONS</div>
                <div style="padding:3px 4px;">
                  <table style="width:100%;border-collapse:collapse;font-size:9px;">
                    <thead><tr><th style="border:1px solid #000;padding:2px">Natural Weapons</th><th style="border:1px solid #000;padding:2px">Pen</th><th style="border:1px solid #000;padding:2px">DMG</th><th style="border:1px solid #000;padding:2px">AD</th></tr></thead>
                    <tbody>
                      ${renderNaturalWeapons(character)}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="panel drugs" style="border:1px solid #000;margin-bottom:5px;">
                <div style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">DRUGS</div>
                <div style="padding:3px 4px;">
                  <table style="width:100%;border-collapse:collapse;font-size:9px;">
                    <thead><tr><th style="border:1px solid #000;padding:2px">Drugs</th><th style="border:1px solid #000;padding:2px">Type</th><th style="border:1px solid #000;padding:2px">Qty</th></tr></thead>
                    <tbody>
                      ${renderDrugsTable(character)}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="panel weapon-notes" style="border:1px solid #000;margin-bottom:5px;">
                <div style="background:#666;color:#fff;padding:2px 4px;font-weight:bold;text-transform:uppercase;font-size:10px;">WEAPON NOTES</div>
                <div style="position:relative;height:80px;"></div>
              </div>

              <div class="panel initiative-strip" style="border:1px solid #000;display:flex;font-size:9px;">
                <div style="padding:2px 4px;flex:1;display:flex;align-items:center;"><span style="text-transform:uppercase;font-weight:bold;margin-right:4px;">Initiative Phase</span><div><span style="display:inline-block;width:14px;height:14px;border:1px solid #000;text-align:center;line-height:12px;margin-right:2px;font-size:8px;">1</span><span style="display:inline-block;width:14px;height:14px;border:1px solid #000;text-align:center;line-height:12px;margin-right:2px;font-size:8px;">2</span><span style="display:inline-block;width:14px;height:14px;border:1px solid #000;text-align:center;line-height:12px;margin-right:2px;font-size:8px;">3</span></div></div>
                <div style="padding:2px 4px;flex:1;display:flex;align-items:center;"><span style="text-transform:uppercase;font-weight:bold;margin-right:4px;">Damage Bonus</span><span style="border-bottom:1px solid #000;flex:1;height:10px;"></span></div>
              </div>
            </div>

            <div class="right-col">
              <div style="border:1px solid #000;margin-bottom:5px;padding:3px 4px;">
                <div style="display:grid;grid-template-columns:60% 40%;column-gap:4px;">
                  <div>
                    <div style="font-size:9px;margin-bottom:4px;">Strength: ${escapeHtml(String(character.stats?.STR || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Dexterity: ${escapeHtml(String(character.stats?.DEX || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Diagnose: ${escapeHtml(String(character.stats?.DIA || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Concentration: ${escapeHtml(String(character.stats?.CONC || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Charisma: ${escapeHtml(String(character.stats?.CHA || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Physique: ${escapeHtml(String(character.derivedStats?.PHYS || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Knowledge: ${escapeHtml(String(character.derivedStats?.KNOW || ''))}</div>
                    <div style="font-size:9px;margin-bottom:4px;">Cool: ${escapeHtml(String(character.stats?.COOL || ''))}</div>
                  </div>
                  <div>
                    <div style="border:1px solid #000;margin-bottom:6px;padding:4px;font-size:9px;">MOVE<br/>Walk: ${escapeHtml(String(character.move?.walk || ''))}<br/>Run: ${escapeHtml(String(character.move?.run || ''))}<br/>Sprint: ${escapeHtml(String(character.move?.sprint || ''))}</div>
                    <div style="border:1px solid #000;padding:4px;font-size:9px;">ENCUMBRANCE<br/>${escapeHtml(String(character.encumbrance?.movement || ''))}</div>
                  </div>
                </div>
              </div>

              <div class="panel skills" style="border:1px solid #000;height:auto;">
                <div style="background:#ddd;padding:4px;font-weight:bold;text-transform:uppercase;font-size:10px;">Skills</div>
                <div style="padding:6px;font-size:9px;color:#000;">
                  ${(() => {
                    const skills = Object.entries(character.skills || {});
                    if (!skills.length) return '<div style="color:#666">No skills</div>';
                    return skills.map(([n,v]) => `<div style="display:grid;grid-template-columns:1fr 36px 40px 36px;gap:6px;padding:2px 0;border-bottom:1px solid #eee;"><div>${escapeHtml(n)}</div><div style="text-align:center">${escapeHtml(String(v))}</div><div style="text-align:center">${escapeHtml(String(character.skillStat?.[n]||''))}</div><div style="text-align:center">${escapeHtml(String(Math.max(v,10)))}</div></div>`).join('');
                  })()}
                </div>
              </div>
            </div>
          </div>
          <footer style="position:absolute;left:8px;right:8px;bottom:8px;font-size:9px;color:#666;display:flex;justify-content:space-between;">Exported: ${nowStr} <span>Page 1</span></footer>
        </div>
      </div>
    `;
    pages.push(cover);

    const interiorPages = buildStandardPages(character, nowStr);
    pages.push(...interiorPages);

    return pages;
  }

  function buildStandardPages(character, nowStr) {
    const pages = [];

    const p1 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Helvetica, Arial, sans-serif;">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8mm">
          <div>
            <h1 style="margin:0;font-family:Georgia, serif;">SLA INDUSTRIES</h1>
            <div style="font-size:12px;color:#666">Operative Character Sheet — 1st Edition Redux</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:600">${escapeHtml(character.name || '')}</div>
            <div style="font-size:12px;color:#666">${escapeHtml(character.race || '')} • ${escapeHtml(character.class || '')}</div>
            <div style="font-size:12px;color:#666">SCL: ${escapeHtml(character.scl || '')}</div>
          </div>
        </header>

        <section style="display:flex;gap:16px;margin-bottom:8mm">
          <div style="flex:1;">
            <h3 style="margin:0 0 6px 0">Primary Statistics</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
              ${Object.entries(character.stats || {}).map(([k,v]) => `<div style="font-size:12px">${escapeHtml(k)}: <span style="float:right">${formatStatBar(v, 15)}</span></div>`).join('')}
            </div>
          </div>
          <div style="width:160mm;max-width:320px">
            <h3 style="margin:0 0 6px 0">Derived & Resources</h3>
            <div style="font-size:12px">PHYS: ${escapeHtml(String(character.derivedStats?.PHYS || ''))} • KNOW: ${escapeHtml(String(character.derivedStats?.KNOW || ''))} • FLUX: ${escapeHtml(String(character.derivedStats?.FLUX || ''))}</div>
            <div style="margin-top:8px;font-size:12px">Credits: ${escapeHtml(String(character.credits || 0))}c</div>
          </div>
        </section>

        <section>
          <h3 style="margin:0 0 6px 0">Summary</h3>
          <div style="font-size:11px;color:#000;line-height:1.3">${escapeHtml(character.summary || '')}</div>
        </section>
        <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Page 2</div></footer>
      </div>
    `;
    pages.push(p1);

    const p_skills = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Skills</h2>
        <div style="font-size:11px;line-height:1.25">
          ${(() => {
            const skills = Object.entries(character.skills || {});
            if (!skills.length) return '<div style="color:#666">No skills</div>';
            return skills.map(([n,v]) => `<div style="display:grid;grid-template-columns:1fr 36px 40px 36px;gap:6px;padding:2px 0;border-bottom:1px solid #eee;"><div>${escapeHtml(n)}</div><div style="text-align:center">${escapeHtml(String(v))}</div><div style="text-align:center">${escapeHtml(String(character.skillStat?.[n]||''))}</div><div style="text-align:center">${escapeHtml(String(Math.max(v,10)))}</div></div>`).join('');
          })()}
        </div>
        <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Page 3</div></footer>
      </div>
    `;
    pages.push(p_skills);

    const p_flux = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#000;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Flux Abilities</h2>
        <div style="font-size:11px;line-height:1.2">
          ${(() => {
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
                  tbl += '<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #ddd">';
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
                        '<td style="border:1px solid #eee;padding:4px">' + escapeHtml(String(rd.notes || '')) + '</td>' +
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
                  sections.push(tbl);
                }
              });
            }

            // Backwards-compat explicit list
            if (Array.isArray(character.ebonAbilities) && character.ebonAbilities.length) {
              sections.unshift('<div style="font-weight:700;margin-bottom:6px">Explicit Ebon Abilities</div>');
              character.ebonAbilities.forEach(a => {
                sections.push('<div style="padding:2px 0">' + escapeHtml(typeof a === 'string' ? a : (a.name || JSON.stringify(a))) + '</div>');
              });
            }

            // Formulae display
            if (Array.isArray(character.selectedFormulae) && character.selectedFormulae.length) {
              sections.push('<div style="font-weight:700;margin-top:6px">Formulae</div>');
              character.selectedFormulae.forEach(f => {
                sections.push('<div style="padding:2px 0">' + escapeHtml(typeof f === 'string' ? f : (f.name || JSON.stringify(f))) + '</div>');
              });
            }

            if (!sections.length) return '<div style="color:#666">No flux abilities</div>';
            return sections.join('');
          })()}
        </div>
        <footer style="position:absolute;left:12mm;right:12mm;bottom:12mm;font-size:10px;color:#666;display:flex;justify-content:space-between"><div>Exported: ${nowStr}</div><div>Flux</div></footer>
      </div>
    `;
    pages.push(p_flux);

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
        ? `${window.currentCharacter.name.replace(/\s+/g, '_')}_SLA_Sheet.pdf`
        : 'SLA_Sheet.pdf';

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
