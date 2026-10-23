import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maakVraag, vraagUitId } from '../de-wiebels/frontend/js/generators/index.js';
import { heeftLenen, heeftOnthouden } from '../de-wiebels/frontend/js/generators/plusmin.js';
import { LEVELS } from '../de-wiebels/frontend/js/levels.js';

const RONDES = 1000;

function getallen(tekst) {
  return tekst.match(/\d+/g).map(Number);
}

function controleerOpties(v) {
  const sleutels = v.opties.map((o) => o.sleutel);
  assert.equal(new Set(sleutels).size, 4, `${v.tekst}: ${sleutels}`);
  assert.ok(sleutels.includes(v.goed));
  assert.ok(sleutels.every((s) => Number(s) >= 0));
}

test('plus: klopt, binnen bereik, onthouden waar het hoort', () => {
  for (const level of LEVELS.plus) {
    for (let stap = 0; stap <= 2; stap++) {
      for (let i = 0; i < RONDES; i++) {
        const v = maakVraag(level, stap);
        const [a, b] = getallen(v.tekst);
        assert.equal(Number(v.goed), a + b);
        assert.ok(a + b <= level.max, `${v.tekst} in ${level.id}`);
        if (level.tiental) assert.ok(a + b > 10);
        if (level.onthouden === true) assert.ok(heeftOnthouden(a, b), v.tekst);
        if (level.onthouden === false) assert.ok(!heeftOnthouden(a, b), v.tekst);
        controleerOpties(v);
      }
    }
  }
});

test('min: nooit negatief, binnen bereik, lenen waar het hoort', () => {
  for (const level of LEVELS.min) {
    for (let stap = 0; stap <= 2; stap++) {
      for (let i = 0; i < RONDES; i++) {
        const v = maakVraag(level, stap);
        const [a, b] = getallen(v.tekst);
        assert.ok(a - b >= 0, v.tekst);
        assert.equal(Number(v.goed), a - b);
        assert.ok(a <= level.max, `${v.tekst} in ${level.id}`);
        if (level.tiental) assert.ok(a > 10 && b > a % 10, v.tekst);
        if (level.onthouden === true) assert.ok(heeftLenen(a, b), v.tekst);
        if (level.onthouden === false) assert.ok(!heeftLenen(a, b), v.tekst);
        controleerOpties(v);
      }
    }
  }
});

test('delen: gaat altijd op, deler uit de tafel', () => {
  for (const level of LEVELS.delen) {
    for (let stap = 0; stap <= 2; stap++) {
      for (let i = 0; i < RONDES; i++) {
        const v = maakVraag(level, stap);
        const [deeltal, deler] = getallen(v.tekst);
        assert.equal(deeltal % deler, 0, v.tekst);
        assert.equal(Number(v.goed), deeltal / deler);
        assert.ok(level.tafels.includes(deler));
        controleerOpties(v);
      }
    }
  }
});

test('vragen zijn terug te bouwen uit hun id', () => {
  assert.equal(vraagUitId('plus:34+57').goed, '91');
  assert.equal(vraagUitId('min:91-38').goed, '53');
  assert.equal(vraagUitId('delen:56:8').goed, '7');
  assert.equal(vraagUitId('min:91-38').tekst, '91 − 38 = ?');
});
