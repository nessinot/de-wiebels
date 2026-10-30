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

// Vaste willekeur, zodat de uitkomst altijd gelijk is.
function rng(zaad) {
  let s = zaad;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

// De stapels zijn moduletoestand: deze tests staan bovenaan, voordat andere tests er zinnen van trekken.
test('kiesZin zegt elke zin eerst één keer voordat er een terugkomt', () => {
  const r = rng(7);
  const ids = ZINNEN.goed.map((z) => z.id);
  assert.equal(ids.length, 30);
  let vorige;
  for (let blok = 0; blok < 3; blok++) {
    const getrokken = [];
    for (let i = 0; i < 30; i++) {
      const zin = kiesZin('goed', r);
      assert.notEqual(zin.id, vorige, `blok ${blok}, trekking ${i}`);
      getrokken.push(zin.id);
      vorige = zin.id;
    }
    assert.deepEqual([...getrokken].sort(), [...ids].sort(), `blok ${blok}`);
  }
});

test('kiesZin herhaalt bij twee zinnen nooit dezelfde achter elkaar', () => {
  const gebeurtenis = Object.keys(ZINNEN).find((g) => ZINNEN[g].length === 2);
  const r = rng(11);
  let vorige;
  for (let i = 0; i < 100; i++) {
    const zin = kiesZin(gebeurtenis, r);
    assert.notEqual(zin.id, vorige, `trekking ${i}`);
    vorige = zin.id;
  }
});

test('kiesZin kiest een zin van de gebeurtenis', () => {
  for (let i = 0; i < 20; i++) assert.ok(ZINNEN.kleurGekozen.includes(kiesZin('kleurGekozen')));
});

test('kiesZin geeft nooit twee keer achter elkaar dezelfde zin', () => {
  // Gebeurtenissen met één vaste zin (zoals bij de Wiebels) slaan we over.
  for (const gebeurtenis of Object.keys(ZINNEN).filter((g) => ZINNEN[g].length > 1)) {
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
  for (const gebeurtenis of ['goed', 'bijna', 'baasRaak', 'baasGewonnen', 'bevrijd', 'gegroeid']) {
    assert.ok(ZINNEN[gebeurtenis]?.length > 1, gebeurtenis);
  }
  for (const combo of Object.keys(COMBO_BONUS)) assert.ok(ZINNEN[COMBO_ZINNEN[combo]], `combo ${combo}`);
  assert.equal(RESULTAAT_ZINNEN.length, 4);
  for (const gebeurtenis of RESULTAAT_ZINNEN) assert.ok(ZINNEN[gebeurtenis], gebeurtenis);
});

test('het verhaal aan het begin heeft één zin per schermpje', () => {
  assert.equal(ZINNEN.intro.length, 4);
});
