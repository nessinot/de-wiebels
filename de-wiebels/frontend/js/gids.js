// De eigen Wiebel als gids: linksonder in de sommen (ronde, eindbaas, tijdrace) en bij het resultaat,
// ongeveer 300 px hoog, met de spreekballon boven zijn hoofd. Hij staat in een eigen strook links van
// de som (css/wiebel.css), dus nooit achter de som of de knoppen.

import { BALLON_HTML, maakBallon } from './spreekballon.js';
import { vliegNaar } from './vliegen.js';
import { eigenWiebelStaat } from './weergave.js';
import { GROEI, wiebelSvg } from './wiebel.js';
import { LOSLATEN, VEER, bijna, blij, dans, gooi, rustig, sprongetje, wijs } from './wiebel-beweging.js';
import { COMBO_ZINNEN } from './zinnen.js';

export const GIDS_HOOGTE = 300;
const SCHAAL = GIDS_HOOGTE / 260;
// Hoogte boven de onderkant van het vak: de grond, en van de grond tot boven het hoofd bij volle grootte.
const GROND = (260 - 238) * SCHAAL;
const KOP = 216 * SCHAAL;

// kort: alleen korte reacties en geen ballon (tijdrace). stadium: om met een eerder stadium te
// beginnen (het resultaat laat daarna de groei zien).
export function maakGids(profiel, prefix, { kort = false, stadium } = {}) {
  const el = document.createElement('div');
  el.className = 'gids';
  el.setAttribute('aria-hidden', 'true');
  const staat = eigenWiebelStaat(profiel);
  if (stadium !== undefined) staat.stadium = stadium;
  el.innerHTML = `${kort ? '' : BALLON_HTML}<div class="gids-figuur"></div>`;
  const figuur = el.querySelector('.gids-figuur');
  const ballon = kort ? null : maakBallon(el);
  const wiebel = () => figuur.querySelector('.wiebel');
  const zeg = (gebeurtenis) => ballon?.zeg(gebeurtenis);

  function teken() {
    figuur.innerHTML = wiebelSvg(staat, prefix, { schaal: SCHAAL });
    // De ballon staat net boven het hoofd, ook als de Wiebel nog klein is.
    el.style.setProperty('--kop', `${Math.round(GROND + KOP * GROEI[wiebel().dataset.stadium] + 14)}px`);
  }
  teken();

  return {
    el,
    wiebel,
    zeg,
    blij() {
      blij(wiebel());
    },
    goed() {
      sprongetje(wiebel());
      zeg('goed');
    },
    // Bij 3, 5 of 10 op rij dansen (het vuurwerk doet het scherm).
    combo(aantal) {
      dans(wiebel());
      zeg(COMBO_ZINNEN[aantal]);
    },
    // Een vaste zin { id, tekst } zeggen, zoals een vraag over Nederland.
    spreek(zin) {
      ballon?.praat(zin.tekst, zin.id);
    },
    // Rustig knikken en naar het goede antwoord wijzen. Geen straf. Met een zin ("Dat is Middelburg.")
    // zegt hij die in plaats van "bijna".
    fout(zin) {
      bijna(wiebel());
      if (kort) return;
      wijs(wiebel());
      if (zin) ballon.praat(zin.tekst, zin.id);
      else zeg('bijna');
    },
    // Eindbaas: een ster naar de baas gooien; opRaak volgt als hij aankomt.
    gooiSter(doel, opRaak) {
      const w = wiebel();
      gooi(w);
      zeg('baasRaak');
      vliegNaar(el.parentElement, '⭐', w.querySelector('.w-arm-basis.r'), doel, { vertraging: LOSLATEN, duur: 420, boog: 120, draai: 540, grootte: 90 })
        .then(opRaak);
    },
    // Groeien naar een nieuw stadium: de nieuwe Wiebel veert op vanuit de oude maat.
    groei(nieuwStadium) {
      const oud = GROEI[wiebel().dataset.stadium];
      staat.stadium = nieuwStadium;
      teken();
      const w = wiebel();
      if (!rustig()) w.animate([{ transform: `scale(${oud / GROEI[nieuwStadium]})` }, { transform: 'scale(1)' }], { duration: 900, easing: VEER });
      blij(w);
      zeg('gegroeid');
    },
    // Een net bevrijde Wiebel springt erbij en blijft naast de gids staan.
    vriend(html) {
      const vriend = document.createElement('span');
      vriend.className = 'gids-vriend';
      vriend.innerHTML = html;
      el.append(vriend);
      zeg('bevrijd');
      if (rustig()) return;
      vriend.animate([
        { transform: 'translate(320px, 0)', opacity: 0 },
        { transform: 'translate(220px, -110px)', opacity: 1, offset: 0.25 },
        { transform: 'translate(120px, 0)', offset: 0.5 },
        { transform: 'translate(50px, -60px)', offset: 0.72 },
        { transform: 'translate(0, 0)', offset: 0.9 },
        { transform: 'translate(0, 0) scale(1.1, .9)', offset: 0.95 },
        { transform: 'translate(0, 0)' },
      ], { duration: 1200, easing: 'ease-in-out', fill: 'backwards' });
    },
  };
}
