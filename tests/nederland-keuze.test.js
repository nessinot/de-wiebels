import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RASTER, pijlNaar } from '../de-wiebels/frontend/js/schermen/nederland.js';

test('de provincieknoppen staan op alfabet', () => {
  assert.deepEqual(RASTER, [
    'pv-drenthe', 'pv-flevoland', 'pv-friesland', 'pv-gelderland',
    'pv-groningen', 'pv-limburg', 'pv-noord-brabant', 'pv-noord-holland',
    'pv-overijssel', 'pv-utrecht', 'pv-zeeland', 'pv-zuid-holland',
  ]);
});

test('pijltjes: ← Terug, Provincies en Hoofdsteden', () => {
  assert.equal(pijlNaar('terug', 'rechts'), 'provincies');
  assert.equal(pijlNaar('terug', 'omlaag'), 'provincies');
  assert.equal(pijlNaar('terug', 'links'), null);
  assert.equal(pijlNaar('terug', 'omhoog'), null);
  assert.equal(pijlNaar('provincies', 'rechts'), 'hoofdsteden');
  assert.equal(pijlNaar('provincies', 'links'), null);
  assert.equal(pijlNaar('provincies', 'omhoog'), 'terug');
  assert.equal(pijlNaar('provincies', 'omlaag'), 'pv-drenthe');
  assert.equal(pijlNaar('hoofdsteden', 'links'), 'provincies');
  assert.equal(pijlNaar('hoofdsteden', 'rechts'), null);
  assert.equal(pijlNaar('hoofdsteden', 'omhoog'), 'terug');
  assert.equal(pijlNaar('hoofdsteden', 'omlaag'), 'pv-friesland');
});

test('pijltjes in het raster: ±1 in de rij, ±4 tussen de rijen, aan de randen blijven', () => {
  assert.equal(pijlNaar('pv-limburg', 'links'), 'pv-groningen');
  assert.equal(pijlNaar('pv-limburg', 'rechts'), 'pv-noord-brabant');
  assert.equal(pijlNaar('pv-limburg', 'omhoog'), 'pv-flevoland');
  assert.equal(pijlNaar('pv-limburg', 'omlaag'), 'pv-utrecht');
  assert.equal(pijlNaar('pv-drenthe', 'links'), null);
  assert.equal(pijlNaar('pv-gelderland', 'rechts'), null);
  assert.equal(pijlNaar('pv-groningen', 'links'), null);
  assert.equal(pijlNaar('pv-overijssel', 'links'), null);
  assert.equal(pijlNaar('pv-zuid-holland', 'rechts'), null);
  // Bovenste rij omhoog: kolom 1–2 naar Provincies, kolom 3–4 naar Hoofdsteden.
  assert.equal(pijlNaar('pv-drenthe', 'omhoog'), 'provincies');
  assert.equal(pijlNaar('pv-flevoland', 'omhoog'), 'provincies');
  assert.equal(pijlNaar('pv-friesland', 'omhoog'), 'hoofdsteden');
  assert.equal(pijlNaar('pv-gelderland', 'omhoog'), 'hoofdsteden');
  // Onderste rij omlaag: Heel Nederland.
  assert.equal(pijlNaar('pv-overijssel', 'omlaag'), 'alle');
  assert.equal(pijlNaar('pv-zuid-holland', 'omlaag'), 'alle');
});

test('pijltjes vanaf Heel Nederland: omhoog naar de laatste provincie, anders Zeeland', () => {
  assert.equal(pijlNaar('alle', 'omhoog', 'pv-limburg'), 'pv-limburg');
  assert.equal(pijlNaar('alle', 'omhoog'), 'pv-zeeland');
  assert.equal(pijlNaar('alle', 'links'), null);
  assert.equal(pijlNaar('alle', 'rechts'), null);
  assert.equal(pijlNaar('alle', 'omlaag'), null);
});
