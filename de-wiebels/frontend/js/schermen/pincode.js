// Pincode voor het ouderscherm: met de cijfertoetsen of de knoppen op het scherm.

import { maakEl, opKlik } from '../dom.js';
import { opslag } from '../opslag.js';

const LENGTE = 4;

export const pincode = {
  maak({ toon }) {
    let invoer = '';
    const el = maakEl(`
      <h1 class="titel-groot">Ouderscherm</h1>
      <p class="ondertitel">Voer de pincode in</p>
      <div class="pinbolletjes"></div>
      <div class="pinpad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="knop toets" data-focus data-actie="cijfer" data-waarde="${n}">${n}</button>`).join('')}
        <span></span>
        <button class="knop toets" data-focus data-actie="cijfer" data-waarde="0">0</button>
        <button class="knop toets" data-focus data-actie="wis">⌫</button>
      </div>
    `);

    function teken(fout = false) {
      const bolletjes = el.querySelector('.pinbolletjes');
      bolletjes.innerHTML = Array.from({ length: LENGTE }, (_, i) => `<span class="${i < invoer.length ? 'vol' : ''}"></span>`).join('');
      bolletjes.classList.toggle('fout', fout);
    }

    function cijfer(c) {
      if (invoer.length >= LENGTE) return;
      invoer += c;
      teken();
      if (invoer.length < LENGTE) return;
      if (invoer === opslag.instellingen().pin) {
        toon('ouderscherm', {}, { vervang: true });
      } else {
        invoer = '';
        teken(true);
      }
    }

    opKlik(el, {
      cijfer,
      wis() {
        invoer = invoer.slice(0, -1);
        teken();
      },
    });

    teken();
    return {
      el,
      bijToets({ actie, cijfer: c }) {
        if (actie !== 'cijfer') return false;
        cijfer(String(c));
        return true;
      },
    };
  },
};
