// Het profiel van een Wiebelaar: aanmaken en vaste keuzelijsten.

import { STARTNIVEAUS } from './levels.js';
import { migreerCosmetica } from './spullen.js';

export const AVATARS = ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🦄', '🐲', '🐙', '🦖', '🐧', '🐰'];

export const MAX_NAAM = 12;
export const STANDAARD_KLEUR = 'paars';

export function nieuwProfiel({ naam, avatar, kleur = STANDAARD_KLEUR, thema = 'ruimte', startniveau = 'starter' }, nu = new Date()) {
  return {
    id: `p-${nu.getTime().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    naam: naam.trim().slice(0, MAX_NAAM),
    avatar,
    wiebel: { kleur },
    thema,
    niveaus: { ...STARTNIVEAUS[startniveau].niveaus },
    instellingen: { tijdsdruk: false },
    munten: 0,
    sterren: {},
    items: {},
    moeilijkheid: {},
    verzameling: [],
    huisdier: { xp: 0 },
    cosmetica: { gekocht: [], aan: {} },
    records: {},
    introGezien: false,
    aangemaakt: nu.toISOString(),
    bijgewerkt: nu.toISOString(),
  };
}

// Vult een profiel uit een oudere versie aan met wat er later bij is gekomen. Mag vaker worden
// aangeroepen; wat er al staat, blijft staan. Geeft hetzelfde profiel terug.
export function vulAan(profiel) {
  profiel.wiebel = { kleur: STANDAARD_KLEUR, ...profiel.wiebel };
  // Het verhaal bij de eerste start is voor nieuwe profielen; wie al speelde, slaat het over.
  profiel.introGezien ??= true;
  // Het oude winkeltje (actief: hoed, kleur, deco) wordt omgezet naar spullen per plek (aan);
  // munten voor wat niet meer bestaat, gaan terug. Na het omzetten is er 'aan', dus gebeurt dit één keer.
  if (!profiel.cosmetica) profiel.cosmetica = { gekocht: [], aan: {} };
  else if (!profiel.cosmetica.aan) {
    const { cosmetica, terug } = migreerCosmetica(profiel.cosmetica);
    profiel.cosmetica = cosmetica;
    profiel.munten = (profiel.munten ?? 0) + terug;
  }
  return profiel;
}
