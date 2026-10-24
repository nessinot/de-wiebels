// Geluiden met de Web Audio API, zonder audiobestanden. Vrolijk bij goed, zacht en neutraal bij fout.
// (Alleen de stem en de muziek zijn bestanden: zie stem.js en muziek.js.)

import { opslag } from './opslag.js';

let ctx = null;

// Browsers staan geluid pas toe na een handeling van de gebruiker.
function ontgrendel() {
  if (!ctx) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    ctx = new Context();
  }
  if (ctx.state === 'suspended') ctx.resume();
}

// (Onder Node, in de tests, is er geen window.)
globalThis.addEventListener?.('keydown', ontgrendel);
globalThis.addEventListener?.('pointerdown', ontgrendel);

// Dezelfde AudioContext voor de stem en de muziek (stem.js, muziek.js); null tot de eerste toets.
export const geefContext = () => ctx;

function noot(frequentie, start, duur, { type = 'sine', volume = 0.18 } = {}) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.value = frequentie;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duur + 0.05);
}

const GELUIDEN = {
  goed: () => {
    noot(523, 0, 0.15);
    noot(784, 0.1, 0.25);
  },
  combo: () => [523, 659, 784, 1047].forEach((f, i) => noot(f, i * 0.08, 0.3)),
  fout: () => noot(262, 0, 0.35, { type: 'triangle', volume: 0.07 }),
  raak: () => noot(196, 0, 0.12, { type: 'square', volume: 0.06 }),
  gewonnen: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => noot(f, i * 0.12, 0.35)),
};

export function speel(naam) {
  if (!ctx || !opslag.instellingen().geluid) return;
  GELUIDEN[naam]?.();
}
