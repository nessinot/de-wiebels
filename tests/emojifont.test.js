import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FRONTEND = fileURLToPath(new URL('../de-wiebels/frontend/', import.meta.url));
const LIJST = JSON.parse(readFileSync(join(FRONTEND, 'fonts', 'emoji.json'), 'utf8'));

// Dezelfde regel als in tools/maak-emojifont.py.
const DEEL = '(?:\\p{Extended_Pictographic}\\uFE0F|\\p{Emoji_Presentation})';
const EMOJI = new RegExp(`${DEEL}(?:\\u200D${DEEL})*`, 'gu');

function bestanden(map) {
  return readdirSync(map).flatMap((naam) => {
    const pad = join(map, naam);
    return statSync(pad).isDirectory() ? bestanden(pad) : pad.endsWith('.js') ? [pad] : [];
  });
}

test('elk emoji in de frontend zit in het emojilettertype', () => {
  const bronnen = [...bestanden(join(FRONTEND, 'js')), join(FRONTEND, 'index.html')];
  const gevonden = new Set(bronnen.flatMap((pad) => readFileSync(pad, 'utf8').match(EMOJI) ?? []));
  assert.ok(gevonden.size > 50);
  // Faalt dit na het toevoegen van een emoji: draai tools/maak-emojifont.py.
  const ontbreekt = [...gevonden].filter((e) => !LIJST.includes(e));
  assert.deepEqual(ontbreekt, []);
});

test('het emojilettertype heeft geen gewone tekens', () => {
  for (const e of LIJST) assert.ok([...e].every((c) => c.codePointAt(0) > 0x7f), e);
});

test('pijltjes als tekst tellen niet als emoji', () => {
  assert.deepEqual('Verder ▶ ◀ minuten'.match(EMOJI), null);
  assert.deepEqual('☀️ ⭐ 🦖'.match(EMOJI), ['☀️', '⭐', '🦖']);
  assert.deepEqual('👨‍🚀'.match(EMOJI), ['👨‍🚀']);
});
