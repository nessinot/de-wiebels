// Wiebels bevrijden en het huisdier laten groeien. De verzameling is thema-onafhankelijk;
// het thema bepaalt alleen hoe elke Wiebel eruitziet.

import { BELONINGEN } from './levels.js';
import { KLEUREN } from './wiebel.js';

export const HUISDIER_GRENZEN = [0, 50, 200, 500];
const KLEURVOLGORDE = Object.keys(KLEUREN);

// De Wiebel die bij een beloning hoort: { naam, kleur, spul } uit het thema. Elke eindbaas heeft een
// eigen Wiebel. Er zijn meer levels dan themawiebels; bij elke volgende ronde door de lijst krijgt
// dezelfde Wiebel een andere kleur.
export function wiebelVoor(beloningId, thema) {
  if (beloningId.startsWith('baas:')) return { ...thema.baaswiebels[beloningId.slice(5)] };
  const i = BELONINGEN.indexOf(beloningId);
  const n = thema.wiebels.length;
  const basis = thema.wiebels[i % n];
  const variant = Math.floor(i / n);
  return { ...basis, kleur: KLEURVOLGORDE[(KLEURVOLGORDE.indexOf(basis.kleur) + variant) % KLEURVOLGORDE.length] };
}

// Geeft true als de beloning nieuw is.
export function geefBeloning(profiel, beloningId) {
  if (profiel.verzameling.includes(beloningId)) return false;
  profiel.verzameling.push(beloningId);
  return true;
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
