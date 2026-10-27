// Herbruikbare stukjes weergave voor meerdere schermen.

import { huisdierStadium } from './beloningen.js';
import { esc } from './dom.js';
import { ITEMS } from './nederland/items.js';
import { spul } from './spullen.js';
import { THEMAS } from './themas/index.js';
import { wiebelSvg } from './wiebel.js';

export function sterrenHtml(aantal, max = 3) {
  return `<span class="sterren">${'★'.repeat(aantal)}<span class="leeg">${'★'.repeat(max - aantal)}</span></span>`;
}

// De emoji-avatar: het herkenningsplaatje bij de profielkeuze en in de topbalk.
export function avatarHtml(profiel, klasse = '') {
  return `<span class="avatar ${klasse}">${profiel.avatar}</span>`;
}

// De eigen Wiebel van het profiel: kleur, groeistadium (huisdier.xp is de groeimaat) en wat hij aan
// heeft (spullen.js).
export function eigenWiebelStaat(profiel) {
  return { ...profiel.wiebel, stadium: huisdierStadium(profiel.huisdier.xp), aan: { ...profiel.cosmetica.aan } };
}

export function eigenWiebelHtml(profiel, prefix, opties) {
  return wiebelSvg(eigenWiebelStaat(profiel), prefix, opties);
}

// Een bevrijde Wiebel (wiebelVoor in beloningen.js): zijn kleur en zijn spul, als Grote Wiebel.
export function vriendjeStaat(w) {
  return { kleur: w.kleur, stadium: 2, aan: { [spul(w.spul).plek]: w.spul } };
}

// Het vak van een vriendje, met ruimte voor wat hij op zijn hoofd of in zijn hand heeft.
export const VRIENDJE_VAK = '-30 -46 300 306';

// Een bevrijde Wiebel als eigen plaatje (vierkant vak). klasse: bijvoorbeeld 'stil' of 'silhouet'.
export function vriendjeHtml(w, prefix, klasse = '') {
  return `<svg class="vriendje ${klasse}" viewBox="${VRIENDJE_VAK}" aria-hidden="true">${wiebelSvg(vriendjeStaat(w), prefix)}</svg>`;
}

export function themaKnoppen(huidig) {
  return `
    <div class="themas">
      ${Object.values(THEMAS).map((t) => `
        <button class="knop themaknop${t.id === huidig ? ' winkel-aan' : ''}" data-focus data-actie="thema" data-waarde="${t.id}"
          style="background: ${t.kleuren.vlak}; color: ${t.kleuren.tekst}">
          <span class="thema-emoji">${t.emoji}</span><span>${t.naam}</span>
        </button>`).join('')}
    </div>`;
}

const NL_ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

// De vraagvormen van Nederland (nederland/vragen.js): nl:<vorm>:<id>.
const NL_TEKST = {
  herken: (it) => `${it.naam} herkennen`,
  wijs: (it) => it.zinnen.waar.tekst,
  hoofdstad: (it) => `Hoofdstad van ${it.naam}`,
  'hoofdstad-wijs': (it) => `Hoofdstad van ${it.naam} aanwijzen`,
  'hoofdstad-van': (it) => it.zinnen.hoofdstadVan?.tekst,
};

// Leesbare omschrijving van een item-id, voor het overzicht van zwakke plekken.
export function itemTekst(id) {
  const [soort, a, b, c] = id.split(':');
  if (soort === 'nl') return (NL_ITEM[b] && NL_TEKST[a]?.(NL_ITEM[b])) || id;
  if (soort === 'keer') return a.replace('x', ' × ');
  if (soort === 'delen') return `${a} : ${b}`;
  if (soort === 'plus') return a.replace('+', ' + ');
  if (soort === 'min') return a.replace('-', ' − ');
  if (soort === 'klok') return `🕒 ${b}:${String(c).padStart(2, '0')}`;
  return id;
}

export function totaalSterren(profiel) {
  return Object.values(profiel.sterren).reduce((som, n) => som + n, 0);
}

export function topbalk(profiel) {
  return `
    <div class="topbalk">
      ${avatarHtml(profiel, 'avatar-klein')}
      <span class="topnaam">${esc(profiel.naam)}</span>
      <span class="teller">⭐ ${totaalSterren(profiel)}</span>
      <span class="teller">🪙 ${profiel.munten}</span>
    </div>
  `;
}
