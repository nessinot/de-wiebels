// Het verhaal bij de eerste start van een profiel: vier korte schermpjes waarin de eigen Wiebel
// vertelt dat de eindbazen de Wiebels hebben gevangen en dat je ze bevrijdt door te oefenen.
// OK = volgend schermpje (de lopende zin stopt), Terug = overslaan. Daarna onthoudt het profiel dat
// de intro gezien is en volgt het hoofdmenu.

import { belHtml, laatVrij } from '../bel.js';
import { wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { BELONINGEN, VAARDIGHEDEN } from '../levels.js';
import { bewaar, staat } from '../opslag.js';
import { BALLON_HTML, maakBallon } from '../spreekballon.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { eigenWiebelStaat, sterrenHtml, vriendjeHtml } from '../weergave.js';
import { GROEI, wiebelSvg } from '../wiebel.js';
import { bijna, blij, hop, rustig, wijs, zwaai } from '../wiebel-beweging.js';
import { ZINNEN } from '../zinnen.js';

const SCHAAL = 1.6;
// Hoogte van de grond en van de grond tot boven het hoofd (bij volle grootte), zoals in gids.js.
const GROND = (260 - 238) * SCHAAL;
const KOP = 216 * SCHAAL;

// Wat er per schermpje te zien is (rechts van de verteller) en wat er daarna gebeurt.
// Elke stap: { html(t), na(podium, verteller, later) }.
const STAPPEN = [
  // De eindbazen hebben de Wiebels gevangen: elke baas met een Wiebel in een bel.
  {
    html: (t) => `<div class="intro-bazen">${VAARDIGHEDEN.map((v) => `
      <div class="intro-baas">
        <span class="intro-baas-emoji">${t.eindbazen[v].emoji}</span>
        ${belHtml(wiebelVoor(`baas:${v}`, t), `intro-bel-${v}`)}
      </div>`).join('')}</div>`,
    na(podium, verteller) {
      bijna(verteller);
      binnen(podium.querySelectorAll('.intro-baas'), 140);
    },
  },
  // Elk level dat je haalt, bevrijdt er één.
  {
    html: (t) => `<div class="intro-level">
      <div class="intro-levelkaart">${sterrenHtml(3)}<span>Level gehaald!</span></div>
      <span class="intro-pijl">➜</span>
      ${belHtml(wiebelVoor(BELONINGEN[0], t), 'intro-bel-level')}
    </div>`,
    na(podium, verteller, later) {
      binnen(podium.querySelectorAll('.intro-levelkaart, .intro-pijl, .vangbel'), 250);
      later(1600, () => {
        laatVrij(podium.querySelector('.vangbel'));
        blij(verteller);
      });
    },
  },
  // Elke eindbaas houdt er nog eentje vast.
  {
    html: (t) => `<div class="intro-een-baas">
      <span class="intro-baas-emoji groot">${t.eindbazen.plus.emoji}</span>
      ${belHtml(wiebelVoor('baas:plus', t), 'intro-bel-baas')}
    </div>`,
    na(podium, verteller) {
      wijs(verteller);
      binnen(podium.querySelectorAll('.intro-baas-emoji, .vangbel'), 300);
      if (rustig()) return;
      podium.querySelector('.intro-baas-emoji').animate([
        { transform: 'rotate(0deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0deg)' },
      ], { duration: 1400, delay: 600, iterations: 2, easing: 'ease-in-out' });
    },
  },
  // Samen gaan we ze bevrijden: een paar vrije Wiebels springen om de beurt.
  {
    html: (t) => `<div class="intro-vrienden">${BELONINGEN.slice(1, 5).map((id, i) => vriendjeHtml(wiebelVoor(id, t), `intro-vriend-${i}`)).join('')}</div>`,
    na(podium, verteller, later) {
      zwaai(verteller);
      const vrienden = podium.querySelectorAll('.vriendje');
      binnen(vrienden, 150);
      if (rustig()) return;
      vrienden.forEach((v, i) => later(900 + i * 350, () => hop(v.querySelector('.wiebel'), 2)));
      later(2600, () => blij(verteller));
    },
  },
];

// Na elkaar binnenkomen: van iets lager, vervagend naar zichtbaar.
function binnen(elementen, tussen) {
  if (rustig()) return;
  [...elementen].forEach((e, i) => e.animate([
    { opacity: 0, transform: 'translateY(60px) scale(.8)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' },
  ], { duration: 500, delay: i * tussen, easing: 'ease-out', fill: 'backwards' }));
}

export const intro = {
  maak({ toon }) {
    const p = staat.profiel;
    const t = thema(p.thema);
    const zinnen = ZINNEN.intro;
    const wiebelStaat = eigenWiebelStaat(p);
    let stap = -1;
    let klaar = false;
    let timers = [];

    const el = maakEl(`
      ${themaAchtergrond(p.thema, null, 'ab-intro')}
      <div class="intro-verteller">${BALLON_HTML}${wiebelSvg(wiebelStaat, 'intro-verteller', { schaal: SCHAAL })}</div>
      <div class="intro-podium"></div>
      <div class="intro-onder">
        <div class="intro-stippen">${STAPPEN.map(() => '<span></span>').join('')}</div>
        <span class="intro-hint">Terug = overslaan</span>
        <button class="knop knop-hoofd" data-focus data-actie="volgende">Verder ▶</button>
      </div>
    `);
    el.classList.add('intro');
    const verteller = el.querySelector('.intro-verteller');
    const podium = el.querySelector('.intro-podium');
    const knop = el.querySelector('[data-actie="volgende"]');
    const ballon = maakBallon(verteller, { blijftStaan: true });
    // De ballon staat net boven het hoofd, ook als de Wiebel nog klein is.
    verteller.style.setProperty('--kop', `${Math.round(GROND + KOP * GROEI[verteller.querySelector('.wiebel').dataset.stadium] + 14)}px`);

    const later = (ms, fn) => timers.push(setTimeout(() => el.isConnected && fn(), ms));

    function afronden() {
      if (klaar) return;
      klaar = true;
      timers.forEach(clearTimeout);
      ballon.stop();
      p.introGezien = true;
      bewaar();
      toon('wereldkaart', {}, { vervang: true });
    }

    function volgende() {
      if (stap === STAPPEN.length - 1) return afronden();
      stap += 1;
      timers.forEach(clearTimeout);
      timers = [];
      podium.innerHTML = STAPPEN[stap].html(t);
      el.querySelectorAll('.intro-stippen span').forEach((s, i) => s.classList.toggle('aan', i <= stap));
      knop.textContent = stap === STAPPEN.length - 1 ? 'Spelen! ▶' : 'Verder ▶';
      ballon.praat(zinnen[stap].tekst, zinnen[stap].id);
      STAPPEN[stap].na(podium, verteller.querySelector('.wiebel'), later);
    }

    opKlik(el, { volgende });
    volgende();
    return {
      el,
      // Terug (ook de terugknop van de tv-browser) slaat het verhaal over.
      bijToets({ actie }) {
        if (actie !== 'terug') return false;
        afronden();
        return true;
      },
    };
  },
};
