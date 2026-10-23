import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tijdInWoorden, dagdeel } from '../de-wiebels/frontend/js/klok.js';

const WOORDEN = ['twaalf', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien'];
// lastIndexOf: als minutenaantal betekent 'twaalf' 12, niet 0.
const getal = (w) => WOORDEN.lastIndexOf(w);

// Onafhankelijke terugvertaling: woorden → minuten na twaalf uur (0–719).
function terugNaarMinuten(tekst) {
  const d = tekst.split(' ');
  const uur = (w) => getal(w) % 12;
  if (d.length === 2 && d[1] === 'uur') return uur(d[0]) * 60;
  if (d[0] === 'half') return (uur(d[1]) * 60 - 30 + 720) % 720;
  if (d[0] === 'kwart') return (uur(d[2]) * 60 + (d[1] === 'over' ? 15 : -15) + 720) % 720;
  const m = getal(d[0]);
  if (d[2] === 'half') return (uur(d[3]) * 60 - 30 + (d[1] === 'over' ? m : -m) + 720) % 720;
  return (uur(d[2]) * 60 + (d[1] === 'over' ? m : -m) + 720) % 720;
}

test('ijkpunten uit de brief en de lastige randen', () => {
  assert.equal(tijdInWoorden(3, 20), 'tien voor half vier');
  assert.equal(tijdInWoorden(7, 35), 'vijf over half acht');
  assert.equal(tijdInWoorden(11, 45), 'kwart voor twaalf');
  assert.equal(tijdInWoorden(4, 15), 'kwart over vier');
  assert.equal(tijdInWoorden(12, 0), 'twaalf uur');
  assert.equal(tijdInWoorden(0, 0), 'twaalf uur');
  assert.equal(tijdInWoorden(12, 30), 'half één');
  assert.equal(tijdInWoorden(23, 55), 'vijf voor twaalf');
  assert.equal(tijdInWoorden(19, 30), 'half acht');
  assert.equal(tijdInWoorden(8, 16), 'veertien voor half negen');
  assert.equal(tijdInWoorden(8, 44), 'veertien over half negen');
  assert.equal(tijdInWoorden(9, 1), 'één over negen');
  assert.equal(tijdInWoorden(9, 59), 'één voor tien');
});

test('alle 1440 minuten van de dag: terug te vertalen naar dezelfde tijd', () => {
  for (let uur = 0; uur < 24; uur++) {
    for (let minuut = 0; minuut < 60; minuut++) {
      const tekst = tijdInWoorden(uur, minuut);
      assert.equal(terugNaarMinuten(tekst), ((uur % 12) * 60 + minuut) % 720, `${uur}:${minuut} → ${tekst}`);
    }
  }
});

test('binnen twaalf uur heeft elke minuut een eigen omschrijving', () => {
  const teksten = new Set();
  for (let m = 0; m < 720; m++) teksten.add(tijdInWoorden(Math.floor(m / 60), m % 60));
  assert.equal(teksten.size, 720);
});

test('dagdelen', () => {
  assert.equal(dagdeel(19).woorden, "'s avonds");
  assert.equal(dagdeel(7).naam, 'ochtend');
  assert.equal(dagdeel(13).naam, 'middag');
  assert.equal(dagdeel(2).naam, 'nacht');
  assert.equal(dagdeel(0).naam, 'nacht');
});
