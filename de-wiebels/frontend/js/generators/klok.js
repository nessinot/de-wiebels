// Klokvragen. Het level bepaalt de minutenstap (hele uren, halve uren, ... op de minuut).

import { dagdeel, digitaal, klokSvg, tijdInWoorden } from '../klok.js';
import { kies, schud, willekeurig } from './opties.js';

const uur12 = (uur) => ((uur + 11) % 12) + 1;

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

// weergave bepaalt hoe een optie eruitziet: digitaal, als klokje of in woorden.
const WEERGAVE = {
  digitaal: (uur, minuut) => digitaal(uur12(uur), minuut),
  klok: (uur, minuut) => klokSvg(uur, minuut),
  woorden: (uur, minuut) => tijdInWoorden(uur, minuut),
};

export function tijdOpties(uur, minuut, stap, rnd = Math.random, weergave = 'digitaal') {
  const tijdOptie = (u, m) => ({ sleutel: `${uur12(u)}:${m}`, html: WEERGAVE[weergave](u, m), tijd: { uur: u, minuut: m } });
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

function klokVraagMet(uur, minuut, vraagtekst) {
  return `<div class="klokvraag">${klokSvg(uur, minuut, 'klok-groot')}<span>${vraagtekst}</span></div>`;
}

const TYPES = {
  // Wijzerklok → digitale tijd.
  lezen(uur, minuut, stap, rnd) {
    return { soort: 'klok', tekst: klokVraagMet(uur, minuut, 'Hoe laat is het?'), klok: { uur, minuut }, ...tijdOpties(uur, minuut, stap, rnd) };
  },
  // Wijzerklok → tijd in woorden.
  woorden(uur, minuut, stap, rnd) {
    return { soort: 'klok', optieSoort: 'tekst', tekst: klokVraagMet(uur, minuut, 'Hoe zeg je dit?'), klok: { uur, minuut }, ...tijdOpties(uur, minuut, stap, rnd, 'woorden') };
  },
  // Digitale tijd → welke wijzerklok hoort erbij.
  digitaal(uur, minuut, stap, rnd) {
    return {
      soort: 'digitaal',
      optieSoort: 'klok',
      tekst: `<div class="digitale-tijd">${digitaal(uur, minuut)}</div><div class="vraagregel">Welke klok hoort erbij?</div>`,
      ...tijdOpties(uur, minuut, stap, rnd, 'klok'),
    };
  },
  // Wijzers zetten met de pijltjes: links/rechts de minuten, op/neer het uur.
  zetten(uur, minuut, stap) {
    return {
      soort: 'klok',
      interactief: 'zetten',
      tekst: `<div class="klokvraag">${klokSvg(12, 0, 'klok-groot')}<span>Zet de klok op<br><strong>${tijdInWoorden(uur, minuut)}</strong></span></div>`,
      klok: { uur, minuut },
      zetStap: stap === 1 || minuut % 5 ? 1 : 5,
      goed: `${uur12(uur)}:${minuut}`,
      opties: [],
    };
  },
  // 24-uursklok → tijd in woorden met dagdeel.
  dag(uur, minuut, stap, rnd) {
    const optie = (u, m) => {
      const d = dagdeel(u);
      return { sleutel: `${u}:${m}`, html: `${d.icoon} ${tijdInWoorden(u, m)} ${d.woorden}` };
    };
    const goed = optie(uur, minuut);
    const fout = [];
    // Dezelfde tijd in het andere dagdeel is de kern van de oefening en gaat altijd mee.
    const rest = schud([[(uur + 1) % 24, minuut], [(uur + 23) % 24, minuut], [uur, (minuut + 30) % 60], [(uur + 6) % 24, minuut]], rnd);
    for (const [u, m] of [[(uur + 12) % 24, minuut], ...rest]) {
      const o = optie(u, m);
      if (fout.length < 3 && o.html !== goed.html && !fout.some((f) => f.html === o.html)) fout.push(o);
    }
    return {
      soort: 'digitaal',
      optieSoort: 'tekst',
      tekst: `<div class="digitale-tijd">${digitaal(uur, minuut)}</div><div class="vraagregel">Hoe zeg je dit?</div>`,
      goed: goed.sleutel,
      opties: schud([goed, ...fout], rnd),
    };
  },
};

export function klokVraagUit(type, uur, minuut, stap = 5, rnd = Math.random) {
  return { id: `klok:${type}:${uur}:${minuut}`, ...TYPES[type](uur, minuut, stap, rnd) };
}

export function klokTypes(level) {
  return level.uur24 ? ['dag', 'dag', 'lezen', 'zetten'] : ['lezen', 'woorden', 'digitaal', 'zetten'];
}

export function klokVraag(level, stap, rnd = Math.random) {
  const { uur, minuut } = willekeurigeTijd(level, rnd);
  return klokVraagUit(kies(klokTypes(level), rnd), uur, minuut, level.stap, rnd);
}
