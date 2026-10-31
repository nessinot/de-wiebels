import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLE_BELONINGEN, afloopBel, belInToets, beloningNa, geefBeloning, gevangenBij, huisdierStadium, markeerGezien, nieuweWiebels, openingsZin, totVolgendStadium, vaardigheidVan, voegXpToe,
  wiebelVan, wiebelVoor,
} from '../de-wiebels/frontend/js/beloningen.js';
import { BELONINGEN, LEVELS, VAARDIGHEDEN, levelVan } from '../de-wiebels/frontend/js/levels.js';
import { sterId } from '../de-wiebels/frontend/js/nederland/wereld.js';
import { NL_WIEBEL } from '../de-wiebels/frontend/js/nederland/wiebels.js';
import { nieuwProfiel, vulAan } from '../de-wiebels/frontend/js/profiel.js';
import { DRAAGBAAR, spul } from '../de-wiebels/frontend/js/spullen.js';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { KLEUREN } from '../de-wiebels/frontend/js/wiebel.js';
import { ZINNEN } from '../de-wiebels/frontend/js/zinnen.js';

test('een beloning wordt maar één keer gegeven', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.equal(geefBeloning(p, 'keer:5'), true);
  assert.equal(geefBeloning(p, 'keer:5'), false);
  assert.deepEqual(p.verzameling, ['keer:5']);
});

test('een Wiebel komt vrij bij twee sterren, in een level en in een toets van Nederland', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.equal(beloningNa(p, 'plus:10', 1), null);
  assert.equal(beloningNa(p, 'plus:10', 2), 'plus:10');
  const zeeland = sterId('plaatsen', 'pv-zeeland', true);
  p.sterren[zeeland] = 1;
  assert.equal(beloningNa(p, zeeland, 1), null);
  p.sterren[zeeland] = 2;
  assert.equal(beloningNa(p, zeeland, 2), zeeland);
  const alle = sterId('plaatsen', 'alle', true);
  p.sterren[alle] = 3;
  assert.equal(beloningNa(p, alle, 3), null, 'alle provincies heeft geen eigen Wiebel');
});

test('de Wiebel die bij een level of toets hoort', () => {
  assert.equal(wiebelVan('plus:10'), 'plus:10');
  assert.equal(wiebelVan(sterId('plaatsen', 'pv-zeeland', true)), sterId('plaatsen', 'pv-zeeland', true));
  assert.equal(wiebelVan(sterId('provincies', 'alle', true)), NL_WIEBEL);
  assert.equal(wiebelVan(sterId('hoofdsteden', 'alle', true)), NL_WIEBEL);
  assert.equal(wiebelVan(sterId('plaatsen', 'pv-zeeland')), null, 'oefenen');
  assert.equal(wiebelVan(sterId('plaatsen', 'alle', true)), null, 'alle provincies');
});

test('tijdens een toets van Nederland zit de Wiebel in zijn bel tot hij vrij is', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  const overijssel = sterId('plaatsen', 'pv-overijssel', true);
  assert.equal(belInToets(p, overijssel), overijssel);
  assert.equal(belInToets(p, sterId('provincies', 'alle', true)), NL_WIEBEL);
  assert.equal(belInToets(p, sterId('hoofdsteden', 'alle', true)), NL_WIEBEL);
  assert.equal(belInToets(p, sterId('plaatsen', 'pv-overijssel')), null, 'oefenen');
  assert.equal(belInToets(p, sterId('plaatsen', 'alle', true)), null, 'alle provincies');
  assert.equal(belInToets(p, 'plus:10'), null, 'een somlevel');
  assert.equal(belInToets(p, 'baas:plus'), null, 'een eindbaas');
  geefBeloning(p, overijssel);
  assert.equal(belInToets(p, overijssel), null, 'al vrij');
});

