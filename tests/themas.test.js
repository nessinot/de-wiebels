import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { VAARDIGHEDEN } from '../de-wiebels/frontend/js/levels.js';

const KLEUREN = ['achtergrond', 'vlak', 'vlakLicht', 'tekst', 'tekstZacht', 'accent'];

for (const [id, t] of Object.entries(THEMAS)) {
  test(`thema ${id} heeft alle verplichte onderdelen`, () => {
    assert.equal(t.id, id);
    assert.ok(t.naam && t.emoji);
    for (const k of KLEUREN) assert.match(t.kleuren[k], /^#[0-9a-f]{6}$/i, k);
    for (const v of VAARDIGHEDEN) {
      assert.ok(t.werelden[v]?.naam && t.werelden[v]?.emoji, `wereld ${v}`);
      assert.ok(t.eindbazen[v]?.naam && t.eindbazen[v]?.emoji, `eindbaas ${v}`);
    }
    assert.ok(t.wiebels.length >= 10);
    assert.equal(t.huisdier.length, 4);
    assert.ok(t.decor.length >= 4);
  });
}
