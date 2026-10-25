// Eindbaas: elk goed antwoord raakt de baas. Fouten kosten niets.

import { maakVraag } from './generators/index.js';
import { kies } from './generators/opties.js';
import { LEVELS } from './levels.js';

export const BAAS_LEVENS = 10;
export const BAAS_BELONING = 10;
export const TIJD_PER_VRAAG = 20; // seconden, alleen als tijdsdruk aan staat

export function nieuwGevecht() {
  return { levens: BAAS_LEVENS, beurten: 0, gesteld: new Set(), vorige: null };
}

export function verwerk(gevecht, goed) {
  gevecht.beurten += 1;
  if (goed) gevecht.levens = Math.max(0, gevecht.levens - 1);
  return { verslagen: gevecht.levens === 0 };
}

function willekeurigeVraag(profiel, vaardigheid, rnd) {
  const level = kies(LEVELS[vaardigheid], rnd);
  return { vraag: maakVraag(level, profiel.moeilijkheid[level.id] ?? 1, rnd), level };
}

// Een vraag uit een willekeurig level van de wereld, op de moeilijkheid van dat level. Een som
// komt in één gevecht niet twee keer; lukt dat niet, dan in elk geval niet twee keer achter elkaar.
export function baasVraag(profiel, vaardigheid, gevecht, rnd = Math.random) {
  let gekozen = null;
  for (let poging = 0; poging < 100 && !gekozen; poging++) {
    const kandidaat = willekeurigeVraag(profiel, vaardigheid, rnd);
    if (!gevecht.gesteld.has(kandidaat.vraag.id)) gekozen = kandidaat;
  }
  while (!gekozen) {
    const kandidaat = willekeurigeVraag(profiel, vaardigheid, rnd);
    if (kandidaat.vraag.id !== gevecht.vorige) gekozen = kandidaat;
  }
  gevecht.gesteld.add(gekozen.vraag.id);
  gevecht.vorige = gekozen.vraag.id;
  return gekozen;
}
