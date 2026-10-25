import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keerVraag } from '../de-wiebels/frontend/js/generators/keer.js';
import { getalOpties } from '../de-wiebels/frontend/js/generators/opties.js';
import { maakVragen, vraagUitId } from '../de-wiebels/frontend/js/generators/index.js';
import { LEVELS, levelVan } from '../de-wiebels/frontend/js/levels.js';
import { RONDE_LENGTE } from '../de-wiebels/frontend/js/ronde.js';

function controleerOpties(vraag) {
  assert.equal(vraag.opties.length, 4);
  const sleutels = vraag.opties.map((o) => o.sleutel);
  assert.equal(new Set(sleutels).size, 4, `unieke opties ${sleutels}`);
  assert.ok(sleutels.includes(vraag.goed));
  for (const s of sleutels) assert.ok(Number(s) >= 0);
}

test('keersommen kloppen, hebben de tafel achteraan en vier unieke opties', () => {
  for (const level of LEVELS.keer) {
    for (let stap = 0; stap <= 2; stap++) {
      for (let i = 0; i < 300; i++) {
        const v = keerVraag(level, stap);
        const [a, b] = v.tekst.replace(' = ?', '').split(' × ').map(Number);
        assert.equal(String(a * b), v.goed);
        assert.ok(level.tafels.includes(b), `${v.tekst} in ${level.id}`);
        assert.ok(a >= 1 && a <= 10);
        assert.equal(v.id, `keer:${a}x${b}`);
        controleerOpties(v);
      }
    }
  }
});

test('foute opties zijn plausibel: buurgetallen uit de tafel gaan voor', () => {
  const opties = getalOpties(56, [63, 49, 64, 48], () => 0.3).map((o) => Number(o.sleutel));
  const fout = opties.filter((n) => n !== 56);
  assert.ok(fout.every((n) => [63, 49, 64, 48].includes(n)));
});

test('opties bij antwoord 0 of 1 blijven positief en uniek', () => {
  for (const n of [0, 1, 2]) {
    const opties = getalOpties(n);
    assert.equal(new Set(opties.map((o) => o.sleutel)).size, 4);
    assert.ok(opties.every((o) => Number(o.sleutel) >= 0));
  }
});

test('een ronde heeft tien verschillende vragen', () => {
  const vragen = maakVragen(levelVan('keer:1'), 10);
  assert.equal(new Set(vragen.map((v) => v.id)).size, 10);
});

test('maakVragen geeft per level en stap alleen verschillende vragen, minstens een ronde vol', () => {
  for (const v of Object.keys(LEVELS)) {
    for (const level of LEVELS[v]) {
      for (let stap = 0; stap <= 2; stap++) {
        const vragen = maakVragen(level, RONDE_LENGTE * 2, stap);
        assert.equal(new Set(vragen.map((x) => x.id)).size, vragen.length, `${level.id} stap ${stap}`);
        assert.ok(vragen.length >= RONDE_LENGTE, `${level.id} stap ${stap}: ${vragen.length}`);
      }
    }
  }
});

test('een vraag is terug te bouwen uit het item-id', () => {
  const v = vraagUitId('keer:7x8');
  assert.equal(v.goed, '56');
  controleerOpties(v);
});
