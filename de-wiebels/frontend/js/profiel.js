// Het profiel van een Wiebelaar: aanmaken en vaste keuzelijsten.

import { STARTNIVEAUS } from './levels.js';

export const AVATARS = ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🦄', '🐲', '🐙', '🦖', '🐧', '🐰'];

export const MAX_NAAM = 12;

export function nieuwProfiel({ naam, avatar, thema = 'ruimte', startniveau = 'starter' }, nu = new Date()) {
  return {
    id: `p-${nu.getTime().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    naam: naam.trim().slice(0, MAX_NAAM),
    avatar,
    thema,
    niveaus: { ...STARTNIVEAUS[startniveau].niveaus },
    instellingen: { tijdsdruk: false },
    munten: 0,
    sterren: {},
    items: {},
    moeilijkheid: {},
    verzameling: [],
    huisdier: { xp: 0 },
    cosmetica: { gekocht: [], actief: {} },
    records: {},
    aangemaakt: nu.toISOString(),
    bijgewerkt: nu.toISOString(),
  };
}
