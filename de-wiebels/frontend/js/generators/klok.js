// Klokvragen. Het level bepaalt de minutenstap (hele uren, halve uren, ... op de minuut).

import { digitaal, klokSvg } from '../klok.js';
import { kies, schud, willekeurig } from './opties.js';

const uur12 = (uur) => ((uur + 11) % 12) + 1;

function tijdOptie(uur, minuut) {
  return { sleutel: `${uur12(uur)}:${minuut}`, html: digitaal(uur12(uur), minuut), tijd: { uur, minuut } };
}

// Foute tijden: verwisselde wijzers, een uur ernaast, een stap ernaast.
export function fouteTijden(uur, minuut, stap) {
  const kandidaten = [
    { uur: minuut === 0 ? 12 : Math.round(minuut / 5) || 12, minuut: (uur12(uur) % 12) * 5 },
    { uur: uur12(uur + 1), minuut },
    { uur: uur12(uur - 1), minuut },
    { uur, minuut: (minuut + Math.max(stap, 5)) % 60 },
    { uur, minuut: (minuut + 60 - Math.max(stap, 5)) % 60 },
    { uur: uur12(uur + 1), minuut: (minuut + 30) % 60 },
  ];
  return kandidaten;
}

export function tijdOpties(uur, minuut, stap, rnd = Math.random) {
  const goed = tijdOptie(uur, minuut);
  const fout = [];
  // De verwisselde wijzers zijn de meest voor de hand liggende fout en gaan altijd mee.
  const [verwisseld, ...rest] = fouteTijden(uur, minuut, stap);
  for (const t of [verwisseld, ...schud(rest, rnd)]) {
    const o = tijdOptie(t.uur, t.minuut);
    if (fout.length < 3 && o.sleutel !== goed.sleutel && !fout.some((f) => f.sleutel === o.sleutel)) fout.push(o);
  }
  for (let extra = 1; fout.length < 3; extra++) {
    const o = tijdOptie(uur + extra + 1, minuut);
    if (o.sleutel !== goed.sleutel && !fout.some((f) => f.sleutel === o.sleutel)) fout.push(o);
  }
  return { goed: goed.sleutel, opties: schud([goed, ...fout], rnd) };
}

export function willekeurigeTijd(level, rnd = Math.random) {
  const stap = level.stap;
  const uur = level.uur24 ? willekeurig(0, 23, rnd) : willekeurig(1, 12, rnd);
  const minuut = stap === 60 ? 0 : willekeurig(0, 60 / stap - 1, rnd) * stap;
  return { uur, minuut };
}

const TYPES = {
  lezen(uur, minuut, stap, rnd) {
    const { goed, opties } = tijdOpties(uur, minuut, stap, rnd);
    return {
      soort: 'klok',
      tekst: `<div class="klokvraag">${klokSvg(uur, minuut, 'klok-groot')}<span>Hoe laat is het?</span></div>`,
      klok: { uur, minuut },
      goed,
      opties,
    };
  },
};

export function klokVraagUit(type, uur, minuut, stap = 5, rnd = Math.random) {
  return { id: `klok:${type}:${uur}:${minuut}`, ...TYPES[type](uur, minuut, stap, rnd) };
}

export function klokTypes(level) {
  return ['lezen'];
}

export function klokVraag(level, stap, rnd = Math.random) {
  const { uur, minuut } = willekeurigeTijd(level, rnd);
  return klokVraagUit(kies(klokTypes(level), rnd), uur, minuut, level.stap, rnd);
}
