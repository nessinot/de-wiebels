import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, NIVEAUS, STARTNIVEAUS, VAARDIGHEDEN, BELONINGEN, levelOpen, baasOpen, levelVan } from '../de-wiebels/frontend/js/levels.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';

const open = (p, v) => LEVELS[v].filter((l) => levelOpen(p, l)).map((l) => l.id);

test('elke vaardigheid heeft levels en geldige startniveaus', () => {
  for (const v of VAARDIGHEDEN) {
    assert.ok(LEVELS[v].length > 0);
    for (const n of NIVEAUS[v]) assert.ok(n.open <= LEVELS[v].length);
    for (const s of Object.values(STARTNIVEAUS)) assert.ok(NIVEAUS[v][s.niveaus[v]]);
  }
});

test('starter begint met tafels van 1, 2, 5 en 10 en zonder delen', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.deepEqual(open(p, 'keer'), ['keer:1', 'keer:2', 'keer:10', 'keer:5']);
  assert.deepEqual(open(p, 'delen'), []);
  assert.deepEqual(open(p, 'plus'), ['plus:10', 'plus:20']);
});

test('een ster opent het volgende level', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  p.sterren['plus:20'] = 1;
  assert.ok(open(p, 'plus').includes('plus:tiental'));
});

test('delen per tafel gaat open als de keertafel beheerst wordt', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  p.sterren['keer:5'] = 1;
  assert.ok(!open(p, 'delen').includes('delen:5'));
  p.sterren['keer:5'] = 2;
  assert.ok(open(p, 'delen').includes('delen:5'));
});

test('de eindbaas opent pas als alle levels een ster hebben', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.ok(!baasOpen(p, 'klok'));
  for (const l of LEVELS.klok) p.sterren[l.id] = 1;
  assert.ok(baasOpen(p, 'klok'));
});

test('beloningen zijn uniek en levels zijn terug te vinden', () => {
  assert.equal(new Set(BELONINGEN).size, BELONINGEN.length);
  assert.equal(levelVan('keer:7').label, 'Tafel van 7');
});
