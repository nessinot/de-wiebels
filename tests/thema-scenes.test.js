import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { VAARDIGHEDEN } from '../de-wiebels/frontend/js/levels.js';
import { MAX_DEELTJES } from '../de-wiebels/frontend/js/scene.js';
import {
  ACCENTEN, DUUR_MAX, DUUR_MIN, THEMA_SCENES, accentSvg, sceneVan, themaAchtergrond,
} from '../de-wiebels/frontend/js/thema-achtergrond.js';

for (const [id, t] of Object.entries(THEMAS)) {
  test(`thema ${id} heeft een scène en elke wereld een accent`, () => {
    assert.ok(THEMA_SCENES.includes(t.scene), `scène ${t.scene}`);
    for (const v of VAARDIGHEDEN) assert.ok(ACCENTEN.includes(t.werelden[v].accent), `accent ${v}`);
  });
}

test('elk thema heeft een eigen scène', () => {
  const scenes = Object.values(THEMAS).map((t) => t.scene);
  assert.equal(new Set(scenes).size, scenes.length);
});

for (const soort of THEMA_SCENES) {
  test(`scène ${soort}: hooguit ${MAX_DEELTJES} deeltjes, langzaam en alleen in de zijstroken`, () => {
    const { vast, deeltjes } = sceneVan(soort, 't');
    assert.ok(deeltjes.length > 0 && deeltjes.length <= MAX_DEELTJES, `${deeltjes.length} deeltjes`);
    assert.doesNotMatch(vast, /class="ab-/, 'het vaste deel beweegt niet');
    for (const d of deeltjes) {
      const [, links, breedte, duur] = d.match(/left:(-?\d+)px;top:-?\d+px;width:(\d+)px;height:\d+px;animation-duration:([\d.]+)s/);
      const midden = Number(links) + Number(breedte) / 2;
      assert.ok(midden <= 280 || midden >= 1640, `deeltje op x ${midden} staat achter het vraagvlak`);
      assert.ok(Number(duur) >= DUUR_MIN && Number(duur) <= DUUR_MAX, `duur ${duur}`);
    }
  });
}

for (const soort of ACCENTEN) {
  test(`accent ${soort} is gedimd en beweegt niet`, () => {
    const svg = accentSvg(soort, 't');
    assert.match(svg, /^<g opacity="\.5">/);
    assert.doesNotMatch(svg, /class=|animation/);
  });
}

test('achtergrond per wereld: hooguit 30 bewegende deeltjes en steeds dezelfde uitkomst', () => {
  for (const [id, t] of Object.entries(THEMAS)) {
    for (const v of VAARDIGHEDEN) {
      const svg = themaAchtergrond(id, v, 'ab-test');
      assert.ok((svg.match(/class="ab-deeltje/g) || []).length <= MAX_DEELTJES);
      assert.ok(svg.includes(accentSvg(t.werelden[v].accent, 'ab-test')), `${id} ${v}`);
      assert.equal(svg, themaAchtergrond(id, v, 'ab-test'));
    }
  }
});

test('het voorvoegsel maakt de id\'s uniek per scherm', () => {
  const a = themaAchtergrond('ruimte', 'klok', 'ab-een');
  assert.match(a, /id="ab-een-lucht"/);
  assert.match(a, /id="ab-een-aarde"/);
  assert.doesNotMatch(a, /ab-twee/);
});
