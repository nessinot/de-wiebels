// De spreekballon: één onderdeel voor alles wat de Wiebel zegt (hoofdmenu, Aanpassen, winkeltje,
// profiel maken, de sommen en het resultaat). Het praten zit alleen hier.

import { laadZin, speelZin } from './stem.js';
import { rustig } from './wiebel-beweging.js';
import { kiesZin } from './zinnen.js';

export const BALLON_HTML = '<span class="bubbel" hidden></span>';

// Praten in de .bubbel binnen houder. Met een zin-id en een opgenomen stem (stem.js) staat de tekst
// meteen in de ballon en beweegt de mond van elke Wiebel in houder op het volume van de stem.
// Anders verschijnt de tekst letter voor letter en gaat de mond open op klinkers, half op
// medeklinkers en dicht op spaties.
// Geeft praat(tekst, id) terug; praat.stop() breekt af. blijftStaan: de ballon blijft na afloop zichtbaar.
// praat() geeft een belofte die vervult als de zin klaar is of wordt afgebroken.
export function maakSpreker(houder, blijftStaan = false) {
  let beurt = 0;
  let stopStem = null;
  let vervulVorige = null;
  function praat(tekst, id) {
    const mijn = ++beurt;
    stopStem?.();
    stopStem = null;
    vervulVorige?.();
    let vervul;
    const belofte = new Promise((r) => { vervul = r; });
    vervulVorige = vervul;
    const wiebels = [...houder.querySelectorAll('.wiebel')];
    const monden = wiebels.map((w) => w.querySelector('.w-mond-open'));
    const bubbel = houder.querySelector('.bubbel');
    const zetMond = (open) => monden.forEach((m) => { m.style.transform = `scaleY(${open})`; });
    const klaar = () => {
      wiebels.forEach((w) => { w.dataset.mond = 'rust'; });
      if (!blijftStaan) setTimeout(() => { if (mijn === beurt) bubbel.hidden = true; }, 1800);
      vervul();
    };

    function metStem(buffer) {
      bubbel.hidden = false;
      bubbel.textContent = tekst;
      if (!rustig()) wiebels.forEach((w) => { w.dataset.mond = 'open'; });
      stopStem = speelZin(buffer, {
        // Zonder bewegingen (prefers-reduced-motion) blijft de mond dicht.
        bijVolume: (open) => {
          if (!houder.isConnected) stopStem?.();
          else if (!rustig()) zetMond(open);
        },
        klaar: () => {
          stopStem = null;
          if (mijn === beurt) klaar();
        },
      });
    }

    function letters() {
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

    if (!id) letters();
    else laadZin(id, tekst).then((buffer) => {
      if (mijn !== beurt) return;
      if (buffer) metStem(buffer);
      else letters();
    });
    return belofte;
  }
  praat.stop = () => {
    beurt++;
    stopStem?.();
    stopStem = null;
    vervulVorige?.();
  };
  return praat;
}

// Ballon met zinnen per gebeurtenis (zinnen.js). zeg() geeft de belofte van praat() terug.
export function maakBallon(houder, { blijftStaan = false } = {}) {
  const praat = maakSpreker(houder, blijftStaan);
  return {
    praat,
    zeg(gebeurtenis) {
      const zin = kiesZin(gebeurtenis);
      return praat(zin.tekst, zin.id);
    },
    stop() {
      praat.stop();
      const bubbel = houder.querySelector('.bubbel');
      if (bubbel) bubbel.hidden = true;
    },
  };
}