test('aan het eind van de toets knapt de bel, schudt hij, of nog één toets bij Tulpje', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  // Zoals het rondescherm: eerst de sterren bewaren, dan kijken wie er vrijkomt.
  const afloop = (levelId, sterren) => {
    p.sterren[levelId] = Math.max(p.sterren[levelId] || 0, sterren);
    const vrij = beloningNa(p, levelId, sterren);
    return afloopBel(sterren, vrij && geefBeloning(p, vrij) ? vrij : null);
  };
  const overijssel = sterId('plaatsen', 'pv-overijssel', true);
  assert.equal(afloop(overijssel, 1), 'schud');
  assert.equal(afloop(overijssel, 2), 'knap');
  const provincies = sterId('provincies', 'alle', true);
  const hoofdsteden = sterId('hoofdsteden', 'alle', true);
  assert.equal(afloop(provincies, 2), 'nogEen');
  assert.equal(afloop(hoofdsteden, 1), 'schud');
  assert.equal(afloop(hoofdsteden, 2), 'knap');
  assert.ok(p.verzameling.includes(NL_WIEBEL));
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

test('elk thema heeft 42 level-Wiebels en 5 baas-Wiebels, in de volgorde van de beloningen', () => {
  for (const t of Object.values(THEMAS)) {
    assert.deepEqual(t.wiebels.map((w) => w.id), BELONINGEN, t.id);
    assert.equal(t.wiebels.filter((w) => w.id.startsWith('baas:')).length, 5, t.id);
    assert.equal(t.wiebels.length, 47, t.id);
    assert.equal(t.baaswiebels, undefined, t.id);
  }
});

test('elke Wiebel heeft een eigen naam binnen zijn thema', () => {
  for (const t of Object.values(THEMAS)) {
    const namen = t.wiebels.map((w) => w.naam);
    assert.equal(new Set(namen).size, namen.length, t.id);
  }
});

test('elke Wiebel heeft een geldige kleur en een spul dat hij kan dragen', () => {
  for (const t of Object.values(THEMAS)) {
    for (const w of t.wiebels) {
      assert.ok(KLEUREN[w.kleur], `${t.id} ${w.naam}: kleur ${w.kleur}`);
      const s = spul(w.spul);
      assert.ok(s, `${t.id} ${w.naam}: spul ${w.spul} bestaat niet`);
      assert.ok(DRAAGBAAR.includes(s.plek) && s.teken, `${t.id} ${w.naam}: ${w.spul} is niet draagbaar`);
    }
  }
});

test('elke Wiebel heeft vier weetjes en een vaste zin met zijn naam', () => {
  const zinIds = new Set(Object.values(ZINNEN).flat().map((z) => z.id));
  for (const t of Object.values(THEMAS)) {
    for (const w of t.wiebels) {
      for (const veld of ['lievelingskleur', 'eetHetLiefst', 'kanHeelGoed', 'geheimpje']) assert.ok(w[veld]?.trim(), `${t.id} ${w.naam}: ${veld}`);
      assert.equal(w.zin.id, `wiebel-${t.id}-${w.id.replace(':', '-')}`, `${t.id} ${w.naam}`);
      assert.ok(w.zin.tekst.includes(w.naam), `${t.id} ${w.naam}: naam niet in de zin`);
      assert.doesNotMatch(w.zin.tekst, /[{}$<>%]|\d/, w.zin.id);
      assert.ok(!zinIds.has(w.zin.id), `${w.zin.id} komt twee keer voor`);
      zinIds.add(w.zin.id);
    }
  }
});

test('wiebelVoor geeft de Wiebel van de beloning, ook bij een eindbaas', () => {
  const t = THEMAS.ruimte;
  assert.equal(wiebelVoor('plus:20', t).naam, 'Pixel');
  assert.equal(wiebelVoor('baas:plus', t).naam, 'Kroonster');
  for (const id of BELONINGEN) assert.equal(wiebelVoor(id, t).id, id);
  assert.equal(vaardigheidVan('baas:klok'), 'klok');
  assert.equal(vaardigheidVan('plus:1000-onthouden'), 'plus');
  for (const v of VAARDIGHEDEN) assert.ok(t.werelden[vaardigheidVan(`baas:${v}`)]);
});

test('nieuwe Wiebels: wat bevrijd is maar nog niet bekeken, en na het bekijken niet meer', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.deepEqual(nieuweWiebels(p), []);
  geefBeloning(p, 'plus:10');
  geefBeloning(p, 'baas:plus');
  assert.deepEqual(nieuweWiebels(p), ['plus:10', 'baas:plus']);
  assert.equal(markeerGezien(p), true);
  assert.deepEqual(nieuweWiebels(p), []);
  assert.equal(markeerGezien(p), false);
  geefBeloning(p, 'min:10');
  assert.deepEqual(nieuweWiebels(p), ['min:10']);
});

test('vulAan: een oud profiel heeft zijn Wiebels al gezien, een nieuw profiel heeft er nog geen', () => {
  const oud = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  oud.verzameling = ['plus:10', 'plus:20', 'baas:plus'];
  delete oud.wiebelsGezien;
  vulAan(oud);
  assert.deepEqual(nieuweWiebels(oud), []);
  oud.verzameling.push('min:10');
  vulAan(oud);
  assert.deepEqual(nieuweWiebels(oud), ['min:10'], 'dubbel aanroepen verandert niets');
  const nieuw = vulAan(nieuwProfiel({ naam: 'Speler 2', avatar: '🐶' }));
  assert.deepEqual(nieuw.wiebelsGezien, []);
  geefBeloning(nieuw, 'plus:10');
  assert.equal(nieuweWiebels(nieuw).length, 1);
});

test('openingszin: nieuwe Wiebels, nog te bevrijden, of allemaal vrij', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  assert.equal(openingsZin(p, 0), 'collectieStart');
  geefBeloning(p, 'plus:10');
  assert.equal(openingsZin(p, 1), 'collectieNieuw');
  assert.equal(openingsZin(p, 0), 'collectieStart');
  p.verzameling = [...ALLE_BELONINGEN];
  assert.equal(openingsZin(p, 0), 'collectieAlles');
  assert.equal(openingsZin(p, 3), 'collectieAlles');
  for (const g of ['collectieStart', 'collectieNieuw', 'collectieAlles', 'gevangenOpen', 'gevangenBaas', 'gevangenDicht', 'menuNieuw']) assert.ok(ZINNEN[g]?.length, g);
});

test('gevangen Wiebel: "Ga erheen" alleen als het level of de eindbaas al open is', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' }); // starter: plus tot 20 open
  assert.deepEqual(gevangenBij(p, 'plus:20'), { vaardigheid: 'plus', level: levelVan('plus:20'), open: true });
  assert.equal(gevangenBij(p, 'plus:tiental').open, false);
  p.sterren['plus:20'] = 1;
  assert.equal(gevangenBij(p, 'plus:tiental').open, true);
  assert.deepEqual(gevangenBij(p, 'baas:plus'), { vaardigheid: 'plus', level: null, open: false });
  for (const l of LEVELS.plus) p.sterren[l.id] = 1;
  assert.equal(gevangenBij(p, 'baas:plus').open, true);
  assert.equal(gevangenBij(p, 'baas:min').open, false);
});
