// Wiebels bevrijden en het huisdier laten groeien. De verzameling is thema-onafhankelijk;
// het thema bepaalt alleen hoe elke Wiebel eruitziet en wie hij is.

import { BELONINGEN, LEVELS, STERREN_VRIJ, baasOpen, levelOpen, levelVan } from './levels.js';
import { BELONINGEN_NL, WIEBELS_NL, nlBeloningNa } from './nederland/wiebels.js';

export const HUISDIER_GRENZEN = [0, 50, 200, 500];

// Alle Wiebels in de verzameling: die van de levels en eindbazen, dan die van Nederland.
export const ALLE_BELONINGEN = [...BELONINGEN, ...BELONINGEN_NL.map((b) => b.id)];

// De Wiebel die bij een beloning hoort, uit de lijst van het thema (één per level en per eindbaas)
// of anders van Nederland (in elk thema gelijk):
// { id, naam, kleur, spul, lievelingskleur, eetHetLiefst, kanHeelGoed, geheimpje, zin }.
export function wiebelVoor(beloningId, thema) {
  return { ...(thema.wiebels.find((w) => w.id === beloningId) ?? WIEBELS_NL.find((w) => w.id === beloningId)) };
}

// De wereld (vaardigheid) van een beloning: 'plus:20' en 'baas:plus' horen allebei bij 'plus';
// alles met 'nl:' bij 'nederland'.
export function vaardigheidVan(beloningId) {
  const [soort, rest] = beloningId.split(':');
  if (soort === 'nl') return 'nederland';
  return soort === 'baas' ? rest : soort;
}

// De Wiebel die bij een level of toets van Nederland hoort (zijn id), of null (oefenen, "Alle provincies").
export function wiebelVan(levelId) {
  if (levelId.startsWith('nl:')) return BELONINGEN_NL.find((b) => b.toetsen.includes(levelId))?.id ?? null;
  return BELONINGEN.includes(levelId) ? levelId : null;
}

// De Wiebel die na een ronde met zoveel sterren vrijkomt (zijn id), of null (Nederland: nlBeloningNa).
export function beloningNa(profiel, levelId, sterren) {
  if (sterren < STERREN_VRIJ) return null;
  if (levelId.startsWith('nl:')) return nlBeloningNa(profiel, levelId);
  return BELONINGEN.includes(levelId) ? levelId : null;
}

// De Wiebel die tijdens deze toets van Nederland in zijn bel zit (zijn id), of null: niet bij oefenen,
// "Alle provincies", de sommen of een Wiebel die al vrij is.
export function belInToets(profiel, levelId) {
  if (!levelId.startsWith('nl:')) return null;
  const id = wiebelVan(levelId);
  return id && !profiel.verzameling.includes(id) ? id : null;
}

// Wat de bel aan het eind van de toets doet: 'knap', 'nogEen' (twee sterren, maar zijn andere toets
// nog niet: alleen Tulpje) of 'schud'.
export function afloopBel(sterren, nieuweWiebel) {
  if (nieuweWiebel) return 'knap';
  return sterren >= STERREN_VRIJ ? 'nogEen' : 'schud';
}

// Geeft true als de beloning nieuw is.
export function geefBeloning(profiel, beloningId) {
  if (profiel.verzameling.includes(beloningId)) return false;
  profiel.verzameling.push(beloningId);
  return true;
}

// Bevrijde Wiebels die het kind nog niet bij Wiebels heeft bekeken, in de volgorde van bevrijden.
export function nieuweWiebels(profiel) {
  return profiel.verzameling.filter((id) => ALLE_BELONINGEN.includes(id) && !profiel.wiebelsGezien.includes(id));
}

// Na het openen van het scherm Wiebels tellen alle bevrijde Wiebels als gezien. Geeft true als er iets veranderde.
export function markeerGezien(profiel) {
  const nieuw = nieuweWiebels(profiel);
  profiel.wiebelsGezien.push(...nieuw);
  return nieuw.length > 0;
}

// Wat de eigen Wiebel zegt bij het openen van het scherm Wiebels (een gebeurtenis uit zinnen.js).
export function openingsZin(profiel, aantalNieuw) {
  if (ALLE_BELONINGEN.every((id) => profiel.verzameling.includes(id))) return 'collectieAlles';
  return aantalNieuw > 0 ? 'collectieNieuw' : 'collectieStart';
}

// Waar een gevangen Wiebel zit en of je er al heen kunt: { vaardigheid, level (null bij een eindbaas), open }.
// Bij Nederland (altijd open) ook de toetsen als label, en de provincie (null voor heel Nederland).
export function gevangenBij(profiel, beloningId) {
  const vaardigheid = vaardigheidVan(beloningId);
  if (vaardigheid === 'nederland') {
    const { toetsen } = BELONINGEN_NL.find((b) => b.id === beloningId);
    const levels = toetsen.map((id) => levelVan(id));
    const provincie = levels[0].onderdeel === 'plaatsen' ? levels[0].keuze : null;
    const namen = levels.map((l) => l.label.split(' · ')[0]); // 'Zeeland · Toets' → 'Zeeland'
    return { vaardigheid, level: null, open: true, provincie, label: `Toets ${namen.join(' en ')}` };
  }
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
