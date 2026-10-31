// De wereld Nederland: naam en emoji (in elk thema gelijk) en de sterren van de onderdelen.

import { ITEMS } from './items.js';

export const NEDERLAND = { naam: 'Nederland', ondertitel: 'Topografie', emoji: '🌷' };

// Sterren staan in p.sterren als nl:<onderdeel>:<keuze>[:toets]; keuze is een provincie of 'alle'.
export function sterId(onderdeel, keuze, toets = false) {
  return `nl:${onderdeel}:${keuze}${toets ? ':toets' : ''}`;
}

// Hoe vol een provincie op de inkleurkaart staat (0–3): de sterren van haar plaatsen-toets.
export function inkleuring(profiel, provincies) {
  return Object.fromEntries(provincies.map((p) => [p, Math.min(3, profiel.sterren[sterId('plaatsen', p, true)] || 0)]));
}

// De sterren van een level zoals het kind ze ziet. Provincies en Hoofdsteden hadden vroeger Oefenen en
// Toets apart; nu is het één ronde (de toets-id) en telt de beste van de twee. Opgeslagen wordt per id.
const OEFEN_VAN = Object.fromEntries(['provincies', 'hoofdsteden'].map((o) => [sterId(o, 'alle', true), sterId(o, 'alle')]));
export function sterrenVan(profiel, levelId) {
  const eigen = profiel.sterren[levelId] || 0;
  const oefen = OEFEN_VAN[levelId];
  return oefen ? Math.max(eigen, profiel.sterren[oefen] || 0) : eigen;
}

// De onderdelen van Nederland. Provincies en Hoofdsteden gaan altijd over heel Nederland ('alle').
export const ONDERDELEN = { provincies: 'Provincies', hoofdsteden: 'Hoofdsteden', plaatsen: 'Plaatsen' };

const PROVINCIE_NAAM = Object.fromEntries(ITEMS.filter((it) => it.soort === 'provincie').map((it) => [it.id, it.naam]));

// Een level van Nederland uit zijn ster-id (voor levelVan in levels.js), of undefined. leitner: het
// levelId waaronder de antwoorden in p.items staan (per onderdeel, niet per provincie of toets).
// herkansing: of een fout later in de ronde terugkomt; niet bij de toets van een provincie of van heel
// Nederland. Provincies en Hoofdsteden zijn één ronde met alle twaalf (de toets-id), met herkansing en
// als kop alleen de naam; hun oefen-ids bestaan nog voor de sterren van vroeger.
export function nederlandLevel(id) {
  const [, onderdeel, keuze, extra] = id.split(':');
  if (!ONDERDELEN[onderdeel] || !keuze) return undefined;
  const naam = onderdeel !== 'plaatsen' ? ONDERDELEN[onderdeel] : keuze === 'alle' ? 'Heel Nederland' : PROVINCIE_NAAM[keuze];
  if (!naam) return undefined;
  const toets = extra === 'toets';
  const label = toets && onderdeel !== 'plaatsen' ? naam : `${naam} · ${toets ? 'Toets' : 'Oefenen'}`;
  return { id, vaardigheid: 'nederland', onderdeel, keuze, toets, herkansing: !toets || onderdeel !== 'plaatsen', leitner: `nl:${onderdeel}`, label };
}
