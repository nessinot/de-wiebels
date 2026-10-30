// Eén provincie ingezoomd (of met provincie null heel Nederland), met haar plaatsen, streken,
// eilanden en water. Je kunt alles aanwijzen en ziet de naam; rechts de knoppen Oefenen en Toets,
// elk met de sterren erbij. Bij de Toets van een provincie zit haar Wiebel in zijn bel tot hij vrij is.

import { bijKnopHtml } from '../bel.js';
import { wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { maakKaartbediening } from '../nederland/bediening.js';
import { PER_ID, doelenVoor, kaartSvg, zoomVak } from '../nederland/kaartbeeld.js';
import { sterId } from '../nederland/wereld.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { sterrenHtml, topbalk } from '../weergave.js';

// Maat van het kaartvak in px (css/nederland.css).
export const KAART_MAAT = [1000, 840];

export const nederlandProvincie = {
  maak({ toon, terug, zetFocus, gegevens }) {
    const el = maakEl();
    el.classList.add('nl-scherm', 'nl-provincie');
    const provincie = gegevens.provincie ?? null;
    const keuze = provincie ?? 'alle';
    const p = staat.profiel;
    const [breedte, hoogte] = KAART_MAAT;
    const doelen = doelenVoor(provincie, p.nederland?.uit ?? []);
    const titel = provincie ? PER_ID[provincie].naam : 'Alle provincies';
    const leeg = doelen.length ? '' : ' disabled';
    const sterren = (toets) => sterrenHtml(Math.min(3, p.sterren[sterId('plaatsen', keuze, toets)] || 0));
    // De Wiebel van de provincie (niet bij "Alle provincies"); zijn id is de plaatsen-toets.
    const wiebelId = provincie && sterId('plaatsen', provincie, true);
    const bijToetsHtml = () => {
      if (!wiebelId) return '';
      const w = wiebelVoor(wiebelId, thema(p.thema));
      return bijKnopHtml(w, p.verzameling.includes(wiebelId), `Bevrijd ${w.naam}!`, `nl-bel-${provincie}`);
    };

    el.innerHTML = `
      ${themaAchtergrond(p.thema, 'nederland', 'ab-nl')}
      ${topbalk(p)}
      <div class="nl-indeling">
        <div class="kaartvak" data-focus aria-label="Kaart van ${titel}">
          ${kaartSvg({ provincie, doelen, breedte, hoogte, stip: provincie ? 16 : 9 })}
        </div>
        <div class="nl-kolom">
          <div class="kopregel">
            <button class="knop" data-focus data-actie="terug">← Terug</button>
            <h1>${titel}</h1>
          </div>
          <div class="nl-naam" aria-live="polite"></div>
          <div class="nl-onderdeel">
            <button class="knop nl-start" data-focus data-actie="oefen"${leeg}>Oefenen</button>
            <span class="nl-sterren-oefen">${sterren(false)}</span>
          </div>
          <div class="nl-onderdeel">
            <button class="knop nl-start" data-focus data-actie="toets"${leeg}>Toets</button>
            <span class="nl-sterren-toets">${sterren(true)}</span>
            ${bijToetsHtml()}
          </div>
        </div>
      </div>
    `;

    const naam = el.querySelector('.nl-naam');
    const kaart = el.querySelector('.kaartvak');
    const knop = (actie) => el.querySelector(`[data-actie="${actie}"]`);
    const bediening = maakKaartbediening(kaart, {
      doelen,
      vak: zoomVak(provincie, breedte, hoogte),
      begin: PER_ID[provincie]?.hoofdstad,
      opFocus(id) {
        naam.textContent = PER_ID[id].naam;
      },
    });
    let gestart = null; // de knop van de laatste ronde; daar staat de focus na afloop weer

    function start(actie) {
      gestart = actie;
      toon('ronde', { levelId: sterId('plaatsen', keuze, actie === 'toets') });
    }

    opKlik(el, {
      terug: () => terug(),
      oefen: () => start('oefen'),
      toets: () => start('toets'),
    });

    // Een vaste volgorde: kaart ↔ Oefenen/Toets ↔ Terug. Van de kaart gaat → naar Oefenen (als
    // daar geen doel meer ligt); de andere randen van de kaart houden de focus op de kaart.
    // Oefenen staat boven Toets.
    const NAAR = {
      oefen: { omhoog: 'terug', omlaag: 'toets', links: 'kaart' },
      toets: { omhoog: 'oefen', links: 'kaart' },
      terug: { omlaag: 'oefen', links: 'kaart' },
    };
    const elVoor = (naam) => {
      if (naam === 'kaart') return kaart;
      return naam === 'oefen' && knop('oefen').disabled ? knop('terug') : knop(naam);
    };
    function bijToets({ actie }) {
      const focus = el.querySelector('.heeft-focus');
      if (focus === kaart) {
        if (bediening.toets(actie)) return true;
        if (actie === 'rechts') zetFocus(elVoor('oefen'));
        return ['links', 'rechts', 'omhoog', 'omlaag'].includes(actie);
      }
      const naar = NAAR[focus?.dataset.actie]?.[actie];
      if (!naar) return false;
      zetFocus(elVoor(naar));
      return true;
    }

    return {
      el,
      // Terug van een ronde: sterren en munten bijwerken en de focus op de knop waarmee hij begon.
      bijTerugkomst() {
        el.querySelector('.topbalk').outerHTML = topbalk(p);
        el.querySelector('.nl-sterren-oefen').innerHTML = sterren(false);
        el.querySelector('.nl-sterren-toets').innerHTML = sterren(true);
        // Een net bevrijde Wiebel staat er nu vrij bij.
        if (wiebelId) el.querySelector('.bij-knop').outerHTML = bijToetsHtml();
        if (gestart) zetFocus(knop(gestart));
        gestart = null;
      },
      bijFocus(doel) {
        const opKaart = doel === kaart;
        bediening.actief(opKaart);
        if (!opKaart) naam.textContent = '';
      },
      bijToets,
    };
  },
};
