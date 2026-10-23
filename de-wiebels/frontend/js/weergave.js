// Herbruikbare stukjes weergave voor meerdere schermen.

import { huisdierStadium } from './beloningen.js';
import { actief } from './cosmetica.js';
import { esc } from './dom.js';

export function sterrenHtml(aantal, max = 3) {
  return `<span class="sterren">${'★'.repeat(aantal)}<span class="leeg">${'★'.repeat(max - aantal)}</span></span>`;
}

// Avatar met de gekozen cosmetica: gekleurde rand, hoedje en decoratie.
export function avatarHtml(profiel, klasse = '') {
  const kleur = actief(profiel, 'kleur');
  const hoed = actief(profiel, 'hoed');
  const deco = actief(profiel, 'deco');
  return `
    <span class="avatar ${klasse}">
      ${kleur ? `<span class="avatar-rand" style="background: ${kleur.kleur}"></span>` : ''}
      <span class="avatar-gezicht">${profiel.avatar}</span>
      ${hoed ? `<span class="avatar-hoed">${hoed.emoji}</span>` : ''}
      ${deco ? `<span class="avatar-deco">${deco.emoji}</span>` : ''}
    </span>`;
}

export function huisdierHtml(profiel, thema) {
  const stadium = thema.huisdier[huisdierStadium(profiel.huisdier.xp)];
  const deco = actief(profiel, 'deco');
  return `<span class="huisdier">${stadium.emoji}${deco ? `<span class="avatar-deco">${deco.emoji}</span>` : ''}</span>`;
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
