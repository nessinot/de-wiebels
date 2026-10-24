// Spullen voor de Wiebel: de catalogus van het winkeltje, kopen, aantrekken en combinaties.
// Draagbare spullen zijn SVG in de coördinaten van de Wiebel (240×260, zie wiebel.js) en komen in
// de ankerplek van hun plek. Spullen "ernaast" staan in de scène (x -20 tot 420, grond rond y 270)
// links van de Wiebel. Achtergronden zijn scènes uit scene.js met dezelfde id.
// In het profiel: cosmetica = { gekocht: [id], aan: { plek: id } }. Gekocht is niet hetzelfde als
// aan: per plek is er hooguit één spul aan.

export const PLEKKEN = [
  { id: 'kleur', titel: 'Kleur', emoji: '🎨' },
  { id: 'hoofd', titel: 'Op het hoofd', emoji: '🧢', beeld: '20 10 200 150' },
  { id: 'gezicht', titel: 'Op het gezicht', emoji: '🕶️', beeld: '50 86 140 94' },
  { id: 'nek', titel: 'Om de nek', emoji: '🧣', beeld: '40 130 160 110' },
  { id: 'lijf', titel: 'Shirt en jas', emoji: '👕', beeld: '20 100 200 150' },
  { id: 'broek', titel: 'Broek', emoji: '🩳', beeld: '30 160 180 90' },
  { id: 'voeten', titel: 'Aan de voeten', emoji: '👟', beeld: '50 180 140 75' },
  { id: 'hand', titel: 'In de hand', emoji: '🎈', beeld: '20 -40 270 270' },
  { id: 'naast', titel: 'Ernaast', emoji: '🌻' },
  { id: 'achtergrond', titel: 'Achtergrond', emoji: '🖼️' },
];

// Plekken die de Wiebel zelf draagt (met een ankerplek in wiebel.js).
export const DRAAGBAAR = PLEKKEN.filter((p) => p.beeld).map((p) => p.id);

// Hals en lijf onder de nek, voor kleding (wordt bijgesneden tot de romp).
export const HALS = 'M30,166 Q120,188 210,166 V240 H30 Z';

const kleding = (p, inhoud) => `<g clip-path="url(#${p}-romp)">${inhoud}</g>`;

