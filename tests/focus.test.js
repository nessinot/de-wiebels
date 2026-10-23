import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kiesVolgende } from '../de-wiebels/frontend/js/focus.js';

const vak = (left, top, width = 100, height = 100) => ({ left, top, width, height });

// Raster van 3×3 vakken met 20px tussenruimte.
const raster = [];
for (let rij = 0; rij < 3; rij++) {
  for (let kolom = 0; kolom < 3; kolom++) raster.push(vak(kolom * 120, rij * 120));
}
const middenvak = raster[4];

test('kiest de directe buur in elke richting', () => {
  assert.equal(kiesVolgende(middenvak, raster, 'rechts'), 5);
  assert.equal(kiesVolgende(middenvak, raster, 'links'), 3);
  assert.equal(kiesVolgende(middenvak, raster, 'omhoog'), 1);
  assert.equal(kiesVolgende(middenvak, raster, 'omlaag'), 7);
});

test('blijft staan als er in die richting niets ligt', () => {
  assert.equal(kiesVolgende(raster[0], raster, 'links'), -1);
  assert.equal(kiesVolgende(raster[0], raster, 'omhoog'), -1);
  assert.equal(kiesVolgende(raster[8], raster, 'rechts'), -1);
});

test('kiest een breed vak dat onder het huidige vak doorloopt', () => {
  const vakken = [vak(0, 0), vak(120, 0), vak(240, 0), vak(120, 120, 220, 100), vak(0, 240)];
  assert.equal(kiesVolgende(vakken[2], vakken, 'omlaag'), 3);
  assert.equal(kiesVolgende(vakken[3], vakken, 'omhoog'), 1);
});

test('verkiest een vak op dezelfde rij boven een dichterbij schuin vak', () => {
  const vakken = [vak(0, 0), vak(130, 200), vak(250, 0)];
  assert.equal(kiesVolgende(vakken[0], vakken, 'rechts'), 2);
});

test('slaat het huidige vak zelf over', () => {
  assert.equal(kiesVolgende(middenvak, [middenvak], 'rechts'), -1);
});
