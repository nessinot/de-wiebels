// Hoofdmenu: links de eigen Wiebel in zijn venster, rechts de werelden (elke vaardigheid is een
// wereld), onderin het winkeltje, de verzameling, de tijdrace en het thema. Kies je een wereld, dan
// vliegt de Wiebel erheen en zoomt het beeld in op de levelkeuze.

import { maakEl, opKlik } from '../dom.js';
import { VAARDIGHEDEN, LEVELS, ONDERTITELS, levelOpen } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { UITSNEDE, VENSTER_HTML, maakVenster } from '../venster.js';
import { eigenWiebelStaat, topbalk } from '../weergave.js';
import { blij, rustig, zwaai } from '../wiebel-beweging.js';

export const wereldkaart = {
  maak({ toon, zetFocus }) {
    const el = maakEl();
    el.classList.add('hoofdmenu');
    let venster;
    let onderweg = false;

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      onderweg = false;
      // De werelden staan vooraan, zodat de focus bij binnenkomst op een wereld begint.
      el.innerHTML = `
        <div class="decor">${t.decor.map((d, i) => `<span class="decor-${i}">${d}</span>`).join('')}</div>
        ${topbalk(p)}
        <div class="werelden">
          ${VAARDIGHEDEN.map((v, i) => {
            const open = LEVELS[v].some((l) => levelOpen(p, l));
            return `
              <button class="knop wereldknop wereld-${i}" data-focus data-actie="wereld" data-waarde="${v}" ${open ? '' : 'disabled'}>
                <span class="wereld-emoji">${open ? t.werelden[v].emoji : '🔒'}</span>
                <span class="wereld-naam">${t.werelden[v].naam}</span>
                <span class="wereld-ondertitel">${ONDERTITELS[v]}</span>
              </button>`;
          }).join('')}
        </div>
        <button class="knop venster menu-venster" data-focus data-actie="wiebel" aria-label="Jouw Wiebel">${VENSTER_HTML}</button>
        <button class="knop aanpassen-knop" data-focus data-actie="scherm" data-waarde="aanpassen">✏️ Aanpassen</button>
        <div class="knoppenrij onderbalk">
          <button class="knop" data-focus data-actie="scherm" data-waarde="winkel">🛒 Winkeltje</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="collectie">🎒 Wiebels</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="tijdraceKeuze">⏱️ Tijdrace</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="themakeuze">🎨 Thema</button>
        </div>
        <div class="zoom" hidden></div>
      `;
      venster = maakVenster(el.querySelector('.venster-binnen'), 'menu', { uitsnede: UITSNEDE.menu, blijftStaan: true });
      venster.teken(eigenWiebelStaat(p));
      venster.zeg('menuWelkom');
    }

    // De Wiebel vliegt naar de wereld: een kopie op precies de plek van de Wiebel (via
    // getScreenCTM, dus zonder pet of ballon in de maat), het origineel verdwijnt meteen. Daarna
    // zoomt het beeld in en volgt de levelkeuze.
    function vlieg(v) {
      if (onderweg) return;
      // Na het inzoomen geen tweede overgang.
      const naarLevels = () => toon('levelkeuze', { vaardigheid: v }, { overgang: false });
      if (rustig()) return naarLevels();
      onderweg = true;
      const t = thema(staat.profiel.thema);
      const knop = el.querySelector(`.wereldknop[data-waarde="${v}"]`);
      const w = venster.wiebel();
      venster.zeg('wereldGekozen');

      const basis = el.getBoundingClientRect();
      const schaal = basis.width / 1920;
      const ctm = w.ownerSVGElement.getScreenCTM();
      const van = {
        x: (ctm.e + ctm.a * Number(w.getAttribute('x')) - basis.left) / schaal,
        y: (ctm.f + ctm.d * Number(w.getAttribute('y')) - basis.top) / schaal,
        b: (ctm.a * 240) / schaal,
        h: (ctm.d * 260) / schaal,
      };
      const doel = knop.querySelector('.wereld-emoji').getBoundingClientRect();
      const naar = {
        x: (doel.left - basis.left + doel.width / 2) / schaal,
        y: (doel.top - basis.top + doel.height / 2) / schaal,
      };

      const kloon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      kloon.setAttribute('viewBox', '0 0 240 260');
      kloon.classList.add('vlieger');
      Object.assign(kloon.style, { left: `${van.x}px`, top: `${van.y}px`, width: `${van.b}px`, height: `${van.h}px` });
      const kopie = w.cloneNode(true);
      kopie.setAttribute('x', 0);
      kopie.setAttribute('y', 0);
      kopie.dataset.ogen = 'blij';
      kloon.append(kopie);
      el.append(kloon);
      w.style.visibility = 'hidden';

      const dx = naar.x - (van.x + van.b / 2);
      const dy = naar.y - (van.y + van.h / 2);
      kloon.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
        { transform: 'translate(0, 20px) scale(1.06, .9) rotate(0deg)', offset: 0.12 },
        { transform: `translate(${dx * 0.45}px, ${dy - 260}px) scale(.8) rotate(-12deg)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(.3) rotate(8deg)`, opacity: 1, offset: 0.92 },
        { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(8deg)`, opacity: 0 },
      ], { duration: 1200, delay: 400, easing: 'ease-in-out', fill: 'backwards' }).onfinish = () => {
        kloon.remove();
        knop.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 400 });
        const zoom = el.querySelector('.zoom');
        zoom.innerHTML = `
          <span class="zoom-inhoud">
            <span class="zoom-emoji">${t.werelden[v].emoji}</span>
            <span class="zoom-naam">${t.werelden[v].naam}</span>
            <span class="zoom-ondertitel">${ONDERTITELS[v]}</span>
          </span>`;
        zoom.hidden = false;
        // Inzoomen vanaf de wereld: het beeld groeit vanuit het midden van de wereldknop.
        zoom.style.transformOrigin = `${naar.x}px ${naar.y}px`;
        zoom.animate([{ opacity: 0, transform: 'scale(.15)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 650, easing: 'ease-out' })
          .onfinish = () => setTimeout(naarLevels, 350);
      };
    }

    opKlik(el, {
      wereld: (v) => vlieg(v),
      scherm: (naam) => !onderweg && toon(naam),
      wiebel() {
        if (onderweg) return;
        blij(venster.wiebel());
        venster.zeg('aangewezen');
      },
    });

    teken();
    return {
      el,
      // Opnieuw tekenen (munten, spullen), met de focus op dezelfde knop als daarvoor.
      bijTerugkomst() {
        const vorige = el.querySelector('.heeft-focus');
        const zoek = vorige && `[data-actie="${vorige.dataset.actie}"]${vorige.dataset.waarde ? `[data-waarde="${vorige.dataset.waarde}"]` : ''}`;
        teken();
        if (zoek) zetFocus(el.querySelector(zoek));
      },
      // Tijdens het vliegen gaan de toetsen nergens heen.
      bijToets: () => onderweg,
      // Aanwijzen (pijltjes of Magic Remote): de Wiebel zwaait en zegt iets.
      bijFocus(doel) {
        if (onderweg || !doel.classList.contains('menu-venster')) return;
        zwaai(venster.wiebel());
        venster.zeg('aangewezen');
      },
    };
  },
};
