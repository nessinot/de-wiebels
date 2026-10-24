import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROEI, KLEUREN, ROMP, STADIUM_NAMEN, wiebelSvg } from '../de-wiebels/frontend/js/wiebel.js';
import { HUISDIER_GRENZEN, huisdierStadium } from '../de-wiebels/frontend/js/beloningen.js';
import { DEELTJES, MAX_DEELTJES, SCENES, achtergrond, rng } from '../de-wiebels/frontend/js/scene.js';
import { SPULLEN } from '../de-wiebels/frontend/js/spullen.js';

const ONDERDELEN = [
  'w-schaduw', 'w-sprong', 'w-kantel', 'w-lijf', 'w-romp', 'w-buik', 'w-voeten', 'w-voet',
  'w-spriet-basis l', 'w-spriet-basis r', 'w-spriet l', 'w-spriet r', 'w-spriet-steel', 'w-spriet-bol',
  'w-arm-basis l', 'w-arm-basis r', 'w-arm l', 'w-arm r', 'w-arm-rand', 'w-arm-vul',
  'w-gezicht', 'w-ogen', 'w-blik', 'w-pupillen', 'w-blije-ogen', 'w-mond-rust', 'w-mond-open', 'w-mond-blij',
];
const PLEKKEN = ['hoofd', 'gezicht', 'nek', 'lijf', 'broek', 'voeten', 'hand'];

const aantal = (tekst, stuk) => tekst.split(stuk).length - 1;
const ids = (svg) => [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);

