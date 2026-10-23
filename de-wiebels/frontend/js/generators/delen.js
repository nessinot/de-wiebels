// Deelsommen per tafel; ze gaan altijd op.

import { getalOpties, kies, willekeurig } from './opties.js';

export function delenVraagUit(deeltal, deler, rnd = Math.random) {
  const antwoord = deeltal / deler;
  return {
    id: `delen:${deeltal}:${deler}`,
    tekst: `${deeltal} : ${deler} = ?`,
    goed: String(antwoord),
    opties: getalOpties(antwoord, [antwoord + 1, antwoord - 1, antwoord + 2, deler], rnd),
  };
}

export function delenVraag(level, stap, rnd = Math.random) {
  const deler = kies(level.tafels, rnd);
  const a = stap === 2 && rnd() < 0.6 ? willekeurig(6, 9, rnd) : willekeurig(1, 10, rnd);
  return delenVraagUit(a * deler, deler, rnd);
}
