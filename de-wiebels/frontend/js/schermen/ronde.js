// Oefenronde: tien vragen met vier antwoorden. Een fout wordt rustig verbeterd en later opnieuw gevraagd.

import { maakEl, opKlik } from '../dom.js';
import { maakVragen } from '../generators/index.js';
import { zetKlok } from '../klok.js';
import { levelVan } from '../levels.js';
import { bewaar, staat } from '../opslag.js';
import { RONDE_LENGTE, beantwoord, huidigeVraag, nieuweRonde, sterrenVoor } from '../ronde.js';

const PAUZE_GOED = 900;
const KLOK_ANIMATIE = 400;
const CIJFER_WACHT = 1500;

export const ronde = {
  maak({ toon, zetFocus, gegevens }) {
    const el = maakEl();
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    const r = nieuweRonde(maakVragen(level, RONDE_LENGTE, 1));
    let bezig = false;
    let cijfers = '';
    let cijferTimer;

    function teken() {
      const vraag = huidigeVraag(r);
      const gedaan = r.aantal - new Set(r.wachtrij.map((v) => v.id)).size;
      el.innerHTML = `
        <div class="rondekop">
          <span>${level.label}</span>
          <span class="voortgang">${Array.from({ length: r.aantal }, (_, i) => `<span class="${i < gedaan ? 'vol' : ''}"></span>`).join('')}</span>
        </div>
        <div class="vraag vraag-${vraag.soort || 'som'}">${vraag.tekst}</div>
        <div class="opties">
          ${vraag.opties.map((o) => `<button class="knop optie" data-focus data-actie="antwoord" data-waarde="${o.sleutel}">${o.html}</button>`).join('')}
        </div>
        <div class="terugkoppeling" data-veld="terugkoppeling"></div>
      `;
      zetFocus(el.querySelector('.optie'));
      bezig = false;
    }

    function volgende() {
      if (r.wachtrij.length) return teken();
      const sterren = sterrenVoor(r.goedEerst, r.aantal);
      p.sterren[level.id] = Math.max(p.sterren[level.id] || 0, sterren);
      bewaar();
      toon('resultaat', { levelId: level.id, goedEerst: r.goedEerst, aantal: r.aantal, sterren }, { vervang: true });
    }

    // Bij een klokvraag draaien de wijzers van het gekozen antwoord naar de goede tijd.
    function toonKlokAnimatie(vraag, sleutel) {
      const gekozen = vraag.opties.find((o) => o.sleutel === sleutel)?.tijd;
      const svg = el.querySelector('.vraag .klok');
      if (!vraag.klok || !gekozen || !svg) return;
      svg.classList.add('zonder-animatie');
      zetKlok(svg, gekozen.uur, gekozen.minuut);
      setTimeout(() => {
        svg.classList.remove('zonder-animatie');
        zetKlok(svg, vraag.klok.uur, vraag.klok.minuut);
      }, KLOK_ANIMATIE);
    }

    function antwoord(sleutel, knop) {
      if (bezig) return;
      bezig = true;
      const uitslag = beantwoord(r, sleutel);
      const goedKnop = el.querySelector(`.optie[data-waarde="${uitslag.vraag.goed}"]`);
      const melding = el.querySelector('[data-veld="terugkoppeling"]');
      el.querySelectorAll('.optie').forEach((o) => o.classList.add('gekozen-niet'));
      goedKnop.classList.replace('gekozen-niet', 'optie-goed');
      if (uitslag.goed) {
        melding.textContent = 'Goed zo!';
        setTimeout(volgende, PAUZE_GOED);
      } else {
        knop.classList.add('optie-fout');
        toonKlokAnimatie(uitslag.vraag, sleutel);
        melding.innerHTML = `<span>Het goede antwoord is <strong>${goedKnop.innerHTML}</strong>.</span>
          <button class="knop knop-hoofd" data-focus data-actie="verder">Verder</button>`;
        zetFocus(melding.querySelector('button'));
      }
    }

    opKlik(el, { antwoord, verder: volgende });

    teken();
    return {
      el,
      // Cijfertoetsen: typ het antwoord; zodra het overeenkomt met een optie wordt die gekozen.
      bijToets({ actie, cijfer }) {
        if (actie !== 'cijfer' || bezig) return false;
        clearTimeout(cijferTimer);
        cijfers += cijfer;
        const knop = el.querySelector(`.optie[data-waarde="${cijfers}"]`);
        if (knop) {
          cijfers = '';
          knop.click();
        } else {
          cijferTimer = setTimeout(() => { cijfers = ''; }, CIJFER_WACHT);
        }
        return true;
      },
    };
  },
};
