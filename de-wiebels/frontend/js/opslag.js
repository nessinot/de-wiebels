// Opslag van profielen en instellingen in de browser (localStorage). De bron is de server (sync.js):
// profielen aanmaken, verwijderen en de instellingen wijzigen gebeurt op de ouderpagina.

import { vulAan } from './profiel.js';

const PROFIELEN = 'wiebels:profielen';
const INSTELLINGEN = 'wiebels:instellingen';

export const STANDAARD_INSTELLINGEN = { geluid: true, stem: true, muziek: true };

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
    // Ruwe toegang voor de synchronisatie: alle profielen als { id: profiel }.
    profielenPerId: () => lees(PROFIELEN, {}),
    zetProfielenPerId: (alle) => schrijf(PROFIELEN, alle),
    // Geluid, stem en muziek: de laatst bekende stand van de server.
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
