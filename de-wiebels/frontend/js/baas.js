// Eindbaas: elk goed antwoord raakt de baas. Fouten kosten niets.

import { maakVraag } from './generators/index.js';
import { kies } from './generators/opties.js';
import { LEVELS } from './levels.js';

export const BAAS_LEVENS = 10;
export const BAAS_BELONING = 10;
export const TIJD_PER_VRAAG = 20; // seconden, alleen als tijdsdruk aan staat

export function nieuwGevecht() {
  return { levens: BAAS_LEVENS, beurten: 0 };
}

export function verwerk(gevecht, goed) {
  gevecht.beurten += 1;
  if (goed) gevecht.levens = Math.max(0, gevecht.levens - 1);
  return { verslagen: gevecht.levens === 0 };
}

// Een vraag uit een willekeurig level van de wereld, op de moeilijkheid van dat level.
export function baasVraag(profiel, vaardigheid, rnd = Math.random) {
  const level = kies(LEVELS[vaardigheid], rnd);
  return { vraag: maakVraag(level, profiel.moeilijkheid[level.id] ?? 1, rnd), level };
}
