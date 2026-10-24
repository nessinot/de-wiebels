import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KLEUREN, ROMP, wiebelSvg } from '../de-wiebels/frontend/js/wiebel.js';
import { MAX_DEELTJES, SCENES, achtergrond, rng } from '../de-wiebels/frontend/js/scene.js';

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

test('wiebelSvg bevat alle onderdelen en lege ankerplekken', () => {
  const svg = wiebelSvg({ kleur: 'groen' }, 'a');
  for (const deel of ONDERDELEN) assert.ok(svg.includes(`class="${deel}`), deel);
  for (const plek of PLEKKEN) assert.ok(svg.includes(`<g class="w-plek" data-plek="${plek}"></g>`), plek);
  assert.equal(aantal(svg, 'class="w-voet"'), 2);
  assert.ok(svg.includes(ROMP));
  assert.ok(svg.includes(KLEUREN.groen.lijf));
  assert.ok(svg.includes('viewBox="0 0 240 260"'));
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
  const bewegend = (s) => {
    const t = s.achter + s.voor;
    return aantal(t, 'class="twinkel"') + aantal(t, 'class="druppel"') + aantal(t, 'class="vlok"');
  };
  assert.deepEqual(SCENES, ['sterren', 'regen', 'sneeuw']);
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

test('scènes zijn bij hetzelfde zaad steeds gelijk', () => {
  for (const soort of SCENES) assert.deepEqual(achtergrond(soort, 'p'), achtergrond(soort, 'p'));
});
