// Waar de pijltjes heen gaan op de kaart met provincies. Met de hand vastgezet naar wat je op de kaart
// verwacht; null betekent dat er in die richting niets ligt (de zee of het buitenland).

export const BUREN = {
  'pv-groningen': { links: 'pv-friesland', rechts: null, omhoog: null, omlaag: 'pv-drenthe' },
  'pv-friesland': { links: 'pv-noord-holland', rechts: 'pv-groningen', omhoog: null, omlaag: 'pv-flevoland' },
  'pv-drenthe': { links: 'pv-friesland', rechts: null, omhoog: 'pv-groningen', omlaag: 'pv-overijssel' },
  'pv-overijssel': { links: 'pv-flevoland', rechts: null, omhoog: 'pv-drenthe', omlaag: 'pv-gelderland' },
  'pv-flevoland': { links: 'pv-noord-holland', rechts: 'pv-overijssel', omhoog: 'pv-friesland', omlaag: 'pv-gelderland' },
  'pv-gelderland': { links: 'pv-utrecht', rechts: null, omhoog: 'pv-overijssel', omlaag: 'pv-limburg' },
  'pv-utrecht': { links: 'pv-zuid-holland', rechts: 'pv-gelderland', omhoog: 'pv-noord-holland', omlaag: 'pv-noord-brabant' },
  'pv-noord-holland': { links: null, rechts: 'pv-flevoland', omhoog: null, omlaag: 'pv-zuid-holland' },
  'pv-zuid-holland': { links: 'pv-zeeland', rechts: 'pv-utrecht', omhoog: 'pv-noord-holland', omlaag: 'pv-noord-brabant' },
  'pv-zeeland': { links: null, rechts: 'pv-noord-brabant', omhoog: 'pv-zuid-holland', omlaag: null },
  'pv-noord-brabant': { links: 'pv-zeeland', rechts: 'pv-limburg', omhoog: 'pv-utrecht', omlaag: null },
  'pv-limburg': { links: 'pv-noord-brabant', rechts: null, omhoog: 'pv-gelderland', omlaag: null },
};
