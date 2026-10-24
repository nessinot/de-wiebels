// Iets dat in een boog over het scherm vliegt: munten naar de teller, een ster naar de eindbaas.
// Alleen transform en opacity; bij prefers-reduced-motion vliegt er niets en is het meteen klaar.

import { rustig } from './wiebel-beweging.js';

// Midden van een element in de coördinaten van het scherm (1920×1080, ook als het podium geschaald is).
function midden(el, basis, schaal) {
  const r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - basis.left) / schaal, y: (r.top + r.height / 2 - basis.top) / schaal };
}

// scherm: het .scherm waarin het vliegt; teken: tekst of emoji; van en naar: elementen.
// Geeft een Promise die klaar is bij aankomst.
export function vliegNaar(scherm, teken, van, naar, { duur = 650, vertraging = 0, boog = 140, draai = 0, grootte = 72 } = {}) {
  if (rustig() || !scherm.isConnected) return Promise.resolve();
  const basis = scherm.getBoundingClientRect();
  const schaal = basis.width / 1920;
  const a = midden(van, basis, schaal);
  const b = midden(naar, basis, schaal);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const vlieger = document.createElement('span');
  vlieger.className = 'vlieger-teken';
  vlieger.textContent = teken;
  Object.assign(vlieger.style, {
    left: `${a.x - grootte / 2}px`, top: `${a.y - grootte / 2}px`, fontSize: `${grootte}px`, width: `${grootte}px`, height: `${grootte}px`,
  });
  scherm.append(vlieger);
  return new Promise((klaar) => {
    vlieger.animate([
      { transform: 'translate(0, 0) scale(.5) rotate(0deg)', opacity: 0 },
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1, offset: 0.08 },
      { transform: `translate(${dx / 2}px, ${dy / 2 - boog}px) scale(1.1) rotate(${draai / 2}deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.7) rotate(${draai}deg)`, opacity: 1 },
    ], { duration: duur, delay: vertraging, easing: 'ease-in-out', fill: 'backwards' }).onfinish = () => {
      vlieger.remove();
      klaar();
    };
  });
}
