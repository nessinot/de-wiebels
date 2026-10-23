// Wereldkaart: elke vaardigheid is een wereld.

import { maakEl, opKlik } from '../dom.js';
import { VAARDIGHEDEN, LEVELS, levelOpen } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { topbalk } from '../weergave.js';

export const wereldkaart = {
  maak({ toon }) {
    const el = maakEl();

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      el.innerHTML = `
        <div class="decor">${t.decor.map((d, i) => `<span class="decor-${i}">${d}</span>`).join('')}</div>
        ${topbalk(p)}
        <div class="werelden">
          ${VAARDIGHEDEN.map((v, i) => {
            const open = LEVELS[v].some((l) => levelOpen(p, l));
            return `
              <button class="knop wereldknop wereld-${i}" data-focus data-actie="wereld" data-waarde="${v}" ${open ? '' : 'disabled'}>
                <span class="wereld-emoji">${open ? t.werelden[v].emoji : '🔒'}</span>
                <span>${t.werelden[v].naam}</span>
              </button>`;
          }).join('')}
        </div>
        <div class="knoppenrij onderbalk">
          <button class="knop" data-focus data-actie="scherm" data-waarde="collectie">🎒 Verzameling</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="winkel">🛒 Winkeltje</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="tijdraceKeuze">⏱️ Tijdrace</button>
          <button class="knop" data-focus data-actie="scherm" data-waarde="themakeuze">🎨 Thema</button>
        </div>
      `;
    }

    opKlik(el, {
      wereld: (v) => toon('levelkeuze', { vaardigheid: v }),
      scherm: (naam) => toon(naam),
    });

    teken();
    return { el, bijTerugkomst: teken };
  },
};
