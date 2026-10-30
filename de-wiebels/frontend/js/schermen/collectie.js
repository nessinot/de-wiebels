// De bevrijde Wiebels en de eigen Wiebel met zijn groei, voor de wereld van het thema. Bovenin lopen
// de nieuwste Wiebels rond (hooguit LOPERS tegelijk, om de tv te sparen); daaronder staan alle Wiebels
// stil, en wie nog gevangen zit, staat er als donker silhouet. Kies je een Wiebel, dan opent zijn
// kaartje: een bevrijde Wiebel vertelt wie hij is, bij een gevangen Wiebel zie je waar hij zit.

import { esc, maakEl, opKlik } from '../dom.js';
import {
  ALLE_BELONINGEN, HUISDIER_GRENZEN, gevangenBij, huisdierStadium, markeerGezien, nieuweWiebels, openingsZin, totVolgendStadium, vaardigheidVan, wiebelVoor,
} from '../beloningen.js';
import { speel } from '../geluid.js';
import { NEDERLAND } from '../nederland/wereld.js';
import { GEVANGEN_ZIN } from '../nederland/wiebels.js';
import { bewaar, staat } from '../opslag.js';
import { rng } from '../scene.js';
import { BALLON_HTML, maakBallon, maakSpreker } from '../spreekballon.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { eigenWiebelHtml, vriendjeHtml } from '../weergave.js';
import { STADIUM_NAMEN } from '../wiebel.js';
import { dans, hop, rustig, sprongetje } from '../wiebel-beweging.js';

const LOPERS = 6;
const WEI_BREEDTE = 1236;
const LOPER_MAAT = 170;
const RAND = 50; // ruimte aan de zijkant, zodat "Nieuw!" boven een loper niet wegvalt
const FEEST_DUUR = 3800; // ms: twee keer dansen

// De lopers: eerst de nieuwe Wiebels, daarna de laatst bevrijde.
function kiesLopers(bevrijd, nieuw) {
  const lopers = nieuw.slice(-LOPERS);
  for (const id of [...bevrijd].reverse()) {
    if (lopers.length >= LOPERS) break;
    if (!lopers.includes(id)) lopers.push(id);
  }
  return lopers;
}

// Elke loper heeft een eigen stuk van de wei en loopt daar heen en weer (alleen transform).
function lopersHtml(bevrijd, nieuw, t) {
  const r = rng(bevrijd.length);
  const ruimte = WEI_BREEDTE - LOPER_MAAT - 2 * RAND;
  const lopers = kiesLopers(bevrijd, nieuw);
  return lopers.map((id, i) => {
    const midden = ((i + 0.5) * ruimte) / lopers.length;
    const stuk = 110 + r() * 110;
    const van = RAND + Math.max(0, midden - stuk);
    const naar = RAND + Math.min(ruimte, midden + stuk);
    const duur = 7 + r() * 5;
    return `<div class="loper" style="--van:${van.toFixed(0)}px;--naar:${naar.toFixed(0)}px;animation-duration:${duur.toFixed(1)}s;animation-delay:-${(r() * duur).toFixed(1)}s">
      ${vriendjeHtml(wiebelVoor(id, t), `loper-${i}`)}${nieuw.includes(id) ? '<span class="nieuw-label">⭐ Nieuw!</span>' : ''}
    </div>`;
  }).join('');
}

// De wereld van een Wiebel: uit het thema, of Nederland (in elk thema gelijk).
const wereldVan = (t, v) => (v === 'nederland' ? NEDERLAND : t.werelden[v]);

const rij = (label, waarde) => `<p class="wkaart-rij"><span>${label}:</span> ${esc(waarde)}</p>`;

function bevrijdKaartHtml(w, wereld) {
  return `
    ${BALLON_HTML}
    <div class="wkaart-figuur">
      ${vriendjeHtml(w, 'kaart')}
      <strong class="wkaart-naam">${esc(w.naam)}</strong>
      <button class="knop knop-hoofd" data-focus data-actie="sluit">Klaar</button>
    </div>
    <div class="wkaart-info">
      ${rij('🏠 Woont in', `${wereld.emoji} ${wereld.naam}`)}
      ${rij('🎨 Lievelingskleur', w.lievelingskleur)}
      ${rij('😋 Eet het liefst', w.eetHetLiefst)}
      ${rij('⭐ Kan heel goed', w.kanHeelGoed)}
      ${rij('🤫 Geheimpje', w.geheimpje)}
    </div>`;
}

