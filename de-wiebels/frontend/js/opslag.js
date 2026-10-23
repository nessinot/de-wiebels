// Opslag van profielen en instellingen in de browser (localStorage).

const PROFIELEN = 'wiebels:profielen';
const INSTELLINGEN = 'wiebels:instellingen';

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

  return {
    alleProfielen() {
      return Object.values(lees(PROFIELEN, {})).sort((a, b) => a.aangemaakt.localeCompare(b.aangemaakt));
    },
    bewaarProfiel(profiel) {
      profiel.bijgewerkt = new Date().toISOString();
      const alle = lees(PROFIELEN, {});
      alle[profiel.id] = profiel;
      schrijf(PROFIELEN, alle);
    },
    verwijderProfiel(id) {
      const alle = lees(PROFIELEN, {});
      delete alle[id];
      schrijf(PROFIELEN, alle);
    },
    instellingen() {
      return { ...STANDAARD_INSTELLINGEN, ...lees(INSTELLINGEN, {}) };
    },
    bewaarInstellingen(instellingen) {
      schrijf(INSTELLINGEN, instellingen);
    },
  };
}

export const opslag = maakOpslag();

// Het profiel dat nu speelt.
export const staat = { profiel: null };

export function bewaar() {
  if (staat.profiel) opslag.bewaarProfiel(staat.profiel);
}
