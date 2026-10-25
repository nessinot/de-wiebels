import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RACE_LENGTE, registreerTijd, raceLevels, raceVragen, tijdTekst } from '../de-wiebels/frontend/js/records.js';
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

test('race gebruikt alle open levels, en niets als de wereld op slot is', () => {
  const p = profiel();
  assert.deepEqual(raceLevels(p, 'keer').map((l) => l.id), ['keer:1', 'keer:2', 'keer:10', 'keer:5']);
  assert.deepEqual(raceLevels(p, 'delen'), []);
});

test('racevragen zijn verschillend en komen uit open levels', () => {
  const p = profiel();
  const open = raceLevels(p, 'keer').map((l) => l.id);
  for (let i = 0; i < 50; i++) {
    const vragen = raceVragen(p, 'keer', RACE_LENGTE);
    assert.equal(vragen.length, RACE_LENGTE);
    assert.equal(new Set(vragen.map((v) => v.id)).size, RACE_LENGTE);
    assert.ok(vragen.every((v) => open.includes(v.levelId)));
  }
});

test('met te weinig verschillende sommen wordt de race korter, zonder herhaling', () => {
  const p = profiel();
  p.sterren['keer:1'] = 2;
  assert.deepEqual(raceLevels(p, 'delen').map((l) => l.id), ['delen:1']);
  const vragen = raceVragen(p, 'delen', RACE_LENGTE + 3);
  assert.equal(vragen.length, 10);
  assert.equal(new Set(vragen.map((v) => v.id)).size, 10);
});

test('tijd met komma', () => {
  assert.equal(tijdTekst(41.26), '41,3 s');
});
