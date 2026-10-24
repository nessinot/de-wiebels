// Winkeltje: spullen voor de Wiebel. Een kaartje kiezen is passen op de Wiebel in het venster; met
// de gele knop koop je het, en dan gaat het meteen aan.

import { maakEl, opKlik } from '../dom.js';
import { speel } from '../geluid.js';
import { bewaar, staat } from '../opslag.js';
import { PLEKKEN, combinatie, heeft, koop, metGepast, spul, spullenOp } from '../spullen.js';
import { UITSNEDE, VENSTER_HTML, houInBeeld, kaartBeeld, maakVenster, tabsHtml } from '../venster.js';
import { eigenWiebelStaat } from '../weergave.js';
import { blij, hop, rustig } from '../wiebel-beweging.js';

const WINKELPLEKKEN = PLEKKEN.filter((x) => x.id !== 'kleur');

export const winkel = {
  maak({ terug, zetFocus, gegevens }) {
    const p = staat.profiel;
    let plek = WINKELPLEKKEN.some((x) => x.id === gegevens.plek) ? gegevens.plek : 'hoofd';
    let pas = null; // wat de Wiebel nu past
    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Winkeltje</h1>
        <span class="teller munten"></span>
      </div>
      <div class="venster groot">${VENSTER_HTML}</div>
      <button class="knop koopknop" data-focus data-actie="koop"></button>
      <div class="kast">
        <div class="tabs">${tabsHtml(WINKELPLEKKEN, plek)}</div>
        <h2 class="plek-titel"></h2>
        <div class="kaarten"></div>
      </div>
    `);
    el.classList.add('winkel');
    const bak = el.querySelector('.kaarten');
    const knop = el.querySelector('.koopknop');
    const venster = maakVenster(el.querySelector('.venster-binnen'), 'winkel', { uitsnede: UITSNEDE.groot, blijftStaan: true });

    // De Wiebel zoals hij er nu uitziet, met wat hij past.
    function getoond() {
      const s = eigenWiebelStaat(p);
      return pas ? { ...s, aan: metGepast(s.aan, pas) } : s;
    }

    function tekenKaarten() {
      el.querySelector('.plek-titel').textContent = WINKELPLEKKEN.find((x) => x.id === plek).titel;
      bak.innerHTML = spullenOp(plek).map((s) => `
        <button class="knop kaart${pas === s.id ? ' aan' : ''}" data-focus data-actie="pas" data-waarde="${s.id}">
          ${kaartBeeld(s.id, 'wk', p.wiebel.kleur)}<span class="kaart-naam">${s.naam}</span>
          <span class="kaart-prijs">${heeft(p, s.id) ? '✓ Gekocht' : `${s.prijs} 🪙`}</span>
        </button>`).join('');
    }

    function tekenKnop() {
      const s = spul(pas);
      knop.disabled = !s || heeft(p, pas) || p.munten < s.prijs;
      knop.textContent = !s ? 'Kies iets om te passen'
        : heeft(p, pas) ? 'Heb je al'
        : p.munten < s.prijs ? `Nog ${s.prijs - p.munten} 🪙 sparen`
        : `Kopen voor ${s.prijs} 🪙`;
    }

    function tekenAlles() {
      el.querySelector('.munten').textContent = `🪙 ${p.munten}`;
      venster.teken(getoond());
      tekenKaarten();
      tekenKnop();
    }

    opKlik(el, {
      terug: () => terug(),
      tab(id) {
        plek = id;
        el.querySelectorAll('.tab').forEach((t) => t.classList.toggle('actief', t.dataset.waarde === id));
        bak.scrollTop = 0;
        tekenKaarten();
      },
      pas(id) {
        const voor = combinatie(getoond().aan);
        pas = id;
        tekenAlles();
        zetFocus(bak.querySelector(`[data-waarde="${id}"]`));
        const na = combinatie(getoond().aan);
        if (!rustig()) hop(venster.wiebel());
        const s = spul(id);
        if (na && na !== voor) {
          venster.zeg(na);
          setTimeout(venster.reageer, 1000);
        } else venster.zeg(heeft(p, id) ? 'alGekocht' : p.munten >= s.prijs ? 'passen' : 'sparen');
      },
      koop() {
        if (!koop(p, pas).ok) return;
        speel('combo');
        bewaar();
        tekenAlles();
        zetFocus(bak.querySelector(`[data-waarde="${pas}"]`));
        blij(venster.wiebel());
        venster.zeg('gekocht');
      },
    });

    tekenAlles();
    venster.zeg('winkelWelkom');
    return {
      el,
      bijFocus: (doel) => houInBeeld(bak, doel),
      // Vanuit de linkerkolom van de kaartjes gaat links altijd naar de koopknop (anders kom je
      // vanuit de bovenste rij bij de tabs uit), en vanaf de koopknop gaat rechts terug naar het
      // kaartje dat de Wiebel past.
      bijToets({ actie }) {
        const focus = el.querySelector('.heeft-focus');
        if (actie === 'links' && focus?.classList.contains('kaart') && [...bak.children].indexOf(focus) % 3 === 0 && !knop.disabled) {
          zetFocus(knop);
          return true;
        }
        const gepast = pas && bak.querySelector(`[data-waarde="${pas}"]`);
        if (actie === 'rechts' && focus === knop && gepast) {
          zetFocus(gepast);
          return true;
        }
        return false;
      },
    };
  },
};
