// Een gevangen Wiebel in een bel (bij de eindbaas en in het verhaal aan het begin). Zolang hij
// gevangen zit, staat hij stil en zweeft de bel zacht op en neer; laatVrij() laat de bel knappen,
// waarna de Wiebel blij opspringt en weer beweegt (css/wiebel.css).

import { vriendjeStaat } from './weergave.js';
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
