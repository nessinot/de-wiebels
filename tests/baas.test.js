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
    for (let i = 0; i < 50; i++) {
      const { vraag, level } = baasVraag(p, v);
      assert.equal(level.vaardigheid, v);
      assert.ok(vraag.goed);
    }
  }
});
