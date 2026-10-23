// Thema wisselen. De voortgang blijft gewoon behouden; alleen de presentatie verandert.

import { maakEl, opKlik } from '../dom.js';
import { bewaar, staat } from '../opslag.js';
import { pasThemaToe } from '../themas/index.js';
import { themaKnoppen } from '../weergave.js';

export const themakeuze = {
  maak({ terug }) {
    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Kies je wereld</h1>
      </div>
      ${themaKnoppen(staat.profiel.thema)}
    `);
    opKlik(el, {
      terug: () => terug(),
      thema(id) {
        staat.profiel.thema = id;
        pasThemaToe(id);
        bewaar();
        terug();
      },
    });
    return { el };
  },
};
