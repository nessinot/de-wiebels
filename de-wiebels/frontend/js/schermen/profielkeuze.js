// Startscherm: kies je profiel of maak een nieuw profiel.

import { esc, maakEl, opKlik } from '../dom.js';
import { opslag, staat } from '../opslag.js';

const GEHEIM_AANTAL = 3;
const GEHEIM_TIJD = 2000;

export const profielkeuze = {
  maak({ toon }) {
    const el = maakEl();
    let profielen = [];
    let blauw = [];

    function teken() {
      profielen = opslag.alleProfielen();
      el.innerHTML = `
        <h1 class="titel-groot">De Wiebels</h1>
        <p class="ondertitel">Wie gaat er spelen?</p>
        <div class="profielen">
          ${profielen.map((p) => `
            <button class="knop profielknop" data-focus data-actie="kies" data-waarde="${p.id}">
              <span class="avatar-groot">${p.avatar}</span>
              <span class="profielnaam">${esc(p.naam)}</span>
            </button>`).join('')}
          <button class="knop profielknop" data-focus data-actie="nieuw">
            <span class="avatar-groot">➕</span>
            <span class="profielnaam">Nieuw</span>
          </button>
        </div>
      `;
    }

    opKlik(el, {
      kies(id) {
        staat.profiel = profielen.find((p) => p.id === id);
        toon('wereldkaart');
      },
      nieuw: () => toon('profielMaken'),
    });

    teken();
    return {
      el,
      bijTerugkomst: teken,
      bijToets({ actie }) {
        if (actie !== 'blauw') return false;
        const nu = Date.now();
        blauw = [...blauw.filter((t) => nu - t < GEHEIM_TIJD), nu];
        if (blauw.length >= GEHEIM_AANTAL) {
          blauw = [];
          toon('bedieningstest');
        }
        return true;
      },
    };
  },
};
