// Tijdrace: zo snel mogelijk een vast aantal sommen goed. Alleen tegen je eigen record.

import { LEVELS, levelOpen } from './levels.js';

export const RACE_LENGTE = 20;

// De race gebruikt het hoogste level dat open is in die wereld.
export function raceLevel(profiel, vaardigheid) {
  const open = LEVELS[vaardigheid].filter((l) => levelOpen(profiel, l));
  return open[open.length - 1] || null;
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
