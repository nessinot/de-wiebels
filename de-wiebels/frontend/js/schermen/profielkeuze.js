// Startscherm: kies je profiel. Profielen maakt een ouder aan op de ouderpagina in Home Assistant;
// zolang dit scherm zichtbaar is, kijkt het elke paar seconden of er iets is veranderd.

import { esc, maakEl, opKlik } from '../dom.js';
import { opslag, staat } from '../opslag.js';
import { synchroniseer } from '../sync.js';
import { pasThemaToe, STANDAARD_THEMA } from '../themas/index.js';
import { avatarHtml } from '../weergave.js';

const PEILEN = 5000;

export const profielkeuze = {
  maak({ toon, zetFocus, herstelFocus }) {
    const el = maakEl();
    let profielen = [];
    let verbonden = null; // null = nog onbekend
    let getekend = '';

    function inhoud() {
      if (profielen.length) {
        return `
          <p class="ondertitel">Wie gaat er spelen?</p>
          <div class="profielen">
            ${profielen.map((p) => `
              <button class="knop profielknop" data-focus data-actie="kies" data-waarde="${p.id}">
                ${avatarHtml(p, 'avatar-groot')}
                <span class="profielnaam">${esc(p.naam)}</span>
              </button>`).join('')}
          </div>`;
      }
      const melding = verbonden === false
        ? 'Geen verbinding met Home Assistant.'
        : 'Vraag je ouders om een profiel in Home Assistant aan te maken.';
      return `<p class="profiel-melding">${melding}</p>`;
    }

    // Alleen opnieuw tekenen als er echt iets anders te zien is, zodat de focus blijft staan.
    // (Bij het maken staat het scherm nog niet op het podium; de router zet dan zelf de focus.)
    function teken(focus = true) {
      profielen = opslag.alleProfielen();
      pasThemaToe(STANDAARD_THEMA);
      const html = `<h1 class="titel-groot">De Wiebels</h1>${inhoud()}`;
      if (html === getekend) return;
      const focusId = el.querySelector('.heeft-focus')?.dataset.waarde;
      el.innerHTML = getekend = html;
      if (!focus) return;
      const vorige = focusId && el.querySelector(`[data-waarde="${focusId}"]`);
      if (vorige) zetFocus(vorige);
      else herstelFocus();
    }

    opKlik(el, {
      kies(id) {
        staat.profiel = profielen.find((p) => p.id === id);
        pasThemaToe(staat.profiel.thema);
        // Een nieuw profiel kiest eerst zijn Wiebel en wereld; wie het verhaal nog niet heeft gezien
        // (intro niet afgemaakt), krijgt dat eerst.
        if (!staat.profiel.wiebelGekozen) toon('eersteStart');
        else toon(staat.profiel.introGezien ? 'wereldkaart' : 'intro');
      },
    });

    async function peil() {
      if (!el.isConnected || el.hidden) return;
      verbonden = await synchroniseer();
      if (el.isConnected && !el.hidden) teken();
    }

    teken(false);
    queueMicrotask(peil);
    setInterval(peil, PEILEN);
    return { el, bijTerugkomst: teken };
  },
};
