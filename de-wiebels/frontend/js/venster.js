// Het venster met de eigen Wiebel in zijn scène (hoofdmenu, Aanpassen, winkeltje): achtergrond,
// spullen, spreekballon en reacties op het weer. Plus de plaatjes in de kaartjes.

import { achtergrond } from './scene.js';
import { PLEKKEN, combinatie, spul } from './spullen.js';
import { GROEI, KLEUREN, wiebelSvg } from './wiebel.js';
import { bezig, maakSpreker, ril, rustig, schud, tevreden } from './wiebel-beweging.js';
import { willekeurigeZin } from './zinnen.js';

// Uitsneden van de scène, met ruimte boven de Wiebel zodat de spreekballon niet over een paraplu
// of pet valt. menu: venster van 720×560; groot: 760×800, met onderin plek voor de koopknop.
export const UITSNEDE = { menu: '-48 -100 496 386', groot: '-24 -92 448 471' };

// De hele scène: achtergrond, het spul ernaast, de Wiebel (op 80,34) en wat ervoor valt.
// staat = { kleur, stadium, aan }.
export function sceneSvg(staat, prefix, { uitsnede = UITSNEDE.menu, stil = false } = {}) {
  const aan = staat.aan ?? {};
  const groei = GROEI[staat.stadium] ?? 1;
  const bg = achtergrond(aan.achtergrond, prefix, {
    stil,
    paraplu: Boolean(spul(aan.hand)?.dak),
    groei,
    schaduw: combinatie(aan) === 'schaduw',
  });
  const naast = spul(aan.naast);
  return `<svg class="scene${stil ? ' stil' : ''}" viewBox="${uitsnede}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${bg.achter}${naast?.plek === 'naast' ? naast.teken(prefix) : ''}${wiebelSvg(staat, prefix, { x: 80, y: 34 })}${bg.voor}
  </svg>`;
}

// Hoe de Wiebel reageert op een combinatie (zie combinatie() in spullen.js).
export const REACTIE = { nat: schud, koud: ril, droog: tevreden, warm: tevreden, schaduw: tevreden };

export const VENSTER_HTML = '<div class="venster-binnen"><div class="scene-houder"></div><span class="bubbel" hidden></span></div>';

// binnen: het element .venster-binnen (zie VENSTER_HTML).
export function maakVenster(binnen, prefix, { uitsnede = UITSNEDE.menu, blijftStaan = false } = {}) {
  const houder = binnen.querySelector('.scene-houder');
  const praat = maakSpreker(binnen, blijftStaan);
  let getoond = {};

  function teken(staat) {
    praat.stop();
    getoond = staat;
    houder.innerHTML = sceneSvg(staat, prefix, { uitsnede, stil: rustig() });
  }

  const wiebel = () => houder.querySelector('.wiebel');
  const vrij = (w) => w && !binnen.closest('[hidden]') && w.style.visibility !== 'hidden' && !bezig(w) && w.dataset.mond !== 'open';

  // Reageren op de combinatie die nu getoond wordt (als hij niet al iets anders doet).
  function reageer() {
    const w = wiebel();
    if (vrij(w)) REACTIE[combinatie(getoond.aan)]?.(w);
  }

  // Elke paar seconden reageert de Wiebel op het weer om hem heen; stopt als het venster weg is.
  const timer = setInterval(() => {
    if (!binnen.isConnected) clearInterval(timer);
    else reageer();
  }, 5000);

  return { teken, wiebel, praat, reageer, zeg: (gebeurtenis) => praat(willekeurigeZin(gebeurtenis).tekst) };
}

// Tabs per plek (Aanpassen en winkeltje); de actieve tab is geel.
export function tabsHtml(plekken, actief) {
  return plekken.map((p) => `<button class="knop tab${p.id === actief ? ' actief' : ''}" data-focus data-actie="tab" data-waarde="${p.id}" aria-label="${p.titel}">${p.emoji}</button>`).join('');
}

// De kaartjes scrollen mee met de focus, zodat het gekozen kaartje helemaal te zien is.
export function houInBeeld(bak, doel) {
  if (!bak.contains(doel)) return;
  const marge = 24;
  const boven = doel.offsetTop - marge;
  const onder = doel.offsetTop + doel.offsetHeight + marge;
  if (boven < bak.scrollTop) bak.scrollTop = boven;
  else if (onder > bak.scrollTop + bak.clientHeight) bak.scrollTop = onder - bak.clientHeight;
}

// Plaatje voor een kaartje (stil, om de tv te sparen): een kleur, een spul op de Wiebel (ingezoomd
// op de plek), een achtergrond, iets ernaast, of 'niets' en 'meer' (naar de winkel).
export function kaartBeeld(id, prefix, kleur) {
  if (id === 'niets') return '<span class="kaart-emoji">🚫</span>';
  if (id === 'meer') return '<span class="kaart-emoji">🛒</span>';
  const svg = (viewBox, inhoud, extra = '') => `<svg class="kaart-beeld stil" viewBox="${viewBox}"${extra} aria-hidden="true">${inhoud}</svg>`;
  if (KLEUREN[id]) return svg('30 24 180 222', wiebelSvg({ kleur: id }, `${prefix}-${id}`));
  const s = spul(id);
  if (s.plek === 'achtergrond') {
    const bg = achtergrond(id, `${prefix}-${id}`, { stil: true });
    return svg('-20 -60 440 360', bg.achter + bg.voor, ' preserveAspectRatio="xMidYMid slice"');
  }
  if (s.plek === 'naast') return s.emoji ? `<span class="kaart-emoji">${s.emoji}</span>` : svg('-6 190 100 100', s.teken(`${prefix}-${id}`));
  const plek = PLEKKEN.find((p) => p.id === s.plek);
  return svg(plek.beeld, wiebelSvg({ kleur, aan: { [s.plek]: id } }, `${prefix}-${id}`));
}
