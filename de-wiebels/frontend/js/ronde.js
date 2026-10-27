// Rondelogica: vragen afwerken, foute vragen later opnieuw stellen, sterren tellen.

export const RONDE_LENGTE = 10;

// Bonusmunten bij een reeks goede antwoorden op rij.
export const COMBO_BONUS = { 3: 2, 5: 5, 10: 10 };

// De reserve levert tussenvragen: als een foute vraag de laatste was, komt er eerst een andere.
// herkansing: false voor een toets: een foute vraag komt niet terug.
export function nieuweRonde(vragen, reserve = [], { herkansing = true } = {}) {
  return { wachtrij: [...vragen], aantal: vragen.length, reserve: [...reserve], herkansing, gesteld: [], fouten: new Set(), goedEerst: 0, goed: 0, combo: 0, munten: 0 };
}

export function huidigeVraag(ronde) {
  return ronde.wachtrij[0];
}

// Hoeveel echte vragen klaar zijn; een tussenvraag telt niet mee.
export function gedaan(ronde) {
  return ronde.aantal - new Set(ronde.wachtrij.filter((v) => !v.extra).map((v) => v.id)).size;
}

// Een tussenvraag: liefst een nieuwe uit de reserve, anders de laatst gestelde andere vraag.
// Is er geen andere vraag (alleen bij een ronde van één vraag), dan geen tussenvraag.
function tussenvraag(ronde, id) {
  const bron = ronde.reserve.shift() ?? [...ronde.gesteld].reverse().find((v) => v.id !== id && !v.extra);
  return bron ? { ...bron, extra: true } : null;
}

export function beantwoord(ronde, sleutel) {
  const vraag = ronde.wachtrij.shift();
  ronde.gesteld.push(vraag);
  const goed = sleutel === vraag.goed;
  const eersteKeer = !vraag.extra && !ronde.fouten.has(vraag.id);
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
    // Een tussenvraag was alleen een buffer en komt niet terug.
    if (!vraag.extra) ronde.fouten.add(vraag.id);
    if (!vraag.extra && ronde.herkansing) {
      // Later in de ronde opnieuw: na twee andere vragen, of aan het eind, maar nooit meteen.
      if (!ronde.wachtrij.length) {
        const tussen = tussenvraag(ronde, vraag.id);
        if (tussen) ronde.wachtrij.push(tussen);
      }
      ronde.wachtrij.splice(Math.min(2, ronde.wachtrij.length), 0, vraag);
    }
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
