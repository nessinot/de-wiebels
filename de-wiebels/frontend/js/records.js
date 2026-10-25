// Tijdrace: zo snel mogelijk een vast aantal sommen goed. Alleen tegen je eigen record.

import { maakVraag } from './generators/index.js';
import { kies } from './generators/opties.js';
import { LEVELS, levelOpen } from './levels.js';

export const RACE_LENGTE = 20;

// De race gebruikt alle levels die open zijn in die wereld (leeg als alles op slot is).
export function raceLevels(profiel, vaardigheid) {
  return LEVELS[vaardigheid].filter((l) => levelOpen(profiel, l));
}

// Verschillende vragen uit de open levels door elkaar, elk op de moeilijkheid van zijn level.
// Zijn er te weinig verschillende sommen, dan komen er minder vragen terug.
export function raceVragen(profiel, vaardigheid, aantal, rnd = Math.random) {
  const levels = raceLevels(profiel, vaardigheid);
  const vragen = [];
  const ids = new Set();
  for (let poging = 0; levels.length && vragen.length < aantal && poging < 1000; poging++) {
    const level = kies(levels, rnd);
    const vraag = maakVraag(level, profiel.moeilijkheid[level.id] ?? 1, rnd);
    if (ids.has(vraag.id)) continue;
    ids.add(vraag.id);
    vragen.push({ ...vraag, levelId: level.id });
  }
  return vragen;
}

export function afgerond(seconden) {
  return Math.round(seconden * 10) / 10;
}

// Geeft true bij een nieuw record (lager is beter).
export function registreerTijd(profiel, vaardigheid, seconden) {
  const tijd = afgerond(seconden);
  const oud = profiel.records[vaardigheid];
  if (oud !== undefined && oud <= tijd) return false;
  profiel.records[vaardigheid] = tijd;
  return true;
}

export function tijdTekst(seconden) {
  return `${afgerond(seconden).toFixed(1).replace('.', ',')} s`;
}
