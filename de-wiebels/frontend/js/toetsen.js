// Vertaalt toetscodes van de afstandsbediening (en het pc-toetsenbord) naar acties.

const VASTE_TOETSEN = {
  37: 'links',
  38: 'omhoog',
  39: 'rechts',
  40: 'omlaag',
  13: 'ok',
  461: 'terug',
  8: 'terug',
  27: 'terug',
  403: 'rood',
  404: 'groen',
  405: 'geel',
  406: 'blauw',
};

export function actieVoorToets(code) {
  if (code in VASTE_TOETSEN) return { actie: VASTE_TOETSEN[code] };
  if (code >= 48 && code <= 57) return { actie: 'cijfer', cijfer: code - 48 };
  if (code >= 96 && code <= 105) return { actie: 'cijfer', cijfer: code - 96 };
  return null;
}
