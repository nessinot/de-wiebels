// Synchronisatie met de server: localStorage is de cache, de server bewaart alles blijvend.
// Profielen aanmaken en verwijderen en de instellingen wijzigen gebeurt op de ouderpagina; de tv
// haalt die op en stuurt alleen de voortgang terug. Bij een verschil wint de versie die het laatst
// is bijgewerkt. Zonder verbinding speelt het spel door met de laatst bekende stand.

import { opslag as standaardOpslag, STANDAARD_INSTELLINGEN } from './opslag.js';
import { vulAan } from './profiel.js';

const API = 'api/';
const WACHT_NA_WIJZIGING = 2000;
const INTERVAL = 60 * 1000;
const TIME_OUT = 4000;

// Puur: bepaalt de nieuwe lokale stand en welke profielen naar de server moeten. Verwijderde
// profielen verdwijnen. Een profiel dat de server niet kent, blijft lokaal staan maar gaat niet
// naar de server: nieuwe profielen komen alleen van de ouderpagina.
export function samenvoegen(lokaal, server, verwijderd) {
  const weg = new Set(verwijderd);
  const opServer = new Map(server.map((p) => [p.id, p]));
  const resultaat = Object.fromEntries(Object.entries(lokaal).filter(([id]) => !weg.has(id)));

  for (const [id, p] of opServer) {
    if (weg.has(id)) continue;
    if (!resultaat[id] || p.bijgewerkt > resultaat[id].bijgewerkt) resultaat[id] = p;
  }
  const upload = Object.values(resultaat).filter((p) => opServer.has(p.id) && p.bijgewerkt > opServer.get(p.id).bijgewerkt);
  return { lokaal: resultaat, upload };
}

// Puur: alleen geluid, stem en muziek als true/false; de rest valt terug op de standaard.
export function leesInstellingen(inhoud) {
  return Object.fromEntries(Object.entries(STANDAARD_INSTELLINGEN).map(([k, v]) => [k, typeof inhoud?.[k] === 'boolean' ? inhoud[k] : v]));
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

let lopend = null;

// Geeft (een belofte van) true als de server bereikbaar was. Loopt er al een synchronisatie, dan
// krijg je de uitslag daarvan.
export function synchroniseer(opslag = standaardOpslag) {
  lopend ??= (async () => {
    try {
      const [server, verwijderd, instellingen] = await Promise.all(
        ['profielen', 'verwijderd', 'instellingen'].map((pad) => vraag(API + pad)),
      );
      if (!Array.isArray(server) || !Array.isArray(verwijderd)) throw new Error('onverwacht antwoord');
      const { lokaal, upload } = samenvoegen(opslag.profielenPerId(), server, verwijderd);
      Object.values(lokaal).forEach(vulAan);
      opslag.zetProfielenPerId(lokaal);
      opslag.bewaarInstellingen(leesInstellingen(instellingen));
      // Een weigering (net verwijderd op de ouderpagina) houdt de rest niet tegen.
      for (const p of upload) await vraag(`${API}profielen/${p.id}`, { method: 'PUT', body: JSON.stringify(p) }).catch(() => {});
      globalThis.dispatchEvent?.(new CustomEvent('wiebels:gesynchroniseerd'));
      return true;
    } catch {
      return false;
    } finally {
      lopend = null;
    }
  })();
  return lopend;
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
