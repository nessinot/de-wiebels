// Een gevangen Wiebel in een bel (bij de eindbaas en in het verhaal aan het begin). Zolang hij
// gevangen zit, staat hij stil en zweeft de bel zacht op en neer; laatVrij() laat de bel knappen,
// waarna de Wiebel blij opspringt en weer beweegt (css/wiebel.css).

import { esc } from './dom.js';
import { vriendjeHtml, vriendjeStaat } from './weergave.js';
import { wiebelSvg } from './wiebel.js';
import { blij, rustig } from './wiebel-beweging.js';

// w: de Wiebel uit wiebelVoor (beloningen.js). De bel is groot genoeg voor wat hij vasthoudt.
export function belHtml(w, prefix) {
  return `<svg class="vangbel" viewBox="-50 -70 360 360" aria-hidden="true">
    <g class="vangbel-zweef">
      <g class="vangbel-inhoud stil">${wiebelSvg(vriendjeStaat(w), prefix)}</g>
      <g class="vangbel-glas">
        <circle cx="130" cy="110" r="170"/>
        <path class="vangbel-glans" d="M0,30 A140,140 0 0 1 90,-38"/>
      </g>
    </g>
  </svg>`;
}

// De Wiebel die je bij een knop (een toets van Nederland) kunt bevrijden: gevangen in zijn bel met een
// regeltje erbij, of na het bevrijden vrij, zonder regeltje. De maat zet elk scherm in de css.
export function bijKnopHtml(w, vrij, regel, prefix) {
  if (vrij) return `<div class="bij-knop">${vriendjeHtml(w, prefix, 'stil')}</div>`;
  return `<div class="bij-knop">${belHtml(w, prefix)}<span class="bij-knop-regel">${esc(regel)}</span></div>`;
}

// bel: het <svg class="vangbel">. Geeft de bevrijde Wiebel terug.
export function laatVrij(bel) {
  const w = bel.querySelector('.wiebel');
  const glas = bel.querySelector('.vangbel-glas');
  bel.classList.add('vrij');
  bel.querySelector('.vangbel-inhoud').classList.remove('stil');
  if (rustig()) glas.remove();
  else {
    glas.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.3)', opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' })
      .onfinish = () => glas.remove();
  }
  blij(w);
  return w;
}
