import { kiesVolgende } from './focus.js';
import { actieVoorToets } from './toetsen.js';
import { schermen } from './schermen/index.js';

const podium = document.getElementById('podium');

// Stapel van open schermen: { naam, inst, el, focus }. Het bovenste is zichtbaar.
const stapel = [];

function actief() {
  return stapel[stapel.length - 1];
}

function schaalPodium() {
  const schaal = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  podium.style.setProperty('--schaal', schaal);
}

function focusbaar() {
  return [...actief().el.querySelectorAll('[data-focus]')].filter(
    (el) => !el.disabled && !el.closest('[hidden]'),
  );
}

function zetFocus(el) {
  const laag = actief();
  if (!el || laag.focus === el) return;
  laag.focus?.classList.remove('heeft-focus');
  laag.focus = el;
  el.classList.add('heeft-focus');
}

// Na het opnieuw tekenen van een scherm: focus terugzetten als het element weg is.
function herstelFocus() {
  const laag = actief();
  if (laag.focus && laag.el.contains(laag.focus) && !laag.focus.disabled) return;
  laag.focus = null;
  zetFocus(focusbaar()[0]);
}

function verplaatsFocus(richting) {
  const laag = actief();
  const kandidaten = focusbaar().filter((el) => el !== laag.focus);
  if (!laag.focus) return zetFocus(kandidaten[0]);
  const i = kiesVolgende(
    laag.focus.getBoundingClientRect(),
    kandidaten.map((el) => el.getBoundingClientRect()),
    richting,
  );
  if (i >= 0) zetFocus(kandidaten[i]);
}

const ctx = { toon, terug, terugTot, zetFocus, herstelFocus };

export function toon(naam, gegevens = {}, { vervang = false } = {}) {
  if (!schermen[naam]) return;
  if (vervang && stapel.length) stapel.pop().el.remove();
  else actief()?.el.setAttribute('hidden', '');
  const inst = schermen[naam].maak({ ...ctx, gegevens });
  inst.el.classList.add('scherm');
  podium.append(inst.el);
  stapel.push({ naam, inst, el: inst.el, focus: null });
  herstelFocus();
}

function toonVorige() {
  const laag = actief();
  laag.el.removeAttribute('hidden');
  laag.inst.bijTerugkomst?.();
  herstelFocus();
}

export function terug(bron = 'toets') {
  window.dispatchEvent(new CustomEvent('wiebels:terug', { detail: { bron, buffer } }));
  if (stapel.length === 1) {
    actief().inst.bijTerugOpStart?.(bron);
    return;
  }
  stapel.pop().el.remove();
  toonVorige();
}

export function terugTot(naam) {
  while (stapel.length > 1 && actief().naam !== naam) stapel.pop().el.remove();
  toonVorige();
}

function verwerk(toets) {
  if (actief().inst.bijToets?.(toets)) return;
  if (['links', 'rechts', 'omhoog', 'omlaag'].includes(toets.actie)) verplaatsFocus(toets.actie);
  else if (toets.actie === 'ok') actief().focus?.click();
  else if (toets.actie === 'terug') terug(toets.bron);
}

window.addEventListener('keydown', (e) => {
  const toets = actieVoorToets(e.keyCode);
  if (toets?.actie !== 'terug') vulBuffer();
  if (!toets) return;
  e.preventDefault();
  verwerk({ ...toets, code: e.keyCode, bron: 'toets' });
});

// Magic Remote en muis: aanwijzen geeft focus, klikken kiest.
podium.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-focus]');
  if (el && actief().el.contains(el) && !el.disabled) zetFocus(el);
});

// Vangnet voor Terug in de tv-browser: die geeft toets 461 niet door, maar gaat terug in de
// geschiedenis. Daarom staan er extra stappen klaar. Chrome slaat stappen over die zonder
// toetsdruk zijn toegevoegd, dus aanvullen gebeurt alleen bij een toets of klik.
const BUFFER = 3;
let buffer = 0;

function vulBuffer() {
  while (buffer < BUFFER) {
    history.pushState({ wiebels: true }, '');
    buffer += 1;
  }
}

window.addEventListener('pointerdown', vulBuffer);
window.addEventListener('popstate', () => {
  buffer = Math.max(0, buffer - 1);
  verwerk({ actie: 'terug', code: null, bron: 'browser' });
});

window.addEventListener('resize', schaalPodium);
schaalPodium();
toon('profielkeuze');
