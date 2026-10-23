// Alle thema's delen dezelfde spellogica; alleen de presentatie verschilt.

import ruimte from './ruimte.js';

export const THEMAS = { ruimte };

export const STANDAARD_THEMA = 'ruimte';

export function thema(id) {
  return THEMAS[id] || THEMAS[STANDAARD_THEMA];
}

export function pasThemaToe(id) {
  const k = thema(id).kleuren;
  const stijl = document.documentElement.style;
  stijl.setProperty('--achtergrond', k.achtergrond);
  stijl.setProperty('--vlak', k.vlak);
  stijl.setProperty('--vlak-licht', k.vlakLicht);
  stijl.setProperty('--tekst', k.tekst);
  stijl.setProperty('--tekst-zacht', k.tekstZacht);
  stijl.setProperty('--accent', k.accent);
  stijl.setProperty('--focus', k.accent);
}
