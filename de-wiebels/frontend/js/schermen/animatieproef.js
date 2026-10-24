// Animatieproef (via het ouderscherm): de bewegende Wiebel met wisselende achtergronden, tot acht
// Wiebels tegelijk en een fps-meter, om op de tv te controleren of alles soepel loopt.

import { maakEl, opKlik } from '../dom.js';
import { achtergrond } from '../scene.js';
import { KLEUREN, wiebelSvg } from '../wiebel.js';
import { bijna, blij, maakSpreker, rustig, zwaai } from '../wiebel-beweging.js';

const REACTIES = [['blij', 'Blij sprongetje'], ['zwaai', 'Zwaaien'], ['bijna', 'Bijna'], ['praat', 'Praten']];
const ACHTERGRONDEN = [['sterren', 'Sterren'], ['regen', 'Regen'], ['sneeuw', 'Sneeuw'], ['geen', 'Geen']];
const AANTALLEN = [1, 4, 8];
const BEWEGING = { blij, zwaai, bijna };
const ZIN = 'Hoi! Ik ben een Wiebel. Zullen we samen sommen maken?';

// Plek en schaal per Wiebel in de scène (x van -20 tot 420, grond rond y 270).
const rij = (y, schaal) => [-4, 96, 196, 296].map((x) => [x, y, schaal]);
const OPSTELLING = {
  1: [[80, 34, 1]],
  4: [-16, 84, 184, 284].map((x) => [x, 151, 0.55]),
  8: [...rij(70, 0.45), ...rij(177, 0.45)],
};
const KLEURNAMEN = Object.keys(KLEUREN);

const knop = (actie, waarde, tekst) =>
  `<button class="knop proef-knop" data-focus data-actie="${actie}" data-waarde="${waarde}">${tekst}</button>`;

export const animatieproef = {
  maak({ terug }) {
    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Animatieproef</h1>
        <span class="fps-meter">— fps</span>
      </div>
      <div class="proef-indeling">
        <div class="proef-venster">
          <svg class="scene" viewBox="-20 -60 440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>
          <span class="bubbel" hidden></span>
        </div>
        <div class="proef-paneel">
          <h2>Reacties</h2>
          <div class="proef-knoppen">${REACTIES.map(([id, tekst]) => knop('reactie', id, tekst)).join('')}</div>
          <h2>Achtergrond</h2>
          <div class="proef-knoppen">${ACHTERGRONDEN.map(([id, tekst]) => knop('achtergrond', id, tekst)).join('')}</div>
          <h2>Aantal Wiebels</h2>
          <div class="proef-knoppen drie">${AANTALLEN.map((n) => knop('aantal', n, `${n} Wiebel${n > 1 ? 's' : ''}`)).join('')}</div>
        </div>
      </div>
    `);
    const venster = el.querySelector('.proef-venster');
    const scene = el.querySelector('.scene');
    const meter = el.querySelector('.fps-meter');
    const spreker = maakSpreker(venster);
    let soort = 'sterren';
    let aantal = 1;

    function teken() {
      spreker.stop();
      venster.querySelector('.bubbel').hidden = true;
      const bg = achtergrond(soort, 'proef', { stil: rustig() });
      const wiebels = OPSTELLING[aantal]
        .map(([x, y, schaal], i) => wiebelSvg({ kleur: KLEURNAMEN[i % KLEURNAMEN.length] }, `proef-${i}`, { x, y, schaal }))
        .join('');
      scene.innerHTML = bg.achter + wiebels + bg.voor;
      el.querySelectorAll('[data-actie="achtergrond"]').forEach((k) => k.classList.toggle('winkel-aan', k.dataset.waarde === soort));
      el.querySelectorAll('[data-actie="aantal"]').forEach((k) => k.classList.toggle('winkel-aan', Number(k.dataset.waarde) === aantal));
    }

    opKlik(el, {
      terug: () => terug(),
      reactie(id) {
        if (id === 'praat') return spreker(ZIN);
        venster.querySelectorAll('.wiebel').forEach((w) => BEWEGING[id](w));
      },
      achtergrond(id) {
        soort = id;
        teken();
      },
      aantal(n) {
        aantal = Number(n);
        teken();
      },
    });

    // Fps-meter: beelden tellen met requestAnimationFrame en elke seconde het gemiddelde tonen.
    // Stopt vanzelf als het scherm weg is.
    let begin = 0;
    let beelden = 0;
    function tel(nu) {
      if (!el.isConnected) return;
      if (!begin) begin = nu;
      else beelden += 1;
      if (nu - begin >= 1000) {
        const fps = Math.round((beelden * 1000) / (nu - begin));
        meter.textContent = `${fps} fps`;
        meter.dataset.niveau = fps >= 50 ? 'goed' : fps >= 30 ? 'matig' : 'slecht';
        begin = nu;
        beelden = 0;
      }
      requestAnimationFrame(tel);
    }
    requestAnimationFrame(tel);

    teken();
    return { el };
  },
};
