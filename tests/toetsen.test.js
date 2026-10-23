import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actieVoorToets } from '../de-wiebels/frontend/js/toetsen.js';

test('afstandsbediening en pc-toetsen', () => {
  assert.equal(actieVoorToets(461).actie, 'terug');
  assert.equal(actieVoorToets(27).actie, 'terug');
  assert.equal(actieVoorToets(8).actie, 'terug');
  assert.equal(actieVoorToets(13).actie, 'ok');
  assert.equal(actieVoorToets(39).actie, 'rechts');
  assert.deepEqual([403, 404, 405, 406].map((c) => actieVoorToets(c).actie), ['rood', 'groen', 'geel', 'blauw']);
});

test('cijfertoetsen, ook op het numerieke toetsenblok', () => {
  assert.deepEqual(actieVoorToets(55), { actie: 'cijfer', cijfer: 7 });
  assert.deepEqual(actieVoorToets(96), { actie: 'cijfer', cijfer: 0 });
});

test('onbekende toetsen worden genegeerd', () => {
  assert.equal(actieVoorToets(65), null);
});
