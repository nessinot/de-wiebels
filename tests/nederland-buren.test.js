import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUREN } from '../de-wiebels/frontend/js/nederland/buren.js';
import { volgende } from '../de-wiebels/frontend/js/nederland/bediening.js';
import { PROVINCIES, doelenVoor, zoomVak } from '../de-wiebels/frontend/js/nederland/kaartbeeld.js';
import { KAART_MAAT } from '../de-wiebels/frontend/js/schermen/nederland-provincie.js';

const RICHTINGEN = ['links', 'rechts', 'omhoog', 'omlaag'];
const TEGEN = { links: 'rechts', rechts: 'links', omhoog: 'omlaag', omlaag: 'omhoog' };

// Pijlen die bewust niet terug leiden, omdat de kaart dat zo laat zien (zie buren.js).
const EENRICHTING = [
  'pv-friesland links',
  'pv-drenthe links',
  'pv-flevoland omlaag',
  'pv-utrecht omhoog',
  'pv-zuid-holland links',
  'pv-zuid-holland omlaag',
  'pv-zeeland omhoog',
];

// Alles wat je vanaf het eerste doel met de pijltjes kunt bereiken.
function bereikbaar(doelen, stap) {
  const gezien = new Set([doelen[0]]);
  const rij = [doelen[0]];
  while (rij.length) {
    const id = rij.shift();
    for (const r of RICHTINGEN) {
      const naar = stap(id, r);
      if (naar && !gezien.has(naar)) {
        gezien.add(naar);
        rij.push(naar);
      }
    }
  }
  return gezien;
}

// Vaste willekeur, zodat een fout altijd terugkomt.
function rng(zaad) {
  let s = zaad;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

test('de burentabel heeft alle twaalf provincies met vier richtingen', () => {
  assert.equal(PROVINCIES.length, 12);
  assert.deepEqual(Object.keys(BUREN).sort(), [...PROVINCIES].sort());
  for (const [id, buren] of Object.entries(BUREN)) {
    assert.deepEqual(Object.keys(buren).sort(), [...RICHTINGEN].sort(), id);
    for (const naar of Object.values(buren)) {
      if (naar !== null) assert.ok(PROVINCIES.includes(naar) && naar !== id, `${id} → ${naar}`);
    }
  }
});

test('vanuit elke provincie is elke andere te bereiken', () => {
  for (const begin of PROVINCIES) {
    const doelen = [begin, ...PROVINCIES.filter((p) => p !== begin)];
    assert.equal(bereikbaar(doelen, (id, r) => volgende(id, r, PROVINCIES)).size, 12, begin);
  }
});

test('de tabel is omkeerbaar, op een korte vaste lijst na', () => {
  const eenrichting = [];
  for (const [id, buren] of Object.entries(BUREN)) {
    for (const r of RICHTINGEN) {
      if (buren[r] && BUREN[buren[r]][TEGEN[r]] !== id) eenrichting.push(`${id} ${r}`);
    }
  }
  assert.deepEqual(eenrichting.sort(), [...EENRICHTING].sort());
});

test('volgende geeft null waar de tabel niets heeft', () => {
  assert.equal(volgende('pv-noord-holland', 'links', PROVINCIES), null);
  assert.equal(volgende('pv-zuid-holland', 'omlaag', PROVINCIES), 'pv-noord-brabant');
});

test('alle stippen en gebieden zijn bereikbaar, per provincie en in heel Nederland', () => {
  for (const provincie of [...PROVINCIES, null]) {
    const doelen = doelenVoor(provincie);
    const vak = zoomVak(provincie, ...KAART_MAAT);
    const gezien = bereikbaar(doelen, (id, r) => volgende(id, r, doelen, vak));
    assert.deepEqual(doelen.filter((id) => !gezien.has(id)), [], provincie ?? 'heel Nederland');
  }
});

test('ook als willekeurige items uitstaan, is de rest bereikbaar', () => {
  const r = rng(7);
  const alles = doelenVoor(null);
  for (let ronde = 0; ronde < 40; ronde++) {
    const uit = alles.filter(() => r() < 0.4);
    for (const provincie of [...PROVINCIES, null]) {
      const doelen = doelenVoor(provincie, uit);
      if (!doelen.length) continue;
      assert.ok(doelen.every((id) => !uit.includes(id)));
      const vak = zoomVak(provincie, ...KAART_MAAT);
      const gezien = bereikbaar(doelen, (id, rr) => volgende(id, rr, doelen, vak));
      assert.equal(gezien.size, doelen.length, `${provincie ?? 'heel Nederland'}, ronde ${ronde}`);
    }
  }
});
