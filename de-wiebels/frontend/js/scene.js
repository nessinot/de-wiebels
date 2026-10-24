// Bewegende achtergronden als SVG-tekst, in scènecoördinaten: x van -20 tot 420, de grond rond y 260.
// De Wiebel staat in deze scènes op x 80, y 34 (240×260). Lucht en grond lopen ruim door (x -120 tot
// 520, y -220 tot 460), zodat ook een ruimere uitsnede gevuld is. Zuinig: hooguit MAX_DEELTJES
// bewegende deeltjes per scène, en alleen transform en opacity bewegen (css/wiebel.css).

export const MAX_DEELTJES = 30;
export const SCENES = ['sterren', 'maan', 'regen', 'snoepwolken', 'bos', 'sneeuw', 'strand', 'regenboog', 'onderwater', 'feest', 'vuurvliegjes'];

// Klassen van de bewegende deeltjes (voor de telling in de tests).
export const DEELTJES = ['twinkel', 'druppel', 'spat', 'vlok', 'blad', 'bel', 'snipper', 'vuurvlieg'];

// Vaste pseudo-willekeur (mulberry32), zodat sterren en druppels elke keer op dezelfde plek staan.
export function rng(zaad) {
  return () => {
    zaad = (zaad + 0x6d2b79f5) | 0;
    let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => n.toFixed(1);

// Twinkelende sterren tussen minY en maxY; stil = zonder beweging.
export function sterrenSvg(aantal, minY, maxY, zaad, stil = false) {
  const r = rng(zaad);
  return Array.from({ length: aantal }, () => {
    const vertraging = (r() * 3).toFixed(2);
    const cx = (r() * 440 - 20).toFixed(1);
    const cy = (minY + r() * (maxY - minY)).toFixed(1);
    const straal = (0.8 + r() * 1.6).toFixed(1);
    return stil
      ? `<circle cx="${cx}" cy="${cy}" r="${straal}" fill="#fff8e7" opacity=".7"/>`
      : `<circle class="twinkel" cx="${cx}" cy="${cy}" r="${straal}" fill="#fff8e7" style="animation-delay:-${vertraging}s"/>`;
  }).join('');
}

export function wolk(x, y, s, kleur = '#fff') {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${kleur}" opacity=".95">
    <ellipse cx="0" cy="0" rx="34" ry="18"/><ellipse cx="-24" cy="6" rx="22" ry="14"/><ellipse cx="26" cy="6" rx="24" ry="14"/><ellipse cx="4" cy="-12" rx="20" ry="16"/>
  </g>`;
}

// Druppels en vlokken vallen van boven het beeld (TOP) tot onder de grond.
const TOP = -130;
const GROND = 400;

// Bovenkant van het paraplu-scherm in scènecoördinaten (benadering voor de volgroeide Wiebel op
// 80,34), of null naast de paraplu.
function dakVolgroeid(x) {
  if (x < 161 || x > 313) return null;
  const t = x < 223 ? (223 - x) / 62 : (x - 223) / 90;
  return x < 223 ? 33 + 67 * t * t : 33 + 18 * t * t;
}

// Een kleinere Wiebel krimpt rond zijn voeten (scène 200, 272), en zijn paraplu dus ook.
function dak(x, groei) {
  const h = dakVolgroeid(200 + (x - 200) / groei);
  return h === null ? null : 272 + (h - 272) * groei;
}

// Met een paraplu ketsen de druppels erop af (een spatje); druppels en spatjes samen blijven
// binnen MAX_DEELTJES.
function regenSvg(stil, paraplu, groei) {
  const r = rng(21);
  let uit = '';
  let deeltjes = 0;
  while (deeltjes < MAX_DEELTJES) {
    const x = +(r() * 480 - 40).toFixed(1);
    const duur = 0.9 + r() * 0.5;
    const start = r();
    const y0 = +(r() * 500 - 120).toFixed(1);
    if (stil) {
      uit += `<line class="druppel-lijn" x1="${x}" y1="${y0}" x2="${x - 3}" y2="${y0 + 12}"/>`;
      deeltjes += 1;
      continue;
    }
    const raak = paraplu ? dak(x, groei) : null;
    if (raak !== null && deeltjes + 2 > MAX_DEELTJES) break;
    const eind = (raak === null ? GROND : raak - 12) - TOP;
    const d = ((duur * eind) / (GROND - TOP)).toFixed(2);
    const vertraging = (-start * d).toFixed(2);
    uit += `<line class="druppel" x1="${x}" y1="${TOP}" x2="${x - 3}" y2="${TOP + 12}" style="--eind:${r1(eind)}px;animation-duration:${d}s;animation-delay:${vertraging}s"/>`;
    deeltjes += 1;
    if (raak !== null) {
      uit += `<circle class="spat" cx="${x - 3}" cy="${r1(raak)}" r="3" style="animation-duration:${d}s;animation-delay:${vertraging}s"/>`;
      deeltjes += 1;
    }
  }
  return `<g>${uit}</g>`;
}

// Vallende deeltjes (sneeuw, blaadjes, snippers): klasse, aantal, zaad en een tekenfunctie.
function valSvg(klasse, aantal, zaad, stil, teken, duurMin, duurBereik) {
  const r = rng(zaad);
  let uit = '';
  for (let i = 0; i < aantal; i++) {
    const x = r1(r() * 480 - 40);
    const grootte = 0.9 + r() * 1.9;
    const duur = (duurMin + r() * duurBereik).toFixed(2);
    const vertraging = (-r() * duur).toFixed(2);
    const y0 = r1(r() * 500 - 120);
    const kleur = r();
    uit += stil
      ? teken(`${klasse}-stil`, x, y0, grootte, kleur, '')
      : teken(klasse, x, TOP, grootte, kleur, `animation-duration:${duur}s;animation-delay:${vertraging}s`);
  }
  return `<g>${uit}</g>`;
}

const vlok = (klasse, x, y, g, _, stijl) => `<circle class="${klasse}" cx="${x}" cy="${y}" r="${r1(g)}"${stijl ? ` style="${stijl}"` : ''}/>`;

const BLADKLEUREN = ['#ff9d3c', '#e8c63a', '#7fc94a'];
const blad = (klasse, x, y, g, k, stijl) =>
  `<ellipse class="${klasse}" cx="${x}" cy="${y}" rx="${r1(3 + g * 1.5)}" ry="${r1(1.6 + g * 0.6)}" fill="${BLADKLEUREN[Math.floor(k * 3)]}"${stijl ? ` style="${stijl}"` : ''}/>`;

const SNIPPERKLEUREN = ['#ff5c7a', '#ffd23f', '#5ee07a', '#7fd6ff', '#ff9d3c', '#ffffff'];
const snipper = (klasse, x, y, g, k, stijl) =>
  `<rect class="${klasse}" x="${x}" y="${y}" width="${r1(3 + g)}" height="${r1(5 + g)}" fill="${SNIPPERKLEUREN[Math.floor(k * 6)]}"${stijl ? ` style="${stijl}"` : ''}/>`;

// Opstijgende belletjes (onderwater).
function bellenSvg(aantal, stil) {
  const r = rng(17);
  let uit = '';
  for (let i = 0; i < aantal; i++) {
    const x = r1(r() * 480 - 40);
    const straal = r1(2 + r() * 4);
    const duur = (6 + r() * 5).toFixed(2);
    const vertraging = (-r() * duur).toFixed(2);
    const y0 = r1(r() * 380 - 80);
    uit += stil
      ? `<circle class="bel-stil" cx="${x}" cy="${y0}" r="${straal}"/>`
      : `<circle class="bel" cx="${x}" cy="300" r="${straal}" style="animation-duration:${duur}s;animation-delay:${vertraging}s"/>`;
  }
  return `<g>${uit}</g>`;
}

// Vuurvliegjes die zachtjes oplichten en zweven.
function vuurvliegjesSvg(aantal, stil) {
  const r = rng(29);
  let uit = '';
  for (let i = 0; i < aantal; i++) {
    const x = r1(r() * 440 - 20);
    const y = r1(40 + r() * 220);
    const duur = (3 + r() * 3).toFixed(2);
    const vertraging = (-r() * duur).toFixed(2);
    uit += stil
      ? `<circle cx="${x}" cy="${y}" r="3" fill="#e9ff7a" opacity=".8"/>`
      : `<circle class="vuurvlieg" cx="${x}" cy="${y}" r="3" style="animation-duration:${duur}s;animation-delay:${vertraging}s"/>`;
  }
  return `<g>${uit}</g>`;
}

// Lucht als verloop over het zichtbare deel (y -100 tot 300), maar ruim getekend.
const lucht = (p, boven, onder) => `
  <defs><linearGradient id="${p}-lucht" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="300"><stop offset="0" stop-color="${boven}"/><stop offset="1" stop-color="${onder}"/></linearGradient></defs>
  <rect x="-120" y="-220" width="640" height="680" fill="url(#${p}-lucht)"/>`;

const grond = (d, kleur) => `<path d="${d} V460 H-120 Z" fill="${kleur}"/>`;
const beweeg = (klasse, stil) => (stil ? '' : ` class="${klasse}"`);

function boom(x, y, s, kleur) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-6" width="10" height="26" fill="#6b4a2e"/><path d="M0,-70 L30,-6 H-30 Z" fill="${kleur}"/><path d="M0,-92 L24,-40 H-24 Z" fill="${kleur}"/></g>`;
}

function boll(x, y, s, kleur) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-10" width="10" height="30" fill="#6b4a2e"/><circle cx="0" cy="-34" r="30" fill="${kleur}"/></g>`;
}

const SCENE = {
  sterren: (p, { stil }) => ({
    achter: `${lucht(p, '#120c38', '#3a2a86')}
      ${sterrenSvg(MAX_DEELTJES, -110, 220, 7, stil)}
      <g transform="translate(334 64)"><circle r="24" fill="#ff9d6c"/><ellipse rx="40" ry="9" fill="none" stroke="#ffd23f" stroke-width="4" transform="rotate(-18)"/></g>
      <ellipse cx="200" cy="278" rx="150" ry="22" fill="#4b3f99"/><ellipse cx="200" cy="271" rx="130" ry="14" fill="#5d50b5"/>`,
    voor: '',
  }),
  maan: (p, { stil }) => ({
    achter: `${lucht(p, '#0b1640', '#2a4580')}
      ${sterrenSvg(18, -110, 170, 31, stil)}
      <circle cx="334" cy="18" r="66" fill="#fff3c4" opacity=".1"/>
      <g transform="translate(334 18)"><circle r="46" fill="#fff3c4"/><circle cx="-16" cy="-10" r="9" fill="#e8d9a0"/><circle cx="15" cy="13" r="12" fill="#e8d9a0"/><circle cx="12" cy="-24" r="5" fill="#e8d9a0"/></g>
      ${grond('M-120,250 Q40,214 200,246 T520,236', '#1d2d5c')}
      ${grond('M-120,272 Q200,252 520,272', '#26396e')}`,
    voor: '',
  }),
  regen: (p, { stil, paraplu, groei }) => ({
    achter: `${lucht(p, '#4b5a7d', '#93a3bf')}
      <g${beweeg('drijf', stil)}>${wolk(60, -40, 1.4, '#6b7896')}${wolk(206, -56, 1.2, '#7d8aa8')}${wolk(350, -34, 1.3, '#6b7896')}</g>
      ${grond('M-120,264 Q200,240 520,264', '#4f7a5a')}
      <ellipse cx="310" cy="284" rx="46" ry="7" fill="#9fb6d8" opacity=".8"/>`,
    voor: regenSvg(stil, paraplu, groei),
  }),
  snoepwolken: (p, { stil }) => ({
    achter: `${lucht(p, '#ffa8d4', '#cdb8ff')}
      <g${beweeg('drijf', stil)}>${wolk(30, -36, 1.3, '#fff0f8')}${wolk(250, -66, 1.1, '#ffe0f0')}</g>
      <g${beweeg('drijf', stil)} style="animation-delay:-7s">${wolk(380, 6, 1.2, '#f2e4ff')}${wolk(150, 66, 0.9, '#fff')}</g>
      <g transform="translate(362 196)"><path d="M0,0 V74" stroke="#fff8e7" stroke-width="5"/><circle r="22" fill="#ff5c9a"/><path d="M0,0 m-14,0 a14,14 0 1 1 14,14 a9,9 0 1 1 -9,-9 a4,4 0 1 1 4,4" fill="none" stroke="#fff8e7" stroke-width="4"/></g>
      ${grond('M-120,262 Q200,238 520,262', '#ff8cc6')}
      <g>${[[10, 290, '#ffd23f'], [60, 300, '#7fd6ff'], [150, 296, '#fff8e7'], [250, 304, '#5ee07a'], [330, 292, '#ffd23f'], [390, 300, '#7fd6ff']]
        .map(([x, y, kleur], i) => `<rect x="${x}" y="${y}" width="12" height="4" rx="2" fill="${kleur}" transform="rotate(${i * 37 - 60} ${x + 6} ${y + 2})"/>`).join('')}</g>`,
    voor: '',
  }),
  bos: (p, { stil }) => ({
    achter: `${lucht(p, '#8fd8ff', '#e2f6d0')}
      ${wolk(300, -40, 1, '#fff')}
      ${boom(-10, 224, 1.3, '#2f7a45')}${boll(60, 234, 1.1, '#3f9a52')}${boom(350, 230, 1.4, '#2f7a45')}${boll(420, 236, 1.2, '#3f9a52')}${boom(250, 214, 0.8, '#3a8a4c')}
      ${grond('M-120,258 Q200,238 520,258', '#5bbf5b')}
      <g fill="#ff5c7a"><circle cx="352" cy="286" r="4"/><circle cx="8" cy="292" r="4"/></g>`,
    voor: valSvg('blad', 10, 11, stil, blad, 12, 8),
  }),
  sneeuw: (p, { stil }) => ({
    achter: `${lucht(p, '#1d2b5a', '#5a78b5')}
      ${sterrenSvg(14, -110, 100, 13, true)}
      <g transform="translate(350 200)"><path d="M0,-58 L30,10 H-30 Z" fill="#2f7a55"/><path d="M0,-58 L14,-26 Q0,-20 -14,-26 Z" fill="#fff"/><rect x="-5" y="10" width="10" height="16" fill="#6b4a2e"/></g>
      ${grond('M-120,258 Q120,240 220,254 T520,250', '#f4f8ff')}`,
    voor: valSvg('vlok', MAX_DEELTJES, 5, stil, vlok, 8, 5),
  }),
  strand: (p, { stil, schaduw }) => ({
    achter: `${lucht(p, '#4cc2ff', '#c8f0ff')}
      <circle cx="350" cy="-10" r="36" fill="#ffe066"/><circle cx="350" cy="-10" r="52" fill="#ffe066" opacity=".25"/>
      <g${beweeg('drijf', stil)}>${wolk(70, -50, 1, '#fff')}</g>
      <path d="M-120,196 H520 V250 H-120 Z" fill="#2f9fe0"/>
      <g${beweeg('drijf', stil)}><path d="M-160,200 q20,-8 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 V214 H-160 Z" fill="#7fd6ff"/></g>
      ${grond('M-120,248 Q200,230 520,248', '#f6d68a')}
      ${schaduw ? '<ellipse cx="222" cy="276" rx="118" ry="16" fill="#000" opacity=".16"/>' : ''}
      <path d="${'M372,290 l4,-10 l4,10 l10,1 l-8,6 l3,10 l-9,-6 l-9,6 l3,-10 l-8,-6 Z'}" fill="#ff9d6c"/>
      <path d="M20,296 q8,-14 16,0 Z" fill="#fff0e0" stroke="#e0b890" stroke-width="2"/>`,
    voor: '',
  }),
  regenboog: (p, { stil }) => ({
    achter: `${lucht(p, '#72c8ff', '#d8f2ff')}
      <g fill="none" stroke-width="13">${['#ff5c5c', '#ff9d3c', '#ffd23f', '#5ee07a', '#4ea8ff', '#9b6bff']
        .map((kleur, i) => `<path d="M${-60 + i * 13},290 A${260 - i * 13},${260 - i * 13} 0 0 1 ${460 - i * 13},290" stroke="${kleur}"/>`).join('')}</g>
      ${wolk(-40, 252, 1.6, '#fff')}${wolk(440, 252, 1.6, '#fff')}
      <g${beweeg('drijf', stil)}>${wolk(130, -60, 0.9, '#fff')}</g>
      ${grond('M-120,262 Q200,242 520,262', '#6fd36f')}`,
    voor: '',
  }),
  onderwater: (p, { stil }) => ({
    achter: `${lucht(p, '#2a8fd8', '#073a6e')}
      <g fill="#fff" opacity=".07"><path d="M40,-220 L100,-220 L20,300 L-60,300 Z"/><path d="M220,-220 L270,-220 L250,300 L160,300 Z"/></g>
      <g${beweeg('drijf', stil)}><text x="330" y="40" font-size="40" text-anchor="middle">🐠</text><text x="10" y="120" font-size="32" text-anchor="middle">🐟</text></g>
      ${[[-4, 1], [372, -1], [410, 1]].map(([x, s], i) => `<g transform="translate(${x} 272)"><path${beweeg('wier', stil)} style="animation-delay:-${i * 1.3}s" d="M0,0 C${12 * s},-30 ${-12 * s},-60 0,-90 C${12 * s},-110 ${-6 * s},-130 ${4 * s},-150" fill="none" stroke="#2fae6a" stroke-width="9" stroke-linecap="round"/></g>`).join('')}
      ${grond('M-120,262 Q200,246 520,262', '#d9b56a')}
      <g fill="#c49a52"><ellipse cx="340" cy="290" rx="10" ry="4"/><ellipse cx="40" cy="300" rx="8" ry="3"/></g>`,
    voor: bellenSvg(14, stil),
  }),
  feest: (p, { stil }) => ({
    achter: `${lucht(p, '#2e1460', '#7a3aa8')}
      <path d="M-120,-40 Q200,40 520,-40" fill="none" stroke="#fff8e7" stroke-width="2"/>
      <g>${Array.from({ length: 13 }, (_, i) => {
        const x = -100 + i * 50;
        const t = (x + 120) / 640;
        const y = (1 - t) ** 2 * -40 + 2 * (1 - t) * t * 40 + t ** 2 * -40;
        return `<path d="M${x - 14},${r1(y)} L${x + 14},${r1(y)} L${x},${r1(y + 30)} Z" fill="${SNIPPERKLEUREN[i % 5]}"/>`;
      }).join('')}</g>
      ${[[-6, 120, '#ff5c7a'], [22, 140, '#ffd23f'], [380, 118, '#7fd6ff'], [408, 142, '#5ee07a']]
        .map(([x, y, kleur], i) => `<g${beweeg('dobber', stil)} style="animation-delay:-${i * 0.7}s"><path d="M${x},${y + 28} Q${x + 6},${y + 80} ${x},${y + 140}" fill="none" stroke="#fff8e7" stroke-width="1.5"/><ellipse cx="${x}" cy="${y}" rx="20" ry="26" fill="${kleur}"/></g>`).join('')}
      <path d="M-120,262 Q200,250 520,262 V460 H-120 Z" fill="#4a2a8a"/>
      <path d="M-120,262 Q200,250 520,262" fill="none" stroke="#ffd23f" stroke-width="4"/>`,
    voor: valSvg('snipper', 24, 23, stil, snipper, 5, 4),
  }),
  vuurvliegjes: (p, { stil }) => ({
    achter: `${lucht(p, '#050b20', '#173a4a')}
      ${sterrenSvg(10, -110, 80, 41, true)}
      <path d="M352,-30 a26,26 0 1 0 22,40 a20,20 0 1 1 -22,-40 Z" fill="#fff3c4"/>
      ${boll(-20, 236, 1.6, '#0d2230')}${boom(40, 236, 1.2, '#0f2a36')}${boll(410, 230, 1.7, '#0d2230')}${boom(350, 238, 1.1, '#0f2a36')}
      ${grond('M-120,262 Q200,244 520,262', '#10301f')}`,
    voor: vuurvliegjesSvg(18, stil),
  }),
};

// Een scène in twee lagen: achter (achter de Wiebel) en voor (ervoor, zoals regen en sneeuw).
// Opties: stil (niets beweegt), paraplu (druppels ketsen af op de paraplu van de Wiebel), groei
// (grootte van de Wiebel, voor de plek van die paraplu) en schaduw (onder de parasol op het strand).
// Onbekende soort (of 'geen') geeft een lege scène.
export function achtergrond(soort, prefix, { stil = false, paraplu = false, groei = 1, schaduw = false } = {}) {
  const maak = SCENE[soort];
  return maak ? maak(prefix, { stil, paraplu, groei, schaduw }) : { achter: '', voor: '' };
}
