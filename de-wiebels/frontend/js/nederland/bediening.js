// Bediening van de kaart: met de pijltjes langs provincies, stippen en gebieden, OK kiest, en de muis
// of Magic Remote wijst aan en klikt. De paden zelf hebben geen data-focus: de focus van het scherm
// staat op het HTML-omhulsel .kaartvak, en het scherm stuurt de pijltjes en OK via bijToets hierheen.

import { BUREN } from './buren.js';
import { PER_ID, doelPunt } from './kaartbeeld.js';

const RICHTING = { links: [-1, 0], rechts: [1, 0], omhoog: [0, -1], omlaag: [0, 1] };

// Het volgende doel in een richting, of null als daar niets ligt. Provincies volgen de vaste
// burentabel. Stippen en gebieden zijn punten (doelPunt): het dichtstbijzijnde punt binnen een kwart
// rond de richting (45° naar elke kant), en anders het best passende punt in die helft van de kaart.
// nederland-buren.test.js controleert dat zo elk punt bereikbaar is; met kiesVolgende uit focus.js
// bleef tussen de stippen soms een punt onbereikbaar.
export function volgende(huidig, richting, doelen, vak = null) {
  if (PER_ID[huidig]?.soort === 'provincie') {
    const buur = BUREN[huidig]?.[richting];
    return buur && doelen.includes(buur) ? buur : null;
  }
  const [hx, hy] = doelPunt(huidig, vak);
  const [rx, ry] = RICHTING[richting];
  let inKwart = null;
  let kwartAfstand = Infinity;
  let inHelft = null;
  let helftScore = Infinity;
  for (const id of doelen) {
    if (id === huidig) continue;
    const [x, y] = doelPunt(id, vak);
    const mee = (x - hx) * rx + (y - hy) * ry;
    const dwars = Math.abs((x - hx) * ry - (y - hy) * rx);
    if (mee <= 0) continue;
    const afstand = Math.hypot(x - hx, y - hy);
    if (dwars <= mee && afstand < kwartAfstand) {
      kwartAfstand = afstand;
      inKwart = id;
    }
    if (mee + 2 * dwars < helftScore) {
      helftScore = mee + 2 * dwars;
      inHelft = id;
    }
  }
  return inKwart ?? inHelft;
}

// kaartvak: het element met de SVG van kaartSvg. doelen: dezelfde ids als bij kaartSvg.
// opFocus(id) bij elk ander aangewezen doel, opKies(id) bij OK of een klik.
export function maakKaartbediening(kaartvak, { doelen, vak = null, begin = null, opFocus = () => {}, opKies = () => {} }) {
  let huidig = null;
  let zichtbaar = false;

  const elVan = (id) => kaartvak.querySelector(`[data-doel="${id}"]`);

  function toon() {
    kaartvak.querySelector('.nl-focus')?.classList.remove('nl-focus');
    if (!zichtbaar || !huidig) return;
    const el = elVan(huidig);
    // Achteraan in de eigen groep, zodat de dikke rand bovenop de buren ligt.
    el.parentNode.append(el);
    el.classList.add('nl-focus');
  }

  function zet(id) {
    if (id === huidig || !doelen.includes(id)) return;
    huidig = id;
    toon();
    opFocus(id);
  }

  kaartvak.addEventListener('pointerover', (e) => {
    const el = e.target.closest?.('[data-doel]');
    if (el) zet(el.dataset.doel);
  });
  kaartvak.addEventListener('click', (e) => {
    const el = e.target.closest?.('[data-doel]');
    if (!el) return;
    zet(el.dataset.doel);
    opKies(el.dataset.doel);
  });

  return {
    get huidig() { return huidig; },
    // Het kaartvak krijgt of verliest de focus van het scherm.
    actief(aan) {
      zichtbaar = aan;
      if (aan && !huidig) huidig = doelen.includes(begin) ? begin : doelen[0] ?? null;
      if (aan && huidig) opFocus(huidig);
      toon();
    },
    // Een pijltje of OK terwijl het kaartvak de focus heeft. false: de gewone focus gaat verder.
    toets(actie) {
      if (!huidig) return false;
      if (actie === 'ok') {
        opKies(huidig);
        return true;
      }
      if (!['links', 'rechts', 'omhoog', 'omlaag'].includes(actie)) return false;
      const naar = volgende(huidig, actie, doelen, vak);
      if (!naar) return false;
      zet(naar);
      return true;
    },
  };
}
