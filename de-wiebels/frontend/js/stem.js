// De stem van de Wiebel: vooraf ingesproken zinnen (geluid/stem/), afgespeeld via de AudioContext
// van geluid.js. Een AnalyserNode meet het volume, zodat de mond meebeweegt. Er praat er steeds één.

import { geefContext } from './geluid.js';
import { stemBestand, mondOpening, STEM_MAP } from './geluidsbestanden.js';
import { opslag } from './opslag.js';

let manifest = null;
const bytes = new Map(); // pad → belofte van de mp3 (klein; ontleden gebeurt per keer)
let huidige = null; // stop() van de zin die nu klinkt

function leesManifest() {
  manifest ??= fetch(`${STEM_MAP}manifest.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return manifest;
}

// Laadt de zin. Geeft een AudioBuffer, of null als er geen stem is: stem uit, nog geen geluid
// toegestaan (vóór de eerste toets), geen bestand voor deze tekst, of een fout.
export async function laadZin(id, tekst) {
  const ctx = geefContext();
  if (!id || !ctx || !opslag.instellingen().stem) return null;
  const pad = stemBestand(await leesManifest(), id, tekst);
  if (!pad) return null;
  if (!bytes.has(pad)) {
    bytes.set(pad, fetch(pad).then((r) => {
      if (!r.ok) throw new Error(`${pad}: ${r.status}`);
      return r.arrayBuffer();
    }));
  }
  try {
    return await ctx.decodeAudioData((await bytes.get(pad)).slice(0));
  } catch {
    bytes.delete(pad);
    return null;
  }
}

// Speelt een geladen zin. bijVolume(opening) wordt elk beeld aangeroepen, klaar() aan het eind of
// bij stoppen. Geeft stop() terug.
export function speelZin(buffer, { bijVolume, klaar }) {
  stopStem();
  const ctx = geefContext();
  const bron = ctx.createBufferSource();
  bron.buffer = buffer;
  const meter = ctx.createAnalyser();
  meter.fftSize = 512;
  bron.connect(meter).connect(ctx.destination);
  const monsters = new Float32Array(meter.fftSize);
  let beeld = 0;
  let klinkt = true;

  function stop() {
    if (!klinkt) return;
    klinkt = false;
    bron.onended = null;
    try { bron.stop(); } catch { /* al gestopt */ }
    cancelAnimationFrame(beeld);
    if (huidige === stop) huidige = null;
    klaar();
  }
  (function meet() {
    meter.getFloatTimeDomainData(monsters);
    bijVolume(mondOpening(monsters));
    beeld = requestAnimationFrame(meet);
  })();
  bron.onended = stop;
  bron.start();
  huidige = stop;
  return stop;
}

export function stopStem() {
  huidige?.();
}
