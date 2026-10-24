// Winkeltje: kopen en aan- of uitzetten van cosmetica.

import { maakEl, opKlik } from '../dom.js';
import { SOORTEN, WINKEL, item, koop, wissel } from '../cosmetica.js';
import { speel } from '../geluid.js';
import { bewaar, staat } from '../opslag.js';
import { avatarHtml, eigenWiebelHtml } from '../weergave.js';

export const winkel = {
  maak({ terug, zetFocus }) {
    const p = staat.profiel;
    const el = maakEl();
    let melding = 'Kies iets om te kopen. Wat je al hebt, zet je met OK aan of uit.';

    function knop(i) {
      const gekocht = p.cosmetica.gekocht.includes(i.id);
      const aan = p.cosmetica.actief[i.soort] === i.id;
      const beeld = i.emoji ? `<span class="winkel-emoji">${i.emoji}</span>` : `<span class="kleurstaal" style="background: ${i.kleur}"></span>`;
      const status = aan ? '✓ aan' : gekocht ? 'gekocht' : `${i.prijs} 🪙`;
      return `
        <button class="knop winkelknop${aan ? ' winkel-aan' : ''}" data-focus data-actie="kies" data-waarde="${i.id}">
          ${beeld}<span>${i.naam}</span><span class="klein">${status}</span>
        </button>`;
    }

    function teken(focusId) {
      el.innerHTML = `
        <div class="kopregel">
          <button class="knop" data-focus data-actie="terug">← Terug</button>
          <h1>Winkeltje</h1>
          <span class="teller">🪙 ${p.munten}</span>
        </div>
        <div class="winkel-indeling">
          <div class="winkel-voorbeeld">
            ${avatarHtml(p, 'avatar-groot')}
            ${eigenWiebelHtml(p, 'winkel')}
          </div>
          <div class="winkel-schappen">
            ${Object.entries(SOORTEN).map(([soort, titel]) => `
              <h2>${titel}</h2>
              <div class="winkel-rij">${WINKEL.filter((i) => i.soort === soort).map(knop).join('')}</div>
            `).join('')}
          </div>
        </div>
        <p class="ondertitel winkel-melding">${melding}</p>
      `;
      if (focusId) zetFocus(el.querySelector(`[data-waarde="${focusId}"]`));
    }

    opKlik(el, {
      terug: () => terug(),
      kies(id) {
        const i = item(id);
        if (p.cosmetica.gekocht.includes(id)) {
          wissel(p, id);
          melding = p.cosmetica.actief[i.soort] === id ? `${i.naam} staat aan.` : `${i.naam} staat uit.`;
        } else {
          const uitslag = koop(p, id);
          if (uitslag.ok) {
            speel('combo');
            melding = `Gekocht: ${i.naam}!`;
          } else {
            melding = `Je hebt nog ${uitslag.tekort} munten nodig voor ${i.naam}. Verdien ze met oefenen!`;
          }
        }
        bewaar();
        teken(id);
      },
    });

    teken();
    return { el };
  },
};
