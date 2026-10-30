import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLE_BELONINGEN, gevangenBij, nieuweWiebels, openingsZin, vaardigheidVan, wiebelVoor,
} from '../de-wiebels/frontend/js/beloningen.js';
import { BELONINGEN } from '../de-wiebels/frontend/js/levels.js';
import { ITEMS } from '../de-wiebels/frontend/js/nederland/items.js';
import { PROVINCIES } from '../de-wiebels/frontend/js/nederland/kaartbeeld.js';
import { HERKEN_ZINNEN } from '../de-wiebels/frontend/js/nederland/vragen.js';
import { sterId } from '../de-wiebels/frontend/js/nederland/wereld.js';
import { BELONINGEN_NL, GEVANGEN_ZIN, NL_WIEBEL, WIEBELS_NL, nlBeloningNa } from '../de-wiebels/frontend/js/nederland/wiebels.js';
import { nieuwProfiel } from '../de-wiebels/frontend/js/profiel.js';
import { DRAAGBAAR, spul } from '../de-wiebels/frontend/js/spullen.js';
import { THEMAS } from '../de-wiebels/frontend/js/themas/index.js';
import { KLEUREN } from '../de-wiebels/frontend/js/wiebel.js';
import { ZINNEN } from '../de-wiebels/frontend/js/zinnen.js';

const profiel = () => nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
const toets = (keuze, onderdeel = 'plaatsen') => sterId(onderdeel, keuze, true);

test('13 Wiebels van Nederland: één per provincie en één voor heel Nederland', () => {
  assert.equal(WIEBELS_NL.length, 13);
  assert.deepEqual(WIEBELS_NL.map((w) => w.id), [...PROVINCIES.map((p) => toets(p)), NL_WIEBEL]);
  assert.deepEqual(BELONINGEN_NL.map((b) => b.id), WIEBELS_NL.map((w) => w.id));
});

test('de verzameling telt 47 + 13 = 60 Wiebels, 5 rijen van 12', () => {
  assert.equal(BELONINGEN.length, 47);
  assert.equal(ALLE_BELONINGEN.length, 60);
  assert.deepEqual(ALLE_BELONINGEN.slice(0, 47), BELONINGEN);
  assert.equal(new Set(ALLE_BELONINGEN).size, 60);
});

test('elke Wiebel van Nederland heeft een eigen naam, ook tegenover de Wiebels van de thema\'s', () => {
  const namen = WIEBELS_NL.map((w) => w.naam);
  assert.equal(new Set(namen).size, namen.length);
  const themaNamen = new Set(Object.values(THEMAS).flatMap((t) => t.wiebels.map((w) => w.naam)));
  for (const naam of namen) assert.ok(!themaNamen.has(naam), `${naam} bestaat al in een thema`);
});

test('elke Wiebel van Nederland heeft een geldige kleur en een spul dat hij kan dragen', () => {
  for (const w of WIEBELS_NL) {
    assert.ok(KLEUREN[w.kleur], `${w.naam}: kleur ${w.kleur}`);
    const s = spul(w.spul);
    assert.ok(s, `${w.naam}: spul ${w.spul} bestaat niet`);
    assert.ok(DRAAGBAAR.includes(s.plek) && s.teken, `${w.naam}: ${w.spul} is niet draagbaar`);
  }
});

