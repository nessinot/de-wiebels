import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMBO_ZINNEN, RESULTAAT_ZINNEN, ZINNEN, kiesZin } from '../de-wiebels/frontend/js/zinnen.js';
import { COMBO_BONUS } from '../de-wiebels/frontend/js/ronde.js';

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

test('kiesZin kiest een zin van de gebeurtenis', () => {
  for (let i = 0; i < 20; i++) assert.ok(ZINNEN.kleurGekozen.includes(kiesZin('kleurGekozen')));
});

test('kiesZin geeft nooit twee keer achter elkaar dezelfde zin', () => {
  for (const gebeurtenis of Object.keys(ZINNEN)) {
    let vorige = kiesZin(gebeurtenis);
    for (let i = 0; i < 30; i++) {
      // Ook als het toeval steeds dezelfde plek in de lijst kiest.
      const zin = kiesZin(gebeurtenis, () => (i % 2 ? 0 : 0.999));
      assert.notEqual(zin.id, vorige.id, gebeurtenis);
      vorige = zin;
    }
  }
});

test('de Wiebel heeft zinnen voor de sommen, de eindbaas en het resultaat', () => {
  for (const gebeurtenis of ['goed', 'bijna', 'baasRaak', 'baasGewonnen', 'nieuweWiebel', 'gegroeid']) {
    assert.ok(ZINNEN[gebeurtenis]?.length > 1, gebeurtenis);
  }
  for (const combo of Object.keys(COMBO_BONUS)) assert.ok(ZINNEN[COMBO_ZINNEN[combo]], `combo ${combo}`);
  assert.equal(RESULTAAT_ZINNEN.length, 4);
  for (const gebeurtenis of RESULTAAT_ZINNEN) assert.ok(ZINNEN[gebeurtenis], gebeurtenis);
});
