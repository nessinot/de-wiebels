// Plus- en minsommen per level. De moeilijkheidsstap schaalt het bereik binnen het level.

import { getalOpties, willekeurig } from './opties.js';

const SCHAAL = [0.6, 0.8, 1];

function cijfers(n) {
  return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10];
}

export function heeftOnthouden(a, b) {
  const ca = cijfers(a);
  const cb = cijfers(b);
  return ca.some((c, i) => c + cb[i] >= 10);
}

export function heeftLenen(a, b) {
  const ca = cijfers(a);
  const cb = cijfers(b);
  return ca.some((c, i) => cb[i] > c);
}

// Probeert willekeurige paren tot er een aan de voorwaarde voldoet.
function zoek(maakPaar, voorwaarde, rnd) {
  for (let i = 0; i < 1000; i++) {
    const [a, b] = maakPaar(rnd);
    if (voorwaarde(a, b)) return [a, b];
  }
  return maakPaar(rnd);
}

export function plusPaar(level, stap, rnd = Math.random) {
  const max = Math.max(10, Math.round(level.max * SCHAAL[stap]));
  if (level.tiental) return zoek((r) => [willekeurig(2, 9, r), willekeurig(2, 9, r)], (a, b) => a + b > 10, rnd);
  if (level.tientallen) return zoek((r) => [willekeurig(1, 9, r) * 10, willekeurig(1, 9, r) * 10], (a, b) => a + b <= max, rnd);
  const paar = (r) => {
    const a = willekeurig(1, max - 1, r);
    return [a, willekeurig(1, max - a, r)];
  };
  if (level.onthouden === true) return zoek(paar, (a, b) => a >= 100 && heeftOnthouden(a, b), rnd);
  if (level.onthouden === false) return zoek(paar, (a, b) => a >= 100 && !heeftOnthouden(a, b), rnd);
  return paar(rnd);
}

export function minPaar(level, stap, rnd = Math.random) {
  const max = Math.max(10, Math.round(level.max * SCHAAL[stap]));
  if (level.tiental) return zoek((r) => [willekeurig(11, 18, r), willekeurig(2, 9, r)], (a, b) => b > a % 10, rnd);
  if (level.tientallen) return zoek((r) => [willekeurig(2, 10, r) * 10, willekeurig(1, 9, r) * 10], (a, b) => b < a && a <= Math.max(max, 20), rnd);
  const paar = (r) => {
    const a = willekeurig(2, max, r);
    return [a, willekeurig(1, a, r)];
  };
  if (level.onthouden === true) return zoek(paar, (a, b) => a >= 100 && heeftLenen(a, b), rnd);
  if (level.onthouden === false) return zoek(paar, (a, b) => a >= 100 && b >= 10 && !heeftLenen(a, b), rnd);
  return paar(rnd);
}

// Bij kleine getallen zijn buurgetallen plausibel, bij grote ook een tiental ernaast.
function buren(antwoord) {
  return antwoord < 20 ? [antwoord - 1, antwoord + 1, antwoord - 2, antwoord + 2] : [antwoord - 10, antwoord + 10, antwoord - 1, antwoord + 1];
}

export function plusVraagUit(a, b, rnd = Math.random) {
  const antwoord = a + b;
  return {
    id: `plus:${a}+${b}`,
    tekst: `${a} + ${b} = ?`,
    goed: String(antwoord),
    opties: getalOpties(antwoord, buren(antwoord), rnd),
  };
}

export function minVraagUit(a, b, rnd = Math.random) {
  const antwoord = a - b;
  // Typische lenenfout: per cijfer het kleinste van het grootste aftrekken.
  const ca = cijfers(a);
  const cb = cijfers(b);
  const lenenFout = ca.reduce((som, c, i) => som + Math.abs(c - cb[i]) * 10 ** i, 0);
  return {
    id: `min:${a}-${b}`,
    tekst: `${a} − ${b} = ?`,
    goed: String(antwoord),
    opties: getalOpties(antwoord, a >= 20 ? [lenenFout, ...buren(antwoord)] : buren(antwoord), rnd),
  };
}

export function plusVraag(level, stap, rnd = Math.random) {
  const [a, b] = plusPaar(level, stap, rnd);
  return plusVraagUit(a, b, rnd);
}

export function minVraag(level, stap, rnd = Math.random) {
  const [a, b] = minPaar(level, stap, rnd);
  return minVraagUit(a, b, rnd);
}
