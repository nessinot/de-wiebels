import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ZINNEN, willekeurigeZin } from '../de-wiebels/frontend/js/zinnen.js';

const alle = Object.values(ZINNEN).flat();

test('elke gebeurtenis heeft zinnen met een id en tekst', () => {
  for (const [gebeurtenis, lijst] of Object.entries(ZINNEN)) {
    assert.ok(lijst.length > 0, gebeurtenis);
    for (const zin of lijst) {
      assert.match(zin.id, /^[a-z]+(-[a-z]+)*-\d+$/, zin.id);
      assert.ok(zin.tekst.trim(), zin.id);
    }
  }
});

test('ids zijn uniek, zodat elk geluidsbestand bij één zin hoort', () => {
  const ids = alle.map((z) => z.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('zinnen zijn vaste tekst zonder in te vullen delen', () => {
  for (const zin of alle) assert.doesNotMatch(zin.tekst, /[{}$<>%]|\d/, zin.id);
});

test('willekeurigeZin kiest een zin van de gebeurtenis', () => {
  for (let i = 0; i < 20; i++) assert.ok(ZINNEN.kleurGekozen.includes(willekeurigeZin('kleurGekozen')));
});
