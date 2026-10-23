// Herbruikbare stukjes weergave voor meerdere schermen.

import { esc } from './dom.js';

export function sterrenHtml(aantal, max = 3) {
  return `<span class="sterren">${'★'.repeat(aantal)}<span class="leeg">${'★'.repeat(max - aantal)}</span></span>`;
}

export function avatarHtml(profiel, klasse = '') {
  return `<span class="avatar ${klasse}">${profiel.avatar}</span>`;
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
