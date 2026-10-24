// Oefenronde: tien vragen met vier antwoorden. Een fout wordt rustig verbeterd en later opnieuw gevraagd.

import { geefBeloning, voegXpToe } from '../beloningen.js';
import { maakEl } from '../dom.js';
import { speel } from '../geluid.js';
import { maakVraag, maakVragen, vraagUitId } from '../generators/index.js';
import { registreer, teHerhalen, volgendeStap } from '../leitner.js';
import { levelVan } from '../levels.js';
import { bewaar, staat } from '../opslag.js';
import { RONDE_LENGTE, beantwoord, huidigeVraag, nieuweRonde, sterrenVoor } from '../ronde.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';

const PAUZE_GOED = 900;
const MAX_HERHALING = 4;

// Vragen voor een ronde: eerst wat aan de beurt is om te herhalen, de rest nieuw.
function stelRondeSamen(p, level, stap) {
  const herhaling = teHerhalen(p.items, level.id, MAX_HERHALING)
    .map((id) => vraagUitId(id))
    .filter(Boolean)
    .map((v) => ({ ...v, herhaling: true }));
  const ids = new Set(herhaling.map((v) => v.id));
  const nieuw = maakVragen(level, RONDE_LENGTE * 2, stap).filter((v) => !ids.has(v.id));
  return [...herhaling, ...nieuw].slice(0, RONDE_LENGTE);
}

export const ronde = {
  maak({ toon, zetFocus, gegevens }) {
    const p = staat.profiel;
    const level = levelVan(gegevens.levelId);
    let stap = p.moeilijkheid[level.id] ?? 1;
    let reeksGoed = 0;
    let reeksFout = 0;
    const r = nieuweRonde(stelRondeSamen(p, level, stap));
    const rondeIds = new Set(r.wachtrij.map((v) => v.id)); // alle vragen van deze ronde, ook al gestelde

    const el = maakEl(`
      ${themaAchtergrond(p.thema, level.vaardigheid, 'ab-ronde')}
      <div class="rondekop">
        <span>${level.label}</span>
        <span class="voortgang"></span>
      </div>
    `);
    const paneel = maakVraagpaneel({ zetFocus, opAntwoord: antwoord });
    el.append(paneel.el);

    function teken() {
      const gedaan = r.aantal - new Set(r.wachtrij.map((v) => v.id)).size;
      el.querySelector('.voortgang').innerHTML = Array.from({ length: r.aantal }, (_, i) => `<span class="${i < gedaan ? 'vol' : ''}"></span>`).join('');
      paneel.toon(huidigeVraag(r));
    }

    function volgende() {
      if (r.wachtrij.length) return teken();
      const sterren = sterrenVoor(r.goedEerst, r.aantal);
      p.sterren[level.id] = Math.max(p.sterren[level.id] || 0, sterren);
      p.munten += r.munten;
      const nieuweWiebel = sterren >= 1 && geefBeloning(p, level.id);
      const gegroeid = voegXpToe(p, r.goed);
      bewaar();
      toon('resultaat', { levelId: level.id, goedEerst: r.goedEerst, aantal: r.aantal, sterren, munten: r.munten, nieuweWiebel, gegroeid }, { vervang: true });
    }

    // Na een reeks goed of meerdere fouten verandert de stap; nog niet gestelde nieuwe vragen
    // worden dan vervangen door vragen op de nieuwe stap.
    function pasMoeilijkheidAan(goed) {
      reeksGoed = goed ? reeksGoed + 1 : 0;
      reeksFout = goed ? 0 : reeksFout + 1;
      const nieuweStap = volgendeStap(stap, reeksGoed, reeksFout);
      if (nieuweStap === stap) return;
      stap = nieuweStap;
      p.moeilijkheid[level.id] = stap;
      reeksGoed = 0;
      reeksFout = 0;
      r.wachtrij = r.wachtrij.map((v) => {
        if (v.herhaling || r.fouten.has(v.id)) return v;
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

    function antwoord(sleutel, knop) {
      const uitslag = beantwoord(r, sleutel);
      registreer(p.items, uitslag.vraag.id, uitslag.goed, level.id);
      pasMoeilijkheidAan(uitslag.goed);
      bewaar();
      if (!uitslag.goed) {
        speel('fout');
        paneel.toonFout(sleutel, knop, volgende);
        return;
      }
      const muntTekst = uitslag.munten ? ` +${uitslag.munten} 🪙` : '';
      paneel.toonGoed(uitslag.bonus ? `${uitslag.combo} op rij!${muntTekst}` : `Goed zo!${muntTekst}`);
      if (uitslag.bonus) {
        speel('combo');
        vuurwerk(el);
        setTimeout(volgende, PAUZE_GOED * 1.6);
      } else {
        speel('goed');
        setTimeout(volgende, PAUZE_GOED);
      }
    }

    teken();
    return { el, bijToets: paneel.bijToets };
  },
};
