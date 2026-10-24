// De Wiebel als genest SVG met eigen coördinaten (240×260). Elk onderdeel heeft een vast draaipunt
// (zie css/wiebel.css) en elke plek voor spullen een vaste ankerplek, zodat alles meebeweegt.
// Lagen: w-sprong (springen) > w-kantel (kantelen) > w-lijf (rustig wiebelen), zodat CSS- en
// WAAPI-animaties elkaar niet in de weg zitten.

export const KLEUREN = {
  paars: { naam: 'Paars', lijf: '#9b6bff', donker: '#5f36c4', buik: '#cdb3ff', spriet: '#ffd23f' },
  groen: { naam: 'Groen', lijf: '#4fd27a', donker: '#24914a', buik: '#b0f2c6', spriet: '#ff8cc6' },
  oranje: { naam: 'Oranje', lijf: '#ff9d3c', donker: '#c8650f', buik: '#ffd5a8', spriet: '#7fd6ff' },
  roze: { naam: 'Roze', lijf: '#ff7ab8', donker: '#c93f83', buik: '#ffc8e2', spriet: '#ffe066' },
  blauw: { naam: 'Blauw', lijf: '#4ea8ff', donker: '#1f6fc4', buik: '#b3dbff', spriet: '#ff9d3c' },
};

export const ROMP = 'M120,68 C165,68 192,110 194,160 C196,205 168,232 120,232 C72,232 44,205 46,160 C48,110 75,68 120,68 Z';

// Groei op de stadia van HUISDIER_GRENZEN (beloningen.js): de hele figuur schaalt rond de grond,
// de voelsprieten worden langer en het laatste stadium krijgt twinkelende sterretjes.
export const STADIUM_NAMEN = ['Mini-Wiebel', 'Kleine Wiebel', 'Grote Wiebel', 'Super-Wiebel'];
export const GROEI = [0.7, 0.8, 0.9, 1];
const SPRIET = [0.6, 0.75, 0.9, 1];
const GROND = 238;
const STERREN = [[34, 104], [66, 50], [212, 116]];

const rond = (n) => +n.toFixed(1);

// Kleiner stadium = ruimere viewBox: de figuur krimpt binnen hetzelfde vak en blijft op de grond
// staan. Alle coördinaten (draaipunten, ankerplekken) blijven zo gelijk.
function viewBox(groei) {
  const b = 240 / groei;
  const h = 260 / groei;
  return [120 - b / 2, GROND - GROND / groei, b, h].map(rond).join(' ');
}

// Voelspriet vanaf de basis (bx, 76) naar de punt (bx + dx, 40) bij volle lengte.
function spriet(bx, dx, lengte) {
  const tip = [rond(bx + dx * lengte), rond(76 - 36 * lengte)];
  const knik = [rond(bx + Math.sign(dx) * 8 * lengte), rond(76 - 20 * lengte)];
  return `<path class="w-spriet-steel" d="M${bx},76 Q${knik} ${tip}"/><circle class="w-spriet-bol" cx="${tip[0]}" cy="${rond(tip[1] - 2)}" r="9"/>`;
}

const STER = 'M0,-9 L2.5,-2.5 L9,0 L2.5,2.5 L0,9 L-2.5,2.5 L-9,0 L-2.5,-2.5 Z';
const sterretjes = () =>
  `<g class="w-sterren">${STERREN.map(([sx, sy]) => `<g transform="translate(${sx} ${sy})"><path class="w-ster" d="${STER}"/></g>`).join('')}</g>`;

// Lege plek waar later een spul in getekend kan worden.
const plek = (naam) => `<g class="w-plek" data-plek="${naam}"></g>`;

