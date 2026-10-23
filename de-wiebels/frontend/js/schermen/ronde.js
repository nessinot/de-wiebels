// Oefenronde: tien vragen met vier antwoorden. Een fout wordt rustig verbeterd en later opnieuw gevraagd.

import { maakEl, opKlik } from '../dom.js';
import { maakVraag, maakVragen, vraagUitId } from '../generators/index.js';
import { digitaal, zetKlok } from '../klok.js';
import { levelVan } from '../levels.js';
import { registreer, teHerhalen, volgendeStap } from '../leitner.js';
import { bewaar, staat } from '../opslag.js';
import { RONDE_LENGTE, beantwoord, huidigeVraag, nieuweRonde, sterrenVoor } from '../ronde.js';

const PAUZE_GOED = 900;
const KLOK_ANIMATIE = 400;
const CIJFER_WACHT = 1500;
const MAX_HERHALING = 4;

// Vragen voor een ronde: eerst wat aan de beurt is om te herhalen, de rest nieuw.
function stelRondeSamen(p, level, stap) {
  const herhaling = teHerhalen(p.items, level.id, MAX_HERHALING)
    .map((id) => vraagUitId(id))
    .filter(Boolean)
    .map((v) => ({ ...v, herhaling: true }));
  const ids = new Set(herhaling.map((v) => v.id));
  const nieuw = maakVragen(level, RONDE_LENGTE * 2, stap).filter((v) => !ids.has(v.id));
  return [...herhaling, ...nieuw].slice(0, RONDE_LENGTE);
}

