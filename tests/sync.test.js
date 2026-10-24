import { test } from 'node:test';
import assert from 'node:assert/strict';
import { samenvoegen, maakExport, leesImport } from '../de-wiebels/frontend/js/sync.js';
import { maakOpslag } from '../de-wiebels/frontend/js/opslag.js';

const p = (id, bijgewerkt, extra = {}) => ({ id, bijgewerkt, aangemaakt: '2026-01-01T00:00:00Z', ...extra });

function nepOpslag() {
  const data = new Map();
  return maakOpslag(() => ({ getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) }));
}

test('nieuwste versie wint, in beide richtingen', () => {
  const lokaal = { a: p('a', '2026-10-20T10:00:00Z', { munten: 5 }), b: p('b', '2026-10-20T08:00:00Z', { munten: 1 }) };
  const server = [p('a', '2026-10-20T09:00:00Z', { munten: 3 }), p('b', '2026-10-20T09:00:00Z', { munten: 2 })];
  const uitslag = samenvoegen(lokaal, server, []);
  assert.equal(uitslag.lokaal.a.munten, 5);
  assert.equal(uitslag.lokaal.b.munten, 2);
  assert.deepEqual(uitslag.upload.map((x) => x.id), ['a']);
});

test('na het wissen van de cache komen profielen terug van de server', () => {
  const uitslag = samenvoegen({}, [p('a', '2026-10-20T10:00:00Z')], []);
  assert.deepEqual(Object.keys(uitslag.lokaal), ['a']);
  assert.deepEqual(uitslag.upload, []);
});

test('offline gemaakte profielen gaan naar de server', () => {
  const uitslag = samenvoegen({ nieuw: p('nieuw', '2026-10-20T10:00:00Z') }, [], []);
  assert.deepEqual(uitslag.upload.map((x) => x.id), ['nieuw']);
});

test('verwijderde profielen komen niet terug en worden op de server verwijderd', () => {
  const uitslag = samenvoegen({}, [p('weg', '2026-10-20T10:00:00Z')], ['weg', 'al-weg']);
  assert.deepEqual(uitslag.lokaal, {});
  assert.deepEqual(uitslag.verwijder, ['weg']);
});

test('gelijke versies hoeven niet opnieuw geüpload', () => {
  const x = p('a', '2026-10-20T10:00:00Z');
  assert.deepEqual(samenvoegen({ a: x }, [x], []).upload, []);
});

test('export en import: alles komt terug, ook de instellingen', () => {
  const bron = nepOpslag();
  bron.bewaarProfiel(p('a', '', { naam: 'Speler 1' }));
  bron.bewaarInstellingen({ geluid: false, pin: '4321' });
  const tekst = JSON.stringify(maakExport(bron));

  const doel = nepOpslag();
  assert.deepEqual(leesImport(tekst, doel), { ok: true, aantal: 1 });
  assert.equal(doel.alleProfielen()[0].naam, 'Speler 1');
  assert.equal(doel.instellingen().pin, '4321');
  assert.deepEqual(doel.profielenPerId().a.wiebel, { kleur: 'paars' }, 'na het samenvoegen aangevuld');
});

test('import weigert vreemde bestanden', () => {
  const doel = nepOpslag();
  assert.equal(leesImport('{kapot', doel).ok, false);
  assert.equal(leesImport('{"app":"iets"}', doel).ok, false);
});
