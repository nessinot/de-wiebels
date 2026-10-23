// Vuurwerk bij een combo: deeltjes die alleen via CSS-transforms bewegen.

const KLEUREN = ['#ffd23f', '#ff5c5c', '#5ee07a', '#4da3ff', '#ff8cf0'];
const DEELTJES = 28;
const DUUR = 1300;

export function vuurwerk(container, x = 960, y = 400) {
  const laag = document.createElement('div');
  laag.className = 'vuurwerk';
  laag.style.left = `${x}px`;
  laag.style.top = `${y}px`;
  for (let i = 0; i < DEELTJES; i++) {
    const hoek = (i / DEELTJES) * Math.PI * 2;
    const afstand = 220 + Math.random() * 200;
    const deeltje = document.createElement('span');
    deeltje.style.setProperty('--dx', `${Math.cos(hoek) * afstand}px`);
    deeltje.style.setProperty('--dy', `${Math.sin(hoek) * afstand}px`);
    deeltje.style.background = KLEUREN[i % KLEUREN.length];
    laag.append(deeltje);
  }
  container.append(laag);
  setTimeout(() => laag.remove(), DUUR);
}
