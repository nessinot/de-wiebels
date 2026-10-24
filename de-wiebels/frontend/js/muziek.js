// Zachte muziek per thema (geluid/muziek/) in het hoofdmenu, het winkeltje en bij Aanpassen; in de
// sommen is het stil. Zacht in- en uitfaden, laag volume. Het stuk loopt rond met een kleine
// overlap, zodat de naad niet te horen is. Via de AudioContext van geluid.js.

import { geefContext } from './geluid.js';
import { MUZIEK_MAP, muziekBestand } from './geluidsbestanden.js';
import { opslag } from './opslag.js';

const VOLUME = 0.12;
const INFADEN = 1.5;
const UITFADEN = 1;
const OVERLAP = 2; // seconden dat het einde en het begin van het stuk over elkaar heen lopen

let manifest = null;
let gewenst = null; // pad van het stuk dat nu hoort te spelen
let speelt = null; // { pad, gain, bronnen, timer }
let laatst = null; // { pad, buffer }: het laatst geladen stuk, zodat terugkomen in het menu meteen klinkt

function leesManifest() {
  manifest ??= fetch(`${MUZIEK_MAP}manifest.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return manifest;
}

// Na elke schermwissel: het juiste stuk voor dit scherm en thema, of stilte.
export async function muziekVoor(scherm, thema) {
  const ctx = geefContext();
  const pad = ctx ? muziekBestand(await leesManifest(), scherm, thema, opslag.instellingen().muziek) : null;
  gewenst = pad;
  if (speelt?.pad === pad) return;
  stop();
  if (!pad) return;
  let buffer = laatst?.pad === pad ? laatst.buffer : null;
  try {
    buffer ??= await ctx.decodeAudioData(await (await fetch(pad)).arrayBuffer());
  } catch {
    return;
  }
  laatst = { pad, buffer };
  // Intussen naar een ander scherm, of al gestart door een eerdere aanroep?
  if (gewenst !== pad || speelt?.pad === pad) return;
  stop();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + INFADEN);
  gain.connect(ctx.destination);
  speelt = { pad, gain, bronnen: new Set(), timer: 0 };
  ronde(ctx, speelt, buffer, ctx.currentTime);
}

// Eén keer het stuk, met in- en uitfaden over de overlap; de volgende ronde start voor het einde.
function ronde(ctx, stuk, buffer, start) {
  const eind = start + buffer.duration;
  const bron = ctx.createBufferSource();
  bron.buffer = buffer;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(1, start + OVERLAP);
  g.gain.setValueAtTime(1, eind - OVERLAP);
  g.gain.linearRampToValueAtTime(0, eind);
  bron.connect(g).connect(stuk.gain);
  bron.start(start);
  bron.stop(eind);
  stuk.bronnen.add(bron);
  bron.onended = () => stuk.bronnen.delete(bron);
  const volgende = eind - OVERLAP;
  stuk.timer = setTimeout(() => ronde(ctx, stuk, buffer, volgende), Math.max(0, volgende - ctx.currentTime - 1) * 1000);
}

function stop() {
  if (!speelt) return;
  const { gain, bronnen, timer } = speelt;
  const ctx = geefContext();
  speelt = null;
  clearTimeout(timer);
  // Vanaf het huidige volume (ook midden in het infaden) naar stil.
  gain.gain.cancelAndHoldAtTime(ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + UITFADEN);
  setTimeout(() => {
    bronnen.forEach((b) => b.stop());
    gain.disconnect();
  }, UITFADEN * 1000 + 100);
}