test('elke Wiebel van Nederland heeft vier weetjes en een vaste zin met zijn naam en een eigen id', () => {
  const bestaand = new Set([
    ...Object.values(ZINNEN).flat(),
    ...Object.values(THEMAS).flatMap((t) => t.wiebels.map((w) => w.zin)),
    ...ITEMS.flatMap((it) => Object.values(it.zinnen)),
    ...Object.values(HERKEN_ZINNEN),
    GEVANGEN_ZIN,
  ].map((z) => z.id));
  for (const w of WIEBELS_NL) {
    for (const veld of ['lievelingskleur', 'eetHetLiefst', 'kanHeelGoed', 'geheimpje']) assert.ok(w[veld]?.trim(), `${w.naam}: ${veld}`);
    const deel = w.id === NL_WIEBEL ? 'nederland' : w.id.split(':')[2].replace(/^pv-/, '');
    assert.equal(w.zin.id, `wiebel-nl-${deel}`, w.naam);
    assert.ok(w.zin.tekst.includes(w.naam), `${w.naam}: naam niet in de zin`);
    assert.doesNotMatch(w.zin.tekst, /[{}$<>%']|\d/, w.zin.id);
    assert.ok(!bestaand.has(w.zin.id), `${w.zin.id} komt twee keer voor`);
    bestaand.add(w.zin.id);
  }
});

test('wiebelVoor vindt een Wiebel van Nederland in elk thema, en die is overal gelijk', () => {
  for (const t of Object.values(THEMAS)) {
    for (const w of WIEBELS_NL) assert.deepEqual(wiebelVoor(w.id, t), w, `${t.id} ${w.naam}`);
  }
  assert.equal(vaardigheidVan(NL_WIEBEL), 'nederland');
  assert.equal(vaardigheidVan(toets('pv-zeeland')), 'nederland');
});

test('een provincie-Wiebel komt vrij bij twee sterren in haar plaatsen-toets', () => {
  const p = profiel();
  assert.equal(nlBeloningNa(p, toets('pv-zeeland')), null, 'nog geen ster');
  p.sterren[toets('pv-zeeland')] = 1;
  assert.equal(nlBeloningNa(p, toets('pv-zeeland')), null, 'één ster is niet genoeg');
  p.sterren[toets('pv-zeeland')] = 2;
  assert.equal(nlBeloningNa(p, toets('pv-zeeland')), toets('pv-zeeland'));
  p.sterren[sterId('plaatsen', 'pv-limburg')] = 3;
  assert.equal(nlBeloningNa(p, sterId('plaatsen', 'pv-limburg')), null, 'oefenen bevrijdt niemand');
  p.sterren[toets('alle')] = 3;
  assert.equal(nlBeloningNa(p, toets('alle')), null, 'alle provincies heeft geen eigen Wiebel');
});

test('de Wiebel van Nederland komt vrij bij twee sterren in de toets Provincies én in de toets Hoofdsteden', () => {
  const p = profiel();
  p.sterren[toets('alle', 'provincies')] = 2;
  assert.equal(nlBeloningNa(p, toets('alle', 'provincies')), null);
  p.sterren[toets('alle', 'hoofdsteden')] = 1;
  assert.equal(nlBeloningNa(p, toets('alle', 'hoofdsteden')), null, 'één ster bij Hoofdsteden is niet genoeg');
  p.sterren[toets('alle', 'hoofdsteden')] = 2;
  assert.equal(nlBeloningNa(p, toets('alle', 'hoofdsteden')), NL_WIEBEL);
  assert.equal(nlBeloningNa(p, toets('alle', 'provincies')), NL_WIEBEL);
});

test('een gevangen Wiebel van Nederland zegt bij welke toets hij zit', () => {
  const p = profiel();
  assert.deepEqual(gevangenBij(p, toets('pv-zeeland')), {
    vaardigheid: 'nederland', level: null, open: true, provincie: 'pv-zeeland', label: 'Toets Zeeland',
  });
  assert.deepEqual(gevangenBij(p, NL_WIEBEL), {
    vaardigheid: 'nederland', level: null, open: true, provincie: null, label: 'Toets Provincies en Hoofdsteden',
  });
});

test('de zin bij een gevangen Wiebel van Nederland is vaste tekst', () => {
  assert.match(GEVANGEN_ZIN.id, /^nl-[a-z-]+$/);
  assert.doesNotMatch(GEVANGEN_ZIN.tekst, /[{}$<>%']|\d/);
});

test('nieuw bevrijde Wiebels van Nederland tellen mee, en "alles bevrijd" pas bij alle 60', () => {
  const p = profiel();
  p.verzameling = [...BELONINGEN];
  p.wiebelsGezien = [...BELONINGEN];
  assert.notEqual(openingsZin(p, 0), 'collectieAlles');
  p.verzameling.push(toets('pv-zeeland'));
  assert.deepEqual(nieuweWiebels(p), [toets('pv-zeeland')]);
  p.verzameling = [...ALLE_BELONINGEN];
  assert.equal(openingsZin(p, 0), 'collectieAlles');
});
