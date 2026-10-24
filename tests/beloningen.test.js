import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geefBeloning, huisdierStadium, totVolgendStadium, voegXpToe, wiebelVoor } from '../de-wiebels/frontend/js/beloningen.js';
import { BELONINGEN, VAARDIGHEDEN } from '../de-wiebels/frontend/js/levels.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';
import { DRAAGBAAR, spul } from '../de-wiebels/frontend/js/spullen.js';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { KLEUREN } from '../de-wiebels/frontend/js/wiebel.js';

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
      assert.ok(w.naam && KLEUREN[w.kleur], `${t.id} ${id}`);
    }
  }
});

test('elke themawiebel heeft een geldige kleur en een spul dat hij kan dragen', () => {
  for (const t of Object.values(THEMAS)) {
    for (const w of t.wiebels) {
      assert.ok(KLEUREN[w.kleur], `${t.id} ${w.naam}: kleur ${w.kleur}`);
      const s = spul(w.spul);
      assert.ok(s, `${t.id} ${w.naam}: spul ${w.spul} bestaat niet`);
      assert.ok(DRAAGBAAR.includes(s.plek) && s.teken, `${t.id} ${w.naam}: ${w.spul} is niet draagbaar`);
    }
  }
});

test('herhalingen van een themawiebel hebben een andere kleur', () => {
  for (const t of Object.values(THEMAS)) {
    const gezien = new Set();
    for (const id of BELONINGEN) {
      const w = wiebelVoor(id, t);
      const sleutel = `${w.naam}/${w.kleur}`;
      assert.ok(!gezien.has(sleutel), `${t.id}: ${sleutel} komt twee keer voor`);
      gezien.add(sleutel);
    }
    const eerste = wiebelVoor(BELONINGEN[0], t);
    const herhaling = wiebelVoor(BELONINGEN[t.wiebels.length], t);
    assert.equal(herhaling.naam, eerste.naam);
    assert.equal(herhaling.spul, eerste.spul);
    assert.notEqual(herhaling.kleur, eerste.kleur);
  }
});

test('elke eindbaas houdt een eigen Wiebel met een draagbaar spul vast', () => {
  for (const t of Object.values(THEMAS)) {
    const namen = new Set(t.wiebels.map((w) => w.naam));
    for (const v of VAARDIGHEDEN) {
      const w = wiebelVoor(`baas:${v}`, t);
      assert.ok(KLEUREN[w.kleur], `${t.id} baas ${v}: kleur ${w.kleur}`);
      const s = spul(w.spul);
      assert.ok(s && DRAAGBAAR.includes(s.plek) && s.teken, `${t.id} baas ${v}: spul ${w.spul}`);
      assert.ok(!namen.has(w.naam), `${t.id}: ${w.naam} komt twee keer voor`);
      namen.add(w.naam);
    }
  }
});
