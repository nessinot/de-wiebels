// Resultaat na een ronde: sterren en wat je verder kunt doen.

import { huisdierStadium, wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { LEVELS, levelOpen, levelVan } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { sterrenHtml } from '../weergave.js';

const TEKSTEN = ['Goed geoefend!', 'Mooi zo!', 'Heel goed!', 'Fantastisch!'];

export const resultaat = {
  maak({ toon, terug, gegevens }) {
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    const lijst = LEVELS[level.vaardigheid];
    const volgende = lijst[lijst.indexOf(level) + 1];
    const volgendeOpen = volgende && levelOpen(p, volgende);

    function beloningen() {
      const t = thema(p.thema);
      const delen = [];
      if (gegevens.nieuweWiebel) {
        const w = wiebelVoor(level.id, t);
        delen.push(`<span class="beloning"><span class="wiebel"><span style="filter: ${w.filter}">${w.emoji}</span></span> Nieuwe Wiebel: ${w.naam}!</span>`);
      }
      if (gegevens.gegroeid) {
        const h = t.huisdier[huisdierStadium(p.huisdier.xp)];
        delen.push(`<span class="beloning"><span class="huisdier">${h.emoji}</span> Je huisdier is gegroeid: ${h.naam}!</span>`);
      }
      return delen.join('');
    }

    const el = maakEl(`
      <h1 class="titel-groot">${TEKSTEN[gegevens.sterren]}</h1>
      <div class="resultaat-sterren">${sterrenHtml(gegevens.sterren)}</div>
      <p class="ondertitel">${gegevens.goedEerst} van de ${gegevens.aantal} in één keer goed · +${gegevens.munten} 🪙</p>
      <div class="knoppenrij beloningen">${beloningen()}</div>
      <div class="knoppenrij">
        ${volgendeOpen ? '<button class="knop knop-hoofd" data-focus data-actie="volgende">Volgend level →</button>' : ''}
        <button class="knop" data-focus data-actie="opnieuw">Nog een keer</button>
        <button class="knop" data-focus data-actie="levels">Naar de levels</button>
      </div>
    `);

    opKlik(el, {
      volgende: () => toon('ronde', { levelId: volgende.id }, { vervang: true }),
      opnieuw: () => toon('ronde', { levelId: level.id }, { vervang: true }),
      levels: () => terug(),
    });
    return { el };
  },
};
