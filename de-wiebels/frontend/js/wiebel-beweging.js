// Reacties van de Wiebel via de Web Animations API. Ze werken op de lagen w-sprong en w-kantel en op
// de armen, zodat ze niet botsen met de rustbewegingen uit css/wiebel.css (die zitten op w-lijf).
// w is steeds het <svg class="wiebel"> uit wiebel.js. Bij prefers-reduced-motion verandert alleen
// het gezicht.

// Veer-easing: schiet iets door en komt dan tot rust.
export const VEER = 'linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50.1%, 1.015 55%, 1.017 63.9%, 1.001 85.5%, 1)';

export const rustig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Is er al een reactie bezig? Handig om rustige reacties niet over een andere heen te zetten.
export function bezig(w) {
  return [...w.querySelectorAll('.w-sprong, .w-kantel, .w-blik')].some((e) => e.getAnimations().length);
}

// Eén timer per Wiebel om het gezicht terug te zetten; een nieuwe reactie vervangt de oude.
const timers = new WeakMap();
function later(w, ms, fn) {
  clearTimeout(timers.get(w));
  timers.set(w, setTimeout(fn, ms));
}

function blijGezicht(w, ms) {
  w.dataset.ogen = 'blij';
  w.dataset.mond = 'blij';
  later(w, ms, () => {
    w.dataset.ogen = '';
    if (w.dataset.mond === 'blij') w.dataset.mond = 'rust';
  });
}

// Tekens (emoji) die bij de Wiebel opstijgen en vervagen; gebied in de coördinaten van de Wiebel.
function deeltjes(w, tekens, gebied) {
  tekens.forEach((teken, i) => {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.textContent = teken;
    t.setAttribute('x', gebied.x + Math.random() * gebied.b);
    t.setAttribute('y', gebied.y + Math.random() * gebied.h);
    t.setAttribute('font-size', 22);
    t.style.transformBox = 'fill-box';
    t.style.transformOrigin = 'center';
    t.style.opacity = 0;
    w.append(t);
    t.animate([
      { transform: 'translate(0, 0) scale(.2)', opacity: 0 },
      { transform: `translate(${(Math.random() - 0.5) * 30}px, -12px) scale(1)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${(Math.random() - 0.5) * 60}px, -34px) scale(.6)`, opacity: 0 },
    ], { duration: 1000, delay: i * 90, easing: 'ease-out' }).onfinish = () => t.remove();
  });
}

// Sprongetje met inveren en landen; de schaduw krimpt mee.
export function hop(w, keer = 1) {
  w.querySelector('.w-sprong').animate([
    { transform: 'translateY(0) scale(1, 1)' },
    { transform: 'translateY(0) scale(1.14, .84)', offset: 0.15 },
    { transform: 'translateY(-62px) scale(.9, 1.12)', offset: 0.42 },
    { transform: 'translateY(0) scale(1.12, .88)', offset: 0.72 },
    { transform: 'translateY(0) scale(1, 1)' },
  ], { duration: 620, iterations: keer, easing: 'ease-in-out' });
  w.querySelector('.w-schaduw').animate([
    { transform: 'scale(1)' }, { transform: 'scale(1.1)', offset: 0.15 }, { transform: 'scale(.6)', offset: 0.42 },
    { transform: 'scale(1.1)', offset: 0.72 }, { transform: 'scale(1)' },
  ], { duration: 620, iterations: keer, easing: 'ease-in-out' });
}

// Blij: twee sprongetjes, armen omhoog en sterretjes.
export function blij(w) {
  blijGezicht(w, 1400);
  if (rustig()) return;
  hop(w, 2);
  const omhoog = (graden) => [
    { transform: 'rotate(0deg)' }, { transform: `rotate(${graden}deg)`, offset: 0.25 }, { transform: `rotate(${graden * 0.78}deg)`, offset: 0.45 },
    { transform: `rotate(${graden}deg)`, offset: 0.65 }, { transform: 'rotate(0deg)' },
  ];
  const volleHand = !!w.querySelector('[data-plek="hand"] *');
  w.querySelector('.w-arm-basis.l').animate(omhoog(105), { duration: 1300, easing: 'ease-in-out' });
  w.querySelector('.w-arm-basis.r').animate(omhoog(volleHand ? -10 : -105), { duration: 1300, easing: 'ease-in-out' });
  deeltjes(w, ['⭐', '✨', '⭐', '✨', '⭐', '✨'], { x: 30, y: 26, b: 180, h: 90 });
}

