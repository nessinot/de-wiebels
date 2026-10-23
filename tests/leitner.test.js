import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registreer, teHerhalen, zwakkePlekken, volgendeStap, WACHTTIJD } from '../de-wiebels/frontend/js/leitner.js';

const nu = new Date('2026-10-20T18:00:00Z');
const later = (ms) => new Date(nu.getTime() + ms);

test('goed schuift een bakje op, fout gaat terug naar bakje 1', () => {
  const items = {};
  registreer(items, 'keer:7x8', true, 'keer:8', nu);
  registreer(items, 'keer:7x8', true, 'keer:8', nu);
  assert.equal(items['keer:7x8'].bak, 3);
  registreer(items, 'keer:7x8', false, 'keer:8', nu);
  assert.deepEqual({ ...items['keer:7x8'], laatst: null }, { bak: 1, goed: 2, fout: 1, laatst: null, level: 'keer:8' });
  for (let i = 0; i < 10; i++) registreer(items, 'keer:7x8', true, 'keer:8', nu);
  assert.equal(items['keer:7x8'].bak, 5);
});

test('foute items komen meteen terug, beheerste veel later', () => {
  const items = {};
  registreer(items, 'fout', false, 'keer:8', nu);
  registreer(items, 'goed', true, 'keer:8', nu);
  assert.deepEqual(teHerhalen(items, 'keer:8', 10, nu), ['fout']);
  assert.deepEqual(teHerhalen(items, 'keer:8', 10, later(WACHTTIJD[2])), ['fout', 'goed']);
});

test('alleen items van het gevraagde level, met een maximum', () => {
  const items = {};
  for (let i = 0; i < 6; i++) registreer(items, `keer:${i}x8`, false, 'keer:8', nu);
  registreer(items, 'keer:3x5', false, 'keer:5', nu);
  const lijst = teHerhalen(items, 'keer:8', 4, nu);
  assert.equal(lijst.length, 4);
  assert.ok(lijst.every((id) => id.endsWith('x8')));
});

test('fout beantwoorde items komen vaker terug dan goed beantwoorde', () => {
  const items = {};
  let tijd = nu;
  const gevraagd = { lastig: 0, makkelijk: 0 };
  registreer(items, 'lastig', false, 'l', tijd);
  registreer(items, 'makkelijk', true, 'l', tijd);
  for (let dag = 0; dag < 14; dag++) {
    tijd = later(dag * 24 * 3600e3 + 1);
    for (const id of teHerhalen(items, 'l', 10, tijd)) {
      gevraagd[id] += 1;
      registreer(items, id, id === 'makkelijk' || dag % 3 === 2, 'l', tijd);
    }
  }
  assert.ok(gevraagd.lastig > gevraagd.makkelijk, JSON.stringify(gevraagd));
});

test('zwakke plekken: vaakst fout bovenaan, beheerste items niet', () => {
  const items = {};
  for (let i = 0; i < 3; i++) registreer(items, 'keer:7x8', false, 'keer:8', nu);
  registreer(items, 'keer:6x7', false, 'keer:7', nu);
  registreer(items, 'keer:2x2', true, 'keer:2', nu);
  assert.deepEqual(zwakkePlekken(items).map((z) => z.id), ['keer:7x8', 'keer:6x7']);
});

test('moeilijkheid omhoog na vijf goed, omlaag na twee fout, binnen 0–2', () => {
  assert.equal(volgendeStap(1, 5, 0), 2);
  assert.equal(volgendeStap(2, 5, 0), 2);
  assert.equal(volgendeStap(1, 0, 2), 0);
  assert.equal(volgendeStap(0, 0, 3), 0);
  assert.equal(volgendeStap(1, 3, 0), 1);
});

test('item-id\'s worden leesbaar voor het ouderscherm', async () => {
  const { itemTekst } = await import('../de-wiebels/frontend/js/weergave.js');
  assert.equal(itemTekst('keer:7x8'), '7 × 8');
  assert.equal(itemTekst('delen:56:8'), '56 : 8');
  assert.equal(itemTekst('plus:34+57'), '34 + 57');
  assert.equal(itemTekst('min:91-38'), '91 − 38');
  assert.equal(itemTekst('klok:lezen:4:5'), '🕒 4:05');
});
