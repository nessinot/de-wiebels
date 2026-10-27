import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../de-wiebels/frontend/js/nederland/items.js';
import { GEBIEDEN, VIEWBOX } from '../de-wiebels/frontend/js/nederland/kaart.js';

const VOORVOEGSEL = { provincie: 'pv', plaats: 'pl', streek: 'st', eiland: 'ei', water: 'wa' };
const provincies = ITEMS.filter((it) => it.soort === 'provincie');
const perId = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
const alleZinnen = ITEMS.flatMap((it) => Object.values(it.zinnen));

// Een pad van maak-kaart.py: per ring "M x y", dan "l" met relatieve stappen, en "z".
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

test('ids zijn uniek en passen bij de soort', () => {
  assert.equal(new Set(ITEMS.map((it) => it.id)).size, ITEMS.length);
  for (const it of ITEMS) {
    assert.ok(VOORVOEGSEL[it.soort], it.id);
    assert.match(it.id, new RegExp(`^${VOORVOEGSEL[it.soort]}-[a-z0-9]+(-[a-z0-9]+)*$`), it.id);
    assert.ok(it.naam && it.noem, it.id);
  }
});

test('twaalf provincies, elk met een hoofdstad in de eigen provincie', () => {
  assert.equal(provincies.length, 12);
  for (const p of provincies) {
    const stad = perId[p.hoofdstad];
    assert.equal(stad?.soort, 'plaats', p.id);
    assert.deepEqual(stad.provincies, [p.id]);
    assert.ok(stad.zinnen.hoofdstadVan, stad.id);
  }
  assert.equal(ITEMS.filter((it) => it.zinnen.hoofdstadVan).length, 12);
});

test('elk item hoort bij bestaande provincies', () => {
  for (const it of ITEMS) {
    assert.ok(it.provincies.length > 0, it.id);
    for (const p of it.provincies) assert.equal(perId[p]?.soort, 'provincie', `${it.id}: ${p}`);
    if (it.soort !== 'water') assert.equal(it.provincies.length, 1, it.id);
  }
});

test('elk item heeft zijn zinnen volgens het vaste patroon', () => {
  for (const it of ITEMS) {
    const z = it.zinnen;
    assert.deepEqual(z.waar, { id: `nl-waar-${it.id}`, tekst: `Waar ligt ${it.noem}?` });
    assert.deepEqual(z.dat, { id: `nl-dat-${it.id}`, tekst: `Dat is ${it.noem}.` });
    if (it.soort === 'provincie') {
      assert.deepEqual(z.hoofdstad, { id: `nl-hoofdstad-${it.id}`, tekst: `Wat is de hoofdstad van ${it.noem}?` });
      assert.deepEqual(z.hoofdstadWaar, { id: `nl-hoofdstad-waar-${it.id}`, tekst: `Waar ligt de hoofdstad van ${it.noem}?` });
    }
    if (z.hoofdstadVan) {
      assert.deepEqual(z.hoofdstadVan, { id: `nl-hoofdstad-van-${it.id}`, tekst: `Van welke provincie is ${it.noem} de hoofdstad?` });
    }
  }
});

test('zinnen zijn vaste tekst met unieke ids', () => {
  const ids = alleZinnen.map((z) => z.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const z of alleZinnen) {
    assert.match(z.id, /^nl-[a-z0-9]+(-[a-z0-9]+)*$/, z.id);
    assert.doesNotMatch(z.tekst, /[{}$<>%]|\d/, z.id);
  }
});

test('elk gebied heeft een pad, en elk pad hoort bij een item', () => {
  const gebieden = ITEMS.filter((it) => it.soort !== 'plaats');
  for (const it of gebieden) {
    assert.equal(it.gebied, it.id);
    const g = GEBIEDEN[it.gebied];
    assert.ok(g, it.id);
    assert.ok(ringen(g.d).length > 0, it.id);
    assert.equal(g.vak.length, 4);
    assert.equal(g.midden.length, 2);
  }
  assert.deepEqual(Object.keys(GEBIEDEN).sort(), gebieden.map((it) => it.id).sort());
});

test('elke stip ligt in de viewBox en in zijn eigen provincie', () => {
  const [x0, y0, b, h] = VIEWBOX;
  const plaatsen = ITEMS.filter((it) => it.soort === 'plaats');
  assert.ok(plaatsen.length >= 100);
  for (const it of plaatsen) {
    const [x, y] = it.stip;
    assert.ok(x >= x0 && x <= x0 + b && y >= y0 && y <= y0 + h, it.id);
    assert.ok(binnen(it.stip, ringen(GEBIEDEN[it.provincies[0]].d)), it.id);
    for (const p of provincies.filter((p) => p.id !== it.provincies[0])) {
      assert.ok(!binnen(it.stip, ringen(GEBIEDEN[p.id].d)), `${it.id} ligt ook in ${p.id}`);
    }
  }
});
