// Kleine hulpfuncties voor het opbouwen van schermen.

export function esc(tekst) {
  return String(tekst).replace(/[&<>"']/g, (t) => `&#${t.charCodeAt(0)};`);
}

export function maakEl(inhoud = '', tag = 'section') {
  const el = document.createElement(tag);
  el.innerHTML = inhoud;
  return el;
}

// Klikken (ook via OK) op elementen met data-actie doorsturen naar de juiste functie.
export function opKlik(el, acties) {
  el.addEventListener('click', (e) => {
    const knop = e.target.closest('[data-actie]');
    if (!knop || !el.contains(knop) || knop.disabled) return;
    acties[knop.dataset.actie]?.(knop.dataset.waarde, knop);
  });
}
