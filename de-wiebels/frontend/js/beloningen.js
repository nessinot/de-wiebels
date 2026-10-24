// Wiebels bevrijden en het huisdier laten groeien. De verzameling is thema-onafhankelijk;
// het thema bepaalt alleen hoe elke Wiebel eruitziet en wie hij is.

import { BELONINGEN, LEVELS, baasOpen, levelOpen, levelVan } from './levels.js';

export const HUISDIER_GRENZEN = [0, 50, 200, 500];

// De Wiebel die bij een beloning hoort, uit de lijst van het thema (één per level en per eindbaas):
// { id, naam, kleur, spul, lievelingskleur, eetHetLiefst, kanHeelGoed, geheimpje, zin }.
export function wiebelVoor(beloningId, thema) {
  return { ...thema.wiebels.find((w) => w.id === beloningId) };
}

// De wereld (vaardigheid) van een beloning: 'plus:20' en 'baas:plus' horen allebei bij 'plus'.
export function vaardigheidVan(beloningId) {
  const [soort, rest] = beloningId.split(':');
  return soort === 'baas' ? rest : soort;
}

// Geeft true als de beloning nieuw is.
export function geefBeloning(profiel, beloningId) {
  if (profiel.verzameling.includes(beloningId)) return false;
  profiel.verzameling.push(beloningId);
  return true;
}

// Bevrijde Wiebels die het kind nog niet bij Wiebels heeft bekeken, in de volgorde van bevrijden.
export function nieuweWiebels(profiel) {
  return profiel.verzameling.filter((id) => BELONINGEN.includes(id) && !profiel.wiebelsGezien.includes(id));
}

// Na het openen van het scherm Wiebels tellen alle bevrijde Wiebels als gezien. Geeft true als er iets veranderde.
export function markeerGezien(profiel) {
  const nieuw = nieuweWiebels(profiel);
  profiel.wiebelsGezien.push(...nieuw);
  return nieuw.length > 0;
}

// Wat de eigen Wiebel zegt bij het openen van het scherm Wiebels (een gebeurtenis uit zinnen.js).
export function openingsZin(profiel, aantalNieuw) {
  if (BELONINGEN.every((id) => profiel.verzameling.includes(id))) return 'collectieAlles';
  return aantalNieuw > 0 ? 'collectieNieuw' : 'collectieStart';
}

// Waar een gevangen Wiebel zit en of je er al heen kunt: { vaardigheid, level (null bij een eindbaas), open }.
export function gevangenBij(profiel, beloningId) {
  const vaardigheid = vaardigheidVan(beloningId);
  if (beloningId.startsWith('baas:')) return { vaardigheid, level: null, open: baasOpen(profiel, vaardigheid) };
  const level = levelVan(beloningId);
  return { vaardigheid, level, open: LEVELS[vaardigheid].includes(level) && levelOpen(profiel, level) };
}

export function huisdierStadium(xp) {
  return HUISDIER_GRENZEN.filter((grens) => xp >= grens).length - 1;
}

// Hoeveel goede antwoorden nog tot het volgende stadium (null als het huisdier volgroeid is).
export function totVolgendStadium(xp) {
  const volgende = HUISDIER_GRENZEN.find((grens) => grens > xp);
  return volgende === undefined ? null : volgende - xp;
}

export function voegXpToe(profiel, aantal) {
  const voor = huisdierStadium(profiel.huisdier.xp);
  profiel.huisdier.xp += aantal;
  return huisdierStadium(profiel.huisdier.xp) > voor;
}
