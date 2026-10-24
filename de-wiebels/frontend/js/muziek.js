// Zachte muziek per thema (geluid/muziek/) op alle schermen na de profielkeuze: normaal in de menu's,
// zachter in de sommen (volume per scherm in geluidsbestanden.js). Bij een schermwissel met hetzelfde
// stuk glijdt alleen het volume; terwijl de Wiebel praat, klinkt de muziek zachter. Het stuk loopt
// rond met een kleine overlap, zodat de naad niet te horen is. Via de AudioContext van geluid.js.

import { geefContext } from './geluid.js';
import { MUZIEK_BIJ_SPRAAK, MUZIEK_MAP, muziekKeuze } from './geluidsbestanden.js';
import { opslag } from './opslag.js';

const INFADEN = 1.5;
const UITFADEN = 1;
const GLIJDEN = 1; // seconden voor een ander volume bij een schermwissel
const OVERLAP = 2; // seconden dat het einde en het begin van het stuk over elkaar heen lopen

let manifest = null;
let gewenst = null; // { pad, volume } van wat nu hoort te spelen
let speelt = null; // { pad, gain, bronnen, timer }
let laatst = null; // { pad, buffer }: het laatst geladen stuk, zodat terugkomen in het menu meteen klinkt
let demper = null; // gain tussen de muziek en de uitgang, zachter tijdens spraak

function leesManifest() {
  manifest ??= fetch(`${MUZIEK_MAP}manifest.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return manifest;
}

function uitgang(ctx) {
  if (!demper) {
    demper = ctx.createGain();
    demper.connect(ctx.destination);
  }
  return demper;
}

// Vanaf de huidige waarde (ook midden in een overgang) in `duur` seconden naar `doel`.
function glijd(param, doel, duur) {
  const nu = geefContext().currentTime;
  param.cancelAndHoldAtTime(nu);
  param.linearRampToValueAtTime(doel, nu + duur);
}

// Na elke schermwissel: het juiste stuk en volume voor dit scherm en thema, of stilte.
export async function muziekVoor(scherm, thema) {
  const ctx = geefContext();
  const keuze = ctx ? muziekKeuze(await leesManifest(), scherm, thema, opslag.instellingen().muziek) : null;
  gewenst = keuze;
  const pad = keuze?.pad ?? null;
  if (pad && speelt?.pad === pad) return glijd(speelt.gain.gain, keuze.volume, GLIJDEN);
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
  if (gewenst?.pad !== pad || speelt?.pad === pad) return;
  stop();
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(gewenst.volume, ctx.currentTime + INFADEN);
  gain.connect(uitgang(ctx));
  speelt = { pad, gain, bronnen: new Set(), timer: 0 };
  ronde(ctx, speelt, buffer, ctx.currentTime);
}

// Aan het begin (true) en eind (false) van een zin van de Wiebel: de muziek even zachter.
export function muziekBijSpraak(praat) {
  if (!demper) return;
  glijd(demper.gain, praat ? MUZIEK_BIJ_SPRAAK : 1, praat ? 0.3 : 0.8);
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
  speelt = null;
  clearTimeout(timer);
  glijd(gain.gain, 0, UITFADEN);
  setTimeout(() => {
    bronnen.forEach((b) => b.stop());
    gain.disconnect();
  }, UITFADEN * 1000 + 100);
}
