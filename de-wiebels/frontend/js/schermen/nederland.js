// De wereld Nederland: links de kaart die meeleest, rechts de knoppen Provincies en Hoofdsteden, een
// knop per provincie (op alfabet) en Heel Nederland.

import { maakEl, opKlik } from '../dom.js';
import { PER_ID, PROVINCIES, kaartSvg } from '../nederland/kaartbeeld.js';
import { NEDERLAND, inkleuring, sterId, sterrenVan } from '../nederland/wereld.js';
import { staat } from '../opslag.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { sterrenHtml, topbalk } from '../weergave.js';

// Maat van het kaartvak in px (css/nederland.css).
export const OVERZICHT_MAAT = [440, 544];

const ONDERDELEN = [
  { id: 'provincies', naam: 'Provincies' },
  { id: 'hoofdsteden', naam: 'Hoofdsteden' },
];

// De provincieknoppen op alfabet, in rijen van vier.
export const RASTER = [...PROVINCIES].sort((a, b) => PER_ID[a].naam.localeCompare(PER_ID[b].naam, 'nl'));
const KOLOMMEN = 4;

// Waar een pijltje heen gaat: de sleutel van de volgende knop, of null (de focus blijft staan).
// Sleutels: 'terug', 'provincies', 'hoofdsteden', een provincie-id en 'alle'. laatste: de laatste
// provincieknop met de focus; daar gaat ↑ vanaf Heel Nederland heen (anders Zeeland).
export function pijlNaar(sleutel, richting, laatste = null) {
  const vast = {
    terug: { rechts: 'provincies', omlaag: 'provincies' },
    provincies: { rechts: 'hoofdsteden', omhoog: 'terug', omlaag: RASTER[0] },
    hoofdsteden: { links: 'provincies', omhoog: 'terug', omlaag: RASTER[2] },
    alle: { omhoog: laatste ?? 'pv-zeeland' },
  };
  if (vast[sleutel]) return vast[sleutel][richting] ?? null;
  const i = RASTER.indexOf(sleutel);
  if (i < 0) return null;
  const kolom = i % KOLOMMEN;
  if (richting === 'links') return kolom > 0 ? RASTER[i - 1] : null;
  if (richting === 'rechts') return kolom < KOLOMMEN - 1 ? RASTER[i + 1] : null;
  if (richting === 'omhoog') return i >= KOLOMMEN ? RASTER[i - KOLOMMEN] : kolom < 2 ? 'provincies' : 'hoofdsteden';
  if (richting === 'omlaag') return RASTER[i + KOLOMMEN] ?? 'alle';
  return null;
}

const PIJLEN = ['links', 'rechts', 'omhoog', 'omlaag'];

export const nederland = {
  maak({ toon, terug, zetFocus }) {
    const el = maakEl();
    el.classList.add('nl-scherm');
    let laatste = null;
    // De knop waarmee een ronde begon: daar staat de focus weer na afloop (de ronde zet bij het
    // opbouwen de focus al voordat hij zichtbaar is, dus .heeft-focus is dan weg).
    let gestart = null;

    function teken() {
      const p = staat.profiel;
      const [breedte, hoogte] = OVERZICHT_MAAT;
      const sterren = (id) => sterrenHtml(Math.min(3, sterrenVan(p, id)));
      el.innerHTML = `
        ${themaAchtergrond(p.thema, 'nederland', 'ab-nl')}
        ${topbalk(p)}
        <div class="nk-inhoud">
          <div class="kopregel">
            <button class="knop" data-focus data-actie="terug">← Terug</button>
            <h1>${NEDERLAND.emoji} ${NEDERLAND.naam}<span class="kop-ondertitel">${NEDERLAND.ondertitel}</span></h1>
          </div>
          <div class="nk-onder">
            <div class="kaartvak nk-kaart" aria-hidden="true">
              ${kaartSvg({ doelen: PROVINCIES, kleuren: inkleuring(p, PROVINCIES), breedte, hoogte })}
            </div>
            <div class="nk-kolom">
              <div class="nk-boven">
                ${ONDERDELEN.map((o, i) => `
                  <button class="knop nk-hoofd" data-focus${i ? '' : '="eerst"'} data-actie="onderdeel" data-waarde="${o.id}">
                    <span class="nk-naam">${o.naam}</span>${sterren(sterId(o.id, 'alle', true))}
                  </button>`).join('')}
              </div>
              <h2 class="nk-kopje">Wat ligt er in…?</h2>
              <div class="nk-raster">
                ${RASTER.map((id) => `
                  <button class="knop nk-pv" data-focus data-actie="provincie" data-waarde="${id}">
                    <span class="nk-naam">${PER_ID[id].naam}</span>${sterren(sterId('plaatsen', id, true))}
                  </button>`).join('')}
              </div>
              <button class="knop nk-alle" data-focus data-actie="alle">
                <span class="nk-naam">Heel Nederland</span>${sterren(sterId('plaatsen', 'alle', true))}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    opKlik(el, {
      terug: () => terug(),
      onderdeel(onderdeel, knop) {
        gestart = knop;
        toon('ronde', { levelId: sterId(onderdeel, 'alle', true) });
      },
      provincie: (id) => toon('nederlandProvincie', { provincie: id }),
      alle: () => toon('nederlandProvincie', { provincie: null }),
    });

    const sleutelVan = (knop) => (knop.dataset.actie === 'onderdeel' || knop.dataset.actie === 'provincie' ? knop.dataset.waarde : knop.dataset.actie);
    const elVoor = (sleutel) => {
      if (sleutel === 'terug' || sleutel === 'alle') return el.querySelector(`[data-actie="${sleutel}"]`);
      return el.querySelector(`[data-waarde="${sleutel}"]`);
    };

    function bijToets({ actie }) {
      const focus = el.querySelector('.heeft-focus');
      if (!focus || !PIJLEN.includes(actie)) return false;
      const naar = pijlNaar(sleutelVan(focus), actie, laatste);
      if (naar) zetFocus(elVoor(naar));
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
        const zoek = vorige?.dataset.actie && `[data-actie="${vorige.dataset.actie}"]${waarde}`;
        teken();
        if (zoek) zetFocus(el.querySelector(zoek));
      },
      // De kaart leest mee: de provincie van de knop met de focus wordt geel, bij Heel Nederland alles.
      bijFocus(doel) {
        const kaart = el.querySelector('.nk-kaart');
        kaart.querySelectorAll('.nl-focus').forEach((pad) => pad.classList.remove('nl-focus'));
        if (doel.dataset.actie === 'provincie') {
          laatste = doel.dataset.waarde;
          const pad = kaart.querySelector(`[data-doel="${laatste}"]`);
          // Achteraan in de eigen groep, zodat de dikke rand bovenop de buren ligt.
          pad.parentNode.append(pad);
          pad.classList.add('nl-focus');
        } else if (doel.dataset.actie === 'alle') {
          kaart.querySelectorAll('[data-doel]').forEach((pad) => pad.classList.add('nl-focus'));
        }
      },
      bijToets,
    };
  },
};
