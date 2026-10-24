import { test } from 'node:test';
import assert from 'node:assert/strict';
import { samenvoegen, leesInstellingen, synchroniseer } from '../de-wiebels/frontend/js/sync.js';
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

test('nieuwe profielen van de ouderpagina komen op de tv', () => {
  const uitslag = samenvoegen({}, [p('a', '2026-10-20T10:00:00Z')], []);
  assert.deepEqual(Object.keys(uitslag.lokaal), ['a']);
  assert.deepEqual(uitslag.upload, []);
});

test('een profiel dat de server niet kent, blijft lokaal maar gaat niet naar de server', () => {
  const uitslag = samenvoegen({ los: p('los', '2026-10-20T10:00:00Z') }, [], []);
  assert.deepEqual(Object.keys(uitslag.lokaal), ['los']);
  assert.deepEqual(uitslag.upload, []);
});

test('verwijderde profielen verdwijnen van de tv en komen niet terug', () => {
  const lokaal = { weg: p('weg', '2026-10-21T10:00:00Z'), blijft: p('blijft', '2026-10-20T10:00:00Z') };
  const uitslag = samenvoegen(lokaal, [p('blijft', '2026-10-20T10:00:00Z')], ['weg', 'al-weg']);
  assert.deepEqual(Object.keys(uitslag.lokaal), ['blijft']);
  assert.deepEqual(uitslag.upload, []);
});

test('gelijke versies hoeven niet opnieuw geüpload', () => {
  const x = p('a', '2026-10-20T10:00:00Z');
  assert.deepEqual(samenvoegen({ a: x }, [x], []).upload, []);
});

test('instellingen: alleen geluid, stem en muziek, de rest standaard aan', () => {
  assert.deepEqual(leesInstellingen({ muziek: false, pin: '1234', stem: 'nee' }), { geluid: true, stem: true, muziek: false });
  assert.deepEqual(leesInstellingen(null), { geluid: true, stem: true, muziek: true });
});

function nepServer(antwoorden, verzoeken = []) {
  return async (pad, opties = {}) => {
    verzoeken.push(`${opties.method ?? 'GET'} ${pad}`);
    const inhoud = antwoorden[pad];
    if (inhoud === undefined) return { ok: false, status: 404, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => inhoud };
  };
}

test('synchroniseren haalt profielen, verwijderde profielen en instellingen op', async (t) => {
  const opslag = nepOpslag();
  opslag.zetProfielenPerId({ weg: p('weg', '2026-10-21T10:00:00Z'), a: p('a', '2026-10-22T10:00:00Z', { munten: 9 }) });
  const verzoeken = [];
  t.mock.method(globalThis, 'fetch', nepServer({
    'api/profielen': [p('a', '2026-10-20T10:00:00Z', { munten: 1 }), p('b', '2026-10-20T10:00:00Z')],
    'api/verwijderd': ['weg'],
    'api/instellingen': { geluid: true, stem: false, muziek: false },
    'api/profielen/a': {},
  }, verzoeken));
  assert.equal(await synchroniseer(opslag), true);
  assert.deepEqual(Object.keys(opslag.profielenPerId()).sort(), ['a', 'b']);
  assert.equal(opslag.profielenPerId().b.wiebelGekozen, true, 'aangevuld');
  assert.deepEqual(opslag.instellingen(), { geluid: true, stem: false, muziek: false });
  assert.ok(verzoeken.includes('PUT api/profielen/a'), 'nieuwere voortgang gaat naar de server');
});

test('zonder verbinding blijft de laatst bekende stand staan', async (t) => {
  const opslag = nepOpslag();
  opslag.zetProfielenPerId({ a: p('a', '2026-10-22T10:00:00Z') });
  opslag.bewaarInstellingen({ geluid: true, stem: true, muziek: false });
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('geen netwerk'); });
  assert.equal(await synchroniseer(opslag), false);
  assert.deepEqual(Object.keys(opslag.profielenPerId()), ['a']);
  assert.equal(opslag.instellingen().muziek, false);
});

test('een weigering van de server houdt de synchronisatie niet tegen', async (t) => {
  const opslag = nepOpslag();
  opslag.zetProfielenPerId({ a: p('a', '2026-10-22T10:00:00Z') });
  t.mock.method(globalThis, 'fetch', nepServer({
    'api/profielen': [p('a', '2026-10-20T10:00:00Z')],
    'api/verwijderd': [],
    'api/instellingen': {},
  }));
  assert.equal(await synchroniseer(opslag), true);
});