function gevangenKaartHtml(w, wereld, plek, baas) {
  return `
    <div class="wkaart-figuur">
      ${vriendjeHtml(w, 'kaart', 'stil silhouet')}
      <strong class="wkaart-naam">${plek.open ? '' : '🔒 '}Gevangen</strong>
    </div>
    <div class="wkaart-info">
      ${rij('🏠 Zit in', `${wereld.emoji} ${wereld.naam}`)}
      ${plek.label ? rij('🎯 Level', plek.label) : plek.level ? rij('🎯 Level', plek.level.label) : rij('👑 Eindbaas', `${baas.emoji} ${baas.naam}`)}
      <div class="wkaart-knoppen">
        ${plek.open ? '<button class="knop knop-hoofd" data-focus data-actie="ga">Ga erheen →</button>' : ''}
        <button class="knop" data-focus data-actie="sluit">Klaar</button>
      </div>
    </div>`;
}

export const collectie = {
  maak({ terug, toon, zetFocus }) {
    const el = maakEl();
    el.classList.add('collectie');
    // Wat bij dit bezoek nieuw was, houdt zijn sterretje, ook na een uitstapje naar een level.
    const nieuwDitBezoek = new Set();
    let ballon;
    let kaart = null; // { id, el, spreker, tegel }
    let feestTimer = 0;
    // Na "Ga erheen" komt de focus bij terugkomst weer op die Wiebel (het level pakt zelf de focus).
    let naTerug = null;

    function teken() {
      const p = staat.profiel;
      const t = thema(p.thema);
      clearTimeout(feestTimer);
      feestTimer = 0;
      kaart = null;
      const vers = nieuweWiebels(p);
      vers.forEach((id) => nieuwDitBezoek.add(id));
      if (markeerGezien(p)) bewaar();

      const stadium = huisdierStadium(p.huisdier.xp);
      const nog = totVolgendStadium(p.huisdier.xp);
      const vorige = HUISDIER_GRENZEN[stadium];
      const deel = nog === null ? 1 : (p.huisdier.xp - vorige) / (p.huisdier.xp - vorige + nog);
      const bevrijd = p.verzameling.filter((id) => ALLE_BELONINGEN.includes(id));
      const nieuw = bevrijd.filter((id) => nieuwDitBezoek.has(id));

      el.innerHTML = `
        ${themaAchtergrond(p.thema, null, 'ab-collectie')}
        <div class="kopregel">
          <button class="knop" data-focus data-actie="terug">← Terug</button>
          <h1>Bevrijde Wiebels</h1>
          <button class="knop" data-focus data-actie="feest" ${bevrijd.length ? '' : 'disabled'}>🎉 Feestje!</button>
          <span class="teller">${bevrijd.length} / ${ALLE_BELONINGEN.length}</span>
        </div>
        <div class="collectie-indeling">
          <div class="huisdier-paneel">
            ${BALLON_HTML}
            ${eigenWiebelHtml(p, 'verzameling', { schaal: 1.3 })}
            <strong>${STADIUM_NAMEN[stadium]}</strong>
            <div class="levensbalk groeibalk"><div style="transform: scaleX(${deel})"></div></div>
            <span class="klein">${nog === null ? 'Helemaal volgroeid!' : `Nog ${nog} goede antwoorden tot de volgende stap`}</span>
          </div>
          <div class="collectie-rechts">
            <div class="wei">
              ${bevrijd.length ? lopersHtml(bevrijd, nieuw, t) : '<p class="wei-leeg">Haal twee sterren in een level om je eerste Wiebel te bevrijden!</p>'}
            </div>
            <div class="wiebels">
              ${ALLE_BELONINGEN.map((id, i) => {
                const vrij = p.verzameling.includes(id);
                const w = wiebelVoor(id, t);
                return `<button class="knop wiebeltje${vrij ? '' : ' gevangen'}" data-focus data-actie="kies" data-waarde="${id}" aria-label="${vrij ? esc(w.naam) : 'Gevangen Wiebel'}">
                  ${vriendjeHtml(w, `vz-${i}`, vrij ? 'stil' : 'stil silhouet')}${nieuw.includes(id) ? '<span class="nieuw-ster">⭐</span>' : ''}
                </button>`;
              }).join('')}
            </div>
            <div class="kaartje" hidden></div>
          </div>
        </div>
      `;
      ballon = maakBallon(el.querySelector('.huisdier-paneel'));
      ballon.zeg(openingsZin(p, vers.length));
    }

    // Tijdens het kaartje werken alleen de knoppen op het kaartje (ook niet met de Magic Remote).
    function zetAchtergrond(aan) {
      for (const deel of el.querySelectorAll('.kopregel, .wei, .wiebels')) deel.inert = !aan;
    }

    function openKaart(id, tegel) {
      const p = staat.profiel;
      const t = thema(p.thema);
      const w = wiebelVoor(id, t);
      const v = vaardigheidVan(id);
      const k = el.querySelector('.kaartje');
      const vrij = p.verzameling.includes(id);
      ballon.stop();
      k.classList.toggle('gevangen-kaart', !vrij);
      if (vrij) {
        k.innerHTML = bevrijdKaartHtml(w, wereldVan(t, v));
      } else {
        const plek = gevangenBij(p, id);
        k.innerHTML = gevangenKaartHtml(w, wereldVan(t, v), plek, t.eindbazen[v]);
        if (plek.vaardigheid === 'nederland') ballon.praat(GEVANGEN_ZIN.tekst, GEVANGEN_ZIN.id);
        else ballon.zeg(!plek.open ? 'gevangenDicht' : plek.level ? 'gevangenOpen' : 'gevangenBaas');
      }
      k.hidden = false;
      kaart = { id, el: k, tegel, spreker: vrij ? maakSpreker(k, true) : null };
      zetAchtergrond(false);
      zetFocus(k.querySelector('[data-focus]'));
      if (vrij) {
        sprongetje(k.querySelector('.wiebel'));
        kaart.spreker(w.zin.tekst, w.zin.id);
      }
    }

    function sluitKaart() {
      if (!kaart) return;
      kaart.spreker?.stop();
      ballon.stop();
      kaart.el.hidden = true;
      kaart.el.innerHTML = '';
      const { tegel } = kaart;
      kaart = null;
      zetAchtergrond(true);
      zetFocus(tegel);
    }

    function gaErheen() {
      const plek = gevangenBij(staat.profiel, kaart.id);
      naTerug = kaart.id;
      sluitKaart();
      if (plek.vaardigheid === 'nederland') {
        if (plek.provincie) toon('nederlandProvincie', { provincie: plek.provincie });
        else toon('nederland', {});
      } else if (plek.level) toon('ronde', { levelId: plek.level.id });
      else toon('eindbaas', { vaardigheid: plek.vaardigheid });
    }

    // Feestje: de grote Wiebels dansen, de kleine springen mee (bewegingen uit wiebel-beweging.js).
    function feestje() {
      if (feestTimer) return;
      speel('gewonnen');
      const groot = [...el.querySelectorAll('.loper .wiebel, .huisdier-paneel .wiebel')];
      const klein = [...el.querySelectorAll('.wiebeltje:not(.gevangen) .wiebel')];
      const ronde = () => {
        groot.forEach(dans);
        if (!rustig()) klein.forEach((w, i) => setTimeout(() => w.isConnected && hop(w, 3), (i % 12) * 50));
      };
      ronde();
      const tweede = setTimeout(() => el.isConnected && ronde(), FEEST_DUUR / 2);
      feestTimer = setTimeout(() => {
        clearTimeout(tweede);
        feestTimer = 0;
      }, FEEST_DUUR);
    }

    opKlik(el, {
      terug: () => terug(),
      feest: feestje,
      kies: (id, knop) => openKaart(id, knop),
      sluit: sluitKaart,
      ga: gaErheen,
    });

    teken();
    return {
      el,
      // Terug van een level: opnieuw tekenen (wie net vrij is, is nieuw) met de focus op dezelfde Wiebel.
      bijTerugkomst() {
        const id = naTerug ?? el.querySelector('.heeft-focus')?.dataset.waarde;
        naTerug = null;
        teken();
        if (id) zetFocus(el.querySelector(`[data-waarde="${id}"]`));
      },
      // Met een open kaartje: Terug sluit het kaartje, de pijltjes gaan langs de knoppen op het kaartje.
      bijToets(toets) {
        if (!kaart) return false;
        if (toets.actie === 'terug') {
          sluitKaart();
          return true;
        }
        const stap = { links: -1, omhoog: -1, rechts: 1, omlaag: 1 }[toets.actie];
        if (!stap) return false;
        const knoppen = [...kaart.el.querySelectorAll('[data-focus]')];
        const i = knoppen.indexOf(el.querySelector('.heeft-focus'));
        const doel = knoppen[i + stap];
        if (doel) zetFocus(doel);
        return true;
      },
    };
  },
};
