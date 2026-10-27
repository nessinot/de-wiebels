// Vragen voor de wereld Nederland. Elk ding wordt op meer manieren gevraagd; de id van een vraag is
// ook het item in p.items (leitner.js):
//   nl:herken:<id>            het ding licht op, kies de naam uit 3 knoppen
//   nl:wijs:<id>              "Waar ligt X?", wijs het aan op de kaart
//   nl:hoofdstad:<prov>       "Wat is de hoofdstad van X?", 3 knoppen
//   nl:hoofdstad-wijs:<prov>  "Waar ligt de hoofdstad van X?", wijs de stip aan
//   nl:hoofdstad-van:<plaats> "Van welke provincie is Y de hoofdstad?", wijs de provincie aan
// Wat uitstaat (profiel.nederland.uit) komt nergens voor: niet als vraag, niet als knop en niet als
// stip. Provincies en hoofdsteden staan altijd aan; in het onderdeel Plaatsen telt uit ook voor een
// hoofdstad.

import { esc } from '../dom.js';
import { kies, schud } from '../generators/opties.js';
import { WACHTTIJD } from '../leitner.js';
import { RONDE_LENGTE } from '../ronde.js';
import { BUREN } from './buren.js';
import { PER_ID, PROVINCIES } from './kaartbeeld.js';
import { ITEMS } from './items.js';

export const TOETS_MAX = 30;
const MAX_HERHALING = 4;

// De vraag bij "het ding licht op", per soort.
export const HERKEN_ZINNEN = {
  provincie: { id: 'nl-herken-provincie', tekst: 'Welke provincie is dit?' },
  plaats: { id: 'nl-herken-plaats', tekst: 'Welke plaats is dit?' },
  streek: { id: 'nl-herken-streek', tekst: 'Welke streek is dit?' },
  eiland: { id: 'nl-herken-eiland', tekst: 'Welk eiland is dit?' },
  water: { id: 'nl-herken-water', tekst: 'Welk water is dit?' },
  // Als er te weinig van dezelfde soort aanstaan en de knoppen streken en eilanden door elkaar zijn.
  gebied: { id: 'nl-herken-gebied', tekst: 'Welk gebied is dit?' },
};

const HOOFDSTAD_VAN = Object.fromEntries(PROVINCIES.map((p) => [PER_ID[p].hoofdstad, p]));

// Buurprovincies: wie in de burentabel naar elkaar wijzen, in een van beide richtingen.
const BUURPROVINCIES = Object.fromEntries(PROVINCIES.map((p) => [p, new Set([
  ...Object.values(BUREN[p]).filter(Boolean),
  ...PROVINCIES.filter((q) => Object.values(BUREN[q]).includes(p)),
])]));

// Wat op de kaart op elkaar lijkt: stippen, gebieden (streek of eiland), water of provincies.
function groep(it) {
  return it.soort === 'streek' || it.soort === 'eiland' ? 'gebied' : it.soort;
}

const deelt = (a, b) => a.provincies.some((p) => b.provincies.includes(p));
const buur = (a, b) => a.provincies.some((p) => b.provincies.some((q) => BUURPROVINCIES[q].has(p)));

// Twee foute knoppen bij een item, van dezelfde soort: eerst uit dezelfde provincie, dan uit de
// buurprovincies, dan uit heel Nederland. Pas als dat er te weinig zijn, ook een streek bij een
// eiland of andersom (de vraag wordt dan "Welk gebied is dit?"). Altijd met een andere naam dan de
// andere knoppen.
function afleiders(item, ctx) {
  const kandidaten = ITEMS.filter((it) => it.id !== item.id && groep(it) === groep(item) && ctx.aan(it.id));
  const lagen = [
    (it) => it.soort === item.soort && deelt(it, item),
    (it) => it.soort === item.soort && buur(it, item),
    (it) => it.soort === item.soort,
    (it) => deelt(it, item),
    (it) => buur(it, item),
    () => true,
  ];
  const gekozen = [];
  for (const laag of lagen) {
    for (const it of schud(kandidaten.filter(laag), ctx.rnd)) {
      if (gekozen.length < 2 && it.naam !== item.naam && !gekozen.some((g) => g.naam === it.naam)) gekozen.push(it);
    }
  }
  return gekozen;
}

