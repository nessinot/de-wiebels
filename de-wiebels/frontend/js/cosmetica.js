// Winkeltje: munten uitgeven aan hoedjes, kleuren en decoratie. Per soort is er één tegelijk aan.

export const WINKEL = [
  { id: 'hoed-pet', soort: 'hoed', emoji: '🧢', naam: 'Pet', prijs: 20 },
  { id: 'hoed-strik', soort: 'hoed', emoji: '🎀', naam: 'Strik', prijs: 25 },
  { id: 'hoed-hoge', soort: 'hoed', emoji: '🎩', naam: 'Hoge hoed', prijs: 40 },
  { id: 'hoed-diploma', soort: 'hoed', emoji: '🎓', naam: 'Afstudeerhoed', prijs: 60 },
  { id: 'hoed-kroon', soort: 'hoed', emoji: '👑', naam: 'Kroon', prijs: 100 },
  { id: 'kleur-rood', soort: 'kleur', kleur: '#ff5c5c', naam: 'Rood', prijs: 20 },
  { id: 'kleur-groen', soort: 'kleur', kleur: '#5ee07a', naam: 'Groen', prijs: 20 },
  { id: 'kleur-blauw', soort: 'kleur', kleur: '#4da3ff', naam: 'Blauw', prijs: 20 },
  { id: 'kleur-goud', soort: 'kleur', kleur: '#ffd23f', naam: 'Goud', prijs: 50 },
  { id: 'kleur-regenboog', soort: 'kleur', kleur: 'conic-gradient(#ff5c5c, #ffd23f, #5ee07a, #4da3ff, #ff8cf0, #ff5c5c)', naam: 'Regenboog', prijs: 80 },
  { id: 'deco-ballon', soort: 'deco', emoji: '🎈', naam: 'Ballon', prijs: 20 },
  { id: 'deco-glitter', soort: 'deco', emoji: '✨', naam: 'Glitter', prijs: 30 },
  { id: 'deco-ster', soort: 'deco', emoji: '⭐', naam: 'Ster', prijs: 40 },
  { id: 'deco-regenboog', soort: 'deco', emoji: '🌈', naam: 'Regenboog', prijs: 60 },
];

export const SOORTEN = { hoed: 'Hoedjes', kleur: 'Kleuren', deco: 'Decoratie' };

export function item(id) {
  return WINKEL.find((i) => i.id === id);
}

export function koop(profiel, id) {
  const i = item(id);
  if (profiel.cosmetica.gekocht.includes(id)) return { ok: false, reden: 'al-gekocht' };
  if (profiel.munten < i.prijs) return { ok: false, reden: 'te-weinig', tekort: i.prijs - profiel.munten };
  profiel.munten -= i.prijs;
  profiel.cosmetica.gekocht.push(id);
  profiel.cosmetica.actief[i.soort] = id;
  return { ok: true };
}

// Aan- of uitzetten van iets dat al gekocht is.
export function wissel(profiel, id) {
  const i = item(id);
  if (!profiel.cosmetica.gekocht.includes(id)) return false;
  const actief = profiel.cosmetica.actief;
  if (actief[i.soort] === id) delete actief[i.soort];
  else actief[i.soort] = id;
  return true;
}

export function actief(profiel, soort) {
  const id = profiel.cosmetica.actief[soort];
  return id ? item(id) : null;
}
