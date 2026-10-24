import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MUZIEK_NORMAAL, MUZIEK_VOLUME, MUZIEK_ZACHT, mondOpening, muziekKeuze, stemBestand } from '../de-wiebels/frontend/js/geluidsbestanden.js';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { schermen } from '../de-wiebels/frontend/js/schermen/index.js';

const STEM = { stem: 'x', zinnen: { 'goed-1': { tekst: 'Goed zo!', bestand: 'goed-1.mp3' } } };
const MUZIEK = { ruimte: { bestand: 'ruimte.mp3' } };

test('stemBestand geeft het bestand bij een zin', () => {
  assert.equal(stemBestand(STEM, 'goed-1', 'Goed zo!'), 'geluid/stem/goed-1.mp3');
});

test('stemBestand geeft null zonder opname of als de tekst is veranderd', () => {
  assert.equal(stemBestand(STEM, 'goed-2', 'Super!'), null);
  assert.equal(stemBestand(STEM, 'goed-1', 'Goed zo hoor!'), null);
  assert.equal(stemBestand(null, 'goed-1', 'Goed zo!'), null);
});

test('muziek normaal in de menu\'s, zacht in de sommen en het intro', () => {
  const pad = 'geluid/muziek/ruimte.mp3';
  for (const scherm of ['wereldkaart', 'levelkeuze', 'collectie', 'winkel', 'aanpassen', 'themakeuze', 'tijdraceKeuze']) {
    assert.deepEqual(muziekKeuze(MUZIEK, scherm, 'ruimte', true), { pad, volume: MUZIEK_NORMAAL }, scherm);
  }
  for (const scherm of ['ronde', 'eindbaas', 'tijdrace', 'resultaat', 'intro']) {
    assert.deepEqual(muziekKeuze(MUZIEK, scherm, 'ruimte', true), { pad, volume: MUZIEK_ZACHT }, scherm);
  }
  assert.ok(MUZIEK_ZACHT < MUZIEK_NORMAAL);
});

test('stil op de profielkeuze en bij de eerste start, als de muziek uit staat of zonder stuk', () => {
  for (const scherm of ['profielkeuze', 'eersteStart']) {
    assert.equal(muziekKeuze(MUZIEK, scherm, 'ruimte', true), null, scherm);
  }
  assert.equal(muziekKeuze(MUZIEK, 'wereldkaart', 'ruimte', false), null);
  assert.equal(muziekKeuze(MUZIEK, 'ronde', 'onderwater', true), null);
  assert.equal(muziekKeuze(null, 'wereldkaart', 'ruimte', true), null);
  assert.equal(muziekKeuze(MUZIEK, 'wereldkaart', undefined, true), null);
});

test('de muziekschermen bestaan', () => {
  for (const scherm of Object.keys(MUZIEK_VOLUME)) assert.ok(schermen[scherm], scherm);
});

test('elk thema heeft muziek', () => {
  const manifest = JSON.parse(readFileSync(new URL('../de-wiebels/frontend/geluid/muziek/manifest.json', import.meta.url), 'utf8'));
  for (const thema of Object.keys(THEMAS)) assert.ok(muziekKeuze(manifest, 'wereldkaart', thema, true), thema);
});

test('mondOpening: dicht bij stilte, verder open bij harder geluid, nooit meer dan 1', () => {
  const stil = new Float32Array(512);
  const zacht = Float32Array.from({ length: 512 }, (_, i) => (i % 2 ? 0.01 : -0.01));
  const hard = Float32Array.from({ length: 512 }, (_, i) => (i % 2 ? 0.5 : -0.5));
  assert.equal(mondOpening(stil), 0.08);
  assert.ok(mondOpening(zacht) > 0.08 && mondOpening(zacht) < 1);
  assert.equal(mondOpening(hard), 1);
});