// Meerkeuze: het goede item en zijn afleiders, door elkaar. gemengd: niet alles van dezelfde soort.
function knoppen(goed, ctx) {
  const fout = afleiders(goed, ctx);
  const opties = schud([goed, ...fout], ctx.rnd).map((it) => ({ sleutel: it.id, html: esc(it.naam) }));
  return { opties, gemengd: fout.some((it) => it.soort !== goed.soort) };
}

// Waar ingezoomd wordt: de provincie van het level, of bij "Alle provincies" de eerste van het item.
function zoomVoor(item, ctx) {
  return item.provincies.includes(ctx.keuze) ? ctx.keuze : item.provincies[0];
}

// Wat je kunt aanwijzen bij een item in een provincie: wat erop lijkt (minstens 3), anders alles daar.
function aanwijsDoelen(item, provincie, ctx) {
  const daar = ITEMS.filter((it) => it.soort !== 'provincie' && it.provincies.includes(provincie)
    && (it.id === item.id || ctx.aan(it.id)));
  const zelfde = daar.filter((it) => groep(it) === groep(item));
  return (zelfde.length >= 3 ? zelfde : daar).map((it) => it.id);
}

// Waar de focus begint: niet meteen op het goede antwoord.
function beginBij(doelen, goed, ctx) {
  return kies(doelen.filter((id) => id !== goed), ctx.rnd) ?? goed;
}

function basis(id, goed, zin, dat) {
  return { id, soort: 'nl', goed, goedHtml: esc(PER_ID[goed].naam), tekst: esc(zin.tekst), zin, dat };
}

function aanwijzen(vraag, provincie, doelen, ctx) {
  return { ...vraag, interactief: 'aanwijzen', opties: [], kaart: { provincie, doelen, begin: beginBij(doelen, vraag.goed, ctx) } };
}

const VORMEN = {
  herken(item, ctx) {
    const provincie = item.soort === 'provincie' ? null : zoomVoor(item, ctx);
    const { opties, gemengd } = knoppen(item, ctx);
    return {
      ...basis(`nl:herken:${item.id}`, item.id, HERKEN_ZINNEN[gemengd ? 'gebied' : item.soort], item.zinnen.dat),
      optieSoort: 'nl', opties, kaart: { provincie, licht: [item.id] },
    };
  },
  wijs(item, ctx) {
    const vraag = basis(`nl:wijs:${item.id}`, item.id, item.zinnen.waar, item.zinnen.dat);
    if (item.soort === 'provincie') return aanwijzen(vraag, null, PROVINCIES, ctx);
    const provincie = zoomVoor(item, ctx);
    return aanwijzen(vraag, provincie, aanwijsDoelen(item, provincie, ctx), ctx);
  },
  hoofdstad(prov, ctx) {
    const stad = PER_ID[prov.hoofdstad];
    return {
      ...basis(`nl:hoofdstad:${prov.id}`, stad.id, prov.zinnen.hoofdstad, stad.zinnen.dat),
      optieSoort: 'nl', opties: knoppen(stad, ctx).opties, kaart: { provincie: null, licht: [prov.id] },
    };
  },
  'hoofdstad-wijs'(prov, ctx) {
    const stad = PER_ID[prov.hoofdstad];
    const doelen = ITEMS.filter((it) => it.soort === 'plaats' && it.provincies.includes(prov.id)
      && (it.id === stad.id || ctx.aan(it.id))).map((it) => it.id);
    return aanwijzen(basis(`nl:hoofdstad-wijs:${prov.id}`, stad.id, prov.zinnen.hoofdstadWaar, stad.zinnen.dat), prov.id, doelen, ctx);
  },
  'hoofdstad-van'(stad, ctx) {
    const prov = PER_ID[HOOFDSTAD_VAN[stad.id]];
    return aanwijzen(basis(`nl:hoofdstad-van:${stad.id}`, prov.id, stad.zinnen.hoofdstadVan, prov.zinnen.dat), null, PROVINCIES, ctx);
  },
};

// Een vraag opnieuw opbouwen uit zijn id (ook voor de herhaling), of null.
export function nlVraagUitId(id, ctx) {
  const [, vorm, itemId] = id.split(':');
  const item = PER_ID[itemId];
  return item && VORMEN[vorm] ? VORMEN[vorm](item, ctx) : null;
}

