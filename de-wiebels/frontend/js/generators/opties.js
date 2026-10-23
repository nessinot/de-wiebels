// Meerkeuze-opties: het goede antwoord plus drie plausibele foute antwoorden.

export function schud(lijst, rnd = Math.random) {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

export function willekeurig(min, max, rnd = Math.random) {
  return min + Math.floor(rnd() * (max - min + 1));
}

export function kies(lijst, rnd = Math.random) {
  return lijst[Math.floor(rnd() * lijst.length)];
}

function verwisselCijfers(n) {
  const s = String(n);
  return s.length === 2 ? Number(s[1] + s[0]) : null;
}

// Plausibele kandidaten gaan voor (zoals buurgetallen uit de tafel), daarna algemene buren.
export function getalOpties(antwoord, plausibel = [], rnd = Math.random) {
  const algemeen = [antwoord + 1, antwoord - 1, antwoord + 2, antwoord - 2, antwoord + 10, antwoord - 10, verwisselCijfers(antwoord)];
  const fout = [];
  for (const groep of [schud(plausibel, rnd), schud(algemeen, rnd)]) {
    for (const n of groep) {
      if (fout.length < 3 && Number.isInteger(n) && n >= 0 && n !== antwoord && !fout.includes(n)) fout.push(n);
    }
  }
  for (let n = antwoord + 3; fout.length < 3; n++) if (!fout.includes(n)) fout.push(n);
  return schud([antwoord, ...fout], rnd).map((n) => ({ sleutel: String(n), html: String(n) }));
}