export const ronde = {
  maak({ toon, zetFocus, gegevens }) {
    const el = maakEl();
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    let stap = p.moeilijkheid[level.id] ?? 1;
    let reeksGoed = 0;
    let reeksFout = 0;
    const r = nieuweRonde(stelRondeSamen(p, level, stap));
    const rondeIds = new Set(r.wachtrij.map((v) => v.id)); // alle vragen van deze ronde, ook al gestelde
    let bezig = false;
    let cijfers = '';
    let cijferTimer;
    let zetTijd = 0; // minuten na twaalf uur bij wijzers zetten

    function teken() {
      const vraag = huidigeVraag(r);
      const gedaan = r.aantal - new Set(r.wachtrij.map((v) => v.id)).size;
      el.innerHTML = `
        <div class="rondekop">
          <span>${level.label}</span>
          <span class="voortgang">${Array.from({ length: r.aantal }, (_, i) => `<span class="${i < gedaan ? 'vol' : ''}"></span>`).join('')}</span>
        </div>
        <div class="vraag vraag-${vraag.soort || 'som'}">${vraag.tekst}</div>
        ${vraag.interactief === 'zetten' ? zetKnoppen() : `
        <div class="opties opties-${vraag.optieSoort || 'getal'}">
          ${vraag.opties.map((o) => `<button class="knop optie" data-focus data-actie="antwoord" data-waarde="${o.sleutel}">${o.html}</button>`).join('')}
        </div>`}
        <div class="terugkoppeling" data-veld="terugkoppeling"></div>
      `;
      zetTijd = 0;
      el.querySelector('.vraag .klok')?.classList.toggle('zonder-animatie', vraag.interactief === 'zetten');
      zetFocus(el.querySelector('.optie, [data-actie="zetKlaar"]'));
      bezig = false;
    }

    function zetKnoppen() {
      return `
        <div class="zetbediening">
          <button class="knop" data-actie="zet" data-waarde="-60">▼ uur</button>
          <button class="knop" data-actie="zet" data-waarde="-1">◀ minuten</button>
          <button class="knop knop-hoofd" data-focus data-actie="zetKlaar">Klaar ✓</button>
          <button class="knop" data-actie="zet" data-waarde="1">minuten ▶</button>
          <button class="knop" data-actie="zet" data-waarde="60">▲ uur</button>
        </div>`;
    }

    // stappen: ±1 = één minutenstap, ±60 = een uur. De uurwijzer draait realistisch mee.
    function verzet(stappen) {
      const vraag = huidigeVraag(r);
      const delta = Math.abs(stappen) === 60 ? stappen : stappen * vraag.zetStap;
      zetTijd = (zetTijd + delta + 720) % 720;
      zetKlok(el.querySelector('.vraag .klok'), Math.floor(zetTijd / 60), zetTijd % 60);
    }

    function zetSleutel() {
      return `${Math.floor(zetTijd / 60) || 12}:${zetTijd % 60}`;
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
      const svg = el.querySelector('.vraag .klok');
      if (vraag.interactief === 'zetten') {
        svg.classList.remove('zonder-animatie');
        zetKlok(svg, vraag.klok.uur, vraag.klok.minuut);
        return;
      }
      const gekozen = vraag.opties.find((o) => o.sleutel === sleutel)?.tijd;
      if (!vraag.klok || !gekozen || !svg) return;
      svg.classList.add('zonder-animatie');
      zetKlok(svg, gekozen.uur, gekozen.minuut);
      setTimeout(() => {
        svg.classList.remove('zonder-animatie');
        zetKlok(svg, vraag.klok.uur, vraag.klok.minuut);
      }, KLOK_ANIMATIE);
    }

    // Na een reeks goed of meerdere fouten verandert de stap; nog niet gestelde nieuwe vragen
    // worden dan vervangen door vragen op de nieuwe stap.
    function pasMoeilijkheidAan(goed) {
      reeksGoed = goed ? reeksGoed + 1 : 0;
      reeksFout = goed ? 0 : reeksFout + 1;
      const nieuweStap = volgendeStap(stap, reeksGoed, reeksFout);
      if (nieuweStap === stap) return;
      stap = nieuweStap;
      p.moeilijkheid[level.id] = stap;
      reeksGoed = 0;
      reeksFout = 0;
      r.wachtrij = r.wachtrij.map((v) => {
        if (v.herhaling || r.fouten.has(v.id)) return v;
        for (let i = 0; i < 50; i++) {
          const nieuw = maakVraag(level, stap);
          if (!rondeIds.has(nieuw.id)) {
            rondeIds.add(nieuw.id);
            return nieuw;
          }
        }
        return v;
      });
    }

    function antwoord(sleutel, knop) {
      if (bezig) return;
      bezig = true;
      const uitslag = beantwoord(r, sleutel);
      registreer(p.items, uitslag.vraag.id, uitslag.goed, level.id);
      pasMoeilijkheidAan(uitslag.goed);
      bewaar();
      const goedKnop = el.querySelector(`.optie[data-waarde="${uitslag.vraag.goed}"]`);
      const goedHtml = goedKnop ? goedKnop.innerHTML : digitaal(uitslag.vraag.klok.uur, uitslag.vraag.klok.minuut);
      const melding = el.querySelector('[data-veld="terugkoppeling"]');
      el.querySelectorAll('.optie').forEach((o) => o.classList.add('gekozen-niet'));
      goedKnop?.classList.replace('gekozen-niet', 'optie-goed');
      if (uitslag.goed) {
        melding.textContent = 'Goed zo!';
        setTimeout(volgende, PAUZE_GOED);
      } else {
        knop.classList.add('optie-fout');
        toonKlokAnimatie(uitslag.vraag, sleutel);
        melding.innerHTML = `<span>Het goede antwoord is <strong>${goedHtml}</strong>.</span>
          <button class="knop knop-hoofd" data-focus data-actie="verder">Verder</button>`;
        zetFocus(melding.querySelector('button'));
      }
    }

    opKlik(el, {
      antwoord,
      verder: volgende,
      zet: (stappen) => !bezig && verzet(Number(stappen)),
      zetKlaar: (_, knop) => antwoord(zetSleutel(), knop),
    });

    teken();
    return {
      el,
      // Cijfertoetsen: typ het antwoord; zodra het overeenkomt met een optie wordt die gekozen.
      bijToets({ actie, cijfer }) {
        const pijl = { links: -1, rechts: 1, omlaag: -60, omhoog: 60 }[actie];
        if (pijl && !bezig && huidigeVraag(r)?.interactief === 'zetten') {
          verzet(pijl);
          return true;
        }
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
