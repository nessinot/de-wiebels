import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nieuwGevecht, verwerk, baasVraag, BAAS_LEVENS } from '../de-wiebels/frontend/js/baas.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';
import { VAARDIGHEDEN } from '../de-wiebels/frontend/js/levels.js';

test('elk goed antwoord raakt de baas, fouten kosten niets', () => {
  const g = nieuwGevecht();
  assert.equal(verwerk(g, false).verslagen, false);
  assert.equal(g.levens, BAAS_LEVENS);
  let uitslag;
  for (let i = 0; i < BAAS_LEVENS; i++) uitslag = verwerk(g, true);
  assert.equal(uitslag.verslagen, true);
  assert.equal(g.levens, 0);
  verwerk(g, true);
  assert.equal(g.levens, 0);
});

test('baasvragen komen uit de levels van die wereld', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  for (const v of VAARDIGHEDEN) {
    const g = nieuwGevecht();
    for (let i = 0; i < 50; i++) {
      const { vraag, level } = baasVraag(p, v, g);
      assert.equal(level.vaardigheid, v);
      assert.ok(vraag.goed);
    }
  }
});

test('in één gevecht komt geen som twee keer', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  for (const v of VAARDIGHEDEN) {
    const g = nieuwGevecht();
    const ids = Array.from({ length: 60 }, () => baasVraag(p, v, g).vraag.id);
    assert.equal(new Set(ids).size, 60, v);
  }
});

test('vangnet: als alles al gesteld is, nooit dezelfde som als de vorige', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  const g = nieuwGevecht();
  g.gesteld = { has: () => true, add() {} };
  let vorige = null;
  for (let i = 0; i < 50; i++) {
    const id = baasVraag(p, 'keer', g).vraag.id;
    assert.notEqual(id, vorige);
    vorige = id;
  }
});
