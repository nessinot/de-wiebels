// Testpagina om de bediening op de tv te controleren.

const KLEUREN = ['rood', 'groen', 'geel', 'blauw'];

let info;

export const bedieningstest = {
  maak({ toon }) {
    const el = document.createElement('section');
    el.innerHTML = `
      <h1>Bedieningstest</h1>
      <div class="test-indeling">
        <div class="test-raster">
          <button class="knop" data-focus style="grid-area: a">A</button>
          <button class="knop" data-focus style="grid-area: b">B</button>
          <button class="knop" data-focus style="grid-area: c">C</button>
          <button class="knop" data-focus style="grid-area: d">D (breed)</button>
          <button class="knop" data-focus style="grid-area: e">E (hoog)</button>
          <button class="knop" data-focus style="grid-area: f">F</button>
          <button class="knop" data-focus style="grid-area: g">G</button>
          <button class="knop" data-focus data-naar style="grid-area: h">Naar scherm 2 →</button>
        </div>
        <div class="test-info">
          <p>Laatste toets: <strong data-veld="toets">—</strong></p>
          <p>Gekozen: <strong data-veld="gekozen">—</strong></p>
          <p>Cijfers: <strong data-veld="cijfers">—</strong></p>
          <p class="kleurtellers">
            ${KLEUREN.map((k) => `<span class="kleur kleur-${k}">0</span>`).join('')}
          </p>
          <p class="melding" data-veld="melding"></p>
        </div>
      </div>
    `;

    const veld = (naam) => el.querySelector(`[data-veld="${naam}"]`);
    const tellers = Object.fromEntries(KLEUREN.map((k) => [k, 0]));
    const cijfers = [];

    info = {
      toets(code, actie) {
        veld('toets').textContent = `${actie} (${code})`;
      },
      kleur(k) {
        tellers[k] += 1;
        el.querySelector(`.kleur-${k}`).textContent = tellers[k];
      },
      cijfer(c) {
        cijfers.push(c);
        veld('cijfers').textContent = cijfers.slice(-10).join(' ');
      },
      melding(tekst) {
        veld('melding').textContent = tekst;
      },
    };

    el.querySelectorAll('.test-raster .knop').forEach((knop) => {
      knop.addEventListener('click', () => {
        if (knop.hasAttribute('data-naar')) return toon('tweedeScherm');
        veld('gekozen').textContent = knop.textContent;
      });
    });
    return el;
  },

  bijToets({ actie, code, cijfer }) {
    info.toets(code, actie);
    if (KLEUREN.includes(actie)) info.kleur(actie);
    if (actie === 'cijfer') info.cijfer(cijfer);
    return false;
  },

  bijTerugOpStart(bron) {
    const via = bron === 'browser' ? 'browser-terug' : 'toets';
    info.melding(`Terug opgevangen (${via}): de app blijft open ✔`);
  },
};
