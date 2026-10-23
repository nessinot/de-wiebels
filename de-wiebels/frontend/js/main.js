import { kiesVolgende } from './focus.js';
import { actieVoorToets } from './toetsen.js';
import { bedieningstest } from './schermen/bedieningstest.js';
import { tweedeScherm } from './schermen/tweede-scherm.js';

const podium = document.getElementById('podium');
const schermen = { bedieningstest, tweedeScherm };

// Stapel van open schermen: { scherm, el, focus }. Het bovenste is zichtbaar.
const stapel = [];

function actief() {
  return stapel[stapel.length - 1];
}

function schaalPodium() {
  const schaal = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  podium.style.setProperty('--schaal', schaal);
}

function focusbaar() {
  return [...actief().el.querySelectorAll('[data-focus]')].filter((el) => !el.disabled);
}

function zetFocus(el) {
  const laag = actief();
  if (!el || laag.focus === el) return;
  laag.focus?.classList.remove('heeft-focus');
  laag.focus = el;
  el.classList.add('heeft-focus');
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

export function toon(naam, gegevens) {
  actief()?.el.setAttribute('hidden', '');
  const scherm = schermen[naam];
  const el = scherm.maak({ toon, terug, gegevens });
  el.classList.add('scherm');
  podium.append(el);
  stapel.push({ scherm, el, focus: null });
  zetFocus(focusbaar()[0]);
}

export function terug(bron = 'toets') {
  if (stapel.length === 1) {
    actief().scherm.bijTerugOpStart?.(bron);
    return;
  }
  stapel.pop().el.remove();
  actief().el.removeAttribute('hidden');
}

window.addEventListener('keydown', (e) => {
  const toets = actieVoorToets(e.keyCode);
  if (!toets) return;
  e.preventDefault();
  if (actief().scherm.bijToets?.({ ...toets, code: e.keyCode })) return;

  if (['links', 'rechts', 'omhoog', 'omlaag'].includes(toets.actie)) verplaatsFocus(toets.actie);
  else if (toets.actie === 'ok') actief().focus?.click();
  else if (toets.actie === 'terug') terug('toets');
});

// Magic Remote en muis: aanwijzen geeft focus, klikken kiest.
podium.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-focus]');
  if (el && actief().el.contains(el)) zetFocus(el);
});

// Vangnet: vangt de Terug van de browser op, zodat de app niet wordt verlaten.
history.pushState({ wiebels: true }, '');
window.addEventListener('popstate', () => {
  history.pushState({ wiebels: true }, '');
  terug('browser');
});

window.addEventListener('resize', schaalPodium);
schaalPodium();
toon('bedieningstest');
