import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nieuweRonde, beantwoord, huidigeVraag, gedaan, sterrenVoor } from '../de-wiebels/frontend/js/ronde.js';

const vragen = Array.from({ length: 10 }, (_, i) => ({ id: `v${i}`, goed: 'g' }));
const reserve = Array.from({ length: 3 }, (_, i) => ({ id: `r${i}`, goed: 'g' }));

// Alles goed tot alleen de laatste vraag nog over is.
function totLaatste(r) {
  while (r.wachtrij.length > 1) beantwoord(r, 'g');
}

test('laatste vraag fout met reserve: eerst een reservevraag, dan de foute', () => {
  const r = nieuweRonde(vragen, reserve);
  totLaatste(r);
  beantwoord(r, 'fout');
  assert.deepEqual(r.wachtrij.map((v) => v.id), ['r0', 'v9']);
  assert.equal(huidigeVraag(r).extra, true);
});

test('laatste vraag fout zonder reserve: eerst een eerder gestelde andere vraag', () => {
  const r = nieuweRonde(vragen);
  totLaatste(r);
  beantwoord(r, 'fout');
  assert.deepEqual(r.wachtrij.map((v) => v.id), ['v8', 'v9']);
  assert.equal(huidigeVraag(r).extra, true);
});

test('ronde van één vraag fout: dezelfde vraag komt terug (vangnet)', () => {
  const r = nieuweRonde([vragen[0]]);
  beantwoord(r, 'fout');
  assert.deepEqual(r.wachtrij.map((v) => v.id), ['v0']);
  assert.ok(!huidigeVraag(r).extra);
});

test('een goede tussenvraag telt niet voor goedEerst en geeft geen basismunt', () => {
  const r = nieuweRonde(vragen, reserve);
  totLaatste(r);
  beantwoord(r, 'fout');
  const voor = r.goedEerst;
  const tussen = beantwoord(r, 'g');
  assert.equal(tussen.vraag.id, 'r0');
  assert.equal(tussen.eersteKeer, false);
  assert.equal(tussen.munten, 0);
  assert.equal(r.goedEerst, voor);
  assert.equal(r.combo, 1);
});

test('een foute tussenvraag komt niet terug', () => {
  const r = nieuweRonde(vragen, reserve);
  totLaatste(r);
  beantwoord(r, 'fout');
  beantwoord(r, 'fout');
  assert.deepEqual(r.wachtrij.map((v) => v.id), ['v9']);
  // Gaat de foute vraag weer mis, dan volgt opnieuw een tussenvraag.
  beantwoord(r, 'fout');
  assert.deepEqual(r.wachtrij.map((v) => v.id), ['r1', 'v9']);
});

test('gedaan() telt de tussenvraag niet mee', () => {
  const r = nieuweRonde(vragen, reserve);
  totLaatste(r);
  assert.equal(gedaan(r), 9);
  beantwoord(r, 'fout');
  assert.equal(gedaan(r), 9);
  beantwoord(r, 'g');
  assert.equal(gedaan(r), 9);
  beantwoord(r, 'g');
  assert.equal(gedaan(r), 10);
  assert.equal(r.wachtrij.length, 0);
});

test('een volle ronde met de laatste fout geeft goedEerst 9 en twee sterren', () => {
  for (const res of [reserve, []]) {
    const r = nieuweRonde(vragen, res);
    totLaatste(r);
    beantwoord(r, 'fout');
    let uitslag;
    while (r.wachtrij.length) uitslag = beantwoord(r, 'g');
    assert.ok(uitslag.klaar);
    assert.equal(r.goedEerst, 9);
    assert.equal(r.aantal, 10);
    assert.equal(sterrenVoor(r.goedEerst, r.aantal), 2);
  }
});

test('met willekeurige fouten komt dezelfde vraag nooit twee keer direct na elkaar', () => {
  for (const res of [reserve, []]) {
    for (let n = 0; n < 500; n++) {
      const r = nieuweRonde(vragen, res);
      let vorige = null;
      for (let stap = 0; r.wachtrij.length && stap < 1000; stap++) {
        const vraag = huidigeVraag(r);
        assert.notEqual(vraag.id, vorige);
        vorige = vraag.id;
        beantwoord(r, Math.random() < 0.4 ? 'fout' : 'g');
      }
      assert.equal(r.wachtrij.length, 0);
    }
  }
});

test('alles in één keer goed geeft drie sterren', () => {
  const r = nieuweRonde(vragen);
  let uitslag;
  while (r.wachtrij.length) uitslag = beantwoord(r, 'g');
  assert.ok(uitslag.klaar);
  assert.equal(r.goedEerst, 10);
  assert.equal(sterrenVoor(r.goedEerst), 3);
});

test('een foute vraag komt later in de ronde terug en telt niet als eerste keer goed', () => {
  const r = nieuweRonde(vragen);
  assert.equal(beantwoord(r, 'fout').goed, false);
  assert.notEqual(huidigeVraag(r).id, 'v0');
  assert.equal(r.wachtrij[2].id, 'v0');
  assert.equal(r.combo, 0);
  while (r.wachtrij.length) beantwoord(r, 'g');
  assert.equal(r.goedEerst, 9);
});

test('sterrengrenzen', () => {
  assert.equal(sterrenVoor(10), 3);
  assert.equal(sterrenVoor(9), 2);
  assert.equal(sterrenVoor(8), 2);
  assert.equal(sterrenVoor(7), 1);
  assert.equal(sterrenVoor(5), 1);
  assert.equal(sterrenVoor(4), 0);
});

test('munten: één per in één keer goed, plus combo-bonus bij 3, 5 en 10 op rij', () => {
  const r = nieuweRonde(vragen);
  const bonussen = [];
  while (r.wachtrij.length) bonussen.push(beantwoord(r, 'g').bonus);
  assert.deepEqual(bonussen, [0, 0, 2, 0, 5, 0, 0, 0, 0, 10]);
  assert.equal(r.munten, 10 + 2 + 5 + 10);
});

test('een fout breekt de combo en een herkansing geeft geen munt', () => {
  const r = nieuweRonde(vragen);
  beantwoord(r, 'g');
  beantwoord(r, 'g');
  beantwoord(r, 'fout');
  assert.equal(r.combo, 0);
  beantwoord(r, 'g');
  beantwoord(r, 'g');
  const herkansing = beantwoord(r, 'g');
  assert.equal(herkansing.vraag.id, 'v2');
  assert.equal(herkansing.munten, 2); // geen munt voor de vraag zelf, wel de bonus voor 3 op rij
});
