// Synchronisatie met de server: localStorage is de cache, de server bewaart alles blijvend.
// Bij een verschil wint de versie die het laatst is bijgewerkt.

import { opslag as standaardOpslag, STANDAARD_INSTELLINGEN } from './opslag.js';
import { vulAan } from './profiel.js';

const API = 'api/profielen';
const WACHT_NA_WIJZIGING = 2000;
const INTERVAL = 60 * 1000;
const TIME_OUT = 4000;

// Puur: bepaalt de nieuwe lokale stand en wat er naar de server moet.
export function samenvoegen(lokaal, server, verwijderd) {
  const resultaat = { ...lokaal };
  const upload = [];
  const weg = new Set(verwijderd);
  const opServer = new Map(server.map((p) => [p.id, p]));

  for (const [id, p] of opServer) {
    if (weg.has(id)) continue;
    if (!resultaat[id] || p.bijgewerkt > resultaat[id].bijgewerkt) resultaat[id] = p;
  }
  for (const [id, p] of Object.entries(resultaat)) {
    const s = opServer.get(id);
    if (!s || p.bijgewerkt > s.bijgewerkt) upload.push(p);
  }
  return { lokaal: resultaat, upload, verwijder: verwijderd.filter((id) => opServer.has(id)) };
}

async function vraag(pad, opties = {}) {
  const afbreken = new AbortController();
  const timer = setTimeout(() => afbreken.abort(), TIME_OUT);
  try {
    const antwoord = await fetch(pad, { ...opties, signal: afbreken.signal, headers: { 'Content-Type': 'application/json' } });
    if (!antwoord.ok) throw new Error(`HTTP ${antwoord.status}`);
    return antwoord.status === 204 ? null : antwoord.json();
  } finally {
    clearTimeout(timer);
  }
}

let bezig = false;

// Geeft true als de server bereikbaar was. Zonder server blijft alles gewoon lokaal werken.
export async function synchroniseer(opslag = standaardOpslag) {
  if (bezig) return false;
  bezig = true;
  try {
    const server = await vraag(API);
    if (!Array.isArray(server)) throw new Error('onverwacht antwoord');
    const { lokaal, upload, verwijder } = samenvoegen(opslag.profielenPerId(), server, opslag.verwijderd());
    Object.values(lokaal).forEach(vulAan);
    opslag.zetProfielenPerId(lokaal);
    for (const p of upload) await vraag(`${API}/${p.id}`, { method: 'PUT', body: JSON.stringify(p) });
    for (const id of verwijder) await vraag(`${API}/${id}`, { method: 'DELETE' });
    opslag.zetVerwijderd([]);
    window.dispatchEvent(new CustomEvent('wiebels:gesynchroniseerd'));
    return true;
  } catch {
    return false;
  } finally {
    bezig = false;
  }
}

let geplandeSync;

export function startSync() {
  standaardOpslag.opWijziging = () => {
    clearTimeout(geplandeSync);
    geplandeSync = setTimeout(synchroniseer, WACHT_NA_WIJZIGING);
  };
  synchroniseer();
  setInterval(synchroniseer, INTERVAL);
  window.addEventListener('online', () => synchroniseer());
}

// Export en import van alle data als JSON-bestand.
export function maakExport(opslag = standaardOpslag, nu = new Date()) {
  return { app: 'de-wiebels', versie: 1, gemaakt: nu.toISOString(), profielen: opslag.alleProfielen(), instellingen: opslag.instellingen() };
}

export function leesImport(tekst, opslag = standaardOpslag) {
  let data;
  try {
    data = JSON.parse(tekst);
  } catch {
    return { ok: false, reden: 'Dit is geen geldig exportbestand.' };
  }
  if (data?.app !== 'de-wiebels' || !Array.isArray(data.profielen)) return { ok: false, reden: 'Dit is geen exportbestand van De Wiebels.' };
  const geldig = data.profielen.filter((p) => p && typeof p.id === 'string' && typeof p.bijgewerkt === 'string');
  const { lokaal } = samenvoegen(opslag.profielenPerId(), geldig, []);
  Object.values(lokaal).forEach(vulAan);
  opslag.zetProfielenPerId(lokaal);
  opslag.zetVerwijderd(opslag.verwijderd().filter((id) => !geldig.some((p) => p.id === id)));
  if (data.instellingen) opslag.bewaarInstellingen({ ...STANDAARD_INSTELLINGEN, ...data.instellingen });
  opslag.opWijziging();
  return { ok: true, aantal: geldig.length };
}

export function downloadExport() {
  const blob = new Blob([JSON.stringify(maakExport(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `de-wiebels-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
