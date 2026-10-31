// Oefenronde: tien vragen met vier antwoorden. Een fout wordt rustig verbeterd en later opnieuw gevraagd.
// Ook de oefenronde en de toets van Nederland; bij een toets komt een fout niet terug.
// Bij een somlevel en bij een toets van Nederland zit de Wiebel die je kunt bevrijden in zijn bel links
// naast de som of de kaart; aan het eind knapt de bel of schudt hij.

import { belHtml, laatVrij, schud } from '../bel.js';
import { afloopBel, belInToets, beloningNa, geefBeloning, voegXpToe, wiebelVan, wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { speel } from '../geluid.js';
import { maakVraag, maakVragen, vraagUitId } from '../generators/index.js';
import { maakGids } from '../gids.js';
import { registreer, teHerhalen, volgendeStap } from '../leitner.js';
import { STERREN_VRIJ, levelVan } from '../levels.js';
import { nlVragen } from '../nederland/vragen.js';
import { NOG_EEN_TOETS_ZIN } from '../nederland/wiebels.js';
import { bewaar, staat } from '../opslag.js';
import { COMBO_BONUS, KEN_BONUS, RONDE_LENGTE, beantwoord, gedaan, huidigeVraag, nieuweRonde, sterBonus, sterrenVoor } from '../ronde.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { thema } from '../themas/index.js';
import { vliegNaar } from '../vliegen.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';
import { rustig } from '../wiebel-beweging.js';

const PAUZE_GOED = 900;
const MAX_LOF = 4000; // langer wacht een vraag over Nederland niet op de lof
const MAX_HERHALING = 4;
const MAX_MUNTEN = 5; // zoveel munten vliegen er hooguit tegelijk naar de teller
const MAX_BOLLETJES = 20; // meer vragen passen niet als bolletjes in de kop
const NA_BEL = 1600; // ms: na het knappen of schudden, dan het resultaat

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
    // Een level of toets die je al kent (3 sterren vóór de ronde) geeft geen munt per goed antwoord,
    // alleen de bonussen voor 3 en 5 op rij.
    const alGekend = (p.sterren[level.id] || 0) >= 3;
    const r = nieuweRonde(vragen, reserve, { herkansing: !level.toets, muntPerGoed: !alGekend, bonussen: alGekend ? KEN_BONUS : COMBO_BONUS });
    const rondeIds = new Set([...vragen, ...reserve].map((v) => v.id)); // alle vragen van deze ronde, ook al gestelde en de reserve
    const belId = belInToets(p, level.id);

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
    // Bij een level dat je al kent zegt de Wiebel eerst waarom er minder munten zijn.
    const begin = alGekend ? gids.zeg(nederland ? 'alGekendNl' : 'alGekend') : null;
    // De bel staat vóór de gids, zodat de ballon er altijd overheen valt.
    if (belId) {
      const w = wiebelVoor(belId, thema(p.thema));
      el.insertAdjacentHTML('beforeend', `<div class="toets-bel">${belHtml(w, 'toetsbel')}<span class="toets-bel-naam">${w.naam}</span></div>`);
    }
    // Het pijltje staat na het vraagpaneel, zodat het eerste antwoord de focus krijgt.
    el.append(paneel.el, gids.el);
    el.insertAdjacentHTML('beforeend', '<button class="knop terugpijl" data-focus data-actie="terug" aria-label="Terug">←</button>');
    const teller = el.querySelector('.munt-teller');
    opKlik(el, { terug: () => terug() });

    // spreek: false voor de eerste vraag na de startzin; die spreekt de Wiebel pas na die zin uit.
    function teken(spreek = true) {
      const klaar = gedaan(r);
      // Bij een lange toets (Nederland) past een bolletje per vraag niet: dan een teller.
      el.querySelector('.voortgang').innerHTML = r.aantal > MAX_BOLLETJES ? `${klaar} van ${r.aantal}`
        : Array.from({ length: r.aantal }, (_, i) => `<span class="${i < klaar ? 'vol' : ''}"></span>`).join('');
      paneel.toon(huidigeVraag(r));
      // Een vraag over Nederland zegt de Wiebel hardop (zonder opname alleen in de ballon).
      if (spreek && huidigeVraag(r).zin) gids.spreek(huidigeVraag(r).zin);
    }

    function volgende() {
      if (!el.isConnected) return; // het scherm is al verlaten
      if (r.wachtrij.length) return teken();
      const sterren = sterrenVoor(r.goedEerst, r.aantal);
      const oud = p.sterren[level.id] || 0;
      p.sterren[level.id] = Math.max(oud, sterren);
      const bonus = sterBonus(oud, sterren);
      p.munten += r.munten + bonus;
      // Een Wiebel hebben alleen de levels en eindbazen (BELONINGEN) en de toetsen van Nederland; hij
      // komt vrij bij STERREN_VRIJ sterren. Bij minder ziet het kind wie er nog gevangen zit.
      const vrij = beloningNa(p, level.id, sterren);
      const nieuweWiebel = vrij && geefBeloning(p, vrij) ? vrij : null;
      const gevangen = sterren < STERREN_VRIJ && wiebelVan(level.id);
      const nogGevangen = gevangen && !p.verzameling.includes(gevangen) ? gevangen : null;
      const gegroeid = voegXpToe(p, r.goed);
      bewaar();
      const naarResultaat = (belGeknapt = false) => toon('resultaat', {
        levelId: level.id, goedEerst: r.goedEerst, aantal: r.aantal, sterren, munten: r.munten, alGekend, sterBonus: bonus, nieuweWiebel, nogGevangen, gegroeid, belGeknapt,
      }, { vervang: true });
      if (!belId) return naarResultaat();
      // Bij twee sterren knapt de bel en zegt de gids een bevrijd-zin; bij Tulpje na de eerste toets
      // schudt hij en zegt de gids dat er nog één toets is; bij minder sterren schudt hij alleen.
      const bel = el.querySelector('.toets-bel .vangbel');
      const afloop = afloopBel(sterren, nieuweWiebel);
      let zin = null;
      if (afloop === 'knap') {
        laatVrij(bel);
        gids.blij();
        zin = gids.zeg('bevrijd');
      } else {
        schud(bel);
        if (afloop === 'nogEen') zin = gids.spreek(NOG_EEN_TOETS_ZIN);
      }
      const wacht = (ms) => new Promise((klaar) => { setTimeout(klaar, ms); });
      Promise.all([wacht(NA_BEL), zin ? Promise.race([zin, wacht(MAX_LOF)]) : null]).then(() => {
        if (el.isConnected) naarResultaat(afloop === 'knap');
      });
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
      // Het feest bij 3, 5 en 10 op rij blijft, ook als er in een gekend level geen munten bij horen.
      const feest = COMBO_BONUS[uitslag.combo];
      paneel.toonGoed(feest ? `${uitslag.combo} op rij!${muntTekst}` : `Goed zo!${muntTekst}`);
      if (feest) {
        speel('combo');
        vuurwerk(el);
        naLof(gids.combo(uitslag.combo), PAUZE_GOED * 1.6);
      } else {
        speel('goed');
        naLof(gids.goed(), PAUZE_GOED);
      }
    }

    // Verder na de pauze. Bij Nederland spreekt de Wiebel de volgende vraag uit; die wacht ook tot
    // de lof klaar is (hooguit MAX_LOF), zodat de vraag de lof niet afbreekt. Bij de laatste vraag met een
    // bel wachten ook de sommen, zodat de zin bij het knappen de lof niet afbreekt.
    function naLof(lof, pauze) {
      if (!nederland && !(belId && !r.wachtrij.length)) return setTimeout(volgende, pauze);
      const wacht = (ms) => new Promise((klaar) => { setTimeout(klaar, ms); });
      Promise.all([wacht(pauze), Promise.race([lof, wacht(MAX_LOF)])]).then(volgende);
    }

    // De eerste vraag staat meteen in beeld; na de startzin spreekt de Wiebel hem uit, maar alleen als
    // het scherm er nog is en die vraag nog aan de beurt is (een snel antwoord breekt de zin af).
    const eerste = huidigeVraag(r);
    teken(!begin);
    begin?.then(() => {
      if (el.isConnected && huidigeVraag(r) === eerste && eerste.zin) gids.spreek(eerste.zin);
    });
    return { el, bijToets: paneel.bijToets, bijFocus: paneel.bijFocus };
  },
};
