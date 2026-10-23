import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WINKEL, koop, wissel, actief } from '../de-wiebels/frontend/js/cosmetica.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';

const profiel = (munten) => Object.assign(nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' }), { munten });

test('niet kopen zonder genoeg munten', () => {
  const p = profiel(10);
  const uitslag = koop(p, 'hoed-pet');
  assert.deepEqual(uitslag, { ok: false, reden: 'te-weinig', tekort: 10 });
  assert.equal(p.munten, 10);
  assert.deepEqual(p.cosmetica.gekocht, []);
});

test('kopen schrijft de munten correct af en zet het item aan', () => {
  const p = profiel(50);
  assert.equal(koop(p, 'hoed-hoge').ok, true);
  assert.equal(p.munten, 10);
  assert.equal(actief(p, 'hoed').id, 'hoed-hoge');
  assert.equal(koop(p, 'hoed-hoge').reden, 'al-gekocht');
  assert.equal(p.munten, 10);
});

test('per soort één tegelijk aan, en weer uit te zetten', () => {
  const p = profiel(100);
  koop(p, 'hoed-pet');
  koop(p, 'hoed-strik');
  assert.equal(actief(p, 'hoed').id, 'hoed-strik');
  wissel(p, 'hoed-pet');
  assert.equal(actief(p, 'hoed').id, 'hoed-pet');
  wissel(p, 'hoed-pet');
  assert.equal(actief(p, 'hoed'), null);
  assert.equal(wissel(p, 'hoed-kroon'), false);
});

test('prijzen liggen tussen 20 en 100 en id\'s zijn uniek', () => {
  assert.equal(new Set(WINKEL.map((i) => i.id)).size, WINKEL.length);
  assert.ok(WINKEL.every((i) => i.prijs >= 20 && i.prijs <= 100));
});
