// Tijdrace: kies een vaardigheid en beantwoord zo snel mogelijk twintig sommen goed.

import { voegXpToe } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { speel } from '../geluid.js';
import { maakGids } from '../gids.js';
import { registreer } from '../leitner.js';
import { ONDERTITELS, VAARDIGHEDEN } from '../levels.js';
import { bewaar, staat } from '../opslag.js';
import { RACE_LENGTE, raceLevels, raceVragen, registreerTijd, tijdTekst } from '../records.js';
import { beantwoord, gedaan, huidigeVraag, nieuweRonde } from '../ronde.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';

const PAUZE_GOED = 400;
const RESERVE = 3; // extra sommen voor tussenvragen na een fout

export const tijdraceKeuze = {
  maak({ toon, terug }) {
    const el = maakEl();

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      el.innerHTML = `
        <div class="kopregel">
          <button class="knop" data-focus data-actie="terug">← Terug</button>
          <h1>⏱️ Tijdrace</h1>
        </div>
        <p class="ondertitel">Beantwoord ${RACE_LENGTE} sommen zo snel mogelijk goed. Kun je je eigen record verbeteren?</p>
        <div class="keuzes race-keuzes">
          ${VAARDIGHEDEN.map((v) => {
            const levels = raceLevels(p, v);
            const label = levels.length > 1 ? `${levels.length} levels door elkaar` : levels[0]?.label;
            const record = p.records[v];
            return `
              <button class="knop keuzeknop" data-focus data-actie="race" data-waarde="${v}" ${levels.length ? '' : 'disabled'}>
                <strong>${t.werelden[v].emoji} ${t.werelden[v].naam}</strong>
                <span>${ONDERTITELS[v]}</span>
                <span>${label ?? 'Nog op slot'}</span>
                <span>Record: ${record === undefined ? '—' : tijdTekst(record)}</span>
              </button>`;
          }).join('')}
        </div>
      `;
    }

    opKlik(el, {
      terug: () => terug(),
      race: (v) => toon('tijdrace', { vaardigheid: v }),
    });

    teken();
    return { el, bijTerugkomst: teken };
  },
};

export const tijdrace = {
  maak({ terug, zetFocus, gegevens }) {
    const p = staat.profiel;
    const v = gegevens.vaardigheid;
    const alle = raceVragen(p, v, RACE_LENGTE + RESERVE);
    const r = nieuweRonde(alle.slice(0, RACE_LENGTE), alle.slice(RACE_LENGTE));
    const start = performance.now();
    let klaar = false;

    const el = maakEl(`
      ${themaAchtergrond(p.thema, v, 'ab-race')}
      <div class="rondekop">
        <span>⏱️ <strong class="racetijd">0,0 s</strong></span>
        <span class="race-teller"></span>
      </div>
    `);
    el.classList.add('met-gids');
    const paneel = maakVraagpaneel({ zetFocus, opAntwoord: antwoord });
    // In de race reageert de Wiebel kort en zonder ballon, zodat het tempo blijft.
    const gids = maakGids(p, 'gids-race', { kort: true });
    el.append(paneel.el, gids.el);
    // Het pijltje staat na het vraagpaneel, zodat het eerste antwoord de focus krijgt.
    el.insertAdjacentHTML('beforeend', '<button class="knop terugpijl" data-focus data-actie="terug" aria-label="Terug">←</button>');

    const klok = setInterval(() => {
      if (!el.isConnected || klaar) return clearInterval(klok);
      el.querySelector('.racetijd').textContent = tijdTekst((performance.now() - start) / 1000);
    }, 100);

    function teken() {
      el.querySelector('.race-teller').textContent = `${gedaan(r)} / ${r.aantal}`;
      paneel.toon(huidigeVraag(r));
    }

    function finish() {
      if (!el.isConnected) return; // het scherm is al verlaten
      klaar = true;
      const seconden = (performance.now() - start) / 1000;
      const record = registreerTijd(p, v, seconden);
      voegXpToe(p, r.goed);
      bewaar();
      // De race maakt plaats voor de uitslag; de achtergrond en de Wiebel blijven.
      el.querySelector('.rondekop').remove();
      el.querySelector('.terugpijl')?.remove();
      paneel.el.remove();
      el.insertAdjacentHTML('beforeend', `
        <div class="overwinning">
          <h1 class="titel-groot">${record ? 'Nieuw record!' : 'Finish!'}</h1>
          <p class="race-uitslag">${tijdTekst(seconden)}</p>
          <p class="ondertitel">Jouw record: ${tijdTekst(p.records[v])}</p>
          <button class="knop knop-hoofd" data-focus data-actie="klaar">Terug</button>
        </div>
      `);
      gids.blij();
      if (record) {
        speel('gewonnen');
        vuurwerk(el, 1100, 400);
      }
      zetFocus(el.querySelector('[data-actie="klaar"]'));
    }

    function volgende() {
      if (r.wachtrij.length) teken();
      else finish();
    }

    function antwoord(sleutel, knop) {
      const uitslag = beantwoord(r, sleutel);
      registreer(p.items, uitslag.vraag.id, uitslag.goed, uitslag.vraag.levelId);
      if (uitslag.goed) {
        speel('goed');
        paneel.toonGoed('Goed!');
        gids.goed();
        setTimeout(volgende, PAUZE_GOED);
      } else {
        speel('fout');
        paneel.toonFout(sleutel, knop, volgende);
        gids.fout();
      }
    }

    opKlik(el, { klaar: () => terug(), terug: () => terug() });

    teken();
    return { el, bijToets: (toets) => (klaar ? false : paneel.bijToets(toets)) };
  },
};
