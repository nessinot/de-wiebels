import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DRAAGBAAR, PLEKKEN, SPULLEN, combinatie, koop, metGepast, migreerCosmetica, spul, spullenOp, trekAan,
} from '../de-wiebels/frontend/js/spullen.js';
import { nieuwProfiel, vulAan } from '../de-wiebels/frontend/js/profiel.js';
import { wiebelSvg } from '../de-wiebels/frontend/js/wiebel.js';
import { sceneSvg } from '../de-wiebels/frontend/js/venster.js';

const profiel = (munten) => Object.assign(nieuwProfiel({ naam: 'Speler 1', avatar: '🐱' }), { munten });
const ids = (svg) => [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const emojiTotUnicode12 = /^(?:[\u{1F300}-\u{1F9FF}☀-➿]️?)$/u;

test('catalogus: unieke ids, bekende plekken, prijzen tussen 15 en 150', () => {
  assert.equal(new Set(SPULLEN.map((s) => s.id)).size, SPULLEN.length);
  const plekken = PLEKKEN.map((p) => p.id).filter((p) => p !== 'kleur');
  for (const s of SPULLEN) {
    assert.ok(plekken.includes(s.plek), s.id);
    assert.ok(s.prijs >= 15 && s.prijs <= 150, s.id);
    assert.ok(s.naam, s.id);
    if (s.plek !== 'achtergrond') assert.equal(typeof s.teken, 'function', s.id);
    if (s.emoji) assert.match(s.emoji, emojiTotUnicode12, s.id);
  }
  const aantallen = Object.fromEntries(plekken.map((p) => [p, spullenOp(p).length]));
  assert.deepEqual(aantallen, { hoofd: 13, gezicht: 5, nek: 4, lijf: 7, broek: 3, voeten: 4, hand: 10, naast: 11, achtergrond: 11 });
  assert.deepEqual(DRAAGBAAR, ['hoofd', 'gezicht', 'nek', 'lijf', 'broek', 'voeten', 'hand']);
  assert.equal(spul('kroon').prijs, 150);
  assert.equal(spul('bestaat-niet'), null);
});

test('niet kopen zonder genoeg munten', () => {
  const p = profiel(10);
  assert.deepEqual(koop(p, 'pet-rood'), { ok: false, reden: 'te-weinig', tekort: 10 });
  assert.equal(p.munten, 10);
  assert.deepEqual(p.cosmetica, { gekocht: [], aan: {} });
  assert.equal(koop(p, 'bestaat-niet').ok, false);
});

test('kopen schrijft de munten correct af en trekt het spul meteen aan', () => {
  const p = profiel(50);
  assert.deepEqual(koop(p, 'hoge-hoed'), { ok: true });
  assert.equal(p.munten, 10);
  assert.deepEqual(p.cosmetica, { gekocht: ['hoge-hoed'], aan: { hoofd: 'hoge-hoed' } });
  assert.equal(koop(p, 'hoge-hoed').reden, 'al-gekocht');
  assert.equal(p.munten, 10);
  p.munten = 100;
  assert.ok(koop(p, 'sterren').ok);
  assert.equal(p.munten, 20);
  assert.deepEqual(p.cosmetica.aan, { hoofd: 'hoge-hoed', achtergrond: 'sterren' });
  assert.ok(koop(p, 'pet-rood').ok, 'precies genoeg munten');
  assert.equal(p.munten, 0);
  assert.equal(p.cosmetica.aan.hoofd, 'pet-rood', 'het nieuwe spul vervangt wat op die plek zat');
});

test('alleen aantrekken wat je hebt, op de eigen plek', () => {
  const p = profiel(200);
  koop(p, 'pet-rood');
  koop(p, 'muts');
  assert.equal(trekAan(p, 'hoofd', 'kroon'), false, 'niet gekocht');
  assert.equal(trekAan(p, 'nek', 'muts'), false, 'verkeerde plek');
  assert.equal(trekAan(p, 'hoofd', 'bestaat-niet'), false);
  assert.equal(p.cosmetica.aan.hoofd, 'muts');
  assert.equal(trekAan(p, 'hoofd', 'pet-rood'), true);
  assert.equal(p.cosmetica.aan.hoofd, 'pet-rood');
  assert.equal(trekAan(p, 'hoofd', 'pet-rood'), false, 'al aan');
  assert.equal(trekAan(p, 'hoofd'), true, 'uittrekken');
  assert.deepEqual(p.cosmetica.aan, {});
  assert.equal(trekAan(p, 'hoofd'), false, 'er was niets aan');
  assert.deepEqual(p.cosmetica.gekocht, ['pet-rood', 'muts'], 'uittrekken is niet weggooien');
});

test('passen verandert alleen de plek van het spul', () => {
  const aan = { hoofd: 'muts', nek: 'sjaal' };
  assert.deepEqual(metGepast(aan, 'pet-rood'), { hoofd: 'pet-rood', nek: 'sjaal' });
  assert.deepEqual(aan, { hoofd: 'muts', nek: 'sjaal' });
});

test('combinaties met regen, sneeuw en strand', () => {
  assert.equal(combinatie({ achtergrond: 'regen' }), 'nat');
  assert.equal(combinatie({ achtergrond: 'regen', hand: 'paraplu' }), 'droog');
  assert.equal(combinatie({ achtergrond: 'regen', hand: 'kikkerparaplu' }), 'droog');
  assert.equal(combinatie({ achtergrond: 'regen', lijf: 'regenjas' }), 'droog');
  assert.equal(combinatie({ achtergrond: 'regen', hand: 'parasol' }), 'nat', 'een parasol is geen paraplu');
  assert.equal(combinatie({ achtergrond: 'regen', hand: 'ballon-stip', lijf: 'shirt-rood' }), 'nat');
  assert.equal(combinatie({ achtergrond: 'sneeuw' }), 'koud');
  assert.equal(combinatie({ achtergrond: 'sneeuw', hoofd: 'muts' }), 'koud');
  assert.equal(combinatie({ achtergrond: 'sneeuw', nek: 'sjaal' }), 'koud');
  assert.equal(combinatie({ achtergrond: 'sneeuw', hoofd: 'muts', nek: 'sjaal' }), 'warm');
  assert.equal(combinatie({ achtergrond: 'strand', hand: 'parasol' }), 'schaduw');
  assert.equal(combinatie({ achtergrond: 'strand' }), null);
  assert.equal(combinatie({ achtergrond: 'sterren', hand: 'paraplu' }), null);
  assert.equal(combinatie({}), null);
  assert.equal(combinatie(), null);
});

test('migratie zet oude aankopen om en geeft munten terug', () => {
  const oud = {
    gekocht: ['hoed-pet', 'hoed-strik', 'hoed-hoge', 'hoed-diploma', 'hoed-kroon', 'kleur-rood', 'kleur-goud', 'kleur-regenboog', 'deco-ballon', 'deco-glitter', 'deco-ster', 'deco-regenboog'],
    actief: { hoed: 'hoed-strik', kleur: 'kleur-goud', deco: 'deco-regenboog' },
  };
  const { cosmetica, terug } = migreerCosmetica(oud);
  assert.deepEqual(cosmetica.gekocht, ['pet-rood', 'strik', 'hoge-hoed', 'afstudeerhoed', 'kroon', 'ballon-stip', 'regenboog']);
  assert.deepEqual(cosmetica.aan, { nek: 'strik', achtergrond: 'regenboog' });
  assert.equal(terug, 20 + 50 + 80 + 30 + 40);
  assert.ok(cosmetica.gekocht.every((id) => spul(id)), 'alles bestaat in de nieuwe catalogus');

  assert.deepEqual(migreerCosmetica({ gekocht: ['hoed-kroon', 'deco-ballon'], actief: { hoed: 'hoed-kroon', deco: 'deco-ballon' } }),
    { cosmetica: { gekocht: ['kroon', 'ballon-stip'], aan: { hoofd: 'kroon', hand: 'ballon-stip' } }, terug: 0 });
  assert.deepEqual(migreerCosmetica({ gekocht: [], actief: {} }), { cosmetica: { gekocht: [], aan: {} }, terug: 0 });
  assert.deepEqual(migreerCosmetica({ gekocht: ['kleur-blauw'], actief: { kleur: 'kleur-blauw' } }), { cosmetica: { gekocht: [], aan: {} }, terug: 20 });
});

test('vulAan migreert een oud profiel precies één keer', () => {
  const oud = profiel(5);
  oud.cosmetica = { gekocht: ['hoed-pet', 'kleur-groen', 'deco-ster'], actief: { hoed: 'hoed-pet', kleur: 'kleur-groen' } };
  vulAan(oud);
  assert.deepEqual(oud.cosmetica, { gekocht: ['pet-rood'], aan: { hoofd: 'pet-rood' } });
  assert.equal(oud.munten, 5 + 20 + 40);
  vulAan(oud);
  assert.equal(oud.munten, 65, 'geen dubbele teruggave');
  const zonder = profiel(0);
  delete zonder.cosmetica;
  assert.deepEqual(vulAan(zonder).cosmetica, { gekocht: [], aan: {} });
});

test('de Wiebel draagt zijn spullen op de ankerplekken', () => {
  const aan = { hoofd: 'muts', gezicht: 'zonnebril', nek: 'sjaal', lijf: 'regenjas', broek: 'broekje', voeten: 'laarzen', hand: 'paraplu', naast: 'zonnebloem', achtergrond: 'regen' };
  const svg = wiebelSvg({ kleur: 'paars', aan }, 'a');
  for (const plek of DRAAGBAAR) assert.ok(!svg.includes(`data-plek="${plek}"></g>`), `${plek} is gevuld`);
  assert.ok(svg.includes('data-hoofd="1"'));
  assert.ok(svg.includes('data-hand="paraplu"'));
  assert.ok(svg.includes('--mouw:#ffd23f'));
  assert.ok(!svg.includes('class="w-voeten"'), 'de gewone voetjes verdwijnen in laarzen');
  assert.ok(!svg.includes('🌻'), 'wat ernaast staat hoort bij de scène');
  assert.ok(wiebelSvg({ kleur: 'paars' }, 'a').includes('class="w-voeten"'));
  assert.ok(!wiebelSvg({ kleur: 'paars', aan: { hoofd: 'sjaal' } }, 'a').includes('data-hoofd'), 'spul op de verkeerde plek telt niet');
  assert.ok(wiebelSvg({ kleur: 'paars', aan: { lijf: 'cape' } }, 'a').indexOf('#b82f3c') < wiebelSvg({ kleur: 'paars', aan: { lijf: 'cape' } }, 'a').indexOf('w-arm-basis l'), 'de cape hangt achter de Wiebel');
});

test('ids blijven uniek per voorvoegsel, ook met spullen', () => {
  const alles = (prefix) => SPULLEN.filter((s) => DRAAGBAAR.includes(s.plek))
    .map((s) => wiebelSvg({ kleur: 'paars', aan: { [s.plek]: s.id } }, `${prefix}-${s.id}`)).join('');
  const lijst = ids(alles('x'));
  assert.equal(new Set(lijst).size, lijst.length);
});

test('de scène tekent achtergrond, het spul ernaast en de Wiebel', () => {
  const svg = sceneSvg({ kleur: 'groen', aan: { naast: 'zonnebloem', achtergrond: 'strand', hand: 'parasol' } }, 's');
  assert.ok(svg.includes('🌻'));
  assert.ok(svg.includes('s-lucht'));
  assert.ok(svg.includes('opacity=".16"'), 'schaduw onder de parasol');
  assert.ok(svg.includes('class="wiebel" x="80" y="34"'));
  assert.ok(sceneSvg({ kleur: 'groen', aan: { hand: 'paraplu', achtergrond: 'regen' } }, 's').includes('class="spat"'));
  assert.ok(!sceneSvg({ kleur: 'groen', aan: { achtergrond: 'regen' } }, 's').includes('class="spat"'));
  assert.ok(sceneSvg({ kleur: 'groen' }, 's', { stil: true }).includes('class="scene stil"'));
});
