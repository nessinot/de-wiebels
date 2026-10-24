// Opslag van profielen en instellingen in de browser (localStorage).

import { vulAan } from './profiel.js';

const PROFIELEN = 'wiebels:profielen';
const INSTELLINGEN = 'wiebels:instellingen';
const VERWIJDERD = 'wiebels:verwijderd';

export const STANDAARD_INSTELLINGEN = { geluid: true, pin: '1234' };

export function maakOpslag(geefOpslag = () => localStorage) {
  const lees = (sleutel, standaard) => {
    try {
      return JSON.parse(geefOpslag().getItem(sleutel)) ?? standaard;
    } catch {
      return standaard;
    }
  };
  const schrijf = (sleutel, waarde) => geefOpslag().setItem(sleutel, JSON.stringify(waarde));

  const opslag = {
    // Wordt aangeroepen na elke wijziging (de synchronisatie haakt hierop in).
    opWijziging: () => {},
    alleProfielen() {
      return Object.values(lees(PROFIELEN, {})).map(vulAan).sort((a, b) => a.aangemaakt.localeCompare(b.aangemaakt));
    },
    bewaarProfiel(profiel) {
      profiel.bijgewerkt = new Date().toISOString();
      const alle = lees(PROFIELEN, {});
      alle[profiel.id] = profiel;
      schrijf(PROFIELEN, alle);
      opslag.opWijziging();
    },
    verwijderProfiel(id) {
      const alle = lees(PROFIELEN, {});
      delete alle[id];
      schrijf(PROFIELEN, alle);
      schrijf(VERWIJDERD, [...new Set([...lees(VERWIJDERD, []), id])]);
      opslag.opWijziging();
    },
    // Ruwe toegang voor de synchronisatie: alle profielen als { id: profiel }.
    profielenPerId: () => lees(PROFIELEN, {}),
    zetProfielenPerId: (alle) => schrijf(PROFIELEN, alle),
    verwijderd: () => lees(VERWIJDERD, []),
    zetVerwijderd: (ids) => schrijf(VERWIJDERD, ids),
    instellingen() {
      return { ...STANDAARD_INSTELLINGEN, ...lees(INSTELLINGEN, {}) };
    },
    bewaarInstellingen(instellingen) {
      schrijf(INSTELLINGEN, instellingen);
    },
  };
  return opslag;
}

export const opslag = maakOpslag();

// Het profiel dat nu speelt.
export const staat = { profiel: null };

export function bewaar() {
  if (staat.profiel) opslag.bewaarProfiel(staat.profiel);
}
