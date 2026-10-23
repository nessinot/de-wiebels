// Ruimtelijke navigatie: vanuit het huidige vak het beste vak in een richting kiezen.
// Vakken zijn rechthoeken zoals getBoundingClientRect ze geeft (left, top, width, height).

const RICHTINGEN = {
  links: { as: 'x', teken: -1 },
  rechts: { as: 'x', teken: 1 },
  omhoog: { as: 'y', teken: -1 },
  omlaag: { as: 'y', teken: 1 },
};

function grenzen(vak, as) {
  return as === 'x'
    ? { begin: vak.left, eind: vak.left + vak.width }
    : { begin: vak.top, eind: vak.top + vak.height };
}

function midden(vak, as) {
  const g = grenzen(vak, as);
  return (g.begin + g.eind) / 2;
}

// Geeft de index van het gekozen vak, of -1 als er in die richting niets ligt.
export function kiesVolgende(huidig, kandidaten, richting) {
  const { as, teken } = RICHTINGEN[richting];
  const dwars = as === 'x' ? 'y' : 'x';
  const hier = grenzen(huidig, as);
  const hierDwars = grenzen(huidig, dwars);

  let beste = -1;
  let besteScore = Infinity;
  kandidaten.forEach((vak, i) => {
    if ((midden(vak, as) - midden(huidig, as)) * teken <= 0) return;

    const daar = grenzen(vak, as);
    const afstand = Math.max(0, teken > 0 ? daar.begin - hier.eind : hier.begin - daar.eind);
    const daarDwars = grenzen(vak, dwars);
    const verschuiving = Math.max(0, daarDwars.begin - hierDwars.eind, hierDwars.begin - daarDwars.eind);
    const score = afstand + verschuiving * 2 + Math.abs(midden(vak, dwars) - midden(huidig, dwars)) * 0.01;

    if (score < besteScore) {
      besteScore = score;
      beste = i;
    }
  });
  return beste;
}
