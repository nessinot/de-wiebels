// Adaptieve herhaling met bakjes 1–5: fout gaat terug naar bakje 1 en komt snel terug,
// beheerste items schuiven door en komen steeds later terug.

const MINUUT = 60 * 1000;
const DAG = 24 * 60 * MINUUT;

// Wachttijd voordat een item uit bakje n weer gevraagd wordt.
export const WACHTTIJD = { 1: 0, 2: 10 * MINUUT, 3: DAG, 4: 3 * DAG, 5: 7 * DAG };

export function registreer(items, id, goed, levelId, nu = new Date()) {
  const item = items[id] || { bak: 1, goed: 0, fout: 0, laatst: null, level: levelId };
  if (goed) {
    item.goed += 1;
    item.bak = Math.min(5, item.bak + 1);
  } else {
    item.fout += 1;
    item.bak = 1;
  }
  item.laatst = nu.toISOString();
  item.level = levelId;
  items[id] = item;
  return item;
}

// Items van dit level die weer aan de beurt zijn: laagste bakje en langst geleden eerst.
export function teHerhalen(items, levelId, max, nu = new Date()) {
  return Object.entries(items)
    .filter(([, item]) => item.level === levelId && nu - new Date(item.laatst) >= WACHTTIJD[item.bak] && item.bak < 5)
    .sort(([, a], [, b]) => a.bak - b.bak || a.laatst.localeCompare(b.laatst))
    .slice(0, max)
    .map(([id]) => id);
}

// Voor het ouderscherm: de items die het vaakst fout gingen en nog niet beheerst zijn.
export function zwakkePlekken(items, max = 10) {
  return Object.entries(items)
    .filter(([, item]) => item.fout > 0 && item.bak < 4)
    .sort(([, a], [, b]) => b.fout - b.goed / 2 - (a.fout - a.goed / 2) || a.bak - b.bak)
    .slice(0, max)
    .map(([id, item]) => ({ id, ...item }));
}

// Moeilijkheid binnen een level (0–2): omhoog na een reeks goed, omlaag na meerdere fouten.
export const REEKS_OMHOOG = 5;
export const REEKS_OMLAAG = 2;

export function volgendeStap(stap, reeksGoed, reeksFout) {
  if (reeksGoed >= REEKS_OMHOOG) return Math.min(2, stap + 1);
  if (reeksFout >= REEKS_OMLAAG) return Math.max(0, stap - 1);
  return stap;
}
