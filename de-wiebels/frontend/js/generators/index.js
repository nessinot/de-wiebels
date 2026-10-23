// Kiest de juiste generator per vaardigheid.

import { keerVraag, keerVraagUit } from './keer.js';

const GENERATORS = {
  keer: keerVraag,
};

export function maakVraag(level, stap = 1, rnd = Math.random) {
  return GENERATORS[level.vaardigheid](level, stap, rnd);
}

// Bouwt een eerder gestelde vraag opnieuw op uit het item-id (voor herhaling).
export function vraagUitId(id, rnd = Math.random) {
  const [soort, rest] = id.split(':');
  if (soort === 'keer') {
    const [a, tafel] = rest.split('x').map(Number);
    return keerVraagUit(a, tafel, false, rnd);
  }
  return null;
}

export function maakVragen(level, aantal, stap = 1, rnd = Math.random) {
  const vragen = [];
  const ids = new Set();
  for (let poging = 0; vragen.length < aantal && poging < 500; poging++) {
    const vraag = maakVraag(level, stap, rnd);
    if (ids.has(vraag.id) && poging < 400) continue;
    ids.add(vraag.id);
    vragen.push(vraag);
  }
  return vragen;
}
