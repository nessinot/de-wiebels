// Eerste start van een nieuw profiel (aangemaakt op de ouderpagina): kies je Wiebel, dan je wereld,
// daarna volgt het verhaal (intro).

import { maakEl, opKlik } from '../dom.js';
import { bewaar, staat } from '../opslag.js';
import { pasThemaToe } from '../themas/index.js';
import { themaKnoppen } from '../weergave.js';
import { KLEUREN, wiebelSvg } from '../wiebel.js';
import { BALLON_HTML, maakBallon } from '../spreekballon.js';
import { blij } from '../wiebel-beweging.js';

const STAPPEN = ['wiebel', 'thema'];
const NA_KLEURKEUZE = 2400; // ms: de gekozen Wiebel springt en zegt iets voor de volgende stap

export const eersteStart = {
  maak({ toon, herstelFocus }) {
    const el = maakEl();
    const p = staat.profiel;
    let stap = 0;
    let wachtOpVolgende = null;

    // De Wiebels als grote kaarten, in het stadium waarin een nieuw profiel begint.
    function tekenWiebel() {
      return `
        <h1>Kies je Wiebel</h1>
        <div class="wiebelkaarten">
          ${Object.entries(KLEUREN).map(([id, k]) => `
            <button class="knop wiebelkaart" data-focus data-actie="kleur" data-waarde="${id}">
              ${BALLON_HTML}
              ${wiebelSvg({ kleur: id, stadium: 0 }, `kies-${id}`, { schaal: 1.6 })}
              <span>${k.naam}</span>
            </button>`).join('')}
        </div>
      `;
    }

    function tekenThema() {
      return `<h1>Kies je wereld</h1>${themaKnoppen(p.thema)}`;
    }

    function teken() {
      el.innerHTML = { wiebel: tekenWiebel, thema: tekenThema }[STAPPEN[stap]]();
      herstelFocus();
    }

    opKlik(el, {
      kleur(id, kaart) {
        if (wachtOpVolgende) return;
        p.wiebel = { ...p.wiebel, kleur: id };
        blij(kaart.querySelector('.wiebel'));
        maakBallon(kaart, { blijftStaan: true }).zeg('kleurGekozen');
        wachtOpVolgende = setTimeout(() => {
          wachtOpVolgende = null;
          stap = 1;
          teken();
        }, NA_KLEURKEUZE);
      },
      thema(id) {
        p.thema = id;
        p.wiebelGekozen = true;
        bewaar();
        pasThemaToe(id);
        toon('intro', {}, { vervang: true });
      },
    });

    teken();
    return {
      el,
      bijToets({ actie }) {
        if (actie !== 'terug') return false;
        clearTimeout(wachtOpVolgende);
        wachtOpVolgende = null;
        // Bij de eerste stap gaat Terug gewoon terug naar de profielkeuze.
        if (stap === 0) return false;
        stap -= 1;
        teken();
        return true;
      },
    };
  },
};
