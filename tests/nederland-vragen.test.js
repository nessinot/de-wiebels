import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc } from '../de-wiebels/frontend/js/dom.js';
import { ITEMS } from '../de-wiebels/frontend/js/nederland/items.js';
import { PER_ID, PROVINCIES } from '../de-wiebels/frontend/js/nederland/kaartbeeld.js';
import { HERKEN_ZINNEN, TOETS_MAX, maakContext, nlVraagUitId, nlVragen } from '../de-wiebels/frontend/js/nederland/vragen.js';
import { sterId, sterrenVan } from '../de-wiebels/frontend/js/nederland/wereld.js';
import { levelVan } from '../de-wiebels/frontend/js/levels.js';
import { nieuwProfiel, vulAan } from '../de-wiebels/frontend/js/profiel.js';
import { RONDE_LENGTE, beantwoord, huidigeVraag, nieuweRonde, sterrenVoor } from '../de-wiebels/frontend/js/ronde.js';

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
  assert.equal(levelVan('nl:hoofdsteden:alle:toets').label, 'Hoofdsteden');
  assert.equal(levelVan('nl:provincies:alle').label, 'Provincies · Oefenen');
  assert.equal(levelVan('nl:plaatsen:pv-zeeland:toets').label, 'Zeeland · Toets');
  assert.equal(levelVan('nl:plaatsen:alle:toets').label, 'Heel Nederland · Toets');
  assert.equal(levelVan('nl:onbekend:alle'), undefined);
  assert.equal(levelVan('nl:plaatsen:pv-nergens'), undefined);
  for (const id of LEVEL_IDS) assert.equal(levelVan(id).id, id);
});

test('een fout komt terug, behalve bij de toets van een provincie of van heel Nederland', () => {
  assert.equal(levelVan('nl:provincies:alle:toets').herkansing, true);
  assert.equal(levelVan('nl:hoofdsteden:alle:toets').herkansing, true);
  assert.equal(levelVan('nl:plaatsen:pv-zeeland:toets').herkansing, false);
  assert.equal(levelVan('nl:plaatsen:alle:toets').herkansing, false);
  assert.equal(levelVan('nl:plaatsen:pv-zeeland').herkansing, true);
});

test('de ronde Provincies vraagt alle twaalf, een fout komt later terug en sterren tellen in één keer goed', () => {
  const level = levelVan('nl:provincies:alle:toets');
  const { vragen, reserve } = nlVragen(profielMet(), level, rng(5));
  assert.equal(vragen.length, 12);
  assert.equal(new Set(vragen.map(eenheid)).size, 12);
  assert.ok(vragen.every((v) => PROVINCIES.includes(eenheid(v))));
  const r = nieuweRonde(vragen, reserve, { herkansing: level.herkansing });
  const fout = huidigeVraag(r);
  beantwoord(r, 'fout');
  assert.ok(r.wachtrij.some((v) => v.id === fout.id), 'de foute vraag komt terug');
  while (r.wachtrij.length) beantwoord(r, huidigeVraag(r).goed);
  assert.equal(r.aantal, 12);
  assert.equal(r.goedEerst, 11);
  assert.equal(sterrenVoor(r.goedEerst, r.aantal), 2);
});

test('sterrenVan: bij Provincies en Hoofdsteden telt de beste van oefenen en toets', () => {
  const p = profielMet();
  p.sterren[sterId('provincies', 'alle')] = 3;
  p.sterren[sterId('provincies', 'alle', true)] = 1;
  p.sterren[sterId('hoofdsteden', 'alle', true)] = 2;
  p.sterren[sterId('plaatsen', 'pv-zeeland')] = 3;
  p.sterren[sterId('plaatsen', 'pv-zeeland', true)] = 1;
  p.sterren['plus:10'] = 2;
  const voor = structuredClone(p.sterren);
  assert.equal(sterrenVan(p, sterId('provincies', 'alle', true)), 3);
  assert.equal(sterrenVan(p, sterId('hoofdsteden', 'alle', true)), 2);
  assert.equal(sterrenVan(profielMet(), sterId('provincies', 'alle', true)), 0);
  assert.equal(sterrenVan(p, sterId('plaatsen', 'pv-zeeland', true)), 1);
  assert.equal(sterrenVan(p, 'plus:10'), 2);
  vulAan(p);
  assert.deepEqual(p.sterren, voor, 'vulAan zet geen sterren over');
});

test('elke vraag heeft een tekst, een zin en bij een fout de goede zin per vraagvorm', () => {
  for (const id of LEVEL_IDS) {
    for (const v of alleVragen(nlVragen(profielMet(), levelVan(id), rng(7)))) {
      assert.ok(v.tekst && v.goedHtml, v.id);
      for (const zin of [v.zin, v.dat]) assert.match(zin.id, /^nl-[a-z0-9-]+$/, v.id);
      assert.ok(v.zin.tekst.endsWith('?'), v.id);
      if (vorm(v) === 'herken' || vorm(v) === 'hoofdstad') {
        assert.ok(v.dat.tekst.startsWith('Het goede antwoord is '), v.id);
        assert.equal(v.foutHtml, undefined, v.id);
        continue;
      }
      assert.ok(v.foutHtml, v.id);
      if (vorm(v) === 'hoofdstad-van') {
        assert.ok(v.dat.id.startsWith('nl-hoofdstad-is-'), v.id);
        assert.ok(v.dat.tekst.includes(PER_ID[v.goed].naam), v.id);
      } else {
        assert.equal(v.dat.id, `nl-hier-${v.goed}`, v.id);
        assert.ok(v.dat.tekst.endsWith(' hier.'), v.id);
      }
    }
  }
  for (const zin of Object.values(HERKEN_ZINNEN)) assert.match(zin.id, /^nl-herken-[a-z]+$/);
});

test('fout bij aanwijzen: dezelfde zin, de namen vet en na elk streepje in een naam een woordverbinder', () => {
  const ctx = maakContext(profielMet(), levelVan(sterId('plaatsen', 'alle')), rng(3));
  const ids = [
    ...ITEMS.map((it) => `nl:wijs:${it.id}`),
    ...PROVINCIES.flatMap((p) => [`nl:hoofdstad-wijs:${p}`, `nl:hoofdstad-van:${PER_ID[p].hoofdstad}`]),
  ];
  for (const v of ids.map((id) => nlVraagUitId(id, ctx))) {
    assert.equal(v.foutHtml.replace(/<\/?strong>|\u2060/g, ''), esc(v.dat.tekst), v.id);
    assert.ok(v.foutHtml.includes('<strong>'), v.id);
    for (const naam of v.foutHtml.match(/<strong>.*?<\/strong>/g)) {
      assert.ok(!/-(?!\u2060)/.test(naam), `${v.id}: ${naam}`);
    }
  }
  assert.equal(nlVraagUitId('nl:hoofdstad-van:pl-s-hertogenbosch', ctx).foutHtml,
    '<strong>&#39;s-\u2060Hertogenbosch</strong> is de hoofdstad van <strong>Noord-\u2060Brabant</strong>.');
  assert.equal(nlVraagUitId('nl:wijs:wa-kagerplassen', ctx).foutHtml, '<strong>De Kagerplassen</strong> liggen hier.');
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
