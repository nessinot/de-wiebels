// De kaart van Nederland als SVG-string, net als klokSvg in klok.js. Heel Nederland of ingezoomd op
// één provincie (via de viewBox, met de andere provincies grijs eromheen). Water ligt deels onder het
// land, dus het komt eerst; daarna het land, de streken en eilanden, de meren midden in het land en
// bovenop de stippen.
// Wat je kunt aanwijzen heeft data-doel met het id van het item (bediening.js).

import { ITEMS } from './items.js';
import { GEBIEDEN, VIEWBOX } from './kaart.js';

export const PROVINCIES = ITEMS.filter((it) => it.soort === 'provincie').map((it) => it.id);
export const PER_ID = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
const WATER = Object.keys(GEBIEDEN).filter((id) => PER_ID[id]?.soort === 'water');

// De ringen van een pad uit kaart.js ("M x y", dan "l" met relatieve stappen, en "z").
function ringen(d) {
  const uit = [];
  let ring = null;
  let x = 0;
  let y = 0;
  let commando = '';
  const getallen = [];
  for (const deel of d.match(/[Mlz]|-?\d+/g)) {
    if (/[Mlz]/.test(deel)) {
      commando = deel;
      if (deel === 'z') uit.push(ring);
      continue;
    }
    getallen.push(Number(deel));
    if (getallen.length < 2) continue;
    const [a, b] = getallen.splice(0, 2);
    if (commando === 'M') {
      [x, y] = [a, b];
      ring = [[x, y]];
    } else {
      x += a;
      y += b;
      ring.push([x, y]);
    }
  }
  return uit;
}

function binnen([px, py], rs) {
  let n = 0;
  for (const r of rs) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [x1, y1] = r[i];
      const [x2, y2] = r[j];
      if ((y1 > py) !== (y2 > py) && px < ((x2 - x1) * (py - y1)) / (y2 - y1) + x1) n++;
    }
  }
  return n % 2 === 1;
}

// Meren midden in het land (zoals de Loosdrechtse Plassen) vallen onder het landpad weg; die komen
// erbovenop. Zeeën en grote meren met hun middelpunt op het water blijven eronder.
const LANDRINGEN = PROVINCIES.map((id) => ringen(GEBIEDEN[id].d));
const WATER_OP_LAND = new Set(WATER.filter((id) => LANDRINGEN.some((rs) => binnen(GEBIEDEN[id].midden, rs))));

// Marge rond een ingezoomde provincie, als deel van haar breedte of hoogte.
const MARGE = 0.08;

// De items die je in een provincie (of met null in heel Nederland) kunt aanwijzen, zonder wat uitstaat.
export function doelenVoor(provincie, uit = []) {
  return ITEMS.filter((it) => it.soort !== 'provincie' && !uit.includes(it.id)
    && (!provincie || it.provincies.includes(provincie))).map((it) => it.id);
}

// Het zichtbare vak [x, y, breedte, hoogte] in kaarteenheden, in de verhouding van het kaartvlak.
export function zoomVak(provincie, breedte, hoogte) {
  let [x, y, b, h] = provincie ? GEBIEDEN[provincie].vak : VIEWBOX;
  if (provincie) {
    const m = Math.max(b, h) * MARGE;
    [x, y, b, h] = [x - m, y - m, b + 2 * m, h + 2 * m];
  }
  const verhouding = breedte / hoogte;
  if (b / h < verhouding) {
    const nb = h * verhouding;
    x -= (nb - b) / 2;
    b = nb;
  } else {
    const nh = b / verhouding;
    y -= (nh - h) / 2;
    h = nh;
  }
  return [x, y, b, h].map(Math.round);
}

// Het punt waar de focus van een item "zit": de stip, of het zwaartepunt van het gebied, binnen het
// zichtbare vak (de Noordzee heeft haar zwaartepunt anders ver buiten beeld).
export function doelPunt(id, vak) {
  const it = PER_ID[id];
  const [px, py] = it.stip ?? GEBIEDEN[it.gebied].midden;
  if (!vak) return [px, py];
  const [x, y, b, h] = vak;
  return [Math.min(x + b, Math.max(x, px)), Math.min(y + h, Math.max(y, py))];
}

const pad = (id, klasse, doel) =>
  `<path class="${klasse}"${doel ? ` data-doel="${id}"` : ''} d="${GEBIEDEN[id].d}"/>`;

// provincie: id of null (heel Nederland). doelen: ids die je kunt aanwijzen (provincies of items).
// kleuren: per provincie 0–3, voor de inkleurkaart (zonder kleuren is het land groen).
// breedte en hoogte: de maat van het kaartvlak in px, voor de verhouding en de stippen.
// licht: ids die oplichten (klasse nl-licht), zonder dat je ze kunt aanwijzen (een vraag "Welke plaats is dit?").
export function kaartSvg({ provincie = null, doelen = [], licht = [], kleuren = null, breedte = 640, hoogte = 760, stip = 12 } = {}) {
  const vak = zoomVak(provincie, breedte, hoogte);
  const r = Math.round((stip * vak[2]) / breedte);
  const isDoel = new Set(doelen);
  const isLicht = new Set(licht);
  const getekend = [...doelen, ...licht.filter((id) => !isDoel.has(id))];
  const extra = (id) => `${isDoel.has(id) ? ' nl-doel' : ''}${isLicht.has(id) ? ' nl-licht' : ''}`;

  const waterPad = (id) => pad(id, `nl-water${extra(id)}`, isDoel.has(id));
  const water = WATER.filter((id) => !WATER_OP_LAND.has(id)).map(waterPad).join('');
  const meren = WATER.filter((id) => WATER_OP_LAND.has(id)).map(waterPad).join('');
  const land = PROVINCIES.map((id) => {
    let klasse = 'nl-land';
    if (provincie && id !== provincie) klasse += ' nl-buur';
    else if (kleuren) klasse += ` nl-kleur-${kleuren[id] ?? 0}`;
    return pad(id, klasse + extra(id), isDoel.has(id));
  }).join('');
  const gebieden = getekend.filter((id) => PER_ID[id].soort === 'streek' || PER_ID[id].soort === 'eiland')
    .map((id) => pad(id, `nl-gebied${extra(id)}`, isDoel.has(id))).join('');
  const stippen = getekend.filter((id) => PER_ID[id].stip).map((id) => {
    const [cx, cy] = PER_ID[id].stip;
    const doel = isDoel.has(id) ? ` data-doel="${id}"` : '';
    return `<circle class="nl-stip${extra(id)}"${doel} cx="${cx}" cy="${cy}" r="${r}"/>`;
  }).join('');

  return `<svg class="nl-kaart" viewBox="${vak.join(' ')}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kaart van Nederland">
    <g class="nl-laag-water">${water}</g>
    <g class="nl-laag-land">${land}</g>
    <g class="nl-laag-gebied">${gebieden}</g>
    <g class="nl-laag-meer">${meren}</g>
    <g class="nl-laag-stip">${stippen}</g>
  </svg>`;
}
