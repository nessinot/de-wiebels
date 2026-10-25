// Levels binnen een wereld, met sterren en de eindbaas.

import { maakEl, opKlik } from '../dom.js';
import { LEVELS, ONDERTITELS, levelOpen, baasOpen } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { sterrenHtml, topbalk } from '../weergave.js';

export const levelkeuze = {
  maak({ toon, terug, gegevens }) {
    const el = maakEl();
    const v = gegevens.vaardigheid;

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      const baas = t.eindbazen[v];
      const baasIsOpen = baasOpen(p, v);
      el.innerHTML = `
        ${themaAchtergrond(p.thema, v, 'ab-level')}
        ${topbalk(p)}
        <div class="kopregel">
          <button class="knop" data-focus data-actie="terug">← Terug</button>
          <h1>${t.werelden[v].emoji} ${t.werelden[v].naam}<span class="kop-ondertitel">${ONDERTITELS[v]}</span></h1>
        </div>
        <div class="levels">
          ${LEVELS[v].map((l) => {
            const open = levelOpen(p, l);
            return `
              <button class="knop levelknop" data-focus data-actie="level" data-waarde="${l.id}" ${open ? '' : 'disabled'}>
                <span>${open ? '' : '🔒 '}${l.label}</span>
                ${sterrenHtml(p.sterren[l.id] || 0)}
              </button>`;
          }).join('')}
          <button class="knop levelknop baasknop" data-focus data-actie="baas" ${baasIsOpen ? '' : 'disabled'}>
            <span>${baasIsOpen ? baas.emoji : '🔒'} ${baas.naam}</span>
            <span class="klein">${baasIsOpen ? 'Eindbaas!' : 'Haal in elk level een ster'}</span>
          </button>
        </div>
      `;
    }

    opKlik(el, {
      terug: () => terug(),
      level: (id) => toon('ronde', { levelId: id }),
      baas: () => toon('eindbaas', { vaardigheid: v }),
    });

    teken();
    return { el, bijTerugkomst: teken };
  },
};