// staat: { kleur, stadium } met stadium 0–3 (standaard 3, volgroeid). prefix maakt de ids uniek als
// er meer Wiebels op één pagina staan. x, y en schaal plaatsen de Wiebel in de omringende SVG
// (schaal 1 = 240×260); het stadium verandert alleen de figuur binnen dat vak.
export function wiebelSvg(staat, prefix, { x = 0, y = 0, schaal = 1 } = {}) {
  const k = KLEUREN[staat.kleur] ?? KLEUREN.paars;
  const stadium = GROEI[staat.stadium] === undefined ? GROEI.length - 1 : staat.stadium;
  return `<svg class="wiebel" x="${x}" y="${y}" width="${240 * schaal}" height="${260 * schaal}" viewBox="${viewBox(GROEI[stadium])}"
      style="overflow:visible;--lijf:${k.lijf};--donker:${k.donker};--buik:${k.buik};--spriet:${k.spriet}" data-mond="rust" data-stadium="${stadium}">
    <defs><clipPath id="${prefix}-romp"><path d="${ROMP}"/></clipPath></defs>
    <ellipse class="w-schaduw" cx="120" cy="238" rx="58" ry="9"/>
    <g class="w-sprong"><g class="w-kantel"><g class="w-lijf">
      ${stadium === GROEI.length - 1 ? sterretjes() : ''}
      <g class="w-spriet-basis l"><g class="w-spriet l">${spriet(106, -14, SPRIET[stadium])}</g></g>
      <g class="w-spriet-basis r"><g class="w-spriet r">${spriet(134, 16, SPRIET[stadium])}</g></g>
      <g class="w-arm-basis l"><g class="w-arm l"><path class="w-arm-rand" d="M62,160 Q38,170 34,192"/><path class="w-arm-vul" d="M62,160 Q38,170 34,192"/></g></g>
      <g class="w-arm-basis r"><g class="w-arm r"><path class="w-arm-rand" d="M178,160 Q202,170 206,192"/><path class="w-arm-vul" d="M178,160 Q202,170 206,192"/>${plek('hand')}</g></g>
      <g class="w-voeten"><ellipse class="w-voet" cx="94" cy="229" rx="17" ry="10"/><ellipse class="w-voet" cx="146" cy="229" rx="17" ry="10"/></g>
      <path class="w-romp" d="${ROMP}"/>
      <ellipse class="w-buik" cx="120" cy="190" rx="46" ry="34"/>
      <ellipse cx="88" cy="100" rx="14" ry="8" fill="#fff" opacity=".25" transform="rotate(-30 88 100)"/>
      ${plek('lijf')}${plek('broek')}${plek('voeten')}
      <g class="w-gezicht">
        <ellipse cx="76" cy="152" rx="10" ry="6" fill="#ff7aa8" opacity=".55"/><ellipse cx="164" cy="152" rx="10" ry="6" fill="#ff7aa8" opacity=".55"/>
        <g class="w-ogen">
          <ellipse cx="98" cy="128" rx="17" ry="20" fill="#fff"/><ellipse cx="142" cy="128" rx="17" ry="20" fill="#fff"/>
          <g class="w-blik"><g class="w-pupillen">
            <circle cx="100" cy="131" r="9" fill="#1d1530"/><circle cx="144" cy="131" r="9" fill="#1d1530"/>
            <circle cx="104" cy="126" r="3.5" fill="#fff"/><circle cx="148" cy="126" r="3.5" fill="#fff"/>
          </g></g>
        </g>
        <g class="w-blije-ogen" fill="none" stroke="#1d1530" stroke-width="5" stroke-linecap="round">
          <path d="M84,132 Q98,114 112,132"/><path d="M128,132 Q142,114 156,132"/>
        </g>
        <path class="w-mond-rust" d="M106,152 Q120,165 134,152" fill="none" stroke="#2a1330" stroke-width="4.5" stroke-linecap="round"/>
        <g class="w-mond-open" style="transform:scaleY(.1)"><ellipse cx="120" cy="157" rx="10" ry="9" fill="#3a1030"/><ellipse cx="120" cy="162" rx="6" ry="3" fill="#ff7a9a"/></g>
        <g class="w-mond-blij"><path d="M102,149 Q120,178 138,149 Z" fill="#3a1030"/><ellipse cx="120" cy="164" rx="8" ry="4" fill="#ff7a9a"/></g>
        ${plek('gezicht')}
      </g>
      ${plek('nek')}${plek('hoofd')}
    </g></g></g>
  </svg>`;
}
