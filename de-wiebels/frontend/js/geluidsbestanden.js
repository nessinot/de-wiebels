// Pure keuzes voor de stem en de muziek: welk bestand bij een zin of thema hoort, wanneer er muziek
// speelt en hoe ver de mond opengaat. De bestanden maakt tools/maak-stemmen.py.

export const STEM_MAP = 'geluid/stem/';
export const MUZIEK_MAP = 'geluid/muziek/';

// Het geluidsbestand bij een zin, of null. Alleen als de opgenomen tekst nog precies klopt: een
// gewijzigde zin zonder nieuwe opname valt terug op de letters in de ballon.
export function stemBestand(manifest, id, tekst) {
  const zin = manifest?.zinnen?.[id];
  return zin && zin.tekst === tekst ? STEM_MAP + zin.bestand : null;
}

// Muziek in het hoofdmenu, het winkeltje en bij Aanpassen; elders (zoals in de sommen) is het stil.
export const MUZIEK_SCHERMEN = new Set(['wereldkaart', 'winkel', 'aanpassen']);

// Het muziekbestand voor dit scherm en thema, of null als het stil moet zijn.
export function muziekBestand(manifest, scherm, thema, aan) {
  const stuk = aan && MUZIEK_SCHERMEN.has(scherm) ? manifest?.[thema] : null;
  return stuk ? MUZIEK_MAP + stuk.bestand : null;
}

// Hoe ver de mond opengaat (0,08–1) bij een stukje geluid (getFloatTimeDomainData, -1 tot 1).
export function mondOpening(monsters) {
  let som = 0;
  for (const m of monsters) som += m * m;
  const volume = Math.sqrt(som / monsters.length);
  // Spraak zit meestal rond 0,01–0,05; daar hoort een halfopen tot open mond bij.
  return Math.min(1, 0.08 + volume * 25);
}
