// Alles wat de Wiebel zegt, per gebeurtenis. Elke zin is vaste tekst zonder ingevulde delen (geen
// namen, prijzen, werelden of spullen), zodat de stem hem vooraf kan inspreken. De id blijft altijd
// gelijk: hij wordt de naam van het geluidsbestand. Een nieuwe zin krijgt een nieuwe id.

import { schud } from './generators/opties.js';

export const ZINNEN = {
  kleurGekozen: [
    { id: 'kleur-1', tekst: 'Hoi! Ik ben jouw Wiebel!' },
    { id: 'kleur-2', tekst: 'Joepie, wat een mooie kleur!' },
    { id: 'kleur-3', tekst: 'Wij worden vast goede vrienden!' },
  ],

  // Het verhaal bij de eerste start van een profiel: één zin per schermpje, in deze volgorde
  // (schermen/intro.js kiest ze zelf, niet via kiesZin).
  intro: [
    { id: 'intro-gevangen-1', tekst: 'Oh nee! De eindbazen hebben alle Wiebels gevangen!' },
    { id: 'intro-level-1', tekst: 'Voor elk level dat je haalt, komt er een Wiebel vrij.' },
    { id: 'intro-baas-1', tekst: 'En elke eindbaas houdt er nog eentje vast.' },
    { id: 'intro-samen-1', tekst: 'Samen gaan we ze allemaal bevrijden! Kom op!' },
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
  // In plaats van het welkom, als er een Wiebel is bevrijd die het kind nog niet heeft bekeken.
  menuNieuw: [
    { id: 'menu-nieuw-1', tekst: 'Er is een Wiebel bevrijd! Kijk maar bij Wiebels.' },
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
    { id: 'goed-7', tekst: 'Ja, dat klopt!' },
    { id: 'goed-8', tekst: 'Precies goed!' },
    { id: 'goed-9', tekst: 'Goed nagedacht!' },
    { id: 'goed-10', tekst: 'Helemaal juist!' },
    { id: 'goed-11', tekst: 'Wauw, knap hoor!' },
    { id: 'goed-12', tekst: 'Keigoed!' },
    { id: 'goed-13', tekst: 'Klopt als een bus!' },
    { id: 'goed-14', tekst: 'Hoera, goed!' },
    { id: 'goed-15', tekst: 'Mooi zo!' },
    { id: 'goed-16', tekst: 'Netjes!' },
    { id: 'goed-17', tekst: 'Dat wist je goed!' },
    { id: 'goed-18', tekst: 'Jij bent een kanjer!' },
    { id: 'goed-19', tekst: 'Dat ging lekker!' },
    { id: 'goed-20', tekst: 'Bingo!' },
    { id: 'goed-21', tekst: 'Yes, goed zo!' },
    { id: 'goed-22', tekst: 'Die zit!' },
    { id: 'goed-23', tekst: 'Hartstikke goed!' },
    { id: 'goed-24', tekst: 'Wat goed van jou!' },
    { id: 'goed-25', tekst: 'Daar ben ik blij mee!' },
    { id: 'goed-26', tekst: 'Jaaa, goed!' },
    { id: 'goed-27', tekst: 'Goed gevonden!' },
    { id: 'goed-28', tekst: 'Je doet het geweldig!' },
    { id: 'goed-29', tekst: 'Ik wist dat je het kon!' },
    { id: 'goed-30', tekst: 'Toppie!' },
  ],
  // Geen straf: rustig laten zien hoe het zit.
  bijna: [
    { id: 'bijna-1', tekst: 'Bijna! Kijk, zo zit het.' },
    { id: 'bijna-2', tekst: 'Net niet. Kijk maar even mee.' },
    { id: 'bijna-3', tekst: 'Geeft niks! Zo is het.' },
    { id: 'bijna-4', tekst: 'Oei, bijna! Kijk eens.' },
    { id: 'bijna-5', tekst: 'Oeps! Kijk, zo moet het.' },
    { id: 'bijna-6', tekst: 'Bijna goed! Zo zit het.' },
    { id: 'bijna-7', tekst: 'Dat was een lastige. Kijk maar.' },
    { id: 'bijna-8', tekst: 'Niet erg, daar leer je van!' },
    { id: 'bijna-9', tekst: 'Net ernaast! Kijk eens mee.' },
    { id: 'bijna-10', tekst: 'Geeft niets, fouten maken mag!' },
    { id: 'bijna-11', tekst: 'Oei! Kijk, zo is het goed.' },
    { id: 'bijna-12', tekst: 'Die is lastig, hè? Zo zit het.' },
    { id: 'bijna-13', tekst: 'Geen zorgen, kijk maar even.' },
    { id: 'bijna-14', tekst: 'Bijna! Nu weet je het.' },
    { id: 'bijna-15', tekst: 'Nét niet! Kijk maar.' },
    { id: 'bijna-16', tekst: 'Hmm, dat klopt niet helemaal. Kijk eens.' },
    { id: 'bijna-17', tekst: 'Oei, die was moeilijk! Zo is het.' },
    { id: 'bijna-18', tekst: 'Geeft helemaal niks. Kijk mee!' },
    { id: 'bijna-19', tekst: 'Ah, bijna! Zo zit het.' },
    { id: 'bijna-20', tekst: 'Niet getreurd, kijk maar even.' },
    { id: 'bijna-21', tekst: 'Dat is een goede om te onthouden!' },
    { id: 'bijna-22', tekst: 'Oeps, mis! Kijk, zo moet het.' },
    { id: 'bijna-23', tekst: 'Rustig maar, zo zit het.' },
    { id: 'bijna-24', tekst: 'Bijna raak! Kijk eens goed.' },
  ],
  comboDrie: [
    { id: 'combo-drie-1', tekst: 'Drie op een rij!' },
    { id: 'combo-drie-2', tekst: 'Lekker bezig!' },
    { id: 'combo-drie-3', tekst: 'Je bent op dreef!' },
    { id: 'combo-drie-4', tekst: 'Het gaat als een trein!' },
    { id: 'combo-drie-5', tekst: 'Drie goed! Ga zo door!' },
    { id: 'combo-drie-6', tekst: 'Daar zit vaart in!' },
  ],
  comboVijf: [
    { id: 'combo-vijf-1', tekst: 'Vijf op een rij, wauw!' },
    { id: 'combo-vijf-2', tekst: 'Wat gaat dat goed!' },
    { id: 'combo-vijf-3', tekst: 'Een hele hand vol goed!' },
    { id: 'combo-vijf-4', tekst: 'Jij bent niet te stoppen!' },
    { id: 'combo-vijf-5', tekst: 'Je bent echt op stoom!' },
    { id: 'combo-vijf-6', tekst: 'Hoe doe je dat toch?' },
  ],
  comboTien: [
    { id: 'combo-tien-1', tekst: 'Tien op een rij! Kampioen!' },
    { id: 'combo-tien-2', tekst: 'Alles goed! Ongelofelijk!' },
    { id: 'combo-tien-3', tekst: 'Tien keer goed! Jij bent een ster!' },
    { id: 'combo-tien-4', tekst: 'Wauw, tien op een rij! Feest!' },
    { id: 'combo-tien-5', tekst: 'Wat een topper ben jij!' },
    { id: 'combo-tien-6', tekst: 'Tien! Ik word er helemaal blij van!' },
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
  // Een Wiebel komt vrij (resultaat na een level, eindbaas verslagen)
  bevrijd: [
    { id: 'bevrijd-1', tekst: 'Hoera, weer een Wiebel bevrijd!' },
    { id: 'bevrijd-2', tekst: 'Kijk, hij is vrij!' },
    { id: 'bevrijd-3', tekst: 'Joepie, kom maar bij ons!' },
  ],
  gegroeid: [
    { id: 'gegroeid-1', tekst: 'Kijk, ik ben gegroeid!' },
    { id: 'gegroeid-2', tekst: 'Ik word steeds groter!' },
  ],

  // Bevrijde Wiebels: bij het openen (openingsZin in beloningen.js) en bij een gevangen Wiebel.
  // Wat een bevrijde Wiebel zelf zegt, staat bij die Wiebel in het thema (themas/*.js).
  collectieNieuw: [
    { id: 'collectie-nieuw-1', tekst: 'Kijk, er zijn nieuwe bij!' },
  ],
  collectieStart: [
    { id: 'collectie-start-1', tekst: 'Bevrijd alle Wiebels!' },
  ],
  collectieAlles: [
    { id: 'collectie-alles-1', tekst: 'Ze zijn allemaal vrij! Hoera!' },
  ],
  gevangenOpen: [
    { id: 'gevangen-open-1', tekst: 'Die zit nog gevangen! Haal twee sterren in dat level om hem te bevrijden.' },
  ],
  gevangenBaas: [
    { id: 'gevangen-baas-1', tekst: 'Die houdt de eindbaas vast! Versla de eindbaas om hem te bevrijden.' },
  ],
  gevangenDicht: [
    { id: 'gevangen-dicht-1', tekst: 'Die zit nog achter slot en grendel. Speel eerst de levels ervoor!' },
  ],
};

// Gebeurtenis bij een combo van 3, 5 of 10 goed op rij (COMBO_BONUS in ronde.js).
export const COMBO_ZINNEN = { 3: 'comboDrie', 5: 'comboVijf', 10: 'comboTien' };
// Gebeurtenis bij het resultaat, per aantal sterren (0–3).
export const RESULTAAT_ZINNEN = ['resultaatNul', 'resultaatEen', 'resultaatTwee', 'resultaatDrie'];

// Kiest een zin voor de gebeurtenis van een geschudde stapel: elke zin komt eerst één keer aan de
// beurt voordat er een terugkomt. Is de stapel op, dan wordt opnieuw geschud, en de eerste van de
// nieuwe stapel is nooit dezelfde als de vorige zin.
const stapels = new Map();
const vorige = new Map();
export function kiesZin(gebeurtenis, rnd = Math.random) {
  let stapel = stapels.get(gebeurtenis);
  if (!stapel?.length) {
    stapel = schud(ZINNEN[gebeurtenis], rnd);
    if (stapel.length > 1 && stapel[0].id === vorige.get(gebeurtenis)) {
      const j = 1 + Math.floor(rnd() * (stapel.length - 1));
      [stapel[0], stapel[j]] = [stapel[j], stapel[0]];
    }
    stapels.set(gebeurtenis, stapel);
  }
  const zin = stapel.shift();
  vorige.set(gebeurtenis, zin.id);
  return zin;
}
