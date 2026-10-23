// Toont één vraag met meerkeuze-opties of wijzers zetten, en de terugkoppeling erop.
// Gedeeld door de oefenronde, de eindbaas en de tijdrace.

import { maakEl, opKlik } from './dom.js';
import { digitaal, zetKlok } from './klok.js';

const KLOK_ANIMATIE = 400;
const CIJFER_WACHT = 1500;
const PIJLEN = { links: -1, rechts: 1, omlaag: -60, omhoog: 60 };

export function maakVraagpaneel({ zetFocus, opAntwoord }) {
  const el = maakEl('', 'div');
  el.className = 'vraagpaneel';
  let vraag = null;
  let bezig = false;
  let zetTijd = 0; // minuten na twaalf uur bij wijzers zetten
  let cijfers = '';
  let cijferTimer;
  let opVerder = null;

  const klok = () => el.querySelector('.vraag .klok');
  const melding = () => el.querySelector('.terugkoppeling');

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

  function toon(nieuweVraag) {
    vraag = nieuweVraag;
    bezig = false;
    zetTijd = 0;
    el.innerHTML = `
      <div class="vraag vraag-${vraag.soort || 'som'}">${vraag.tekst}</div>
      ${vraag.interactief === 'zetten' ? zetKnoppen() : `
      <div class="opties opties-${vraag.optieSoort || 'getal'}">
        ${vraag.opties.map((o) => `<button class="knop optie" data-focus data-actie="antwoord" data-waarde="${o.sleutel}">${o.html}</button>`).join('')}
      </div>`}
      <div class="terugkoppeling"></div>
    `;
    klok()?.classList.toggle('zonder-animatie', vraag.interactief === 'zetten');
    zetFocus(el.querySelector('.optie, [data-actie="zetKlaar"]'));
  }

  // stappen: ±1 = één minutenstap, ±60 = een uur. De uurwijzer draait realistisch mee.
  function verzet(stappen) {
    const delta = Math.abs(stappen) === 60 ? stappen : stappen * vraag.zetStap;
    zetTijd = (zetTijd + delta + 720) % 720;
    zetKlok(klok(), Math.floor(zetTijd / 60), zetTijd % 60);
  }

  function kies(sleutel, knop) {
    if (bezig) return;
    bezig = true;
    opAntwoord(sleutel, knop);
  }

  function markeer() {
    el.querySelectorAll('.optie').forEach((o) => o.classList.add('gekozen-niet'));
    el.querySelector(`.optie[data-waarde="${vraag.goed}"]`)?.classList.replace('gekozen-niet', 'optie-goed');
  }

  // Bij een klokvraag draaien de wijzers naar de goede tijd.
  function klokAnimatie(sleutel) {
    const svg = klok();
    if (!svg || !vraag.klok) return;
    if (vraag.interactief === 'zetten') {
      svg.classList.remove('zonder-animatie');
      zetKlok(svg, vraag.klok.uur, vraag.klok.minuut);
      return;
    }
    const gekozen = vraag.opties.find((o) => o.sleutel === sleutel)?.tijd;
    if (!gekozen) return;
    svg.classList.add('zonder-animatie');
    zetKlok(svg, gekozen.uur, gekozen.minuut);
    setTimeout(() => {
      svg.classList.remove('zonder-animatie');
      zetKlok(svg, vraag.klok.uur, vraag.klok.minuut);
    }, KLOK_ANIMATIE);
  }

  function toonGoed(tekst) {
    bezig = true;
    markeer();
    melding().textContent = tekst;
  }

  // Rustig het goede antwoord tonen; verder gaat met OK op de knop Verder.
  function toonFout(sleutel, knop, verder) {
    bezig = true;
    markeer();
    knop?.classList.add('optie-fout');
    klokAnimatie(sleutel);
    const goedKnop = el.querySelector(`.optie[data-waarde="${vraag.goed}"]`);
    const goedHtml = goedKnop ? goedKnop.innerHTML : digitaal(vraag.klok.uur, vraag.klok.minuut);
    opVerder = verder;
    melding().innerHTML = `<span>Het goede antwoord is <strong>${goedHtml}</strong>.</span>
      <button class="knop knop-hoofd" data-focus data-actie="verder">Verder</button>`;
    zetFocus(melding().querySelector('button'));
  }

  opKlik(el, {
    antwoord: kies,
    zet: (stappen) => !bezig && verzet(Number(stappen)),
    zetKlaar: (_, knop) => kies(`${Math.floor(zetTijd / 60) || 12}:${zetTijd % 60}`, knop),
    verder: () => opVerder?.(),
  });

  // Pijltjes zetten de wijzers; cijfertoetsen kiezen de optie met dat getal.
  function bijToets({ actie, cijfer }) {
    if (!vraag || bezig) return false;
    if (PIJLEN[actie] && vraag.interactief === 'zetten') {
      verzet(PIJLEN[actie]);
      return true;
    }
    if (actie !== 'cijfer') return false;
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
  }

  return { el, toon, toonGoed, toonFout, bijToets, isBezig: () => bezig };
}
