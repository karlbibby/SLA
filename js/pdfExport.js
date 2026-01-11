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
      "Combat Skills": ["Melee","Pistol","Rifle","Shotgun","Heavy Weapons","Auto/Support","Marksman","Dodge/Parry"],
      "Survival Skills": ["Running","Climbing","Jumping","Swimming","Falling","Sneaking/Hide"],
      "Knowledge Skills": ["Elint","SLA Info","Streetwise","Interrogation","Science","Medicine","Hacking","Engineering","Psychology","Languages"],
      "Social Skills": ["Charisma","Flattery","Persuasion","Intimidation","Trading"],
      "Perception Skills": ["Detect","Sense Ambush","Sight"],
      "Technical Skills": ["Pilot","Drive","Gunnery","Demolitions","Lockpicking"]
    };

    const buildSkillsHtml = () => {
      let html = '';
      for (const cat in skillCategories) {
        html += `<div style="margin-bottom:8px"><strong>${cat}</strong><div style="font-size:11px;margin-top:4px">`;
        const items = skillCategories[cat];
        items.forEach(name => {
          const rank = character.skills[name] || 0;
          html += `<div style="display:flex;justify-content:space-between;padding:2px 0"><span>${name}</span><span>${formatStatBar(rank, Math.max(10, rank))}</span></div>`;
        });
        html += `</div></div>`;
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
    const equipmentHtml = (character.selectedEquipment || []).map(it => `<div style="margin-bottom:6px"><strong>${escapeHtml(it)}</strong></div>`).join('') || '<div style="color:#666">No equipment selected</div>';
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
          const effects = (meta.effects && meta.effects.other_effects) ? meta.effects.other_effects.join('; ') : '';
          const side = meta.side_effects ? JSON.stringify(meta.side_effects) : '';
          return `<div style="margin-bottom:8px">
                    <div style="font-weight:600">${escapeHtml(meta.name)} <span style="font-weight:400">x${qty}</span></div>
                    <div style="font-size:11px;color:#444;margin-top:4px">${escapeHtml(effects)}</div>
                    <div style="font-size:11px;color:#666;margin-top:4px"><em>Side effects:</em> ${escapeHtml(side)}</div>
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
