// Tijdrace: kies een vaardigheid en beantwoord zo snel mogelijk twintig sommen goed.

import { voegXpToe } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { speel } from '../geluid.js';
import { maakVragen } from '../generators/index.js';
import { maakGids } from '../gids.js';
import { registreer } from '../leitner.js';
import { ONDERTITELS, VAARDIGHEDEN } from '../levels.js';
import { bewaar, staat } from '../opslag.js';
import { RACE_LENGTE, raceLevel, registreerTijd, tijdTekst } from '../records.js';
import { beantwoord, huidigeVraag, nieuweRonde } from '../ronde.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';

const PAUZE_GOED = 400;

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
            const level = raceLevel(p, v);
            const record = p.records[v];
            return `
              <button class="knop keuzeknop" data-focus data-actie="race" data-waarde="${v}" ${level ? '' : 'disabled'}>
                <strong>${t.werelden[v].emoji} ${t.werelden[v].naam}</strong>
                <span>${ONDERTITELS[v]}</span>
                <span>${level ? level.label : 'Nog op slot'}</span>
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
    const level = raceLevel(p, v);
    const r = nieuweRonde(maakVragen(level, RACE_LENGTE, p.moeilijkheid[level.id] ?? 1));
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

    const klok = setInterval(() => {
      if (!el.isConnected || klaar) return clearInterval(klok);
      el.querySelector('.racetijd').textContent = tijdTekst((performance.now() - start) / 1000);
    }, 100);

    function teken() {
      const gedaan = r.aantal - new Set(r.wachtrij.map((x) => x.id)).size;
      el.querySelector('.race-teller').textContent = `${gedaan} / ${r.aantal}`;
      paneel.toon(huidigeVraag(r));
    }

    function finish() {
      klaar = true;
      const seconden = (performance.now() - start) / 1000;
      const record = registreerTijd(p, v, seconden);
      voegXpToe(p, r.goed);
      bewaar();
      // De race maakt plaats voor de uitslag; de achtergrond en de Wiebel blijven.
      el.querySelector('.rondekop').remove();
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
      registreer(p.items, uitslag.vraag.id, uitslag.goed, level.id);
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

    opKlik(el, { klaar: () => terug() });

    teken();
    return { el, bijToets: (toets) => (klaar ? false : paneel.bijToets(toets)) };
  },
};
