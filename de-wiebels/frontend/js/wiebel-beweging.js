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

// Nat: omhoog kijken en zich dan uitschudden, met wegspattende druppels.
export function schud(w) {
  if (rustig()) return;
  w.querySelector('.w-blik').animate([
    { transform: 'translate(0, 0)' }, { transform: 'translate(0, -7px)', offset: 0.15 }, { transform: 'translate(0, -7px)', offset: 0.5 },
    { transform: 'translate(0, 0)', offset: 0.56 }, { transform: 'translate(0, 0)' },
  ], { duration: 2400 });
  w.querySelector('.w-kantel').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(0deg)', offset: 0.55 },
    { transform: 'rotate(-7deg)', offset: 0.62 }, { transform: 'rotate(7deg)', offset: 0.69 }, { transform: 'rotate(-6deg)', offset: 0.76 },
    { transform: 'rotate(6deg)', offset: 0.83 }, { transform: 'rotate(-3deg)', offset: 0.9 }, { transform: 'rotate(0deg)' },
  ], { duration: 2400 });
  setTimeout(() => deeltjes(w, ['💧', '💧', '💧', '💧'], { x: 40, y: 76, b: 160, h: 80 }), 1350);
}

// Koud: rillen.
export function ril(w) {
  if (rustig()) return;
  w.querySelector('.w-sprong').animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(-3px)' },
    { transform: 'translateX(3px)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' },
  ], { duration: 700, iterations: 2 });
}

// Tevreden: even blije ogen, zonder het praten te onderbreken.
export function tevreden(w) {
  if (w.dataset.mond === 'open') return;
  w.dataset.ogen = 'blij';
  later(w, 1500, () => { w.dataset.ogen = ''; });
}

// Goed antwoord: één sprongetje met blije ogen.
export function sprongetje(w) {
  blijGezicht(w, 900);
  if (!rustig()) hop(w);
}

// Wijzen: de rechterarm gaat omhoog naar de goede oplossing (rechtsboven) en blijft even wijzen.
export function wijs(w) {
  if (rustig()) return;
  w.querySelector('.w-arm-basis.r').animate([
    { transform: 'rotate(0deg)', easing: VEER },
    { transform: 'rotate(-118deg)', offset: 0.25 },
    { transform: 'rotate(-110deg)', offset: 0.45 },
    { transform: 'rotate(-118deg)', offset: 0.65, easing: 'ease-in' },
    { transform: 'rotate(0deg)' },
  ], { duration: 1800 });
}

// Dansen bij een combo: heen en weer kantelen op drie sprongetjes, armen om de beurt omhoog.
export function dans(w) {
  blijGezicht(w, 1900);
  if (rustig()) return;
  hop(w, 3);
  w.querySelector('.w-kantel').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-10deg)', offset: 0.17 }, { transform: 'rotate(10deg)', offset: 0.5 },
    { transform: 'rotate(-10deg)', offset: 0.83 }, { transform: 'rotate(0deg)' },
  ], { duration: 1860, easing: 'ease-in-out' });
  const zwaaiArm = (kant, graden, vertraging) => w.querySelector(`.w-arm-basis.${kant}`).animate([
    { transform: 'rotate(0deg)' }, { transform: `rotate(${graden}deg)`, offset: 0.3 }, { transform: 'rotate(0deg)', offset: 0.6 }, { transform: 'rotate(0deg)' },
  ], { duration: 1240, delay: vertraging, easing: 'ease-in-out' });
  zwaaiArm('l', 110, 0);
  zwaaiArm('r', -110, 620);
  deeltjes(w, ['🎉', '✨', '⭐', '✨'], { x: 30, y: 26, b: 180, h: 90 });
}

// Gooien (eindbaas): de rechterarm zwaait naar achteren en dan omhoog naar voren. LOSLATEN is het
// moment (ms) waarop de arm vooraan is en het gegooide kan wegvliegen.
export const LOSLATEN = 220;
export function gooi(w) {
  blijGezicht(w, 900);
  if (rustig()) return;
  w.querySelector('.w-arm-basis.r').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(40deg)', offset: 0.3 },
    { transform: 'rotate(-140deg)', offset: 0.5 }, { transform: 'rotate(-120deg)', offset: 0.7 }, { transform: 'rotate(0deg)' },
  ], { duration: LOSLATEN * 2.4, easing: 'ease-out' });
  w.querySelector('.w-kantel').animate([
    { transform: 'rotate(0deg)' }, { transform: 'rotate(-5deg)', offset: 0.3 }, { transform: 'rotate(6deg)', offset: 0.55 }, { transform: 'rotate(0deg)' },
  ], { duration: LOSLATEN * 2.4, easing: 'ease-out' });
}
