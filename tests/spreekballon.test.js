import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maakSpreker } from '../de-wiebels/frontend/js/spreekballon.js';

// Een houder zonder Wiebels, met alleen een ballon. Onder Node is er geen stem (geen AudioContext).
const houder = () => {
  const bubbel = { hidden: true, textContent: '' };
  return { bubbel, querySelectorAll: () => [], querySelector: () => bubbel };
};
const zonderBeweging = (aan) => { globalThis.matchMedia = () => ({ matches: aan }); };

test('praat vervult na de zin letter voor letter', async () => {
  zonderBeweging(false);
  const h = houder();
  await maakSpreker(h, true)('Goed zo!');
  assert.equal(h.bubbel.textContent, 'Goed zo!');
});

test('praat vervult ook met een zin-id als er geen stem is', async () => {
  zonderBeweging(true);
  const h = houder();
  await maakSpreker(h, true)('Super!', 'goed-4');
  assert.equal(h.bubbel.textContent, 'Super!');
});

test('praat vervult als de zin wordt afgebroken', async () => {
  zonderBeweging(false);
  const praat = maakSpreker(houder(), true);
  const eerste = praat('Dit is een hele lange zin die nog lang niet klaar is.');
  const tweede = praat('Kort.');
  praat.stop();
  await Promise.all([eerste, tweede]);
});
