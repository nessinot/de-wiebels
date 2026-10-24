// Alles wat de Wiebel zegt, per gebeurtenis. Elke zin is vaste tekst zonder ingevulde delen (geen
// namen, prijzen, werelden of spullen), zodat de stem hem vooraf kan inspreken. De id blijft altijd
// gelijk: hij wordt de naam van het geluidsbestand. Een nieuwe zin krijgt een nieuwe id.

export const ZINNEN = {
  kleurGekozen: [
    { id: 'kleur-1', tekst: 'Hoi! Ik ben jouw Wiebel!' },
    { id: 'kleur-2', tekst: 'Joepie, wat een mooie kleur!' },
    { id: 'kleur-3', tekst: 'Wij worden vast goede vrienden!' },
  ],

  // Hoofdmenu
  menuWelkom: [
    { id: 'menu-welkom-1', tekst: 'Waar gaan we heen?' },
    { id: 'menu-welkom-2', tekst: 'Zullen we gaan oefenen?' },
    { id: 'menu-welkom-3', tekst: 'Kies maar een wereld!' },
  ],
  aangewezen: [
    { id: 'aangewezen-1', tekst: 'Hihi, dat kietelt!' },
    { id: 'aangewezen-2', tekst: 'Hoi! Daar ben ik!' },
    { id: 'aangewezen-3', tekst: 'Wil je me iets anders aantrekken?' },
  ],
  wereldGekozen: [
    { id: 'wereld-1', tekst: 'Hup, daar gaan we!' },
    { id: 'wereld-2', tekst: 'Joepie, op reis!' },
  ],

  // Aanpassen
  aanpassenWelkom: [
    { id: 'aanpassen-welkom-1', tekst: 'Wat zal ik eens aandoen?' },
    { id: 'aanpassen-welkom-2', tekst: 'Maak me maar mooi!' },
  ],
  aangetrokken: [
    { id: 'aangetrokken-1', tekst: 'Kijk eens!' },
    { id: 'aangetrokken-2', tekst: 'Hoe sta ik?' },
    { id: 'aangetrokken-3', tekst: 'Mooi, hè?' },
  ],
  uitgetrokken: [
    { id: 'uitgetrokken-1', tekst: 'Zo, weer zonder.' },
    { id: 'uitgetrokken-2', tekst: 'Even zonder!' },
  ],
  kleurGewisseld: [
    { id: 'kleur-gewisseld-1', tekst: 'Mooie kleur!' },
    { id: 'kleur-gewisseld-2', tekst: 'Zo zie ik er heel anders uit!' },
  ],
  achtergrondGekozen: [
    { id: 'achtergrond-1', tekst: 'Wat een mooie plek!' },
    { id: 'achtergrond-2', tekst: 'Hier vind ik het fijn!' },
  ],

  // Winkeltje
  winkelWelkom: [
    { id: 'winkel-welkom-1', tekst: 'Kies iets om te passen!' },
    { id: 'winkel-welkom-2', tekst: 'Wat zullen we eens passen?' },
  ],
  passen: [
    { id: 'passen-1', tekst: 'Past goed!' },
    { id: 'passen-2', tekst: 'Staat me mooi, hè?' },
    { id: 'passen-4', tekst: 'Ooh, wat mooi!' },
  ],
  sparen: [
    { id: 'sparen-1', tekst: 'Mooi! Daar moeten we nog even voor sparen.' },
    { id: 'sparen-2', tekst: 'Nog even oefenen, dan kunnen we het kopen!' },
  ],
  alGekocht: [
    { id: 'al-gekocht-1', tekst: 'Die heb je al!' },
    { id: 'al-gekocht-2', tekst: 'Die is al van ons!' },
  ],
  gekocht: [
    { id: 'gekocht-1', tekst: 'Gekocht! Ik doe het meteen aan.' },
    { id: 'gekocht-2', tekst: 'Joepie, dank je wel!' },
  ],

  // Combinaties van achtergrond en spullen (combinatie() in spullen.js)
  nat: [
    { id: 'nat-1', tekst: 'Brr, ik word nat!' },
    { id: 'nat-2', tekst: 'Oei, wat een regen!' },
  ],
  droog: [
    { id: 'droog-1', tekst: 'Lekker droog!' },
    { id: 'droog-2', tekst: 'Zo word ik niet nat!' },
  ],
  koud: [
    { id: 'koud-1', tekst: 'Brrr, wat koud!' },
    { id: 'koud-2', tekst: 'Ik heb het koud!' },
  ],
  warm: [
    { id: 'warm-1', tekst: 'Lekker warm!' },
    { id: 'warm-2', tekst: 'Zo is de sneeuw fijn!' },
  ],
  schaduw: [
    { id: 'schaduw-1', tekst: 'Lekker in de schaduw!' },
    { id: 'schaduw-2', tekst: 'Heerlijk koel hier!' },
  ],

  // In de sommen (ronde en eindbaas; in de tijdrace zegt hij niets, zodat het tempo blijft)
  goed: [
    { id: 'goed-1', tekst: 'Goed zo!' },
    { id: 'goed-2', tekst: 'Knap gedaan!' },
    { id: 'goed-3', tekst: 'Ja, helemaal goed!' },
    { id: 'goed-4', tekst: 'Super!' },
    { id: 'goed-5', tekst: 'Jij kunt dit!' },
    { id: 'goed-6', tekst: 'Joepie, goed!' },
  ],
  // Geen straf: rustig laten zien hoe het zit.
  bijna: [
    { id: 'bijna-1', tekst: 'Bijna! Kijk, zo zit het.' },
    { id: 'bijna-2', tekst: 'Net niet. Kijk maar even mee.' },
    { id: 'bijna-3', tekst: 'Geeft niks! Zo is het.' },
    { id: 'bijna-4', tekst: 'Oei, bijna! Kijk eens.' },
  ],
  comboDrie: [
    { id: 'combo-drie-1', tekst: 'Drie op een rij!' },
    { id: 'combo-drie-2', tekst: 'Lekker bezig!' },
  ],
  comboVijf: [
    { id: 'combo-vijf-1', tekst: 'Vijf op een rij, wauw!' },
    { id: 'combo-vijf-2', tekst: 'Wat gaat dat goed!' },
  ],
  comboTien: [
    { id: 'combo-tien-1', tekst: 'Tien op een rij! Kampioen!' },
    { id: 'combo-tien-2', tekst: 'Alles goed! Ongelofelijk!' },
  ],
  baasRaak: [
    { id: 'baas-raak-1', tekst: 'Raak!' },
    { id: 'baas-raak-2', tekst: 'Pats! Hebbes!' },
    { id: 'baas-raak-3', tekst: 'Nog eentje!' },
    { id: 'baas-raak-4', tekst: 'Die zit!' },
  ],
  baasGewonnen: [
    { id: 'baas-gewonnen-1', tekst: 'We hebben gewonnen!' },
    { id: 'baas-gewonnen-2', tekst: 'Hoera, verslagen!' },
  ],

  // Resultaat na een ronde, per aantal sterren
  resultaatNul: [
    { id: 'resultaat-nul-1', tekst: 'Goed geoefend! Zullen we het nog eens doen?' },
    { id: 'resultaat-nul-2', tekst: 'Oefenen maakt je sterker!' },
  ],
  resultaatEen: [
    { id: 'resultaat-een-1', tekst: 'Een ster! Mooi zo!' },
    { id: 'resultaat-een-2', tekst: 'Goed bezig!' },
  ],
  resultaatTwee: [
    { id: 'resultaat-twee-1', tekst: 'Twee sterren! Heel goed!' },
    { id: 'resultaat-twee-2', tekst: 'Wat knap van jou!' },
  ],
  resultaatDrie: [
    { id: 'resultaat-drie-1', tekst: 'Drie sterren! Fantastisch!' },
    { id: 'resultaat-drie-2', tekst: 'Alles in een keer goed!' },
  ],
  nieuweWiebel: [
    { id: 'nieuwe-wiebel-1', tekst: 'Kijk, een nieuw vriendje!' },
    { id: 'nieuwe-wiebel-2', tekst: 'Hoi! Kom je bij ons?' },
  ],
  gegroeid: [
    { id: 'gegroeid-1', tekst: 'Kijk, ik ben gegroeid!' },
    { id: 'gegroeid-2', tekst: 'Ik word steeds groter!' },
  ],
};

// Gebeurtenis bij een combo van 3, 5 of 10 goed op rij (COMBO_BONUS in ronde.js).
export const COMBO_ZINNEN = { 3: 'comboDrie', 5: 'comboVijf', 10: 'comboTien' };
// Gebeurtenis bij het resultaat, per aantal sterren (0–3).
export const RESULTAAT_ZINNEN = ['resultaatNul', 'resultaatEen', 'resultaatTwee', 'resultaatDrie'];

// Kiest een zin voor de gebeurtenis, maar nooit dezelfde als de vorige keer bij die gebeurtenis.
const vorige = new Map();
export function kiesZin(gebeurtenis, rnd = Math.random) {
  const lijst = ZINNEN[gebeurtenis];
  const keuze = lijst.length > 1 ? lijst.filter((z) => z.id !== vorige.get(gebeurtenis)) : lijst;
  const zin = keuze[Math.floor(rnd() * keuze.length)];
  vorige.set(gebeurtenis, zin.id);
  return zin;
}
