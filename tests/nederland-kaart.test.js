import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../de-wiebels/frontend/js/nederland/items.js';
import { GEBIEDEN } from '../de-wiebels/frontend/js/nederland/kaart.js';
import { PROVINCIES, doelPunt, doelenVoor, kaartSvg, zoomVak } from '../de-wiebels/frontend/js/nederland/kaartbeeld.js';

const doelenIn = (svg) => [...svg.matchAll(/data-doel="([^"]+)"/g)].map((m) => m[1]);

test('heel Nederland: elke provincie is één keer aan te wijzen', () => {
  const svg = kaartSvg({ doelen: PROVINCIES });
  assert.deepEqual(doelenIn(svg).sort(), [...PROVINCIES].sort());
  assert.equal((svg.match(/<circle/g) || []).length, 0);
});

test('ingezoomd: elk doel één keer, de andere provincies grijs', () => {
  for (const provincie of PROVINCIES) {
    const doelen = doelenVoor(provincie);
    const svg = kaartSvg({ provincie, doelen });
    assert.deepEqual(doelenIn(svg).sort(), [...doelen].sort(), provincie);
    assert.equal((svg.match(/nl-buur/g) || []).length, 11, provincie);
    assert.equal((svg.match(/<circle/g) || []).length, doelen.filter((id) => ITEMS.find((it) => it.id === id).stip).length);
  }
});

test('doelenVoor: geen provincies, alleen de eigen provincie, en niets wat uitstaat', () => {
  const alles = doelenVoor(null);
  assert.equal(alles.length, ITEMS.length - 12);
  for (const provincie of PROVINCIES) {
    const doelen = doelenVoor(provincie);
    assert.ok(doelen.length > 0, provincie);
    for (const id of doelen) assert.ok(ITEMS.find((it) => it.id === id).provincies.includes(provincie), id);
    const uit = doelen.filter((_, i) => i % 2 === 0);
    assert.deepEqual(doelenVoor(provincie, uit), doelen.filter((id) => !uit.includes(id)));
  }
});

test('zoomVak heeft de verhouding van het kaartvak en bevat de hele provincie', () => {
  for (const provincie of PROVINCIES) {
    const [x, y, b, h] = zoomVak(provincie, 1000, 840);
    assert.ok(Math.abs(b / h - 1000 / 840) < 0.01, provincie);
    const [px, py, pb, ph] = GEBIEDEN[provincie].vak;
    assert.ok(x <= px && y <= py && x + b >= px + pb && y + h >= py + ph, provincie);
  }
});

test('het punt van een doel ligt binnen het zichtbare vak', () => {
  for (const provincie of PROVINCIES) {
    const vak = zoomVak(provincie, 1000, 840);
    for (const id of doelenVoor(provincie)) {
      const [x, y] = doelPunt(id, vak);
      assert.ok(x >= vak[0] && x <= vak[0] + vak[2] && y >= vak[1] && y <= vak[1] + vak[3], id);
    }
  }
});