// Aanwijzen heeft pas zin met minstens zoveel dingen op de kaart (staat er veel uit, dan vervalt die vorm).
const MIN_DOELEN = 3;

function bruikbaar(id, ctx) {
  if (!/^nl:(wijs|hoofdstad-wijs):/.test(id)) return true;
  const vraag = nlVraagUitId(id, ctx);
  return vraag.interactief !== 'aanwijzen' || vraag.kaart.doelen.length >= MIN_DOELEN;
}

// De eenheden van een level: per ding (een provincie, of een plaats, streek, eiland of water) de
// ids van de vragen die erover gaan. Een toets vraagt elke eenheid hoogstens één keer.
export function eenheden(level, ctx) {
  let lijst;
  if (level.onderdeel === 'provincies') {
    lijst = PROVINCIES.map((p) => ({ id: p, vragen: [`nl:herken:${p}`, `nl:wijs:${p}`] }));
  } else if (level.onderdeel === 'hoofdsteden') {
    lijst = PROVINCIES.map((p) => ({ id: p, vragen: [`nl:hoofdstad:${p}`, `nl:hoofdstad-wijs:${p}`, `nl:hoofdstad-van:${PER_ID[p].hoofdstad}`] }));
  } else {
    lijst = ITEMS.filter((it) => it.soort !== 'provincie' && ctx.aan(it.id)
      && (level.keuze === 'alle' || it.provincies.includes(level.keuze)))
      .map((it) => ({ id: it.id, vragen: [`nl:herken:${it.id}`, `nl:wijs:${it.id}`] }));
  }
  return lijst.map((e) => ({ ...e, vragen: e.vragen.filter((id) => bruikbaar(id, ctx)) })).filter((e) => e.vragen.length);
}

export function maakContext(profiel, level, rnd = Math.random) {
  const uit = new Set(profiel.nederland?.uit ?? []);
  return { keuze: level.keuze, rnd, aan: (id) => !uit.has(id) };
}

// De vragen voor een oefenronde of toets: { vragen, reserve }.
// Oefenen: eerst wat volgens de bakjes weer aan de beurt is (WACHTTIJD), dan nieuwe dingen; de rest
// is reserve voor tussenvragen. Toets: elke eenheid één keer; over heel Nederland (Provincies,
// Hoofdsteden, Plaatsen bij "Alle provincies") hoogstens 30.
export function nlVragen(profiel, level, rnd = Math.random, nu = new Date()) {
  const ctx = maakContext(profiel, level, rnd);
  const lijst = eenheden(level, ctx);
  if (level.toets) {
    const gekozen = schud(lijst, rnd).slice(0, level.keuze === 'alle' ? TOETS_MAX : lijst.length);
    return { vragen: gekozen.map((e) => nlVraagUitId(kies(e.vragen, rnd), ctx)), reserve: [] };
  }
  const eenheidVan = Object.fromEntries(lijst.flatMap((e) => e.vragen.map((id) => [id, e.id])));
  const herhaling = Object.entries(profiel.items)
    .filter(([id, item]) => eenheidVan[id] && item.level === level.leitner && item.bak < 5 && nu - new Date(item.laatst) >= WACHTTIJD[item.bak])
    .sort(([, a], [, b]) => a.bak - b.bak || a.laatst.localeCompare(b.laatst))
    .map(([id]) => id);
  const gebruikt = new Set();
  const ids = [];
  for (const id of herhaling) {
    if (ids.length >= MAX_HERHALING || gebruikt.has(eenheidVan[id])) continue;
    gebruikt.add(eenheidVan[id]);
    ids.push(id);
  }
  // Eerst elk ding één keer, daarna (bij weinig dingen) een andere vraag over hetzelfde ding.
  const gemengd = schud(lijst, rnd);
  for (const e of gemengd) if (!gebruikt.has(e.id)) ids.push(kies(e.vragen, rnd));
  for (const e of gemengd) for (const id of schud(e.vragen, rnd)) if (!ids.includes(id)) ids.push(id);
  const vragen = ids.slice(0, RONDE_LENGTE * 2).map((id) => nlVraagUitId(id, ctx));
  return { vragen: vragen.slice(0, RONDE_LENGTE), reserve: vragen.slice(RONDE_LENGTE) };
}
