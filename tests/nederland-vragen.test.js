import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../de-wiebels/frontend/js/nederland/items.js';
import { PER_ID, PROVINCIES } from '../de-wiebels/frontend/js/nederland/kaartbeeld.js';
import { HERKEN_ZINNEN, TOETS_MAX, maakContext, nlVraagUitId, nlVragen } from '../de-wiebels/frontend/js/nederland/vragen.js';
import { sterId } from '../de-wiebels/frontend/js/nederland/wereld.js';
import { levelVan } from '../de-wiebels/frontend/js/levels.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';
import { RONDE_LENGTE } from '../de-wiebels/frontend/js/ronde.js';

// Vaste willekeur, zodat een fout altijd terugkomt.
function rng(zaad) {
  let s = zaad;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const HOOFDSTEDEN = new Set(PROVINCIES.map((p) => PER_ID[p].hoofdstad));
const NIET_PROVINCIE = ITEMS.filter((it) => it.soort !== 'provincie').map((it) => it.id);

// Alle levels: Provincies en Hoofdsteden over heel Nederland, Plaatsen per provincie en voor alles.
const LEVEL_IDS = [
  ...['provincies', 'hoofdsteden'].flatMap((o) => [sterId(o, 'alle'), sterId(o, 'alle', true)]),
  ...[...PROVINCIES, 'alle'].flatMap((k) => [sterId('plaatsen', k), sterId('plaatsen', k, true)]),
];

function profielMet(uit = []) {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  p.nederland.uit = uit;
  return p;
}

// Willekeurig de helft van de plaatsen, streken, eilanden en wateren uit.
function willekeurigUit(zaad) {
  const r = rng(zaad);
  return NIET_PROVINCIE.filter(() => r() < 0.5);
}

const vorm = (v) => v.id.split(':')[1];
// Waar een vraag over gaat: de provincie bij Provincies en Hoofdsteden, anders het ding zelf.
const eenheid = (v) => (vorm(v) === 'hoofdstad-van' ? v.goed : v.id.split(':')[2]);
const alleVragen = ({ vragen, reserve }) => [...vragen, ...reserve];

test('levelVan herkent de levels van Nederland', () => {
  const zeeland = levelVan('nl:plaatsen:pv-zeeland');
  assert.equal(zeeland.vaardigheid, 'nederland');
  assert.equal(zeeland.onderdeel, 'plaatsen');
  assert.equal(zeeland.keuze, 'pv-zeeland');
  assert.equal(zeeland.toets, false);
  assert.equal(zeeland.leitner, 'nl:plaatsen');
  assert.equal(zeeland.label, 'Zeeland · Oefenen');
  assert.equal(levelVan('nl:plaatsen:alle:toets').toets, true);
  assert.equal(levelVan('nl:hoofdsteden:alle:toets').label, 'Hoofdsteden · Toets');
  assert.equal(levelVan('nl:onbekend:alle'), undefined);
  assert.equal(levelVan('nl:plaatsen:pv-nergens'), undefined);
  for (const id of LEVEL_IDS) assert.equal(levelVan(id).id, id);
});

test('elke vraag heeft een tekst, een zin en "Dat is …" voor de stem', () => {
  for (const id of LEVEL_IDS) {
    for (const v of alleVragen(nlVragen(profielMet(), levelVan(id), rng(7)))) {
      assert.ok(v.tekst && v.goedHtml, v.id);
      for (const zin of [v.zin, v.dat]) assert.match(zin.id, /^nl-[a-z0-9-]+$/, v.id);
      assert.ok(v.zin.tekst.endsWith('?') && v.dat.tekst.startsWith('Dat is '), v.id);
    }
  }
  for (const zin of Object.values(HERKEN_ZINNEN)) assert.match(zin.id, /^nl-herken-[a-z]+$/);
});

test('knoppen: drie verschillende, precies één goede; aanwijzen: het goede antwoord staat op de kaart', () => {
  for (let zaad = 1; zaad <= 5; zaad++) {
    const p = profielMet(willekeurigUit(zaad));
    for (const id of LEVEL_IDS) {
      for (const v of alleVragen(nlVragen(p, levelVan(id), rng(zaad)))) {
        if (v.interactief === 'aanwijzen') {
          const { doelen, begin } = v.kaart;
          assert.equal(new Set(doelen).size, doelen.length, v.id);
          assert.ok(doelen.includes(v.goed) && doelen.includes(begin), v.id);
          assert.ok(doelen.length >= 3, `${v.id}: ${doelen.length} doelen`);
          assert.notEqual(begin, v.goed, `${v.id}: de focus begint op het antwoord`);
        } else {
          const sleutels = v.opties.map((o) => o.sleutel);
          assert.equal(v.opties.length, 3, v.id);
          assert.equal(new Set(sleutels).size, 3, v.id);
          assert.equal(new Set(v.opties.map((o) => o.html)).size, 3, v.id);
          assert.equal(sleutels.filter((s) => s === v.goed).length, 1, v.id);
          assert.ok(v.kaart.licht.length === 1, v.id);
        }
      }
    }
  }
});

test('wat uitstaat, komt nergens voor: niet als vraag, knop, stip of oplichtend ding', () => {
  for (let zaad = 1; zaad <= 8; zaad++) {
    const uit = willekeurigUit(zaad);
    const p = profielMet(uit);
    for (const id of LEVEL_IDS) {
      const level = levelVan(id);
      // Provincies en hoofdsteden staan altijd aan in hun eigen onderdeel.
      const verboden = new Set(level.onderdeel === 'plaatsen' ? uit : uit.filter((u) => !HOOFDSTEDEN.has(u)));
      for (const v of alleVragen(nlVragen(p, level, rng(zaad)))) {
        const genoemd = [v.goed, v.id.split(':')[2], ...v.opties.map((o) => o.sleutel), ...(v.kaart.doelen ?? []), ...(v.kaart.licht ?? [])];
        for (const ding of genoemd) assert.ok(!verboden.has(ding), `${id} ${v.id}: ${ding} staat uit`);
      }
    }
  }
});

test('toets: elk ding hoogstens één keer; per provincie alles wat aanstaat, anders hoogstens 30', () => {
  for (let zaad = 1; zaad <= 4; zaad++) {
    const uit = willekeurigUit(zaad);
    const p = profielMet(uit);
    for (const id of LEVEL_IDS.filter((l) => l.endsWith(':toets'))) {
      const level = levelVan(id);
      const { vragen, reserve } = nlVragen(p, level, rng(zaad));
      assert.deepEqual(reserve, [], id);
      const eenheden = vragen.map(eenheid);
      assert.equal(new Set(eenheden).size, eenheden.length, id);
      if (level.onderdeel !== 'plaatsen') assert.equal(vragen.length, 12, id);
      else if (level.keuze === 'alle') assert.equal(vragen.length, TOETS_MAX, id);
      else {
        const aan = ITEMS.filter((it) => it.soort !== 'provincie' && it.provincies.includes(level.keuze) && !uit.includes(it.id));
        assert.equal(vragen.length, aan.length, id);
      }
    }
  }
});

test('oefenen: tien vragen, verschillende ids, en elke vraagvorm komt voor', () => {
  const vormen = { provincies: new Set(), hoofdsteden: new Set(), plaatsen: new Set() };
  for (let zaad = 1; zaad <= 10; zaad++) {
    for (const id of LEVEL_IDS.filter((l) => !l.endsWith(':toets'))) {
      const level = levelVan(id);
      const uitslag = nlVragen(profielMet(), level, rng(zaad));
      assert.equal(uitslag.vragen.length, RONDE_LENGTE, id);
      const ids = alleVragen(uitslag).map((v) => v.id);
      assert.equal(new Set(ids).size, ids.length, id);
      ids.forEach((v) => vormen[level.onderdeel].add(v.split(':')[1]));
    }
  }
  assert.deepEqual([...vormen.provincies].sort(), ['herken', 'wijs']);
  assert.deepEqual([...vormen.hoofdsteden].sort(), ['hoofdstad', 'hoofdstad-van', 'hoofdstad-wijs']);
  assert.deepEqual([...vormen.plaatsen].sort(), ['herken', 'wijs']);
});

test('oefenen: wat volgens de bakjes weer aan de beurt is, komt eerst', () => {
  const p = profielMet();
  const nu = new Date('2026-10-01T12:00:00Z');
  const lang = '2026-09-01T12:00:00.000Z';
  const zeeland = ITEMS.filter((it) => it.soort !== 'provincie' && it.provincies.includes('pv-zeeland'));
  const [a, b] = zeeland;
  const elders = ITEMS.find((it) => it.soort === 'plaats' && !it.provincies.includes('pv-zeeland'));
  p.items[`nl:wijs:${a.id}`] = { bak: 1, goed: 0, fout: 1, laatst: lang, level: 'nl:plaatsen' };
  p.items[`nl:herken:${b.id}`] = { bak: 2, goed: 1, fout: 0, laatst: nu.toISOString(), level: 'nl:plaatsen' }; // nog niet aan de beurt
  p.items[`nl:wijs:${elders.id}`] = { bak: 1, goed: 0, fout: 1, laatst: lang, level: 'nl:plaatsen' }; // andere provincie
  const { vragen } = nlVragen(p, levelVan('nl:plaatsen:pv-zeeland'), rng(3), nu);
  assert.equal(vragen[0].id, `nl:wijs:${a.id}`);
  assert.ok(!vragen.some((v) => v.id === `nl:wijs:${elders.id}`));
  assert.equal(vragen.filter((v) => eenheid(v) === a.id).length, 1);
});

test('een provincie met alles uit geeft een lege ronde (de knoppen staan dan uit)', () => {
  const uit = ITEMS.filter((it) => it.provincies.includes('pv-drenthe') && it.soort !== 'provincie').map((it) => it.id);
  assert.equal(nlVragen(profielMet(uit), levelVan('nl:plaatsen:pv-drenthe:toets'), rng(1)).vragen.length, 0);
});

test('herkennen: de vraag past bij de knoppen; alleen bij te weinig van dezelfde soort "Welk gebied is dit?"', () => {
  const soortVan = (id) => PER_ID[id].soort;
  const gebieden = ITEMS.filter((it) => it.soort === 'streek' || it.soort === 'eiland');
  for (let zaad = 0; zaad <= 5; zaad++) {
    const uit = zaad ? willekeurigUit(zaad) : [];
    const p = profielMet(uit);
    for (const it of ITEMS.filter((x) => x.soort !== 'provincie' && !uit.includes(x.id))) {
      const ctx = maakContext(p, levelVan(sterId('plaatsen', it.provincies[0])), rng(zaad + 1));
      const v = nlVraagUitId(`nl:herken:${it.id}`, ctx);
      const gemengd = v.opties.some((o) => soortVan(o.sleutel) !== it.soort);
      assert.equal(v.zin, gemengd ? HERKEN_ZINNEN.gebied : HERKEN_ZINNEN[it.soort], `${zaad} ${it.id}`);
      // Van dezelfde soort zijn er genoeg (ook met de helft uit): dan ook alleen die als knop.
      const zelfde = gebieden.filter((g) => g.soort === it.soort && g.id !== it.id && !uit.includes(g.id));
      if (new Set(zelfde.map((g) => g.naam)).size >= 2) assert.ok(!gemengd, `${zaad} ${it.id}: knoppen van een andere soort`);
    }
  }
  // Nog maar één andere streek aan: de vraag wordt algemeen.
  const anders = ITEMS.filter((it) => it.soort === 'streek' && !['st-zeeuws-vlaanderen', 'st-twente'].includes(it.id)).map((it) => it.id);
  const p = profielMet(anders);
  const v = nlVraagUitId('nl:herken:st-zeeuws-vlaanderen', maakContext(p, levelVan(sterId('plaatsen', 'pv-zeeland')), rng(2)));
  assert.equal(v.zin, HERKEN_ZINNEN.gebied);
  assert.equal(v.tekst, 'Welk gebied is dit?');
  assert.equal(v.opties.filter((o) => soortVan(o.sleutel) === 'eiland').length, 1);
});
