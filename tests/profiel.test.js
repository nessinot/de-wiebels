import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maakOpslag, STANDAARD_INSTELLINGEN } from '../de-wiebels/frontend/js/opslag.js';
import { nieuwProfiel, MAX_NAAM, vulAan } from '../de-wiebels/frontend/js/profiel.js';

function nepOpslag() {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

test('nieuw profiel volgt het datamodel en het gekozen startniveau', () => {
  const p = nieuwProfiel({ naam: '  Speler 1  ', avatar: '🐱', startniveau: 'gevorderd' });
  assert.equal(p.naam, 'Speler 1');
  assert.equal(p.thema, 'ruimte');
  assert.deepEqual(p.niveaus, { plus: 2, min: 2, keer: 1, delen: 1, klok: 1 });
  assert.equal(p.munten, 0);
  assert.deepEqual(p.verzameling, []);
  assert.match(p.id, /^p-[a-z0-9]+$/);
  assert.deepEqual(p.wiebel, { kleur: 'paars' });
  assert.deepEqual(p.huisdier, { xp: 0 });
  assert.equal(p.introGezien, false);
});

test('nieuw profiel krijgt de gekozen Wiebel-kleur', () => {
  const p = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱', kleur: 'blauw' });
  assert.deepEqual(p.wiebel, { kleur: 'blauw' });
});

test('vulAan geeft een oud profiel een paarse Wiebel en laat de rest staan', () => {
  const oud = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  delete oud.wiebel;
  oud.huisdier.xp = 120;
  const kopie = structuredClone(oud);
  assert.equal(vulAan(oud), oud);
  assert.deepEqual(oud, { ...kopie, wiebel: { kleur: 'paars' } });
  vulAan(oud);
  assert.deepEqual(oud, { ...kopie, wiebel: { kleur: 'paars' } }, 'dubbel aanroepen verandert niets');
  const groen = vulAan(nieuwProfiel({ naam: 'Speler 2', avatar: '🐶', kleur: 'groen' }));
  assert.deepEqual(groen.wiebel, { kleur: 'groen' }, 'een gekozen kleur blijft');
});

test('vulAan: een bestaand profiel krijgt geen intro, een nieuw profiel wel', () => {
  const oud = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  delete oud.introGezien;
  assert.equal(vulAan(oud).introGezien, true);
  assert.equal(vulAan(oud).introGezien, true, 'dubbel aanroepen verandert niets');
  const nieuw = nieuwProfiel({ naam: 'Speler 2', avatar: '🐶' });
  assert.equal(vulAan(nieuw).introGezien, false);
  assert.equal(vulAan(nieuw).introGezien, false, 'dubbel aanroepen verandert niets');
  nieuw.introGezien = true;
  assert.equal(vulAan(nieuw).introGezien, true);
});

test('profielen worden bij het laden aangevuld', () => {
  const opslag = nepOpslag();
  const oud = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' });
  delete oud.wiebel;
  opslag.setItem('wiebels:profielen', JSON.stringify({ [oud.id]: oud }));
  assert.deepEqual(maakOpslag(() => opslag).alleProfielen()[0].wiebel, { kleur: 'paars' });
});

test('naam wordt ingekort tot de maximale lengte', () => {
  const p = nieuwProfiel({ naam: 'A'.repeat(30), avatar: '🐶' });
  assert.equal(p.naam.length, MAX_NAAM);
});

test('profielen bewaren, teruglezen en verwijderen', () => {
  const opslag = nepOpslag();
  const o = maakOpslag(() => opslag);
  const a = nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' }, new Date('2026-01-01'));
  const b = nieuwProfiel({ naam: 'Speler 2', avatar: '🐶' }, new Date('2026-01-02'));
  o.bewaarProfiel(b);
  o.bewaarProfiel(a);
  assert.deepEqual(o.alleProfielen().map((p) => p.naam), ['Speler 1', 'Speler 2']);
  a.munten = 7;
  o.bewaarProfiel(a);
  assert.equal(o.alleProfielen()[0].munten, 7);
  o.verwijderProfiel(a.id);
  assert.deepEqual(o.alleProfielen().map((p) => p.naam), ['Speler 2']);
});

test('instellingen hebben standaardwaarden en kapotte data breekt niets', () => {
  const opslag = nepOpslag();
  const o = maakOpslag(() => opslag);
  assert.deepEqual(o.instellingen(), STANDAARD_INSTELLINGEN);
  o.bewaarInstellingen({ geluid: false });
  assert.equal(o.instellingen().geluid, false);
  assert.equal(o.instellingen().pin, '1234');
  opslag.setItem('wiebels:profielen', '{kapot');
  assert.deepEqual(o.alleProfielen(), []);
});
