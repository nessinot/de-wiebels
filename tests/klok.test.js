import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hoeken, digitaal } from '../de-wiebels/frontend/js/klok.js';
import { klokVraag, tijdOpties } from '../de-wiebels/frontend/js/generators/klok.js';
import { vraagUitId } from '../de-wiebels/frontend/js/generators/index.js';
import { LEVELS } from '../de-wiebels/frontend/js/levels.js';

test('uurwijzer beweegt mee met de minuten', () => {
  assert.deepEqual(hoeken(3, 0), { uur: 90, minuut: 0 });
  assert.deepEqual(hoeken(3, 30), { uur: 105, minuut: 180 });
  assert.deepEqual(hoeken(15, 45), { uur: 112.5, minuut: 270 });
  assert.deepEqual(hoeken(12, 0), { uur: 0, minuut: 0 });
});

test('digitale notatie', () => {
  assert.equal(digitaal(4, 5), '4:05');
  assert.equal(digitaal(15, 45), '15:45');
});

test('verwisselde wijzers zitten tussen de foute opties', () => {
  const { opties } = tijdOpties(4, 15, 15, () => 0);
  assert.ok(opties.some((o) => o.sleutel === '3:20'), opties.map((o) => o.sleutel).join(' '));
});

test('klokvragen per level: minuten passen bij het level, vier unieke opties', () => {
  for (const level of LEVELS.klok) {
    for (let i = 0; i < 300; i++) {
      const v = klokVraag(level, 1);
      assert.equal(v.klok.minuut % level.stap, 0);
      if (!level.uur24) assert.ok(v.klok.uur >= 1 && v.klok.uur <= 12);
      const sleutels = v.opties.map((o) => o.sleutel);
      assert.equal(new Set(sleutels).size, 4, sleutels.join(' '));
      assert.ok(sleutels.includes(v.goed));
    }
  }
});

test('klokvraag is terug te bouwen uit het item-id', () => {
  const v = vraagUitId('klok:lezen:4:15');
  assert.equal(v.goed, '4:15');
  assert.deepEqual(v.klok, { uur: 4, minuut: 15 });
});
