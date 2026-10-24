// De spreekballon: één onderdeel voor alles wat de Wiebel zegt (hoofdmenu, Aanpassen, winkeltje,
// profiel maken, de sommen en het resultaat). Het praten zit alleen hier, zodat de stem het later op
// één plek kan overnemen.

import { rustig } from './wiebel-beweging.js';
import { kiesZin } from './zinnen.js';

export const BALLON_HTML = '<span class="bubbel" hidden></span>';

// Praten: de tekst verschijnt letter voor letter in de .bubbel binnen houder, en de mond van elke
// Wiebel in houder gaat open op klinkers, half op medeklinkers en dicht op spaties.
// Geeft praat(tekst) terug; praat.stop() breekt af. blijftStaan: de ballon blijft na afloop zichtbaar.
export function maakSpreker(houder, blijftStaan = false) {
  let beurt = 0;
  function praat(tekst) {
    const mijn = ++beurt;
    const wiebels = [...houder.querySelectorAll('.wiebel')];
    const monden = wiebels.map((w) => w.querySelector('.w-mond-open'));
    const bubbel = houder.querySelector('.bubbel');
    const zetMond = (open) => monden.forEach((m) => { m.style.transform = `scaleY(${open})`; });
    const klaar = () => {
      wiebels.forEach((w) => { w.dataset.mond = 'rust'; });
      if (!blijftStaan) setTimeout(() => { if (mijn === beurt) bubbel.hidden = true; }, 1800);
    };
    bubbel.hidden = false;
    if (rustig()) {
      bubbel.textContent = tekst;
      klaar();
      return;
    }
    bubbel.textContent = '';
    wiebels.forEach((w) => { w.dataset.mond = 'open'; });
    let i = 0;
    (function stap() {
      if (mijn !== beurt) return;
      if (i < tekst.length) {
        const c = tekst[i].toLowerCase();
        zetMond('aeiouyë'.includes(c) ? 0.85 + Math.random() * 0.15 : /[a-z]/.test(c) ? 0.35 + Math.random() * 0.25 : 0.08);
        bubbel.textContent = tekst.slice(0, ++i);
        setTimeout(stap, 58);
        return;
      }
      zetMond(0.1);
      klaar();
    })();
  }
  praat.stop = () => { beurt++; };
  return praat;
}

// Ballon met zinnen per gebeurtenis (zinnen.js). zeg() geeft de gekozen zin terug ({ id, tekst }).
export function maakBallon(houder, { blijftStaan = false } = {}) {
  const praat = maakSpreker(houder, blijftStaan);
  return {
    praat,
    zeg(gebeurtenis) {
      const zin = kiesZin(gebeurtenis);
      praat(zin.tekst);
      return zin;
    },
    stop() {
      praat.stop();
      const bubbel = houder.querySelector('.bubbel');
      if (bubbel) bubbel.hidden = true;
    },
  };
}
