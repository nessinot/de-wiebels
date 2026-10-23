// Rondelogica: vragen afwerken, foute vragen later opnieuw stellen, sterren tellen.

export const RONDE_LENGTE = 10;

// Bonusmunten bij een reeks goede antwoorden op rij.
export const COMBO_BONUS = { 3: 2, 5: 5, 10: 10 };

export function nieuweRonde(vragen) {
  return { wachtrij: [...vragen], aantal: vragen.length, fouten: new Set(), goedEerst: 0, goed: 0, combo: 0, munten: 0 };
}

export function huidigeVraag(ronde) {
  return ronde.wachtrij[0];
}

export function beantwoord(ronde, sleutel) {
  const vraag = ronde.wachtrij.shift();
  const goed = sleutel === vraag.goed;
  const eersteKeer = !ronde.fouten.has(vraag.id);
  let munten = 0;
  if (goed) {
    ronde.combo += 1;
    ronde.goed += 1;
    if (eersteKeer) {
      ronde.goedEerst += 1;
      munten += 1;
    }
    munten += COMBO_BONUS[ronde.combo] || 0;
    ronde.munten += munten;
  } else {
    ronde.combo = 0;
    ronde.fouten.add(vraag.id);
    // Later in de ronde opnieuw: na twee andere vragen, of aan het eind.
    ronde.wachtrij.splice(Math.min(2, ronde.wachtrij.length), 0, vraag);
  }
  const bonus = goed ? COMBO_BONUS[ronde.combo] || 0 : 0;
  return { goed, eersteKeer, vraag, munten, bonus, combo: ronde.combo, klaar: ronde.wachtrij.length === 0 };
}

export function sterrenVoor(goedEerst, aantal = RONDE_LENGTE) {
  const deel = goedEerst / aantal;
  if (deel === 1) return 3;
  if (deel >= 0.8) return 2;
  if (deel >= 0.5) return 1;
  return 0;
}
