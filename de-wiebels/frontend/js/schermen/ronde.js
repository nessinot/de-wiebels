// Oefenronde: tien vragen met vier antwoorden. Een fout wordt rustig verbeterd en later opnieuw gevraagd.
// Ook de oefenronde en de toets van Nederland; bij een toets komt een fout niet terug.

import { geefBeloning, voegXpToe } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { speel } from '../geluid.js';
import { maakVraag, maakVragen, vraagUitId } from '../generators/index.js';
import { maakGids } from '../gids.js';
import { registreer, teHerhalen, volgendeStap } from '../leitner.js';
import { BELONINGEN, levelVan } from '../levels.js';
import { nlVragen } from '../nederland/vragen.js';
import { nlBeloningNa } from '../nederland/wiebels.js';
import { bewaar, staat } from '../opslag.js';
import { RONDE_LENGTE, beantwoord, gedaan, huidigeVraag, nieuweRonde, sterrenVoor } from '../ronde.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { vliegNaar } from '../vliegen.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';
import { rustig } from '../wiebel-beweging.js';

const PAUZE_GOED = 900;
const MAX_HERHALING = 4;
const MAX_MUNTEN = 5; // zoveel munten vliegen er hooguit tegelijk naar de teller
const MAX_BOLLETJES = 20; // meer vragen passen niet als bolletjes in de kop

// Vragen voor een ronde: eerst wat aan de beurt is om te herhalen, de rest nieuw. Alles na de
// eerste tien is reserve voor tussenvragen. Geeft { vragen, reserve }.
function stelRondeSamen(p, level, stap) {
  if (level.vaardigheid === 'nederland') return nlVragen(p, level);
  const herhaling = teHerhalen(p.items, level.id, MAX_HERHALING)
    .map((id) => vraagUitId(id))
    .filter(Boolean)
    .map((v) => ({ ...v, herhaling: true }));
  const ids = new Set(herhaling.map((v) => v.id));
  const nieuw = maakVragen(level, RONDE_LENGTE * 2, stap).filter((v) => !ids.has(v.id));
  const alle = [...herhaling, ...nieuw];
  return { vragen: alle.slice(0, RONDE_LENGTE), reserve: alle.slice(RONDE_LENGTE) };
}

