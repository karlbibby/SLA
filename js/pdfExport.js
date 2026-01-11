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
            <div style="margin-top:8px;font-size:12px">Credits: ${character.totalPoints || 0} Uni • Fear: ${character.fear || 0 || 0} • Reputation: ${character.reputation || 0 || 0}</div>
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
      const sel = character.selectedEquipment || [];
      const eq = (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : {};
      if (!sel || !sel.length) return '<div style="color:#666">No equipment selected</div>';
      const parts = [];
      for (const nameRaw of sel) {
        const name = String(nameRaw || '').trim();
        if (!name) continue;

        // Ammunition (by calibre)
        let item = (eq.ammunitions || []).find(a => a.calibre === name);
        if (item) {
          parts.push(`<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(item.calibre)}</div><div style="font-size:11px;color:#444">STD: ${escapeHtml(item.std || '-')} • AP: ${escapeHtml(item.ap || '-')} • HP: ${escapeHtml(item.hp || '-')} • HEAP: ${escapeHtml(item.heap || '-')} • HESH: ${escapeHtml(item.hesh || '-')}</div></div>`);
          continue;
        }

        // Specialised ammunition
        item = (eq.specialisedAmmunition || []).find(a => a.type === name);
        if (item) {
          parts.push(`<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(item.type)}</div><div style="font-size:11px;color:#444">DMG: ${escapeHtml(String(item.dmg || '-'))} • PEN: ${escapeHtml(item.pen == null ? '-' : String(item.pen))} • ARM: ${escapeHtml(String(item.arm || '-'))} • COST: ${escapeHtml(item.cost || '')}</div></div>`);
          continue;
        }

        // Grenades
        item = (eq.grenades || []).find(g => g.type === name);
        if (item) {
          parts.push(`<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(item.type)}</div><div style="font-size:11px;color:#444">Blast: ${escapeHtml(item.blast == null ? '-' : String(item.blast))} • PEN: ${escapeHtml(item.pen == null ? '-' : String(item.pen))} • Weight: ${escapeHtml(item.weight || '-')}</div></div>`);
          continue;
        }

        // Armour
        item = (eq.armour || []).find(a => a.name === name);
        if (item) {
          parts.push(`<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(item.name)}</div><div style="font-size:11px;color:#444">PV: ${escapeHtml(String(item.pv || '-'))} • Head: ${escapeHtml(item.head == null ? '-' : String(item.head))} • Torso: ${escapeHtml(item.torso == null ? '-' : String(item.torso))} • Arms: ${escapeHtml(item.arms == null ? '-' : String(item.arms))} • Legs: ${escapeHtml(item.legs == null ? '-' : String(item.legs))} • Modifiers: ${escapeHtml(item.modifiers || '')}</div></div>`);
          continue;
        }

        // Vehicles
        item = (eq.vehicles || []).find(v => v.name === name);
        if (item) {
          parts.push(`<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(item.name)}</div><div style="font-size:11px;color:#444">${escapeHtml(item.type || '')} • Speed: ${escapeHtml(item.speed || '-') } • Skill: ${escapeHtml(item.skill || '-')} • Cost: ${escapeHtml(item.cost || '-')} • P.V./I.D.: ${escapeHtml(item.pv_id || '-')} • Crew: ${escapeHtml(item.crew || '-')}</div></div>`);
          continue;
        }

        // Fallback: raw string
        parts.push(`<div style="margin-bottom:6px"><strong>${escapeHtml(name)}</strong></div>`);
      }
      return parts.join('');
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

    // Page 4: Ebon Abilities (if any)
    const ebonAbilitiesHtml = (character.ebonAbilities || []).length ? (character.ebonAbilities || []).map(ab => `<div style="margin-bottom:6px"><strong>${escapeHtml(ab)}</strong></div>`).join('') : '<div style="color:#666">No Ebon abilities or not an Ebon/Brain Waster</div>';
    const p4 = `
      <div class="print-page" style="width:210mm;height:297mm;box-sizing:border-box;padding:12mm;background:#fff;color:#111;font-family:Helvetica, Arial, sans-serif;">
        <h2 style="margin:0 0 8px 0">Ebon / Flux Abilities</h2>
        <div style="font-size:11px">${ebonAbilitiesHtml}</div>
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
