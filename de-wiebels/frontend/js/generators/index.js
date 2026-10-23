// Kiest de juiste generator per vaardigheid.

import { delenVraag, delenVraagUit } from './delen.js';
import { keerVraag, keerVraagUit } from './keer.js';
import { klokVraag, klokVraagUit } from './klok.js';
import { minVraag, minVraagUit, plusVraag, plusVraagUit } from './plusmin.js';

const GENERATORS = {
  plus: plusVraag,
  min: minVraag,
  keer: keerVraag,
  delen: delenVraag,
  klok: klokVraag,
};

export function maakVraag(level, stap = 1, rnd = Math.random) {
  return GENERATORS[level.vaardigheid](level, stap, rnd);
}

// Bouwt een eerder gestelde vraag opnieuw op uit het item-id (voor herhaling).
export function vraagUitId(id, rnd = Math.random) {
  const [soort, rest, ...meer] = id.split(':');
  if (soort === 'plus') return plusVraagUit(...rest.split('+').map(Number), rnd);
  if (soort === 'min') return minVraagUit(...rest.split('-').map(Number), rnd);
  if (soort === 'keer') return keerVraagUit(...rest.split('x').map(Number), false, rnd);
  if (soort === 'delen') return delenVraagUit(Number(rest), Number(meer[0]), rnd);
  if (soort === 'klok') return klokVraagUit(rest, Number(meer[0]), Number(meer[1]), 5, rnd);
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
