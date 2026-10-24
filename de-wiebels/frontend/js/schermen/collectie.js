// De bevrijde Wiebels en de eigen Wiebel met zijn groei. Bovenin lopen de laatst bevrijde Wiebels
// rond (hooguit LOPERS tegelijk, om de tv te sparen); daaronder staan alle Wiebels stil, en wie nog
// gevangen zit, staat er als donker silhouet.

import { maakEl, opKlik } from '../dom.js';
import { HUISDIER_GRENZEN, huisdierStadium, totVolgendStadium, wiebelVoor } from '../beloningen.js';
import { BELONINGEN } from '../levels.js';
import { staat } from '../opslag.js';
import { rng } from '../scene.js';
import { thema } from '../themas/index.js';
import { eigenWiebelHtml, vriendjeHtml } from '../weergave.js';
import { STADIUM_NAMEN } from '../wiebel.js';

const LOPERS = 6;
const WEI_BREEDTE = 1236;
const LOPER_MAAT = 170;

// Elke loper heeft een eigen stuk van de wei en loopt daar heen en weer (alleen transform).
function lopersHtml(bevrijd, t) {
  const r = rng(bevrijd.length);
  const ruimte = WEI_BREEDTE - LOPER_MAAT;
  const lopers = bevrijd.slice(-LOPERS);
  return lopers.map((id, i) => {
    const midden = ((i + 0.5) * ruimte) / lopers.length;
    const stuk = 110 + r() * 110;
    const van = Math.max(0, midden - stuk);
    const naar = Math.min(ruimte, midden + stuk);
    const duur = 7 + r() * 5;
    return `<div class="loper" style="--van:${van.toFixed(0)}px;--naar:${naar.toFixed(0)}px;animation-duration:${duur.toFixed(1)}s;animation-delay:-${(r() * duur).toFixed(1)}s">
      ${vriendjeHtml(wiebelVoor(id, t), `loper-${i}`)}
    </div>`;
  }).join('');
}

export const collectie = {
  maak({ terug }) {
    const p = staat.profiel;
    const t = thema(p.thema);
    const stadium = huisdierStadium(p.huisdier.xp);
    const nog = totVolgendStadium(p.huisdier.xp);
    const vorige = HUISDIER_GRENZEN[stadium];
    const deel = nog === null ? 1 : (p.huisdier.xp - vorige) / (p.huisdier.xp - vorige + nog);
    const bevrijd = p.verzameling.filter((id) => BELONINGEN.includes(id));

    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Bevrijde Wiebels</h1>
        <span class="teller">${bevrijd.length} / ${BELONINGEN.length}</span>
      </div>
      <div class="collectie-indeling">
        <div class="huisdier-paneel">
          ${eigenWiebelHtml(p, 'verzameling', { schaal: 1.3 })}
          <strong>${STADIUM_NAMEN[stadium]}</strong>
          <div class="levensbalk groeibalk"><div style="transform: scaleX(${deel})"></div></div>
          <span class="klein">${nog === null ? 'Helemaal volgroeid!' : `Nog ${nog} goede antwoorden tot de volgende stap`}</span>
        </div>
        <div class="collectie-rechts">
          <div class="wei">
            ${bevrijd.length ? lopersHtml(bevrijd, t) : '<p class="wei-leeg">Haal een level om je eerste Wiebel te bevrijden!</p>'}
          </div>
          <div class="wiebels">
            ${BELONINGEN.map((id, i) => {
              const vrij = p.verzameling.includes(id);
              return `<span class="wiebeltje${vrij ? '' : ' gevangen'}">${vriendjeHtml(wiebelVoor(id, t), `vz-${i}`, vrij ? 'stil' : 'stil silhouet')}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    `);
    opKlik(el, { terug: () => terug() });
    return { el };
  },
};
