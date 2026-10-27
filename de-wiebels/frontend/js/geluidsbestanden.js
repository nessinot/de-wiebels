// Pure keuzes voor de stem en de muziek: welk bestand bij een zin of thema hoort, hoe hard de muziek
// per scherm speelt en hoe ver de mond opengaat. De bestanden maakt tools/maak-stemmen.py.

export const STEM_MAP = 'geluid/stem/';
export const MUZIEK_MAP = 'geluid/muziek/';

// Het geluidsbestand bij een zin, of null. Alleen als de opgenomen tekst nog precies klopt: een
// gewijzigde zin zonder nieuwe opname valt terug op de letters in de ballon.
export function stemBestand(manifest, id, tekst) {
  const zin = manifest?.zinnen?.[id];
  return zin && zin.tekst === tekst ? STEM_MAP + zin.bestand : null;
}

// Volume van de muziek per scherm: normaal in de menu's, zacht in de sommen en het intro. Op andere
// schermen (profielkeuze, profiel maken) is het stil.
export const MUZIEK_NORMAAL = 0.12;
export const MUZIEK_ZACHT = 0.05;
export const MUZIEK_VOLUME = {
  wereldkaart: MUZIEK_NORMAAL,
  levelkeuze: MUZIEK_NORMAAL,
  collectie: MUZIEK_NORMAAL,
  winkel: MUZIEK_NORMAAL,
  aanpassen: MUZIEK_NORMAAL,
  themakeuze: MUZIEK_NORMAAL,
  tijdraceKeuze: MUZIEK_NORMAAL,
  nederland: MUZIEK_NORMAAL,
  nederlandProvincie: MUZIEK_NORMAAL,
  ronde: MUZIEK_ZACHT,
  eindbaas: MUZIEK_ZACHT,
  tijdrace: MUZIEK_ZACHT,
  resultaat: MUZIEK_ZACHT,
  intro: MUZIEK_ZACHT,
};

// Terwijl de Wiebel praat, klinkt de muziek op dit deel van het volume.
export const MUZIEK_BIJ_SPRAAK = 0.4;

// Het muziekstuk voor dit scherm en thema als { pad, volume }, of null als het stil moet zijn.
export function muziekKeuze(manifest, scherm, thema, aan) {
  const volume = MUZIEK_VOLUME[scherm];
  const stuk = aan && volume ? manifest?.[thema] : null;
  return stuk ? { pad: MUZIEK_MAP + stuk.bestand, volume } : null;
}

// Hoe ver de mond opengaat (0,08–1) bij een stukje geluid (getFloatTimeDomainData, -1 tot 1).
export function mondOpening(monsters) {
  let som = 0;
  for (const m of monsters) som += m * m;
  const volume = Math.sqrt(som / monsters.length);
  // Spraak zit meestal rond 0,01–0,05; daar hoort een halfopen tot open mond bij.
  return Math.min(1, 0.08 + volume * 25);
}
