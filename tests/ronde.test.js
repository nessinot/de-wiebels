import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nieuweRonde, beantwoord, huidigeVraag, sterrenVoor } from '../de-wiebels/frontend/js/ronde.js';

const vragen = Array.from({ length: 10 }, (_, i) => ({ id: `v${i}`, goed: 'g' }));

test('alles in één keer goed geeft drie sterren', () => {
  const r = nieuweRonde(vragen);
  let uitslag;
  while (r.wachtrij.length) uitslag = beantwoord(r, 'g');
  assert.ok(uitslag.klaar);
  assert.equal(r.goedEerst, 10);
  assert.equal(sterrenVoor(r.goedEerst), 3);
});

test('een foute vraag komt later in de ronde terug en telt niet als eerste keer goed', () => {
  const r = nieuweRonde(vragen);
  assert.equal(beantwoord(r, 'fout').goed, false);
  assert.notEqual(huidigeVraag(r).id, 'v0');
  assert.equal(r.wachtrij[2].id, 'v0');
  assert.equal(r.combo, 0);
  while (r.wachtrij.length) beantwoord(r, 'g');
  assert.equal(r.goedEerst, 9);
});

test('sterrengrenzen', () => {
  assert.equal(sterrenVoor(10), 3);
  assert.equal(sterrenVoor(9), 2);
  assert.equal(sterrenVoor(8), 2);
  assert.equal(sterrenVoor(7), 1);
  assert.equal(sterrenVoor(5), 1);
  assert.equal(sterrenVoor(4), 0);
});

test('munten: één per in één keer goed, plus combo-bonus bij 3, 5 en 10 op rij', () => {
  const r = nieuweRonde(vragen);
  const bonussen = [];
  while (r.wachtrij.length) bonussen.push(beantwoord(r, 'g').bonus);
  assert.deepEqual(bonussen, [0, 0, 2, 0, 5, 0, 0, 0, 0, 10]);
  assert.equal(r.munten, 10 + 2 + 5 + 10);
});

test('een fout breekt de combo en een herkansing geeft geen munt', () => {
  const r = nieuweRonde(vragen);
  beantwoord(r, 'g');
  beantwoord(r, 'g');
  beantwoord(r, 'fout');
  assert.equal(r.combo, 0);
  beantwoord(r, 'g');
  beantwoord(r, 'g');
  const herkansing = beantwoord(r, 'g');
  assert.equal(herkansing.vraag.id, 'v2');
  assert.equal(herkansing.munten, 2); // geen munt voor de vraag zelf, wel de bonus voor 3 op rij
});
