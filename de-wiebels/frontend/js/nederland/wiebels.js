// De Wiebels van Nederland: één per provincie en één voor heel Nederland, in elk thema dezelfde.
// Zelfde vorm als de Wiebels van een thema (themas/*.js): { id, naam, kleur, spul, lievelingskleur,
// eetHetLiefst, kanHeelGoed, geheimpje, zin }. De id is de beloning in profiel.verzameling.

import { sterId } from './wereld.js';

// De Wiebel van heel Nederland; die van een provincie heeft als id de plaatsen-toets van die provincie.
export const NL_WIEBEL = 'nl:nederland';
const toets = (provincie) => sterId('plaatsen', provincie, true);

export const WIEBELS_NL = [
  {
    id: toets('pv-groningen'), naam: 'Wadje', kleur: 'paars', spul: 'regenjas',
    lievelingskleur: 'Modderbruin van het wad', eetHetLiefst: 'Groninger koek met een glas melk',
    kanHeelGoed: 'Wadlopen: bij eb over de bodem van de Waddenzee lopen', geheimpje: 'Hij zwaait altijd naar de zeehonden op de zandplaten',
    zin: { id: 'wiebel-nl-groningen', tekst: 'Hallo, ik ben Wadje! Bij eb loop ik over de bodem van de Waddenzee.' },
  },
  {
    id: toets('pv-friesland'), naam: 'Elfje', kleur: 'blauw', spul: 'muts',
    lievelingskleur: 'Rood, zoals de blaadjes op de Friese vlag', eetHetLiefst: 'Fries suikerbrood met stukjes suiker',
    kanHeelGoed: 'Schaatsen langs de elf Friese steden', geheimpje: 'Hij oefent stiekem fierljeppen: met een lange stok over het water springen',
    zin: { id: 'wiebel-nl-friesland', tekst: 'Hoi, ik ben Elfje! Ik schaats het liefst langs de elf Friese steden.' },
  },
  {
    id: toets('pv-drenthe'), naam: 'Keitje', kleur: 'paars', spul: 'pet-streep',
    lievelingskleur: 'Heidepaars', eetHetLiefst: 'Pannenkoeken na een lange fietstocht',
    kanHeelGoed: 'Fietsen van hunebed naar hunebed', geheimpje: 'De grote stenen van de hunebedden zijn in de ijstijd met het ijs meegekomen',
    zin: { id: 'wiebel-nl-drenthe', tekst: 'Hallo, ik ben Keitje! Ik fiets van hunebed naar hunebed.' },
  },
  {
    id: toets('pv-overijssel'), naam: 'Fluistertje', kleur: 'roze', spul: 'zonnehoed',
    lievelingskleur: 'Rietgroen', eetHetLiefst: 'Zwolse balletjes, zoete snoepjes uit Zwolle',
    kanHeelGoed: 'Varen door de slootjes van Giethoorn', geheimpje: 'Zijn bootje is een fluisterboot: je hoort hem bijna niet',
    zin: { id: 'wiebel-nl-overijssel', tekst: 'Psst, ik ben Fluistertje! Ik vaar heel zachtjes door Giethoorn.' },
  },
  {
    id: toets('pv-flevoland'), naam: 'Poldertje', kleur: 'groen', spul: 'laarzen',
    lievelingskleur: 'Tulpenrood', eetHetLiefst: 'Patat van aardappels uit de polder',
    kanHeelGoed: 'Windmolens tellen langs de dijk', geheimpje: 'Waar hij woont, was vroeger zee: het land is drooggemaakt',
    zin: { id: 'wiebel-nl-flevoland', tekst: 'Hoi, ik ben Poldertje! Waar ik woon, was vroeger zee.' },
  },
  {
    id: toets('pv-gelderland'), naam: 'Eikeltje', kleur: 'oranje', spul: 'ronde-bril',
    lievelingskleur: 'Bosgroen', eetHetLiefst: 'Appels en kersen uit de Betuwe',
    kanHeelGoed: 'Wilde zwijnen en herten zoeken op de Veluwe', geheimpje: 'Zijn provincie heeft meer land dan elke andere provincie',
    zin: { id: 'wiebel-nl-gelderland', tekst: 'Hallo, ik ben Eikeltje! Op de Veluwe zoek ik wilde zwijnen.' },
  },
  {
    id: toets('pv-utrecht'), naam: 'Torentje', kleur: 'paars', spul: 'hoge-hoed',
    lievelingskleur: 'Grachtengroen', eetHetLiefst: 'Een broodje op de kade langs de gracht',
    kanHeelGoed: 'De trappen van de Domtoren op klimmen', geheimpje: 'De Domtoren is de hoogste kerktoren van Nederland',
    zin: { id: 'wiebel-nl-utrecht', tekst: 'Hoi, ik ben Torentje! Ik klim zo naar de top van de Domtoren.' },
  },
  {
    id: toets('pv-noord-holland'), naam: 'Molentje', kleur: 'groen', spul: 'ballon-regenboog',
    lievelingskleur: 'Kaasgeel', eetHetLiefst: 'Kaas van de kaasmarkt in Alkmaar',
    kanHeelGoed: 'Molens zien draaien in de Zaanstreek', geheimpje: 'Amsterdam, de hoofdstad van Nederland, ligt in zijn provincie',
    zin: { id: 'wiebel-nl-noord-holland', tekst: 'Hallo, ik ben Molentje! Ik kijk graag naar de molens in de Zaanstreek.' },
  },
  {
    id: toets('pv-zuid-holland'), naam: 'Kraantje', kleur: 'blauw', spul: 'pet-blauw',
    lievelingskleur: 'Delfts blauw', eetHetLiefst: 'Stroopwafels uit Gouda',
    kanHeelGoed: 'Grote zeeschepen tellen in de haven van Rotterdam', geheimpje: 'De haven van Rotterdam is de grootste haven van Europa',
    zin: { id: 'wiebel-nl-zuid-holland', tekst: 'Hoi, ik ben Kraantje! Ik tel de grote schepen in de haven van Rotterdam.' },
  },
  {
    id: toets('pv-zeeland'), naam: 'Bolusje', kleur: 'roze', spul: 'strik',
    lievelingskleur: 'Zeeblauw', eetHetLiefst: 'Een Zeeuwse bolus, lekker zoet en plakkerig',
    kanHeelGoed: 'Schelpen zoeken op het strand', geheimpje: 'Als het hard stormt, houdt een grote stormvloedkering de zee tegen',
    zin: { id: 'wiebel-nl-zeeland', tekst: 'Hallo, ik ben Bolusje! Ik eet het liefst een plakkerige Zeeuwse bolus.' },
  },
  {
    id: toets('pv-noord-brabant'), naam: 'Confetti', kleur: 'roze', spul: 'feesthoedje',
    lievelingskleur: 'Confettiroze', eetHetLiefst: 'Een warm Brabants worstenbroodje',
    kanHeelGoed: 'Feestvieren met carnaval', geheimpje: 'In zijn provincie ligt een groot sprookjespark',
    zin: { id: 'wiebel-nl-noord-brabant', tekst: 'Hoi, ik ben Confetti! Met carnaval dans ik de hele dag.' },
  },
  {
    id: toets('pv-limburg'), naam: 'Vlaaitje', kleur: 'oranje', spul: 'sneakers',
    lievelingskleur: 'Kersenrood', eetHetLiefst: 'Limburgse vlaai met kersen',
    kanHeelGoed: 'De heuvels van Zuid-Limburg op en af rennen', geheimpje: 'Op de Vaalserberg kan hij tegelijk in drie landen staan',
    zin: { id: 'wiebel-nl-limburg', tekst: 'Hallo, ik ben Vlaaitje! Op de Vaalserberg sta ik in drie landen tegelijk.' },
  },
  {
    id: NL_WIEBEL, naam: 'Tulpje', kleur: 'oranje', spul: 'kroon',
    lievelingskleur: 'Oranje, natuurlijk!', eetHetLiefst: 'Poffertjes met poedersuiker',
    kanHeelGoed: 'Fietsen door het hele land', geheimpje: 'Een groot deel van Nederland ligt lager dan de zee',
    zin: { id: 'wiebel-nl-nederland', tekst: 'Hoi, ik ben Tulpje! Ik ken alle provincies van Nederland.' },
  },
];

// Wat de eigen Wiebel zegt bij een gevangen Wiebel van Nederland (in de verzameling).
export const GEVANGEN_ZIN = { id: 'nl-gevangen-toets', tekst: 'Die zit nog gevangen! Haal een ster bij die toets om hem te bevrijden.' };

// Welke toetsen samen een Wiebel van Nederland bevrijden: elk met minstens 1 ster. Een provincie:
// haar plaatsen-toets; heel Nederland: de toets Provincies én de toets Hoofdsteden.
export const BELONINGEN_NL = WIEBELS_NL.map((w) => ({
  id: w.id,
  toetsen: w.id === NL_WIEBEL ? [sterId('provincies', 'alle', true), sterId('hoofdsteden', 'alle', true)] : [w.id],
}));

// De Wiebel die na deze toets vrijkomt (zijn id), of null: alleen als de toets erbij hoort en alle
// toetsen van die Wiebel nu minstens 1 ster hebben.
export function nlBeloningNa(profiel, levelId) {
  const b = BELONINGEN_NL.find((x) => x.toetsen.includes(levelId));
  return b && b.toetsen.every((id) => (profiel.sterren[id] || 0) >= 1) ? b.id : null;
}