function ster(cx, cy, buiten, binnen, punten = 5) {
  const hoeken = Array.from({ length: punten * 2 }, (_, i) => {
    const r = i % 2 ? binnen : buiten;
    const a = (Math.PI / punten) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${hoeken.join(' L')} Z`;
}

function hart(cx, cy, s) {
  return `M${cx},${cy + s * 0.9} C${cx - s * 1.4},${cy} ${cx - s},${cy - s * 1.1} ${cx},${cy - s * 0.35} C${cx + s},${cy - s * 1.1} ${cx + s * 1.4},${cy} ${cx},${cy + s * 0.9} Z`;
}

// Hoofd
function pet(kleur, rand, streep) {
  return `<g transform="rotate(-8 120 80)">
    <path d="M80,85 C80,44 160,44 160,85 Z" fill="${kleur}" stroke="${rand}" stroke-width="3" stroke-linejoin="round"/>
    ${streep ? '<path d="M85,70 Q120,58 155,70 M81,80 Q120,70 159,80" stroke="#fff8e7" stroke-width="5" fill="none"/>' : `<path d="M120,48 V85" stroke="${rand}" stroke-width="2.5" opacity=".55"/>`}
    <path d="M152,80 Q188,74 200,88 Q174,98 148,89 Z" fill="${rand}"/>
    <circle cx="120" cy="47" r="5.5" fill="${rand}"/>
  </g>`;
}

const BLOEMKLEUREN = ['#ff7ab8', '#ffd23f', '#7fd6ff', '#ff9d3c', '#ff7ab8', '#ffd23f', '#7fd6ff'];
const KRANS = [[78, 94], [92, 81], [107, 73], [123, 71], [139, 74], [154, 82], [166, 95]];
function bloemetje([x, y], kleur) {
  const blad = [[0, -5], [4.8, -1.5], [2.9, 4], [-2.9, 4], [-4.8, -1.5]];
  return `<g transform="translate(${x} ${y})">${blad.map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="4.6" fill="${kleur}"/>`).join('')}<circle r="3" fill="#fff3a8"/></g>`;
}

// Hand (de hand zit op 206,192 in de rechterarm)
function paraplu(kleur, rand, extra = '') {
  return `<g class="w-handding"><g transform="rotate(-18 206 192)">
    <path d="M206,30 V200 q0,12 -10,12 q-8,0 -8,-8" fill="none" stroke="#5b4a6e" stroke-width="4" stroke-linecap="round"/>
    <path d="M126,34 C136,-26 276,-26 286,34 Q266,22 246,34 Q226,22 206,34 Q186,22 166,34 Q146,22 126,34 Z" fill="${kleur}" stroke="${rand}" stroke-width="3" stroke-linejoin="round"/>
    ${extra}
    <path d="M206,-11 V-21" stroke="#5b4a6e" stroke-width="4" stroke-linecap="round"/>
  </g></g>`;
}

const touwtje = '<path d="M206,192 Q214,140 222,102" fill="none" stroke="#fff8e7" stroke-width="2" opacity=".85"/>';

// Voeten
function sneaker(cx) {
  return `<ellipse cx="${cx}" cy="230" rx="21" ry="11" fill="#fff8e7" stroke="#d8cfe0" stroke-width="2"/>
    <path d="M${cx - 21},234 Q${cx},244 ${cx + 21},234" stroke="#ff5c5c" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M${cx - 8},223 L${cx + 6},231" stroke="#4ea8ff" stroke-width="4" stroke-linecap="round"/>`;
}

function laars(cx, richting) {
  const t = cx + 24 * richting;
  const z = cx + 16 * richting;
  const h = cx - 16 * richting;
  return `<path d="M${h},238 L${h},215 Q${h},209 ${cx - 10 * richting},209 L${cx + 10 * richting},209 Q${z},209 ${z},215 L${z},230 Q${t},232 ${t},238 Z" fill="#5ee07a" stroke="#2f9e50" stroke-width="3" stroke-linejoin="round"/>
    <rect x="${cx - 17}" y="207" width="34" height="7" rx="3.5" fill="#2f9e50"/>`;
}

function flipper(cx) {
  return `<path d="M${cx - 13},218 Q${cx},212 ${cx + 13},218 L${cx + 24},244 Q${cx},252 ${cx - 24},244 Z" fill="#4ea8ff" stroke="#1f6fc4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${cx - 8},230 L${cx - 12},244 M${cx},230 V247 M${cx + 8},230 L${cx + 12},244" stroke="#1f6fc4" stroke-width="2"/>`;
}

function balletschoen(cx) {
  return `<path d="M${cx - 10},226 L${cx + 6},210 M${cx + 10},226 L${cx - 6},210" stroke="#e0307a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="${cx}" cy="231" rx="18" ry="9" fill="#ffc8e2" stroke="#e0307a" stroke-width="2.5"/>
    <circle cx="${cx}" cy="225" r="3.5" fill="#e0307a"/>`;
}

// Lijf
function shirt(kleur, rand) {
  return (p) => kleding(p, `
    <path d="${HALS}" fill="${kleur}"/>
    <path d="M30,166 Q120,188 210,166" stroke="${rand}" stroke-width="5" fill="none"/>
    <path d="M102,176 Q120,192 138,176" stroke="${rand}" stroke-width="4" fill="none"/>`);
}

// Ernaast: een emoji of eigen tekening op de grond links van de Wiebel.
function ernaast(emoji, beweging = '') {
  const tekst = `<text x="44" y="278" font-size="56" text-anchor="middle">${emoji}</text>`;
  return () => (beweging ? `<g class="${beweging}">${tekst}</g>` : tekst);
}

const ZANDKASTEEL = `<g transform="translate(44 278)" fill="#e9c27a" stroke="#b8914a" stroke-width="2.5" stroke-linejoin="round">
  <path d="M-38,0 V-34 H-30 V-28 H-22 V-34 H-14 V-28 H14 V-34 H22 V-28 H30 V-34 H38 V0 Z"/>
  <path d="M-14,-28 V-60 H-9 V-54 H-3 V-60 H3 V-54 H9 V-60 H14 V-28 Z"/>
  <path d="M-7,0 V-12 A7,7 0 0 1 7,-12 V0 Z" fill="#b8914a"/>
  <path d="M0,-60 V-78" fill="none" stroke="#8a6a4a"/><path d="M0,-78 L16,-73 L0,-68 Z" fill="#ff5c5c" stroke="none"/>
</g>`;

const SCHATKIST = `<g transform="translate(44 278)">
  <rect x="-34" y="-30" width="68" height="30" rx="3" fill="#a8652e" stroke="#6b3d16" stroke-width="3"/>
  <path d="M-34,-30 V-38 Q0,-62 34,-38 V-30 Z" fill="#c07a3a" stroke="#6b3d16" stroke-width="3" stroke-linejoin="round"/>
  <path d="M-22,-48 V0 M22,-48 V0" stroke="#ffd23f" stroke-width="5"/>
  <rect x="-7" y="-37" width="14" height="14" rx="2" fill="#ffd23f" stroke="#c99a10" stroke-width="2"/>
  <circle cx="0" cy="-30" r="2.5" fill="#6b3d16"/>
</g>`;

// De catalogus. Lange samengestelde namen hebben een zacht afbreekstreepje (­), zodat ze in
// een kaartje over twee regels passen.
export const SPULLEN = [
  // Hoofd
  { id: 'pet-rood', plek: 'hoofd', naam: 'Rode pet', prijs: 20, teken: () => pet('#ff5c5c', '#b82f3c') },
  { id: 'pet-blauw', plek: 'hoofd', naam: 'Blauwe pet', prijs: 20, teken: () => pet('#4ea8ff', '#1f6fc4') },
  { id: 'pet-streep', plek: 'hoofd', naam: 'Gestreepte pet', prijs: 30, teken: () => pet('#5ee07a', '#2f9e50', true) },
  {
    id: 'muts', plek: 'hoofd', naam: 'Muts met pompon', prijs: 35,
    teken: () => `<g>
      <path d="M78,92 C74,38 166,38 162,92 Z" fill="#4ea8ff" stroke="#2a6fc4" stroke-width="3"/>
      <path d="M100,52 V88 M120,46 V88 M140,52 V88" stroke="#2a6fc4" stroke-width="2.5" opacity=".6"/>
      <rect x="72" y="80" width="96" height="18" rx="9" fill="#2a6fc4"/>
      <circle cx="120" cy="40" r="13" fill="#fff8e7" stroke="#d8cfe0" stroke-width="2"/>
    </g>`,
  },
  {
    id: 'feesthoedje', plek: 'hoofd', naam: 'Feest­hoedje', prijs: 30,
    teken: () => `<g transform="rotate(10 120 70)">
      <path d="M94,86 L120,26 L146,86 Z" fill="#ff7ab8" stroke="#c93f83" stroke-width="3" stroke-linejoin="round"/>
      <path d="M104,64 H136 M111,48 H129" stroke="#ffd23f" stroke-width="5"/>
      <circle cx="112" cy="78" r="3" fill="#fff8e7"/><circle cx="130" cy="76" r="3" fill="#7fd6ff"/>
      <circle cx="120" cy="24" r="8" fill="#ffd23f"/>
    </g>`,
  },
  {
    id: 'zonnehoed', plek: 'hoofd', naam: 'Zonnehoed', prijs: 40,
    teken: () => `<g transform="rotate(-6 120 80)">
      <ellipse cx="120" cy="84" rx="74" ry="14" fill="#f2cf6b" stroke="#c9a03a" stroke-width="3"/>
      <path d="M86,84 C86,46 154,46 154,84 Z" fill="#f2cf6b" stroke="#c9a03a" stroke-width="3"/>
      <path d="M87,74 Q120,82 153,74 L154,84 Q120,92 86,84 Z" fill="#ff5c7a"/>
      ${bloemetje([146, 78], '#fff8e7')}
    </g>`,
  },
  {
    id: 'hoge-hoed', plek: 'hoofd', naam: 'Hoge hoed', prijs: 40,
    teken: () => `<g transform="rotate(-5 120 80)">
      <rect x="92" y="28" width="56" height="56" rx="4" fill="#2a2440" stroke="#14101f" stroke-width="3"/>
      <rect x="92" y="66" width="56" height="10" fill="#ff5c5c"/>
      <ellipse cx="120" cy="86" rx="46" ry="9" fill="#2a2440" stroke="#14101f" stroke-width="3"/>
    </g>`,
  },
  {
    id: 'cowboyhoed', plek: 'hoofd', naam: 'Cowboyhoed', prijs: 50,
    teken: () => `<g transform="rotate(-6 120 80)">
      <path d="M90,84 C88,52 100,44 112,50 Q120,56 128,50 C140,44 152,52 150,84 Z" fill="#b8763a" stroke="#7a4a1e" stroke-width="3"/>
      <path d="M90,74 Q120,80 150,74 L150,84 Q120,90 90,84 Z" fill="#7a4a1e"/>
      <path d="M44,70 Q58,94 120,94 Q182,94 196,70 Q192,104 120,106 Q48,104 44,70 Z" fill="#b8763a" stroke="#7a4a1e" stroke-width="3" stroke-linejoin="round"/>
    </g>`,
  },
  {
    id: 'bloemenkrans', plek: 'hoofd', naam: 'Bloemen­krans', prijs: 45,
    teken: () => `<g>
      <path d="M76,96 Q120,52 168,96" fill="none" stroke="#3fa35a" stroke-width="5" stroke-linecap="round"/>
      ${KRANS.map((punt, i) => bloemetje(punt, BLOEMKLEUREN[i])).join('')}
    </g>`,
  },
  {
    id: 'koptelefoon', plek: 'hoofd', naam: 'Koptelefoon', prijs: 60,
    teken: () => `<g>
      <path d="M56,124 C54,46 186,46 184,124" fill="none" stroke="#2a2440" stroke-width="9" stroke-linecap="round"/>
      <rect x="40" y="106" width="24" height="40" rx="10" fill="#ff5c7a" stroke="#2a2440" stroke-width="3"/>
      <rect x="176" y="106" width="24" height="40" rx="10" fill="#ff5c7a" stroke="#2a2440" stroke-width="3"/>
    </g>`,
  },
  {
    id: 'afstudeerhoed', plek: 'hoofd', naam: 'Afstudeer­hoed', prijs: 60,
    teken: () => `<g transform="rotate(-6 120 70)">
      <path d="M92,68 V86 Q120,96 148,86 V68 Z" fill="#2a2440"/>
      <path d="M58,62 L120,42 L182,62 L120,82 Z" fill="#2a2440" stroke="#14101f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M120,62 L170,70 V96" fill="none" stroke="#ffd23f" stroke-width="3"/>
      <circle cx="120" cy="62" r="4" fill="#ffd23f"/>
      <rect x="166" y="94" width="8" height="14" rx="3" fill="#ffd23f"/>
    </g>`,
  },
  {
    id: 'helm', plek: 'hoofd', naam: 'Astronauten­helm', prijs: 90,
    teken: () => `<g>
      <circle cx="120" cy="124" r="98" fill="#bfe3ff" fill-opacity=".18" stroke="#e8eef8" stroke-width="7"/>
      <path d="M58,74 Q78,46 112,36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>
      <path d="M36,182 Q120,218 204,182 L200,198 Q120,234 40,198 Z" fill="#e8eef8" stroke="#9aa6bd" stroke-width="3"/>
    </g>`,
  },
  {
    id: 'kroon', plek: 'hoofd', naam: 'Kroon', prijs: 150,
    teken: () => `<g transform="rotate(6 120 70)">
      <path d="M88,84 L86,50 L103,64 L120,42 L137,64 L154,50 L152,84 Z" fill="#ffd23f" stroke="#c99a10" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="120" cy="68" r="5" fill="#ff5c7a"/><circle cx="101" cy="74" r="3.5" fill="#4ea8ff"/><circle cx="139" cy="74" r="3.5" fill="#5ee07a"/>
    </g>`,
  },

  // Gezicht
  {
    id: 'ronde-bril', plek: 'gezicht', naam: 'Ronde bril', prijs: 20,
    teken: () => `<g fill="#fff" fill-opacity=".12" stroke="#5b3a1e" stroke-width="4">
      <circle cx="98" cy="128" r="21"/><circle cx="142" cy="128" r="21"/>
      <path d="M114,121 Q120,115 126,121 M77,124 L58,118 M163,124 L182,118" fill="none"/>
    </g>`,
  },
  {
    id: 'snor', plek: 'gezicht', naam: 'Snor', prijs: 20,
    teken: () => '<path d="M120,142 C112,134 96,134 88,142 C84,146 80,144 78,140 C80,152 100,154 120,147 C140,154 160,152 162,140 C160,144 156,146 152,142 C144,134 128,134 120,142 Z" fill="#5b3a1e"/>',
  },
  {
    id: 'zonnebril', plek: 'gezicht', naam: 'Zonnebril', prijs: 25,
    teken: () => `<g>
      <path d="M74,122 H166" stroke="#1d1530" stroke-width="4"/>
      <rect x="78" y="114" width="38" height="28" rx="12" fill="#1d1530"/><rect x="124" y="114" width="38" height="28" rx="12" fill="#1d1530"/>
      <path d="M86,121 h10 M132,121 h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    </g>`,
  },
  {
    id: 'duikbril', plek: 'gezicht', naam: 'Duikbril', prijs: 30,
    teken: () => `<g>
      <path d="M46,126 H74 M166,126 H194" stroke="#ff9d3c" stroke-width="7"/>
      <rect x="72" y="106" width="96" height="44" rx="20" fill="#7fd6ff" fill-opacity=".45" stroke="#ff9d3c" stroke-width="6"/>
      <path d="M84,116 q8,-4 16,0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M178,132 V66 q0,-10 10,-10" fill="none" stroke="#5ee07a" stroke-width="8" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'hartjesbril', plek: 'gezicht', naam: 'Hartjesbril', prijs: 35,
    teken: () => `<g fill="#ff7ab8" fill-opacity=".55" stroke="#e0307a" stroke-width="3.5">
      <path d="M114,124 Q120,118 126,124" fill="none"/>
      <path d="${hart(98, 128, 19)}"/><path d="${hart(142, 128, 19)}"/>
    </g>`,
  },

  // Nek
  {
    id: 'strik', plek: 'nek', naam: 'Strik', prijs: 15,
    teken: () => `<g fill="#ff7ab8" stroke="#c93f83" stroke-width="2.5" stroke-linejoin="round">
      <path d="M120,177 L98,165 L98,189 Z"/><path d="M120,177 L142,165 L142,189 Z"/><circle cx="120" cy="177" r="6"/>
    </g>`,
  },
  {
    id: 'ketting', plek: 'nek', naam: 'Kralen­ketting', prijs: 25,
    teken: () => {
      const kleuren = ['#ff5c7a', '#ffd23f', '#7fd6ff', '#5ee07a'];
      const kralen = Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        const x = (1 - t) ** 2 * 64 + 2 * (1 - t) * t * 120 + t ** 2 * 176;
        const y = (1 - t) ** 2 * 166 + 2 * (1 - t) * t * 206 + t ** 2 * 166;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${kleuren[i % 4]}" stroke="#2a1330" stroke-width="1.5"/>`;
      });
      return `<g>${kralen.join('')}</g>`;
    },
  },
  {
    id: 'sjaal', plek: 'nek', naam: 'Sjaal', prijs: 30,
    teken: () => `<g>
      <path d="M48,160 Q120,184 192,160 L194,176 Q120,200 46,176 Z" fill="#ff5c5c" stroke="#c23a3a" stroke-width="2.5"/>
      <path d="M84,170 L82,186 M120,174 L120,190 M156,170 L158,186" stroke="#fff8e7" stroke-width="5"/>
      <path d="M148,180 L168,177 L174,216 L156,218 Z" fill="#ff5c5c" stroke="#c23a3a" stroke-width="2.5"/>
      <path d="M158,218 v7 M164,217 v7 M170,216 v7" stroke="#c23a3a" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'medaille', plek: 'nek', naam: 'Medaille', prijs: 40,
    teken: () => `<g>
      <path d="M90,166 L114,200 L124,198 L104,168 Z" fill="#4ea8ff"/>
      <path d="M150,166 L126,200 L116,198 L136,168 Z" fill="#ff5c5c"/>
      <circle cx="120" cy="208" r="15" fill="#ffd23f" stroke="#c99a10" stroke-width="3"/>
      <path d="${ster(120, 208, 8, 3.5)}" fill="#c99a10"/>
    </g>`,
  },

  // Lijf
  { id: 'shirt-rood', plek: 'lijf', naam: 'Rood T-shirt', prijs: 30, mouw: '#ff5c5c', teken: shirt('#ff5c5c', '#c23a3a') },
  { id: 'shirt-blauw', plek: 'lijf', naam: 'Blauw T-shirt', prijs: 30, mouw: '#4ea8ff', teken: shirt('#4ea8ff', '#1f6fc4') },
  { id: 'shirt-groen', plek: 'lijf', naam: 'Groen T-shirt', prijs: 30, mouw: '#5ee07a', teken: shirt('#5ee07a', '#2f9e50') },
  {
    id: 'shirt-streep', plek: 'lijf', naam: 'Gestreept shirt', prijs: 40, mouw: '#4ea8ff',
    teken: (p) => kleding(p, `
      <path d="${HALS}" fill="#fff8e7"/>
      <rect x="30" y="186" width="180" height="8" fill="#4ea8ff"/><rect x="30" y="202" width="180" height="8" fill="#4ea8ff"/>
      <rect x="30" y="218" width="180" height="8" fill="#4ea8ff"/>
      <path d="M30,166 Q120,188 210,166" stroke="#4ea8ff" stroke-width="5" fill="none"/>`),
  },
  {
    id: 'voetbalshirt', plek: 'lijf', naam: 'Voetbal­shirt', prijs: 50, mouw: '#ff9d3c',
    teken: (p) => kleding(p, `
      <path d="${HALS}" fill="#ff9d3c"/>
      <path d="M30,166 Q120,188 210,166" stroke="#fff8e7" stroke-width="6" fill="none"/>
      <path d="M106,177 L120,190 L134,177" stroke="#fff8e7" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <text x="120" y="224" font-size="30" font-weight="800" text-anchor="middle" fill="#fff8e7" font-family="system-ui, sans-serif">10</text>`),
  },
  {
    id: 'regenjas', plek: 'lijf', naam: 'Gele regenjas', prijs: 60, mouw: '#ffd23f',
    teken: (p) => kleding(p, `
      <path d="${HALS}" fill="#ffd23f"/>
      <path d="M30,166 Q120,188 210,166" stroke="#d9a400" stroke-width="4" fill="none"/>
      <path d="M92,176 L120,194 L106,178 Z M148,176 L120,194 L134,178 Z" fill="#d9a400"/>
      <path d="M120,194 V236" stroke="#d9a400" stroke-width="3"/>
      <circle cx="129" cy="204" r="3.5" fill="#2a1330"/><circle cx="129" cy="218" r="3.5" fill="#2a1330"/>
      <rect x="68" y="204" width="28" height="15" rx="4" fill="none" stroke="#d9a400" stroke-width="3"/>`),
  },
  {
    id: 'cape', plek: 'lijf', naam: 'Super­helden­cape', prijs: 80,
    // De cape hangt achter de Wiebel; vooraan zit alleen de kraag met de gesp.
    achter: () => '<path d="M74,160 Q36,196 26,236 Q120,250 214,236 Q204,196 166,160 Z" fill="#ff5c5c" stroke="#b82f3c" stroke-width="3" stroke-linejoin="round"/>',
    teken: () => `<g>
      <path d="M62,164 Q120,186 178,164 L174,176 Q120,198 66,176 Z" fill="#ff5c5c" stroke="#b82f3c" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="120" cy="186" r="9" fill="#ffd23f" stroke="#c99a10" stroke-width="2.5"/>
    </g>`,
  },

  // Broek
  {
    id: 'zwembroek', plek: 'broek', naam: 'Zwembroek', prijs: 25,
    teken: (p) => kleding(p, `
      <path d="M30,206 Q120,220 210,206 V240 H30 Z" fill="#2ec4b6"/>
      <path d="M30,206 Q120,220 210,206" stroke="#1a8a80" stroke-width="5" fill="none"/>
      <path d="M50,226 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" stroke="#fff8e7" stroke-width="3" fill="none"/>`),
  },
  {
    id: 'broekje', plek: 'broek', naam: 'Broekje', prijs: 30,
    teken: (p) => kleding(p, `
      <path d="M30,208 Q120,222 210,208 V240 H30 Z" fill="#2f6fd6"/>
      <path d="M30,208 Q120,222 210,208" stroke="#1f4fa8" stroke-width="5" fill="none"/>
      <path d="M120,216 V234" stroke="#1f4fa8" stroke-width="3"/>`),
  },
  {
    id: 'rokje', plek: 'broek', naam: 'Rokje', prijs: 30,
    teken: () => `<g>
      <path d="M58,200 Q120,214 182,200 L194,226 Q120,240 46,226 Z" fill="#ff7ab8" stroke="#c93f83" stroke-width="3" stroke-linejoin="round"/>
      <path d="M90,208 L84,232 M120,211 V236 M150,208 L156,232" stroke="#c93f83" stroke-width="2.5"/>
    </g>`,
  },

  // Voeten (de gewone voetjes verdwijnen dan)
  { id: 'flippers', plek: 'voeten', naam: 'Flippers', prijs: 30, teken: () => flipper(94) + flipper(146) },
  { id: 'sneakers', plek: 'voeten', naam: 'Sneakers', prijs: 35, teken: () => sneaker(94) + sneaker(146) },
  { id: 'balletschoenen', plek: 'voeten', naam: 'Ballet­schoentjes', prijs: 35, teken: () => balletschoen(94) + balletschoen(146) },
  { id: 'laarzen', plek: 'voeten', naam: 'Regen­laarzen', prijs: 40, teken: () => laars(94, -1) + laars(146, 1) },

  // Hand
  {
    id: 'ijsje', plek: 'hand', naam: 'IJsje', prijs: 15,
    teken: () => `<g class="w-handding">
      <path d="M195,170 L217,170 L206,200 Z" fill="#e8b46a" stroke="#b07a32" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M200,177 L212,187 M212,176 L201,189" stroke="#b07a32" stroke-width="1.5"/>
      <circle cx="206" cy="161" r="13" fill="#ffb3d6" stroke="#e0307a" stroke-width="2.5"/>
      <circle cx="209" cy="147" r="4" fill="#ff3b3b"/>
    </g>`,
  },
  {
    id: 'vlaggetje', plek: 'hand', naam: 'Vlaggetje', prijs: 15,
    teken: () => `<g class="w-handding">
      <path d="M206,200 V112" stroke="#8a6a4a" stroke-width="4" stroke-linecap="round"/>
      <path d="M206,114 L246,126 L206,140 Z" fill="#ffd23f" stroke="#c99a10" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${ster(219, 127, 5, 2.2)}" fill="#ff5c5c"/>
    </g>`,
  },
  {
    id: 'ballon-stip', plek: 'hand', naam: 'Ballon met stippen', prijs: 20,
    teken: () => `<g class="w-ballon w-handding">${touwtje}
      <path d="M219,104 L229,104 L224,97 Z" fill="#ff5c5c"/>
      <ellipse cx="224" cy="74" rx="24" ry="29" fill="#ff5c5c"/>
      <g fill="#fff" opacity=".85"><circle cx="214" cy="68" r="4"/><circle cx="233" cy="80" r="4"/><circle cx="221" cy="92" r="3"/><circle cx="234" cy="60" r="3"/><circle cx="213" cy="84" r="2.5"/></g>
    </g>`,
  },
  {
    id: 'ballon-hart', plek: 'hand', naam: 'Ballon met hartje', prijs: 25,
    teken: () => `<g class="w-ballon w-handding">${touwtje}
      <path d="${hart(224, 74, 26)}" fill="#ff7ab8" stroke="#e0307a" stroke-width="2"/>
      <ellipse cx="212" cy="66" rx="5" ry="8" fill="#fff" opacity=".45" transform="rotate(-25 212 66)"/>
    </g>`,
  },
  {
    id: 'ballon-ster', plek: 'hand', naam: 'Ballon met ster', prijs: 25,
    teken: () => `<g class="w-ballon w-handding">${touwtje}
      <path d="${ster(224, 72, 32, 15)}" fill="#ffd23f" stroke="#c99a10" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="216" cy="64" rx="4" ry="7" fill="#fff" opacity=".5" transform="rotate(-25 216 64)"/>
    </g>`,
  },
  {
    id: 'ballon-regenboog', plek: 'hand', naam: 'Regenboog­ballon', prijs: 35,
    teken: (p) => `<g class="w-ballon w-handding">${touwtje}
      <defs><clipPath id="${p}-ballon"><ellipse cx="224" cy="74" rx="24" ry="29"/></clipPath></defs>
      <path d="M219,104 L229,104 L224,97 Z" fill="#b36bff"/>
      <g clip-path="url(#${p}-ballon)">${['#ff5c5c', '#ff9d3c', '#ffd23f', '#5ee07a', '#4ea8ff', '#b36bff']
        .map((kleur, i) => `<rect x="196" y="${44 + i * 10}" width="56" height="10" fill="${kleur}"/>`).join('')}</g>
      <ellipse cx="214" cy="64" rx="5" ry="8" fill="#fff" opacity=".45" transform="rotate(-25 214 64)"/>
    </g>`,
  },
  {
    id: 'paraplu', plek: 'hand', naam: 'Paraplu', prijs: 40, dak: true,
    teken: () => paraplu('#ff5c5c', '#c23a3a', '<g fill="#fff" opacity=".9"><circle cx="160" cy="14" r="5"/><circle cx="196" cy="0" r="5"/><circle cx="232" cy="4" r="5"/><circle cx="262" cy="18" r="5"/><circle cx="212" cy="22" r="4"/></g>'),
  },
  {
    id: 'parasol', plek: 'hand', naam: 'Parasol', prijs: 45,
    teken: (p) => `<g class="w-handding"><g transform="rotate(-12 206 192)">
      <defs><clipPath id="${p}-parasol"><path d="M100,30 C112,-46 300,-46 312,30 Z"/></clipPath></defs>
      <path d="M206,-30 V200 q0,12 -10,12 q-8,0 -8,-8" fill="none" stroke="#e8e0d0" stroke-width="5" stroke-linecap="round"/>
      <path d="M100,30 C112,-46 300,-46 312,30 Z" fill="#ff9d3c"/>
      <g clip-path="url(#${p}-parasol)" fill="#fff8e7">${[100, 153, 206, 259]
        .map((x) => `<path d="M206,-60 L${x},40 L${x + 26.5},40 Z"/>`).join('')}</g>
      <path d="M100,30 C112,-46 300,-46 312,30 Z" fill="none" stroke="#c8650f" stroke-width="3"/>
    </g></g>`,
  },
  {
    id: 'kikkerparaplu', plek: 'hand', naam: 'Kikker­paraplu', prijs: 50, dak: true,
    teken: () => paraplu('#5ee07a', '#2f9e50', `<g stroke="#2f9e50" stroke-width="2.5">
      <circle cx="186" cy="-14" r="10" fill="#fff"/><circle cx="226" cy="-14" r="10" fill="#fff"/>
      <circle cx="188" cy="-13" r="4.5" fill="#1d1530" stroke="none"/><circle cx="228" cy="-13" r="4.5" fill="#1d1530" stroke="none"/>
      <path d="M190,12 Q206,22 222,12" fill="none" stroke="#1d1530" stroke-linecap="round"/>
    </g>`),
  },
  {
    id: 'toverstaf', plek: 'hand', naam: 'Toverstaf', prijs: 60,
    teken: () => `<g class="w-handding">
      <path d="M204,198 L236,122" stroke="#2a2440" stroke-width="6" stroke-linecap="round"/>
      <path d="M231,134 L236,122" stroke="#fff8e7" stroke-width="6" stroke-linecap="round"/>
      <path d="${ster(238, 112, 17, 7.5)}" fill="#ffd23f" stroke="#c99a10" stroke-width="2.5" stroke-linejoin="round"/>
      <g class="twinkel" fill="#fff8e7"><circle cx="260" cy="98" r="3"/><circle cx="222" cy="94" r="2.5"/><circle cx="256" cy="128" r="2"/></g>
    </g>`,
  },

  // Ernaast
  { id: 'zonnebloem', plek: 'naast', naam: 'Zonnebloem', prijs: 20, emoji: '🌻', teken: ernaast('🌻') },
  { id: 'tulp', plek: 'naast', naam: 'Tulp', prijs: 20, emoji: '🌷', teken: ernaast('🌷') },
  { id: 'cactus', plek: 'naast', naam: 'Cactus', prijs: 25, emoji: '🌵', teken: ernaast('🌵') },
  { id: 'slakje', plek: 'naast', naam: 'Slakje', prijs: 30, emoji: '🐌', teken: ernaast('🐌', 'kruip') },
  { id: 'eendje', plek: 'naast', naam: 'Eendje', prijs: 35, emoji: '🦆', teken: ernaast('🦆', 'dobber') },
  { id: 'zandkasteel', plek: 'naast', naam: 'Zandkasteel', prijs: 40, teken: () => ZANDKASTEEL },
  { id: 'sneeuwpop', plek: 'naast', naam: 'Sneeuwpop', prijs: 40, emoji: '⛄', teken: ernaast('⛄') },
  { id: 'raketje', plek: 'naast', naam: 'Raketje', prijs: 50, emoji: '🚀', teken: ernaast('🚀', 'dobber') },
  { id: 'schatkist', plek: 'naast', naam: 'Schatkist', prijs: 60, teken: () => SCHATKIST },
  { id: 'poesje', plek: 'naast', naam: 'Poesje', prijs: 70, emoji: '🐈', teken: ernaast('🐈') },
  { id: 'puppy', plek: 'naast', naam: 'Puppy', prijs: 70, emoji: '🐕', teken: ernaast('🐕', 'dobber') },

  // Achtergrond (de scène met dezelfde id uit scene.js)
  { id: 'sterren', plek: 'achtergrond', naam: 'Sterren­hemel', prijs: 80 },
  { id: 'maan', plek: 'achtergrond', naam: 'Maan', prijs: 80 },
  { id: 'regen', plek: 'achtergrond', naam: 'Regen', prijs: 80 },
  { id: 'snoepwolken', plek: 'achtergrond', naam: 'Snoep­wolken', prijs: 90 },
  { id: 'bos', plek: 'achtergrond', naam: 'Bos', prijs: 90 },
  { id: 'sneeuw', plek: 'achtergrond', naam: 'Sneeuw', prijs: 100 },
  { id: 'strand', plek: 'achtergrond', naam: 'Strand', prijs: 100 },
  { id: 'regenboog', plek: 'achtergrond', naam: 'Regenboog', prijs: 110 },
  { id: 'onderwater', plek: 'achtergrond', naam: 'Onderwater', prijs: 120 },
  { id: 'feest', plek: 'achtergrond', naam: 'Feest', prijs: 120 },
  { id: 'vuurvliegjes', plek: 'achtergrond', naam: 'Nacht met vuur­vliegjes', prijs: 150 },
];

const PER_ID = new Map(SPULLEN.map((s) => [s.id, s]));

export function spul(id) {
  return PER_ID.get(id) ?? null;
}

export function spullenOp(plek) {
  return SPULLEN.filter((s) => s.plek === plek);
}

export function heeft(profiel, id) {
  return profiel.cosmetica.gekocht.includes(id);
}

// Kopen kan alleen met genoeg munten; wat je koopt, gaat meteen aan.
export function koop(profiel, id) {
  const s = spul(id);
  if (!s) return { ok: false, reden: 'onbekend' };
  if (heeft(profiel, id)) return { ok: false, reden: 'al-gekocht' };
  if (profiel.munten < s.prijs) return { ok: false, reden: 'te-weinig', tekort: s.prijs - profiel.munten };
  profiel.munten -= s.prijs;
  profiel.cosmetica.gekocht.push(id);
  profiel.cosmetica.aan[s.plek] = id;
  return { ok: true };
}

// Aantrekken kan alleen met iets wat je hebt, op de eigen plek. Zonder id gaat de plek leeg.
// Geeft true als er iets veranderde.
export function trekAan(profiel, plek, id = null) {
  const aan = profiel.cosmetica.aan;
  if (!id) {
    const had = Boolean(aan[plek]);
    delete aan[plek];
    return had;
  }
  const s = spul(id);
  if (!s || s.plek !== plek || !heeft(profiel, id) || aan[plek] === id) return false;
  aan[plek] = id;
  return true;
}

// Wat de Wiebel aan heeft als hij dit spul past (in de winkel).
export function metGepast(aan, id) {
  const s = spul(id);
  return s ? { ...aan, [s.plek]: id } : { ...aan };
}

// Combinaties van achtergrond en spullen: 'droog', 'nat', 'warm', 'koud', 'schaduw' of null.
export function combinatie(aan = {}) {
  if (aan.achtergrond === 'regen') return spul(aan.hand)?.dak || aan.lijf === 'regenjas' ? 'droog' : 'nat';
  if (aan.achtergrond === 'sneeuw') return aan.hoofd === 'muts' && aan.nek === 'sjaal' ? 'warm' : 'koud';
  if (aan.achtergrond === 'strand' && aan.hand === 'parasol') return 'schaduw';
  return null;
}

// Omzetten van het oude winkeltje (cosmetica: { gekocht, actief: { hoed, kleur, deco } }).
// Spullen met een tegenhanger worden omgezet en blijven aan als ze aan stonden; voor kleuren en
// spullen zonder tegenhanger krijg je de oude prijs terug.
const OMZETTEN = {
  'hoed-pet': 'pet-rood',
  'hoed-hoge': 'hoge-hoed',
  'hoed-diploma': 'afstudeerhoed',
  'hoed-kroon': 'kroon',
  'hoed-strik': 'strik',
  'deco-ballon': 'ballon-stip',
  'deco-regenboog': 'regenboog',
};
const TERUGGAVE = {
  'kleur-rood': 20,
  'kleur-groen': 20,
  'kleur-blauw': 20,
  'kleur-goud': 50,
  'kleur-regenboog': 80,
  'deco-glitter': 30,
  'deco-ster': 40,
};

// Puur: geeft de nieuwe cosmetica en het aantal munten dat terug moet.
export function migreerCosmetica(oud = {}) {
  const gekocht = [];
  let terug = 0;
  for (const id of oud.gekocht ?? []) {
    const nieuw = OMZETTEN[id] ?? (spul(id) ? id : null);
    if (nieuw && !gekocht.includes(nieuw)) gekocht.push(nieuw);
    else if (!nieuw) terug += TERUGGAVE[id] ?? 0;
  }
  const aan = {};
  for (const id of Object.values(oud.actief ?? {})) {
    const nieuw = OMZETTEN[id];
    if (nieuw && gekocht.includes(nieuw)) aan[spul(nieuw).plek] = nieuw;
  }
  return { cosmetica: { gekocht, aan }, terug };
}
