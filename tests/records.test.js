import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registreerTijd, raceLevel, tijdTekst } from '../de-wiebels/frontend/js/records.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';

const profiel = () => nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });

test('eerste tijd is altijd een record, daarna alleen sneller', () => {
  const p = profiel();
  assert.equal(registreerTijd(p, 'keer', 41.23), true);
  assert.equal(p.records.keer, 41.2);
  assert.equal(registreerTijd(p, 'keer', 45), false);
  assert.equal(registreerTijd(p, 'keer', 41.2), false);
  assert.equal(registreerTijd(p, 'keer', 38.06), true);
  assert.equal(p.records.keer, 38.1);
});

test('records zijn per vaardigheid', () => {
  const p = profiel();
  registreerTijd(p, 'keer', 30);
  assert.equal(registreerTijd(p, 'plus', 50), true);
  assert.deepEqual(p.records, { keer: 30, plus: 50 });
});

test('race gebruikt het hoogste open level, en niets als de wereld op slot is', () => {
  const p = profiel();
  assert.equal(raceLevel(p, 'keer').id, 'keer:5');
  assert.equal(raceLevel(p, 'delen'), null);
});

test('tijd met komma', () => {
  assert.equal(tijdTekst(41.26), '41,3 s');
});
