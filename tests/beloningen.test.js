import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geefBeloning, huisdierStadium, totVolgendStadium, voegXpToe, wiebelVoor } from '../de-wiebels/frontend/js/beloningen.js';
import { BELONINGEN } from '../de-wiebels/frontend/js/levels.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';

test('een beloning wordt maar één keer gegeven', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.equal(geefBeloning(p, 'keer:5'), true);
  assert.equal(geefBeloning(p, 'keer:5'), false);
  assert.deepEqual(p.verzameling, ['keer:5']);
});

test('huisdier groeit in vier stadia', () => {
  assert.equal(huisdierStadium(0), 0);
  assert.equal(huisdierStadium(49), 0);
  assert.equal(huisdierStadium(50), 1);
  assert.equal(huisdierStadium(200), 2);
  assert.equal(huisdierStadium(9999), 3);
  assert.equal(totVolgendStadium(40), 10);
  assert.equal(totVolgendStadium(500), null);
});

test('xp toevoegen meldt wanneer het huisdier een stadium verder is', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.equal(voegXpToe(p, 45), false);
  assert.equal(voegXpToe(p, 10), true);
  assert.equal(p.huisdier.xp, 55);
});

test('elke beloning heeft in elk thema een Wiebel', () => {
  for (const t of Object.values(THEMAS)) {
    for (const id of BELONINGEN) {
      const w = wiebelVoor(id, t);
      assert.ok(w.emoji && w.naam, `${t.id} ${id}`);
    }
  }
});
