// Toont één vraag met meerkeuze-opties, wijzers zetten of aanwijzen op de kaart, en de terugkoppeling erop.
// Gedeeld door de oefenronde, de eindbaas en de tijdrace.

import { maakEl, opKlik } from './dom.js';
import { digitaal, zetKlok } from './klok.js';
import { maakKaartbediening } from './nederland/bediening.js';
import { kaartSvg, zoomVak } from './nederland/kaartbeeld.js';

const KLOK_ANIMATIE = 400;
const CIJFER_WACHT = 1500;
const PIJLEN = { links: -1, rechts: 1, omlaag: -60, omhoog: 60 };
const MIN_LETTER = 40; // zo klein wordt de letter van een lange naam hooguit (px)
// Maat van de kaart bij een vraag over Nederland in px (css/nederland.css).
export const VRAAGKAART_MAAT = [760, 800];

export function maakVraagpaneel({ zetFocus, opAntwoord }) {
  const el = maakEl('', 'div');
  el.className = 'vraagpaneel';
  let vraag = null;
  let bezig = false;
  let zetTijd = 0; // minuten na twaalf uur bij wijzers zetten
  let cijfers = '';
  let cijferTimer;
  let opVerder = null;
  let bediening = null; // bij aanwijzen op de kaart (nederland/bediening.js)

  const klok = () => el.querySelector('.vraag .klok');
  const melding = () => el.querySelector('.terugkoppeling');
  const kaartvak = () => el.querySelector('.kaartvak');

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

  // Een vraag met een kaart (Nederland): links de kaart, rechts de vraag en de knoppen. Bij aanwijzen
  // heeft de kaart de focus en lopen de pijltjes en OK via de kaartbediening.
  function kaartHtml(vragen) {
    const [breedte, hoogte] = VRAAGKAART_MAAT;
    const { provincie = null, doelen = [], licht = [] } = vraag.kaart;
    const svg = kaartSvg({ provincie, doelen, licht, breedte, hoogte, stip: provincie ? 16 : 12 });
    return `
      <div class="nl-vraag">
        <div class="kaartvak nl-vraagkaart"${vraag.interactief === 'aanwijzen' ? ' data-focus' : ''}>${svg}</div>
        <div class="nl-vraagkant">${vragen}</div>
      </div>`;
  }

  // Een lange naam (Nederland) past op één regel: de letter van die knop wordt kleiner, maar niet
  // kleiner dan MIN_LETTER. Meten kan pas als het paneel in de DOM staat.
  function pasNamenIn() {
    el.querySelectorAll('.opties-nl .optie').forEach((knop) => {
      const stijl = getComputedStyle(knop);
      const ruimte = knop.clientWidth - parseFloat(stijl.paddingLeft) - parseFloat(stijl.paddingRight);
      const maat = parseFloat(stijl.fontSize);
      knop.style.whiteSpace = 'nowrap';
      const tekst = document.createRange();
      tekst.selectNodeContents(knop);
      // Het spel wordt als geheel geschaald (--schaal); de tekstbreedte terug naar px van de knop.
      const breedte = tekst.getBoundingClientRect().width * knop.offsetWidth / knop.getBoundingClientRect().width;
      knop.style.whiteSpace = '';
      if (breedte > ruimte) knop.style.fontSize = `${Math.max(MIN_LETTER, Math.floor(maat * ruimte / breedte))}px`;
    });
  }

  function toon(nieuweVraag) {
    vraag = nieuweVraag;
    bezig = false;
    zetTijd = 0;
    bediening = null;
    const inhoud = `
      <div class="vraag vraag-${vraag.soort || 'som'}">${vraag.tekst}</div>
      ${vraag.interactief === 'zetten' ? zetKnoppen() : `
      <div class="opties opties-${vraag.optieSoort || 'getal'}">
        ${vraag.opties.map((o) => `<button class="knop optie" data-focus data-actie="antwoord" data-waarde="${o.sleutel}">${o.html}</button>`).join('')}
      </div>`}
      <div class="terugkoppeling"></div>
    `;
    el.innerHTML = vraag.kaart ? kaartHtml(inhoud) : inhoud;
    if (vraag.optieSoort === 'nl') requestAnimationFrame(pasNamenIn);
    klok()?.classList.toggle('zonder-animatie', vraag.interactief === 'zetten');
    // Wat oplicht, komt bovenop zijn buren te liggen.
    el.querySelectorAll('.nl-licht').forEach((d) => d.parentNode.append(d));
    if (vraag.interactief === 'aanwijzen') {
      const { provincie = null, doelen, begin } = vraag.kaart;
      bediening = maakKaartbediening(kaartvak(), {
        doelen, begin, vak: zoomVak(provincie, ...VRAAGKAART_MAAT), opKies: (id) => kies(id),
      });
    }
    zetFocus(el.querySelector('.optie, [data-actie="zetKlaar"], .kaartvak[data-focus]'));
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

  // Op de kaart: het goede antwoord groen en bovenop. De kaart doet daarna niet meer mee met de
  // focus, zodat OK naar Verder gaat.
  function markeer() {
    el.querySelectorAll('.optie').forEach((o) => o.classList.add('gekozen-niet'));
    el.querySelector(`.optie[data-waarde="${vraag.goed}"]`)?.classList.replace('gekozen-niet', 'optie-goed');
    if (!bediening) return;
    bediening.actief(false);
    kaartvak().removeAttribute('data-focus');
    kaartvak().classList.remove('heeft-focus');
    kaartvak().querySelector('.nl-kaart').classList.add('nl-beantwoord');
    const goed = kaartvak().querySelector(`[data-doel="${vraag.goed}"]`);
    goed?.parentNode.append(goed);
    goed?.classList.add('nl-goed');
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
    const goedHtml = goedKnop?.innerHTML ?? vraag.goedHtml ?? digitaal(vraag.klok.uur, vraag.klok.minuut);
    opVerder = verder;
    melding().innerHTML = `<span>${vraag.foutHtml ?? `Het goede antwoord is <strong>${goedHtml}</strong>.`}</span>
      <button class="knop knop-hoofd" data-focus data-actie="verder">Verder</button>`;
    zetFocus(melding().querySelector('button'));
  }

  opKlik(el, {
    antwoord: kies,
    zet: (stappen) => !bezig && verzet(Number(stappen)),
    zetKlaar: (_, knop) => kies(`${Math.floor(zetTijd / 60) || 12}:${zetTijd % 60}`, knop),
    verder: () => opVerder?.(),
  });

  // Pijltjes zetten de wijzers of gaan langs de kaart; cijfertoetsen kiezen de optie met dat getal.
  function bijToets({ actie, cijfer }) {
    if (!vraag || bezig) return false;
    if (bediening && kaartvak().classList.contains('heeft-focus') && (PIJLEN[actie] || actie === 'ok')) {
      return bediening.toets(actie);
    }
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

  // Het scherm geeft elke focuswissel door: de kaart laat dan zien wat aangewezen is.
  function bijFocus(doel) {
    bediening?.actief(!bezig && doel.classList.contains('kaartvak'));
  }

  return { el, toon, toonGoed, toonFout, bijToets, bijFocus, isBezig: () => bezig };
}
