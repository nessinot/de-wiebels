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
