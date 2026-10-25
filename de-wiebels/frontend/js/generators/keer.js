// Keersommen per tafel, altijd a × tafel (de tafel achteraan). Stap 2: vaker de lastige 6 t/m 9.

import { getalOpties, kies, willekeurig } from './opties.js';

export function keerVraagUit(a, tafel, rnd = Math.random) {
  const antwoord = a * tafel;
  const plausibel = [(a + 1) * tafel, (a - 1) * tafel, a * (tafel + 1), a * (tafel - 1)];
  return {
    id: `keer:${a}x${tafel}`,
    tekst: `${a} × ${tafel} = ?`,
    goed: String(antwoord),
    opties: getalOpties(antwoord, plausibel, rnd),
  };
}

export function keerVraag(level, stap, rnd = Math.random) {
  const tafel = kies(level.tafels, rnd);
  const a = stap === 2 && rnd() < 0.6 ? willekeurig(6, 9, rnd) : willekeurig(1, 10, rnd);
  return keerVraagUit(a, tafel, rnd);
}