// Zwaaien: rechterarm veert omhoog en zwaait heen en weer, het lijf leunt een beetje mee.
export function zwaai(w) {
  blijGezicht(w, 1800);
  if (rustig()) return;
  w.querySelector('.w-arm-basis.r').animate([
    { transform: 'rotate(0deg)', easing: VEER },
    { transform: 'rotate(-125deg)', offset: 0.25 },
    { transform: 'rotate(-95deg)', offset: 0.4 },
    { transform: 'rotate(-125deg)', offset: 0.55 },
    { transform: 'rotate(-95deg)', offset: 0.7 },
    { transform: 'rotate(-120deg)', offset: 0.82, easing: 'ease-in' },
    { transform: 'rotate(0deg)' },
  ], { duration: 1800 });
  w.querySelector('.w-kantel').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-4deg)', offset: 0.25 },
    { transform: 'rotate(-4deg)', offset: 0.82 }, { transform: 'rotate(0deg)' },
  ], { duration: 1800, easing: 'ease-in-out' });
}

// Bijna: rustig het hoofd scheef, twee knikjes en even naar beneden kijken; daarna veert hij terug.
export function bijna(w) {
  if (rustig()) return;
  w.querySelector('.w-kantel').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-9deg)', offset: 0.3 },
    { transform: 'rotate(-9deg)', offset: 0.6, easing: VEER }, { transform: 'rotate(0deg)' },
  ], { duration: 1600, easing: 'ease-out' });
  w.querySelector('.w-sprong').animate([
    { transform: 'translateY(0)' }, { transform: 'translateY(6px)', offset: 0.2 }, { transform: 'translateY(0)', offset: 0.35 },
    { transform: 'translateY(6px)', offset: 0.5 }, { transform: 'translateY(0)', offset: 0.65 }, { transform: 'translateY(0)' },
  ], { duration: 1600, easing: 'ease-in-out' });
  w.querySelector('.w-blik').animate([
    { transform: 'translate(0, 0)' }, { transform: 'translate(0, 5px)', offset: 0.2 },
    { transform: 'translate(0, 5px)', offset: 0.6 }, { transform: 'translate(0, 0)', offset: 0.75 }, { transform: 'translate(0, 0)' },
  ], { duration: 1600 });
}

// Praten: de tekst verschijnt letter voor letter in de .bubbel van het venster, en de mond van elke
// Wiebel in het venster gaat open op klinkers, half op medeklinkers en dicht op spaties.
// Geeft praat(tekst) terug; praat.stop() breekt af. blijftStaan: de ballon blijft na afloop zichtbaar.
export function maakSpreker(venster, blijftStaan = false) {
  let beurt = 0;
  function praat(tekst) {
    const mijn = ++beurt;
    const wiebels = [...venster.querySelectorAll('.wiebel')];
    const monden = wiebels.map((w) => w.querySelector('.w-mond-open'));
    const bubbel = venster.querySelector('.bubbel');
    const zetMond = (open) => monden.forEach((m) => { m.style.transform = `scaleY(${open})`; });
    const klaar = () => {
      wiebels.forEach((w) => { w.dataset.mond = 'rust'; });
      if (!blijftStaan) setTimeout(() => { if (mijn === beurt) bubbel.hidden = true; }, 1800);
    };
    bubbel.hidden = false;
    if (rustig()) {
      bubbel.textContent = tekst;
      klaar();
      return;
    }
    bubbel.textContent = '';
    wiebels.forEach((w) => { w.dataset.mond = 'open'; });
    let i = 0;
    (function stap() {
      if (mijn !== beurt) return;
      if (i < tekst.length) {
        const c = tekst[i].toLowerCase();
        zetMond('aeiouyë'.includes(c) ? 0.85 + Math.random() * 0.15 : /[a-z]/.test(c) ? 0.35 + Math.random() * 0.25 : 0.08);
        bubbel.textContent = tekst.slice(0, ++i);
        setTimeout(stap, 58);
        return;
      }
      zetMond(0.1);
      klaar();
    })();
  }
  praat.stop = () => { beurt++; };
  return praat;
}
