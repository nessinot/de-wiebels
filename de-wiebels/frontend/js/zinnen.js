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
    { id: 'passen-3', tekst: 'Ooh, die wil ik wel!' },
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
};

export function willekeurigeZin(gebeurtenis) {
  const lijst = ZINNEN[gebeurtenis];
  return lijst[Math.floor(Math.random() * lijst.length)];
}
