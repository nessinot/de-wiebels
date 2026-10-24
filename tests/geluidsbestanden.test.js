import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MUZIEK_SCHERMEN, mondOpening, muziekBestand, stemBestand } from '../de-wiebels/frontend/js/geluidsbestanden.js';
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

test('muziek alleen in hoofdmenu, winkeltje en Aanpassen, en alleen als hij aan staat', () => {
  for (const scherm of ['wereldkaart', 'winkel', 'aanpassen']) {
    assert.equal(muziekBestand(MUZIEK, scherm, 'ruimte', true), 'geluid/muziek/ruimte.mp3');
  }
  for (const scherm of ['ronde', 'eindbaas', 'tijdrace', 'levelkeuze', 'ouderscherm']) {
    assert.equal(muziekBestand(MUZIEK, scherm, 'ruimte', true), null, scherm);
  }
  assert.equal(muziekBestand(MUZIEK, 'wereldkaart', 'ruimte', false), null);
  assert.equal(muziekBestand(MUZIEK, 'wereldkaart', 'onderwater', true), null);
  assert.equal(muziekBestand(null, 'wereldkaart', 'ruimte', true), null);
});

test('de muziekschermen bestaan', () => {
  for (const scherm of MUZIEK_SCHERMEN) assert.ok(schermen[scherm], scherm);
});

test('elk thema heeft muziek', () => {
  const manifest = JSON.parse(readFileSync(new URL('../de-wiebels/frontend/geluid/muziek/manifest.json', import.meta.url), 'utf8'));
  for (const thema of Object.keys(THEMAS)) assert.ok(muziekBestand(manifest, 'wereldkaart', thema, true), thema);
});

test('mondOpening: dicht bij stilte, verder open bij harder geluid, nooit meer dan 1', () => {
  const stil = new Float32Array(512);
  const zacht = Float32Array.from({ length: 512 }, (_, i) => (i % 2 ? 0.01 : -0.01));
  const hard = Float32Array.from({ length: 512 }, (_, i) => (i % 2 ? 0.5 : -0.5));
  assert.equal(mondOpening(stil), 0.08);
  assert.ok(mondOpening(zacht) > 0.08 && mondOpening(zacht) < 1);
  assert.equal(mondOpening(hard), 1);
});
