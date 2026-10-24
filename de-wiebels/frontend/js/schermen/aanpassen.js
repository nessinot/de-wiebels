// Aanpassen: de Wiebel aankleden met wat je hebt gekocht, en gratis zijn kleur kiezen. Elke keuze
// is meteen te zien en wordt meteen bewaard; Terug gaat gewoon terug.

import { maakEl, opKlik } from '../dom.js';
import { bewaar, staat } from '../opslag.js';
import { PLEKKEN, combinatie, spul, spullenOp, trekAan } from '../spullen.js';
import { UITSNEDE, VENSTER_HTML, houInBeeld, kaartBeeld, maakVenster, tabsHtml } from '../venster.js';
import { eigenWiebelStaat } from '../weergave.js';
import { KLEUREN } from '../wiebel.js';
import { blij, hop, rustig } from '../wiebel-beweging.js';

export const aanpassen = {
  maak({ toon, terug, zetFocus }) {
    const p = staat.profiel;
    let plek = 'hoofd';
    const el = maakEl(`
      <div class="kopregel">
        <button class="knop" data-focus data-actie="terug">← Terug</button>
        <h1>Wiebel aanpassen</h1>
        <span class="teller munten"></span>
      </div>
      <div class="venster groot">${VENSTER_HTML}</div>
      <div class="kast">
        <div class="tabs">${tabsHtml(PLEKKEN, plek)}</div>
        <h2 class="plek-titel"></h2>
        <div class="kaarten"></div>
      </div>
    `);
    el.classList.add('aanpassen');
    const bak = el.querySelector('.kaarten');
    const venster = maakVenster(el.querySelector('.venster-binnen'), 'aanpassen', { uitsnede: UITSNEDE.groot });

    const kaart = (waarde, beeld, naam, aan, actie = 'kies') => `
      <button class="knop kaart${aan ? ' aan' : ''}" data-focus data-actie="${actie}" data-waarde="${waarde}">
        ${beeld}<span class="kaart-naam">${naam}</span>
      </button>`;

    function tekenKaarten() {
      const titel = PLEKKEN.find((x) => x.id === plek).titel;
      let notitie = '';
      let kaarten;
      if (plek === 'kleur') {
        notitie = 'gratis';
        kaarten = Object.entries(KLEUREN).map(([id, k]) => kaart(`kleur:${id}`, kaartBeeld(id, 'ap'), k.naam, p.wiebel.kleur === id));
      } else {
        const eigen = spullenOp(plek).filter((s) => p.cosmetica.gekocht.includes(s.id));
        if (!eigen.length) notitie = 'nog niets gekocht';
        kaarten = [
          kaart(`${plek}:`, kaartBeeld('niets'), 'Niets', !p.cosmetica.aan[plek]),
          ...eigen.map((s) => kaart(`${plek}:${s.id}`, kaartBeeld(s.id, 'ap', p.wiebel.kleur), s.naam, p.cosmetica.aan[plek] === s.id)),
          kaart(plek, kaartBeeld('meer'), 'Meer in de winkel', false, 'winkel'),
        ];
      }
      el.querySelector('.plek-titel').innerHTML = `${titel}${notitie ? `<span class="klein">${notitie}</span>` : ''}`;
      bak.innerHTML = kaarten.join('');
    }

    function tekenAlles() {
      el.querySelector('.munten').textContent = `🪙 ${p.munten}`;
      venster.teken(eigenWiebelStaat(p));
      tekenKaarten();
    }

    opKlik(el, {
      terug: () => terug(),
      tab(id) {
        plek = id;
        el.querySelectorAll('.tab').forEach((t) => t.classList.toggle('actief', t.dataset.waarde === id));
        bak.scrollTop = 0;
        tekenKaarten();
      },
      kies(waarde) {
        const [deze, id] = waarde.split(':');
        const voor = combinatie(p.cosmetica.aan);
        if (deze === 'kleur') {
          if (!KLEUREN[id] || p.wiebel.kleur === id) return;
          p.wiebel.kleur = id;
        } else if (!trekAan(p, deze, id || null)) return;
        bewaar();
        tekenAlles();
        zetFocus(bak.querySelector(`[data-waarde="${waarde}"]`));
        const na = combinatie(p.cosmetica.aan);
        const w = venster.wiebel();
        if (id) blij(w);
        else if (!rustig()) hop(w);
        // Een nieuwe combinatie (ook door iets uit te trekken) gaat voor.
        if (na && na !== voor) {
          venster.zeg(na);
          setTimeout(venster.reageer, 1600);
        } else if (!id) venster.zeg('uitgetrokken');
        else if (deze === 'kleur') venster.zeg('kleurGewisseld');
        else if (spul(id).plek === 'achtergrond') venster.zeg('achtergrondGekozen');
        else venster.zeg('aangetrokken');
      },
      winkel: (id) => toon('winkel', { plek: id }),
    });

    tekenAlles();
    venster.zeg('aanpassenWelkom');
    return {
      el,
      bijTerugkomst: tekenAlles,
      bijFocus: (doel) => houInBeeld(bak, doel),
    };
  },
};