export const ronde = {
  maak({ toon, terug, zetFocus, gegevens }) {
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    let stap = p.moeilijkheid[level.id] ?? 1;
    let reeksGoed = 0;
    let reeksFout = 0;
    const nederland = level.vaardigheid === 'nederland';
    const { vragen, reserve } = stelRondeSamen(p, level, stap);
    const r = nieuweRonde(vragen, reserve, { herkansing: !level.toets });
    const rondeIds = new Set([...vragen, ...reserve].map((v) => v.id)); // alle vragen van deze ronde, ook al gestelde en de reserve

    const el = maakEl(`
      ${themaAchtergrond(p.thema, level.vaardigheid, 'ab-ronde')}
      <div class="rondekop">
        <span>${level.label}</span>
        <span class="voortgang"></span>
        <span class="teller munt-teller">🪙 ${p.munten}</span>
      </div>
    `);
    el.classList.add('met-gids');
    const paneel = maakVraagpaneel({ zetFocus, opAntwoord: antwoord });
    const gids = maakGids(p, 'gids-ronde');
    // Het pijltje staat na het vraagpaneel, zodat het eerste antwoord de focus krijgt.
    el.append(paneel.el, gids.el);
    el.insertAdjacentHTML('beforeend', '<button class="knop terugpijl" data-focus data-actie="terug" aria-label="Terug">←</button>');
    const teller = el.querySelector('.munt-teller');
    opKlik(el, { terug: () => terug() });

    function teken() {
      const klaar = gedaan(r);
      // Bij een lange toets (Nederland) past een bolletje per vraag niet: dan een teller.
      el.querySelector('.voortgang').innerHTML = r.aantal > MAX_BOLLETJES ? `${klaar} van ${r.aantal}`
        : Array.from({ length: r.aantal }, (_, i) => `<span class="${i < klaar ? 'vol' : ''}"></span>`).join('');
      paneel.toon(huidigeVraag(r));
      // Een vraag over Nederland zegt de Wiebel hardop (zonder opname alleen in de ballon).
      if (huidigeVraag(r).zin) gids.spreek(huidigeVraag(r).zin);
    }

    function volgende() {
      if (!el.isConnected) return; // het scherm is al verlaten
      if (r.wachtrij.length) return teken();
      const sterren = sterrenVoor(r.goedEerst, r.aantal);
      p.sterren[level.id] = Math.max(p.sterren[level.id] || 0, sterren);
      p.munten += r.munten;
      // Een Wiebel hebben alleen de levels en eindbazen (BELONINGEN) en de toetsen van Nederland.
      const beloning = nederland ? nlBeloningNa(p, level.id) : BELONINGEN.includes(level.id) && level.id;
      const nieuweWiebel = sterren >= 1 && beloning && geefBeloning(p, beloning) ? beloning : null;
      const gegroeid = voegXpToe(p, r.goed);
      bewaar();
      toon('resultaat', { levelId: level.id, goedEerst: r.goedEerst, aantal: r.aantal, sterren, munten: r.munten, nieuweWiebel, gegroeid }, { vervang: true });
    }

    // Na een reeks goed of meerdere fouten verandert de stap; nog niet gestelde nieuwe vragen
    // worden dan vervangen door vragen op de nieuwe stap. Nederland heeft geen stappen.
    function pasMoeilijkheidAan(goed) {
      if (nederland) return;
      reeksGoed = goed ? reeksGoed + 1 : 0;
      reeksFout = goed ? 0 : reeksFout + 1;
      const nieuweStap = volgendeStap(stap, reeksGoed, reeksFout);
      if (nieuweStap === stap) return;
      stap = nieuweStap;
      p.moeilijkheid[level.id] = stap;
      reeksGoed = 0;
      reeksFout = 0;
      r.wachtrij = r.wachtrij.map((v) => {
        if (v.herhaling || v.extra || r.fouten.has(v.id)) return v;
        for (let i = 0; i < 50; i++) {
          const nieuw = maakVraag(level, stap);
          if (!rondeIds.has(nieuw.id)) {
            rondeIds.add(nieuw.id);
            return nieuw;
          }
        }
        return v;
      });
    }

    // De verdiende munten vliegen van het goede antwoord naar de teller; die telt bij aankomst op.
    function vliegMunten(aantal, knop) {
      const totaal = p.munten + r.munten;
      const tel = () => {
        teller.textContent = `🪙 ${totaal}`;
        if (!rustig()) teller.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 250 });
      };
      if (!knop) return tel();
      for (let i = 0; i < Math.min(aantal, MAX_MUNTEN); i++) {
        vliegNaar(el, '🪙', knop, teller, { vertraging: i * 90, duur: 650 }).then(tel);
      }
    }

    function antwoord(sleutel, knop) {
      const uitslag = beantwoord(r, sleutel);
      registreer(p.items, uitslag.vraag.id, uitslag.goed, level.leitner ?? level.id);
      pasMoeilijkheidAan(uitslag.goed);
      bewaar();
      if (!uitslag.goed) {
        speel('fout');
        paneel.toonFout(sleutel, knop, volgende);
        gids.fout(uitslag.vraag.dat);
        return;
      }
      const goedEl = el.querySelector(`.optie[data-waarde="${uitslag.vraag.goed}"], .kaartvak [data-doel="${uitslag.vraag.goed}"]`);
      if (uitslag.munten) vliegMunten(uitslag.munten, goedEl ?? knop);
      const muntTekst = uitslag.munten ? ` +${uitslag.munten} 🪙` : '';
      paneel.toonGoed(uitslag.bonus ? `${uitslag.combo} op rij!${muntTekst}` : `Goed zo!${muntTekst}`);
      if (uitslag.bonus) {
        speel('combo');
        vuurwerk(el);
        gids.combo(uitslag.combo);
        setTimeout(volgende, PAUZE_GOED * 1.6);
      } else {
        speel('goed');
        gids.goed();
        setTimeout(volgende, PAUZE_GOED);
      }
    }

    teken();
    return { el, bijToets: paneel.bijToets, bijFocus: paneel.bijFocus };
  },
};
