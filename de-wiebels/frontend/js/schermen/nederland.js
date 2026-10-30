// De wereld Nederland: links de inkleurkaart met de provincies, rechts de onderdelen Provincies,
// Hoofdsteden en Plaatsen. Voor Plaatsen kies je een provincie op de kaart of "Alle provincies".
// Onder Provincies en Hoofdsteden zit Tulpje in zijn bel tot beide toetsen hem bevrijden.

import { bijKnopHtml } from '../bel.js';
import { wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { maakKaartbediening } from '../nederland/bediening.js';
import { PER_ID, PROVINCIES, kaartSvg } from '../nederland/kaartbeeld.js';
import { NEDERLAND, inkleuring, sterId } from '../nederland/wereld.js';
import { NL_WIEBEL } from '../nederland/wiebels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { sterrenHtml, topbalk } from '../weergave.js';

// Maat van het kaartvak in px (css/nederland.css).
export const OVERZICHT_MAAT = [680, 840];

const ONDERDELEN = [
  { id: 'provincies', naam: 'Provincies' },
  { id: 'hoofdsteden', naam: 'Hoofdsteden' },
];

export const nederland = {
  maak({ toon, terug, zetFocus }) {
    const el = maakEl();
    el.classList.add('nl-scherm');
    let bediening;
    let laatste = null;
    // De knop waarmee een ronde begon: daar staat de focus weer na afloop (de ronde zet bij het
    // opbouwen de focus al voordat hij zichtbaar is, dus .heeft-focus is dan weg).
    let gestart = null;

    function teken() {
      const p = staat.profiel;
      const [breedte, hoogte] = OVERZICHT_MAAT;
      el.innerHTML = `
        ${themaAchtergrond(p.thema, 'nederland', 'ab-nl')}
        ${topbalk(p)}
        <div class="nl-indeling">
          <div class="kaartvak" data-focus aria-label="Kaart van Nederland">
            ${kaartSvg({ doelen: PROVINCIES, kleuren: inkleuring(p, PROVINCIES), breedte, hoogte })}
          </div>
          <div class="nl-kolom">
            <div class="kopregel">
              <button class="knop" data-focus data-actie="terug">← Terug</button>
              <h1>${NEDERLAND.emoji} ${NEDERLAND.naam}<span class="kop-ondertitel">${NEDERLAND.ondertitel}</span></h1>
            </div>
            <div class="nl-naam" aria-live="polite"></div>
            ${ONDERDELEN.map((o) => `
              <div class="nl-onderdeel">
                <span class="nl-onderdeel-naam">${o.naam}</span>
                ${sterrenHtml(Math.min(3, p.sterren[sterId(o.id, 'alle', true)] || 0))}
                <button class="knop" data-focus data-actie="oefen" data-waarde="${o.id}">Oefenen</button>
                <button class="knop" data-focus data-actie="toets" data-waarde="${o.id}">Toets</button>
              </div>`).join('')}
            <div class="nl-tulpje">
              ${bijKnopHtml(wiebelVoor(NL_WIEBEL, thema(p.thema)), p.verzameling.includes(NL_WIEBEL), 'Bevrijd Tulpje! Haal beide toetsen.', 'nl-bel-tulpje')}
            </div>
            <div class="nl-onderdeel nl-plaatsen">
              <span class="nl-onderdeel-naam">Plaatsen</span>
              <span class="klein">Kies een provincie op de kaart</span>
              <button class="knop" data-focus data-actie="alle">Alle provincies</button>
            </div>
          </div>
        </div>
      `;
      bediening = maakKaartbediening(el.querySelector('.kaartvak'), {
        doelen: PROVINCIES,
        begin: laatste ?? 'pv-utrecht',
        opFocus(id) {
          laatste = id;
          el.querySelector('.nl-naam').textContent = PER_ID[id].naam;
        },
        opKies: (id) => toon('nederlandProvincie', { provincie: id }),
      });
    }

    opKlik(el, {
      terug: () => terug(),
      alle: () => toon('nederlandProvincie', { provincie: null }),
      oefen(onderdeel, knop) {
        gestart = knop;
        toon('ronde', { levelId: sterId(onderdeel, 'alle') });
      },
      toets(onderdeel, knop) {
        gestart = knop;
        toon('ronde', { levelId: sterId(onderdeel, 'alle', true) });
      },
    });

    // Een vaste volgorde: Terug → Provincies → Hoofdsteden → Alle provincies, en ← naar de kaart.
    // Van de kaart gaat → naar Provincies (als daar geen provincie meer ligt); de andere randen van
    // de kaart houden de focus op de kaart. Oefenen ↔ Toets gaat via de gewone focus.
    const NAAR = {
      terug: { omlaag: 'oefen:provincies', links: 'kaart' },
      'oefen:provincies': { omhoog: 'terug', omlaag: 'oefen:hoofdsteden', links: 'kaart' },
      'toets:provincies': { omhoog: 'terug', omlaag: 'toets:hoofdsteden' },
      'oefen:hoofdsteden': { omhoog: 'oefen:provincies', omlaag: 'alle', links: 'kaart' },
      'toets:hoofdsteden': { omhoog: 'toets:provincies', omlaag: 'alle' },
      alle: { omhoog: 'oefen:hoofdsteden', links: 'kaart' },
    };
    const elVoor = (naam) => {
      if (naam === 'kaart') return el.querySelector('.kaartvak');
      const [actie, waarde] = naam.split(':');
      return el.querySelector(`[data-actie="${actie}"]${waarde ? `[data-waarde="${waarde}"]` : ''}`);
    };
    function bijToets({ actie }) {
      const focus = el.querySelector('.heeft-focus');
      if (focus?.classList.contains('kaartvak')) {
        if (bediening.toets(actie)) return true;
        if (actie === 'rechts') zetFocus(elVoor('oefen:provincies'));
        return ['links', 'rechts', 'omhoog', 'omlaag'].includes(actie);
      }
      const sleutel = focus?.dataset.waarde ? `${focus.dataset.actie}:${focus.dataset.waarde}` : focus?.dataset.actie;
      const naar = NAAR[sleutel]?.[actie];
      if (!naar) return false;
      zetFocus(elVoor(naar));
      return true;
    }

    teken();
    return {
      el,
      // Opnieuw tekenen (sterren, inkleuring), met de focus op dezelfde plek als daarvoor.
      bijTerugkomst() {
        const vorige = gestart ?? el.querySelector('.heeft-focus');
        gestart = null;
        const waarde = vorige?.dataset.waarde ? `[data-waarde="${vorige.dataset.waarde}"]` : '';
        const zoek = vorige?.classList.contains('kaartvak') ? '.kaartvak' : vorige?.dataset.actie && `[data-actie="${vorige.dataset.actie}"]${waarde}`;
        teken();
        if (zoek) zetFocus(el.querySelector(zoek));
      },
      bijFocus(doel) {
        const opKaart = doel.classList.contains('kaartvak');
        bediening.actief(opKaart);
        if (!opKaart) el.querySelector('.nl-naam').textContent = '';
      },
      bijToets,
    };
  },
};
