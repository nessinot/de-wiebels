// Resultaat na een ronde: sterren en wat je verder kunt doen.

import { maakEl, opKlik } from '../dom.js';
import { LEVELS, levelOpen, levelVan } from '../levels.js';
import { staat } from '../opslag.js';
import { sterrenHtml } from '../weergave.js';

const TEKSTEN = ['Goed geoefend!', 'Mooi zo!', 'Heel goed!', 'Fantastisch!'];

export const resultaat = {
  maak({ toon, terug, gegevens }) {
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    const lijst = LEVELS[level.vaardigheid];
    const volgende = lijst[lijst.indexOf(level) + 1];
    const volgendeOpen = volgende && levelOpen(p, volgende);

    const el = maakEl(`
      <h1 class="titel-groot">${TEKSTEN[gegevens.sterren]}</h1>
      <div class="resultaat-sterren">${sterrenHtml(gegevens.sterren)}</div>
      <p class="ondertitel">${gegevens.goedEerst} van de ${gegevens.aantal} in één keer goed · +${gegevens.munten} 🪙</p>
      <div class="knoppenrij" data-beloningen></div>
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
