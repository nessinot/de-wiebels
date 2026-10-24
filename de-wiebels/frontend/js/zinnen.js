// Alles wat de Wiebel zegt, per gebeurtenis. Elke zin is vaste tekst zonder ingevulde delen (geen
// namen, prijzen, werelden of spullen), zodat de stem hem vooraf kan inspreken. De id blijft altijd
// gelijk: hij wordt de naam van het geluidsbestand. Een nieuwe zin krijgt een nieuwe id.

export const ZINNEN = {
  kleurGekozen: [
    { id: 'kleur-1', tekst: 'Hoi! Ik ben jouw Wiebel!' },
    { id: 'kleur-2', tekst: 'Joepie, wat een mooie kleur!' },
    { id: 'kleur-3', tekst: 'Wij worden vast goede vrienden!' },
  ],
};

export function willekeurigeZin(gebeurtenis) {
  const lijst = ZINNEN[gebeurtenis];
  return lijst[Math.floor(Math.random() * lijst.length)];
}
