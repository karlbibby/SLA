/* Client-side printable multi-page PDF generator
   - Renders a dedicated set of print pages from the currentCharacter data
   - Captures each page separately with html2canvas and adds to jsPDF A4 pages
   - Non-fillable PDF as requested
*/
(function () {
  function formatStatBar(value, max) {
    const filled = Math.max(0, Math.min(max, value));
    const totalBlocks = 10;
    const filledBlocks = Math.round((filled / max) * totalBlocks);
    return '▰'.repeat(filledBlocks) + '▱'.repeat(totalBlocks - filledBlocks) + ` ${value}/${max}`;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  }

  function buildPages(character) {
    const pages = [];

    // Page 1: Header + Primary & Derived Stats + Resources
    const p1 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
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
              ${Object.entries(character.stats).map(([k,v]) => `<div style="font-size:12px">${k}: <span style="float:right">${formatStatBar(v, 15)}</span></div>`).join('')}
            </div>
          </div>
          <div style="width:160mm;max-width:320px">
            <h3 style="margin:0 0 6px 0">Derived & Resources</h3>
            <div style="font-size:12px">PHYS: ${character.derivedStats.PHYS} • KNOW: ${character.derivedStats.KNOW} • FLUX: ${character.derivedStats.FLUX}</div>
            <div style="margin-top:8px;font-size:12px">Credits: ${character.credits || 0}c • UNI: ${(character.credits || 0) * 10}n • Fear: ${character.fear || 0} • Reputation: ${character.reputation || 0}</div>
          </div>
        </section>

        <section>
          <h3 style="margin:0 0 6px 0">Summary</h3>
          <div style="font-size:11px;color:#333;line-height:1.3">
            ${escapeHtml(character.summary || '')}
          </div>
        </section>
      </div>
    `;
    pages.push(p1);

    // Page 2: Skills Grid (grouped)
    // Build simple grids from character.skills object
    const skillCategories = {
      "STRENGTH": ["Unarmed Combat","Blade, 1-H","Blade, 2-H","Club, 1-H","Club, 2-H","Chainaxe","Flexible Weapon","Pole-arm"],
      "DEXTERITY": ["Martial Arts","Gymnastics","Forgery, Manual","Sleight","Sneaking","Hide","Pistol","Rifle","Drive, Motorcycle"],
      "PHYSIQUE": ["Wrestling","Acrobatics","Running","Climb","Swim","Auto/Support","Throw"],
      "CHARISMA": ["Leadership","Seduction","Disguise","Interview","Diplomacy","Communique","Haggle","Persuasion"],
      "DIAGNOSE": ["Computer Use","Electronics, Industrial","Mechanics, Industrial","Demolitions","Medical, Paramedic","Tactics","Tracking","Bribery","Torture","Lock Picking","Electronic Locks","Business Administration","Forensics","Pathology","Read Lips","Intimidation"],
      "CONCENTRATION": ["Weapons Maintenance","Drive, Civilian","Drive, Military","Detect","Medical, Surgery","Marksman","Business Finance","Photography"],
      "KNOWLEDGE": ["Computer, Subterfuge","Electronics, Repair","Mechanics, Repair","Demolitions Disposal","Survival","Medical, Practice","Streetwise","Evaluate Opponent","Literacy","SLA Information","Psychology","Astronomy","Pilot, Military","Navigation","Space Navigation"],
      "SECONDARY-SPECIAL INTEREST- HOBBY SKILLS": ["Gambling","Ecology","Cooking","Agriculture","History","Dance","Artistic Ability","Music - general","Sewing","Archaeology","Physiography","Cinematography","Theatre","Languages: Killan","Languages: Wraith","Languages: Shaktarian","Languages: Sign Language","Languages: New Parisian","Sports: Various","Architecture","Physiology","Palaeography","Botany","Zoology","Mathematics","Video Games","Sing","Play Instrument"]
    };

    const buildSkillsHtml = () => {
      let html = '';
      for (const cat in skillCategories) {
        const items = skillCategories[cat];
        const entries = items.map(name => {
          const rank = character.skills[name] || 0;
          return rank > 0
            ? `<div style="display:flex;justify-content:space-between;padding:2px 0"><span>${escapeHtml(name)}</span><span>${formatStatBar(rank, Math.max(10, rank))}</span></div>`
            : '';
        }).filter(Boolean);
        if (entries.length === 0) continue;
        html += `<div style="margin-bottom:8px"><strong>${escapeHtml(cat)}</strong><div style="font-size:11px;margin-top:4px">` + entries.join('') + `</div></div>`;
      }
      return html;
    };

    const p2 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Skills</h2>
        <div style="font-size:11px;line-height:1.25">${buildSkillsHtml()}</div>
      </div>
    `;
    pages.push(p2);

    // Page 3: Equipment & Advantages
    const equipmentHtml = (() => {
      const eq = (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : {};
      const counts = character._purchasedEquipmentCounts || {};
      const singles = character._purchasedEquipment || {};
      const names = new Set([...Object.keys(counts || {}), ...Object.keys(singles || {})]);

      if (names.size === 0) return '<div style="color:#666">No purchased equipment</div>';

      function findItem(name) {
        let item = (eq.ammunitions || []).find(a => a.calibre === name);
        if (item) return { category: 'Ammunition', item };
        item = (eq.specialisedAmmunition || []).find(a => a.type === name);
        if (item) return { category: 'Special Ammo', item };
        item = (eq.grenades || []).find(g => g.type === name);
        if (item) return { category: 'Grenade', item };
        item = (eq.armour || []).find(a => a.name === name);
        if (item) return { category: 'Armour', item };
        item = (eq.vehicles || []).find(v => v.name === name);
        if (item) return { category: 'Vehicle', item };
        if (typeof HARDWARE !== 'undefined' && HARDWARE[name]) return { category: 'Hardware', item: HARDWARE[name] };
        return null;
      }

      const rows = [];
      for (const name of names) {
        const qty = counts[name] || (singles[name] ? 1 : 0);
        const found = findItem(name);
        if (!found) {
          rows.push({ name, category: 'Unknown', func: '', cost: '' });
          continue;
        }
        const { category, item } = found;
        let func = '';
        const unitCost = item.cost || item.price || item.blackmarket || item.std || '';
        if (category === 'Ammunition') {
          func = `STD: ${item.std || '-'}; AP: ${item.ap || '-'}; HP: ${item.hp || '-'}; HEAP: ${item.heap || '-'}; HESH: ${item.hesh || '-'}`;
        } else if (category === 'Special Ammo') {
          func = `DMG: ${item.dmg == null ? '-' : String(item.dmg)}; PEN: ${item.pen == null ? '-' : String(item.pen)}; ARM: ${item.arm == null ? '-' : String(item.arm)}; ${item.dmgNote || ''}`;
        } else if (category === 'Grenade') {
          func = `Blast: ${item.blast == null ? '-' : String(item.blast)}; PEN: ${item.pen == null ? '-' : String(item.pen)}; W: ${item.weight || '-'}`;
        } else if (category === 'Armour') {
          func = `PV: ${item.pv || '-'}; Head: ${item.head == null ? '-' : String(item.head)}; Torso: ${item.torso == null ? '-' : String(item.torso)}; Arms: ${item.arms == null ? '-' : String(item.arms)}; Legs: ${item.legs == null ? '-' : String(item.legs)}; ${item.modifiers || ''}`;
        } else if (category === 'Vehicle') {
          func = `${item.type || ''}; Speed: ${item.speed || '-'}; Skill: ${item.skill || '-'}; P.V./I.D.: ${item.pv_id || '-'}; Crew: ${item.crew || '-'}`;
        } else if (category === 'Hardware') {
          func = item.description || item.desc || '';
        }
        const costDisplay = unitCost ? `${unitCost}${qty > 1 ? ' ×' + qty : ''}` : (singles[name] ? 'Purchased' : '');
        rows.push({ name, category, func, cost: costDisplay });
      }

      let table = `<table style="width:100%;border-collapse:collapse;font-size:11px">`;
      table += `<thead><tr>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Item</th>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Category</th>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Function / Stats</th>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Cost</th>
      </tr></thead><tbody>`;
      for (const r of rows) {
        table += `<tr>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0"><strong>${escapeHtml(r.name)}</strong></td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.category)}</td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.func)}</td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.cost)}</td>
        </tr>`;
      }
      table += `</tbody></table>`;
      return table;
    })();
    const advantagesHtml = Object.keys(character.advantages || {}).length ? Object.entries(character.advantages).map(([k,v]) => `<div><strong>${escapeHtml(k)}</strong> (Rank ${v})</div>`).join('') : '<div style="color:#666">None</div>';
    const disadvantagesHtml = Object.keys(character.disadvantages || {}).length ? Object.entries(character.disadvantages).map(([k,v]) => `<div><strong>${escapeHtml(k)}</strong> (Rank ${v})</div>`).join('') : '<div style="color:#666">None</div>';

    const p3 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Equipment & Advantages</h2>
        <section style="margin-bottom:8px"><h4 style="margin:0 0 6px 0">Weapons / Gear</h4>${equipmentHtml}</section>
        <section style="margin-bottom:8px"><h4 style="margin:0 0 6px 0">Advantages</h4>${advantagesHtml}</section>
        <section><h4 style="margin:0 0 6px 0">Disadvantages</h4>${disadvantagesHtml}</section>
      </div>
    `;
    pages.push(p3);

    // Page 4: Drugs & Chemical Effects (map drugInventory -> DRUGS metadata)
    function findDrugByName(name) {
      for (const catKey in DRUGS) {
        const cat = DRUGS[catKey];
        for (const d of cat.drugs) {
          if (d.name === name) return { ...d, categoryName: cat.name, categoryKey: catKey };
        }
      }
      return null;
    }

    const drugEntries = Object.entries(character.drugInventory || {});
    const drugsHtml = drugEntries.length
      ? drugEntries.map(([drugName, qty]) => {
          const meta = findDrugByName(drugName);
          if (!meta) {
            return `<div style="margin-bottom:6px"><strong>${escapeHtml(drugName)}</strong> x${qty} <div style="font-size:11px;color:#444">No metadata available</div></div>`;
          }

          // Build concise effects summary
          const effectsArr = [];
          if (meta.effects) {
            if (Array.isArray(meta.effects.other_effects) && meta.effects.other_effects.length) effectsArr.push(...meta.effects.other_effects);
            if (meta.effects.game) effectsArr.push(meta.effects.game);
            if (Array.isArray(meta.effects.stat_modifiers)) meta.effects.stat_modifiers.forEach(m => effectsArr.push((m.delta || '') + ' ' + (m.stat || '') + (m.duration_hours ? ' (' + m.duration_hours + 'h)' : '')));
            if (Array.isArray(meta.effects.skill_modifiers)) meta.effects.skill_modifiers.forEach(m => effectsArr.push((m.delta || '') + ' ' + (m.skill || '') + (m.duration_minutes ? ' (' + m.duration_minutes + 'm)' : '')));
          }
          const effects = effectsArr.join('; ') || 'None';

          // Detox / side effects
          let detoxText = 'None';
          if (meta.detox) {
            if (typeof meta.detox === 'string') detoxText = meta.detox;
            else if (meta.detox.effects) detoxText = meta.detox.effects;
            else detoxText = JSON.stringify(meta.detox);
          }

          // Addiction summary
          const addictionParts = [];
          if (meta.addiction) {
            if (meta.addiction.rate) addictionParts.push(`Rate: ${meta.addiction.rate}`);
            if (meta.addiction.effects) addictionParts.push(meta.addiction.effects);
            else if (meta.addiction.failure_effect) addictionParts.push(meta.addiction.failure_effect);
          }
          const addictionText = addictionParts.length ? addictionParts.join(' • ') : 'None';

          const costText = (typeof meta.cost === 'number') ? `${meta.cost} cr` : (meta.cost ? String(meta.cost) : 'Unknown');
          const availText = meta.availability || meta.legal_status || 'Unknown';
          const notes = meta.notes || '';

          return `<div style="margin-bottom:8px">
                    <div style="font-weight:600">${escapeHtml(meta.name)} <span style="font-weight:400">x${qty}</span></div>
                    <div style="font-size:11px;color:#444;margin-top:4px">${escapeHtml(effects)}</div>
                    <div style="font-size:11px;color:#444;margin-top:4px"><strong>Cost:</strong> ${escapeHtml(costText)} • <strong>Availability:</strong> ${escapeHtml(availText)} • <strong>Category:</strong> ${escapeHtml(meta.categoryName || meta.category || '')}</div>
                    <div style="font-size:11px;color:#666;margin-top:4px"><em>Detox:</em> ${escapeHtml(detoxText)}</div>
                    <div style="font-size:11px;color:#666;margin-top:4px"><em>Addiction:</em> ${escapeHtml(addictionText)}</div>
                    ${notes ? `<div style="font-size:11px;color:#555;margin-top:4px">${escapeHtml(notes)}</div>` : ''}
                  </div>`;
        }).join('')
      : '<div style="color:#666">No drugs selected</div>';

    const p_drugs = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Drugs & Chemical Effects</h2>
        <div style="font-size:11px">${drugsHtml}</div>
      </div>
    `;
    pages.push(p_drugs);

    // Page: Ebon / Flux Abilities (detailed ranks)
    const buildEbonHtml = () => {
      if (!EBON_ABILITIES) return '<div style="color:#666">Ebon ability data not available.</div>';
      const ranks = character.ebonRanks || {};
      const isNecanthrope = (typeof character.isNecanthrope === 'function') ? !!character.isNecanthrope() : (character.class && String(character.class).toLowerCase().includes('necanthrope'));
      const rows = [];
      for (const key of Object.keys(EBON_ABILITIES)) {
        const cat = EBON_ABILITIES[key];
        if (!cat) continue;
        const selRank = Number(ranks[key] || 0);

        // Only include selected categories in the PDF
        if (!selRank || selRank <= 0) continue;

        // Build details for every rank up to current rank
        const detailsParts = [];
        for (let i = 0; i < Math.min(selRank, (cat.ranks || []).length); i++) {
          const rr = cat.ranks[i];
          if (!rr) continue;
          const pieces = [];
          if (rr.title) pieces.push(rr.title);
          if (typeof rr.dmg !== 'undefined') pieces.push(`DMG: ${rr.dmg}`);
          if (typeof rr.armDmg !== 'undefined') pieces.push(`ARM DMG: ${rr.armDmg}`);
          if (typeof rr.pen !== 'undefined') pieces.push(`PEN: ${rr.pen}`);
          if (rr.range) pieces.push(`Range: ${rr.range}`);
          if (rr.blastRadius) pieces.push(`Blast Radius: ${rr.blastRadius}`);
          if (rr.notes) pieces.push(rr.notes);
          detailsParts.push(`${i + 1}. ${pieces.join(' • ')}`);
        }
        const detailsHtml = detailsParts.length ? detailsParts.join('<br/>') : '—';

        const fluxCost = (typeof computeCumulativeCost === 'function') ? computeCumulativeCost(key, selRank) : 0;
        const pointCost = selRank > 0 ? (selRank * (selRank + 1)) / 2 : 0;
        const purchaseNote = (cat.necanthropeOnly && !isNecanthrope) ? ' (Necanthrope only)' : '';

        rows.push({
          name: cat.name + purchaseNote,
          rank: String(selRank),
          summaryHtml: detailsHtml,
          points: pointCost || 0,
          flux: (fluxCost || (selRank > 0 && fluxCost === 0 ? 'See notes' : 0))
        });
      }

      if (rows.length === 0) return '<div style="color:#666">No Ebon abilities available.</div>';

      let table = `<table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Ability</th>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd;width:56px">Rank</th>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd">Rank Details</th>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd;width:80px">Points</th>
          <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd;width:80px">FLUX</th>
        </tr></thead><tbody>`;
      for (const r of rows) {
        table += `<tr>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0"><strong>${escapeHtml(r.name)}</strong></td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(r.rank)}</td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${r.summaryHtml ? r.summaryHtml : escapeHtml(r.summary || '')}</td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(String(r.points))}</td>
          <td style="padding:6px;border-bottom:1px solid #f0f0f0">${escapeHtml(String(r.flux))}</td>
        </tr>`;
      }
      table += `</tbody></table>`;
      return table;
    };

    const p4 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Ebon / Flux Abilities</h2>
        <div style="font-size:11px">${buildEbonHtml()}</div>
      </div>
    `;
    pages.push(p4);

    // Page 5: Phobias & Trauma
    const phobiasHtml = (character.phobias || []).length ? (character.phobias || []).map(p => `<div style="margin-bottom:8px"><strong>${escapeHtml(p.name)}</strong> (Rank ${p.rank})<div style="font-size:11px;color:#444">${escapeHtml(p.trigger || '')}</div></div>`).join('') : '<div style="color:#666">None</div>';
    const p5 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Phobias & Trauma</h2>
        <div style="font-size:11px">${phobiasHtml}</div>
      </div>
    `;
    pages.push(p5);

    // Page 6: Combat Reference & Notes
    const combatHtml = `
      <div style="margin-bottom:8px"><strong>Initiative (DEX):</strong> ${character.stats.DEX || 0}</div>
      <div style="margin-bottom:8px"><strong>Base Target:</strong> 11+</div>
      <div style="margin-bottom:8px"><strong>Damage Calculation:</strong> Melee: [Weapon] + STR/3</div>
      <div style="margin-top:12px"><strong>Notes</strong><div style="min-height:80px;border:1px dashed #ddd;margin-top:6px;padding:6px"></div></div>
    `;
    const p6 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Combat Reference & Notes</h2>
        <div style="font-size:11px">${combatHtml}</div>
      </div>
    `;
    pages.push(p6);

    return pages;
  }

  async function generatePdf() {
    if (!window.currentCharacter) {
      alert('No character loaded to export.');
      return;
    }
    const pages = buildPages(window.currentCharacter);

    // Resolve jsPDF constructor
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
        // Use html2canvas per page at scale 2 for decent DPI
        const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfPageWidth, pdfPageHeight);

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

  // Attach to button when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('downloadPdfBtn');
    if (btn) btn.addEventListener('click', generatePdf);
  });

  window.generateCharacterPdf = generatePdf;
})();