test('er zijn vijf kleuren met alle tinten', () => {
  assert.deepEqual(Object.keys(KLEUREN), ['paars', 'groen', 'oranje', 'roze', 'blauw']);
  for (const k of Object.values(KLEUREN)) {
    assert.ok(k.naam);
    for (const tint of ['lijf', 'donker', 'buik', 'spriet']) assert.match(k[tint], /^#[0-9a-f]{6}$/i);
  }
});

test('wiebelSvg bevat in elk stadium alle onderdelen en lege ankerplekken', () => {
  for (const stadium of [0, 1, 2, 3]) {
    const svg = wiebelSvg({ kleur: 'groen', stadium }, 'a');
    for (const deel of ONDERDELEN) assert.ok(svg.includes(`class="${deel}`), `${deel} in stadium ${stadium}`);
    for (const plek of PLEKKEN) assert.ok(svg.includes(`<g class="w-plek" data-plek="${plek}"></g>`), `${plek} in stadium ${stadium}`);
    assert.equal(aantal(svg, 'class="w-voet"'), 2);
    assert.equal(aantal(svg, 'class="w-spriet-bol"'), 2);
    assert.ok(svg.includes(ROMP));
    assert.ok(svg.includes(KLEUREN.groen.lijf));
    assert.ok(svg.includes(`data-stadium="${stadium}"`));
  }
  assert.ok(wiebelSvg({ kleur: 'groen' }, 'a').includes('viewBox="0 0 240 260"'));
});

test('groeistadium per aantal goede antwoorden', () => {
  const stadia = [[0, 0], [49, 0], [50, 1], [199, 1], [200, 2], [500, 3]];
  for (const [xp, stadium] of stadia) assert.equal(huisdierStadium(xp), stadium, `xp ${xp}`);
  assert.equal(STADIUM_NAMEN.length, HUISDIER_GRENZEN.length);
  assert.equal(GROEI.length, HUISDIER_GRENZEN.length);
  assert.deepEqual(STADIUM_NAMEN, ['Mini-Wiebel', 'Kleine Wiebel', 'Grote Wiebel', 'Super-Wiebel']);
});

test('de Wiebel groeit: kleiner in zijn vak, langere voelsprieten, sterretjes in het laatste stadium', () => {
  const vak = (svg) => svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const punt = (svg) => Number(svg.match(/class="w-spriet-bol" cx="[^"]+" cy="([^"]+)"/)[1]);
  const svgs = [0, 1, 2, 3].map((stadium) => wiebelSvg({ kleur: 'paars', stadium }, 'a'));
  svgs.forEach((svg, i) => {
    const [, , b, h] = vak(svg);
    assert.ok(Math.abs(240 / b - GROEI[i]) < 0.01, `breedte stadium ${i}`);
    assert.ok(Math.abs(260 / h - GROEI[i]) < 0.01, `hoogte stadium ${i}`);
    assert.ok(svg.includes('width="240" height="260"'), 'het vak zelf blijft even groot');
    if (i) assert.ok(punt(svg) < punt(svgs[i - 1]), `spriet stadium ${i} langer`);
    assert.equal(aantal(svg, 'class="w-ster"'), i === 3 ? 3 : 0);
  });
  assert.deepEqual(GROEI, [0.7, 0.8, 0.9, 1]);
  assert.equal(wiebelSvg({ kleur: 'paars' }, 'a'), svgs[3], 'zonder stadium is hij volgroeid');
});

test('lagen liggen genest: sprong > kantel > lijf', () => {
  const svg = wiebelSvg({ kleur: 'paars' }, 'a');
  assert.ok(svg.includes('<g class="w-sprong"><g class="w-kantel"><g class="w-lijf">'));
  assert.ok(svg.includes('</g></g></g>\n  </svg>'));
});

test('ids zijn uniek per voorvoegsel', () => {
  const a = ids(wiebelSvg({ kleur: 'paars' }, 'een'));
  const b = ids(wiebelSvg({ kleur: 'paars' }, 'twee'));
  assert.deepEqual(a, ['een-romp']);
  assert.deepEqual(b, ['twee-romp']);
  const pagina = ['kies-paars', 'kies-groen', 'verzameling', 'resultaat']
    .map((prefix, stadium) => wiebelSvg({ kleur: 'paars', stadium }, prefix)).join('');
  const alle = ids(pagina);
  assert.equal(alle.length, 4);
  assert.equal(new Set(alle).size, alle.length);
});

test('onbekende kleur wordt paars; plek en schaal komen in het svg', () => {
  const svg = wiebelSvg({ kleur: 'zwart' }, 'a', { x: 10, y: 20, schaal: 0.5 });
  assert.ok(svg.includes(KLEUREN.paars.lijf));
  assert.ok(svg.includes('x="10" y="20" width="120" height="130"'));
});

test('rng met een vast zaad geeft een vaste reeks', () => {
  const a = rng(42);
  const b = rng(42);
  const reeks = Array.from({ length: 5 }, a);
  assert.deepEqual(Array.from({ length: 5 }, b), reeks);
  assert.deepEqual(reeks.map((x) => x.toFixed(6)), ['0.601104', '0.448291', '0.852466', '0.669734', '0.174814']);
  for (const x of reeks) assert.ok(x >= 0 && x < 1);
  assert.notDeepEqual(Array.from({ length: 5 }, rng(43)), reeks);
});

test('scènes hebben het verwachte aantal deeltjes', () => {
  const bewegend = (s) => DEELTJES.reduce((som, k) => som + aantal(s.achter + s.voor, `class="${k}"`), 0);
  assert.equal(SCENES.length, 11);
  assert.equal(aantal(achtergrond('sterren', 'p').achter, 'class="twinkel"'), MAX_DEELTJES);
  assert.equal(aantal(achtergrond('regen', 'p').voor, 'class="druppel"'), MAX_DEELTJES);
  assert.equal(aantal(achtergrond('sneeuw', 'p').voor, 'class="vlok"'), MAX_DEELTJES);
  for (const soort of SCENES) {
    assert.ok(bewegend(achtergrond(soort, 'p')) <= MAX_DEELTJES, soort);
    assert.equal(bewegend(achtergrond(soort, 'p', { stil: true })), 0, `${soort} stil`);
    assert.deepEqual(ids(achtergrond(soort, 'p').achter), ['p-lucht'], soort);
  }
  assert.equal(aantal(achtergrond('regen', 'p', { stil: true }).voor, 'class="druppel-lijn"'), MAX_DEELTJES);
  assert.equal(aantal(achtergrond('sneeuw', 'p', { stil: true }).voor, 'class="vlok-stil"'), MAX_DEELTJES);
  assert.deepEqual(achtergrond('geen', 'p'), { achter: '', voor: '' });
});

test('met een paraplu ketsen druppels af, en samen blijven ze binnen de grens', () => {
  for (const groei of [0.7, 1]) {
    const regen = achtergrond('regen', 'p', { paraplu: true, groei }).voor;
    assert.ok(aantal(regen, 'class="spat"') > 0, `spatjes bij groei ${groei}`);
    assert.ok(aantal(regen, 'class="druppel"') + aantal(regen, 'class="spat"') <= MAX_DEELTJES);
  }
  assert.equal(aantal(achtergrond('regen', 'p').voor, 'class="spat"'), 0);
});

test('elke achtergrond in de winkel is een scène', () => {
  assert.deepEqual(SPULLEN.filter((s) => s.plek === 'achtergrond').map((s) => s.id), SCENES);
});

test('scènes zijn bij hetzelfde zaad steeds gelijk', () => {
  for (const soort of SCENES) assert.deepEqual(achtergrond(soort, 'p'), achtergrond(soort, 'p'));
});
