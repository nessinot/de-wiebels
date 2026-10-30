// Levels binnen een wereld, met sterren en de eindbaas. Op de hoek van de eindbaas zit zijn Wiebel
// in de bel (ook als de eindbaas op slot zit); na het verslaan staat hij er vrij.

import { belHtml } from '../bel.js';
import { wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { LEVELS, ONDERTITELS, levelOpen, baasOpen } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { sterrenHtml, topbalk, vriendjeHtml } from '../weergave.js';

export const levelkeuze = {
  maak({ toon, terug, gegevens }) {
    const el = maakEl();
    const v = gegevens.vaardigheid;

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      const baas = t.eindbazen[v];
      const baasIsOpen = baasOpen(p, v);
      const baasWiebel = wiebelVoor(`baas:${v}`, t);
      const verslagen = p.verzameling.includes(`baas:${v}`);
      // Eén regeltje in de knop: op slot wat je moet doen, open wie je bevrijdt, verslagen "Eindbaas!".
      let regel = 'Eindbaas!';
      if (!baasIsOpen) regel = 'Haal in elk level een ster';
      else if (!verslagen) regel = `Bevrijd ${baasWiebel.naam}!`;
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
          <div class="baasplek">
            <button class="knop levelknop baasknop" data-focus data-actie="baas" ${baasIsOpen ? '' : 'disabled'}>
              <span>${baasIsOpen ? baas.emoji : '🔒'} ${baas.naam}</span>
              <span class="klein">${regel}</span>
            </button>
            <div class="baas-hoek">${verslagen ? vriendjeHtml(baasWiebel, `baasknop-${v}`, 'stil') : belHtml(baasWiebel, `baasknop-${v}`)}</div>
          </div>
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
