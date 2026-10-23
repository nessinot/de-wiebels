// Verzameling van Wiebels en het eigen huisdier.

import { maakEl, opKlik } from '../dom.js';
import { HUISDIER_GRENZEN, huisdierStadium, totVolgendStadium, wiebelVoor } from '../beloningen.js';
import { BELONINGEN } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { huisdierHtml } from '../weergave.js';

export const collectie = {
  maak({ terug }) {
    const p = staat.profiel;
    const t = thema(p.thema);
    const stadium = huisdierStadium(p.huisdier.xp);
    const nog = totVolgendStadium(p.huisdier.xp);
    const vorige = HUISDIER_GRENZEN[stadium];
    const deel = nog === null ? 1 : (p.huisdier.xp - vorige) / (p.huisdier.xp - vorige + nog);

    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Verzameling</h1>
        <span class="teller">${p.verzameling.length} / ${BELONINGEN.length}</span>
      </div>
      <div class="collectie-indeling">
        <div class="huisdier-paneel">
          ${huisdierHtml(p, t)}
          <strong>${t.huisdier[stadium].naam}</strong>
          <div class="levensbalk groeibalk"><div style="transform: scaleX(${deel})"></div></div>
          <span class="klein">${nog === null ? 'Helemaal volgroeid!' : `Nog ${nog} goede antwoorden tot de volgende stap`}</span>
        </div>
        <div class="wiebels">
          ${BELONINGEN.map((id) => {
            if (!p.verzameling.includes(id)) return '<span class="wiebel onbekend">?</span>';
            const w = wiebelVoor(id, t);
            return `<span class="wiebel" title="${w.naam}"><span style="filter: ${w.filter}">${w.emoji}</span></span>`;
          }).join('')}
        </div>
      </div>
    `);
    opKlik(el, { terug: () => terug() });
    return { el };
  },
};
