// Bewegende achtergronden als SVG-tekst, in scènecoördinaten: x van -20 tot 420, de grond rond y 260.
// De Wiebel staat in deze scènes op x 80, y 34 (240×260). Zuinig: hooguit MAX_DEELTJES bewegende
// deeltjes per scène, en alleen transform en opacity bewegen (css/wiebel.css).

export const MAX_DEELTJES = 30;
export const SCENES = ['sterren', 'regen', 'sneeuw'];

// Vaste pseudo-willekeur (mulberry32), zodat sterren en druppels elke keer op dezelfde plek staan.
export function rng(zaad) {
  return () => {
    zaad = (zaad + 0x6d2b79f5) | 0;
    let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

function regenSvg(stil) {
  const r = rng(21);
  let uit = '';
  for (let i = 0; i < MAX_DEELTJES; i++) {
    const x = +(r() * 440 - 20).toFixed(1);
    const duur = (0.9 + r() * 0.5).toFixed(2);
    const vertraging = (-r() * duur).toFixed(2);
    const y0 = +(r() * 500 - 120).toFixed(1);
    uit += stil
      ? `<line class="druppel-lijn" x1="${x}" y1="${y0}" x2="${x - 3}" y2="${y0 + 12}"/>`
      : `<line class="druppel" x1="${x}" y1="${TOP}" x2="${x - 3}" y2="${TOP + 12}" style="--eind:${GROND - TOP}px;animation-duration:${duur}s;animation-delay:${vertraging}s"/>`;
  }
  return `<g>${uit}</g>`;
}

function sneeuwSvg(stil) {
  const r = rng(5);
  let uit = '';
  for (let i = 0; i < MAX_DEELTJES; i++) {
    const x = (r() * 440 - 20).toFixed(1);
    const straal = (0.9 + r() * 1.9).toFixed(1);
    const duur = (8 + r() * 5).toFixed(2);
    const vertraging = (-r() * duur).toFixed(2);
    const y0 = (r() * 500 - 120).toFixed(1);
    uit += stil
      ? `<circle class="vlok-stil" cx="${x}" cy="${y0}" r="${straal}"/>`
      : `<circle class="vlok" cx="${x}" cy="${TOP}" r="${straal}" style="animation-duration:${duur}s;animation-delay:${vertraging}s"/>`;
  }
  return `<g>${uit}</g>`;
}

const lucht = (p, boven, onder) => `
  <defs><linearGradient id="${p}-lucht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${boven}"/><stop offset="1" stop-color="${onder}"/></linearGradient></defs>
  <rect x="-40" y="-150" width="480" height="560" fill="url(#${p}-lucht)"/>`;

// Een scène in twee lagen: achter (achter de Wiebel) en voor (ervoor, zoals regen en sneeuw).
// Onbekende soort (of 'geen') geeft een lege scène.
export function achtergrond(soort, prefix, { stil = false } = {}) {
  if (soort === 'sterren') return { achter: `${lucht(prefix, '#120c38', '#3a2a86')}
    ${sterrenSvg(MAX_DEELTJES, -110, 220, 7, stil)}
    <g transform="translate(334 64)"><circle r="24" fill="#ff9d6c"/><ellipse rx="40" ry="9" fill="none" stroke="#ffd23f" stroke-width="4" transform="rotate(-18)"/></g>
    <ellipse cx="200" cy="278" rx="150" ry="22" fill="#4b3f99"/><ellipse cx="200" cy="271" rx="130" ry="14" fill="#5d50b5"/>`, voor: '' };
  if (soort === 'regen') return { achter: `${lucht(prefix, '#4b5a7d', '#93a3bf')}
    <g${stil ? '' : ' class="drijf"'}>${wolk(60, -40, 1.4, '#6b7896')}${wolk(206, -56, 1.2, '#7d8aa8')}${wolk(350, -34, 1.3, '#6b7896')}</g>
    <path d="M-40,262 Q200,246 440,262 V420 H-40Z" fill="#4f7a5a"/>
    <ellipse cx="310" cy="284" rx="46" ry="7" fill="#9fb6d8" opacity=".8"/>`, voor: regenSvg(stil) };
  // In de sneeuw staan de sterren stil, zodat alleen de vlokken bewegen.
  if (soort === 'sneeuw') return { achter: `${lucht(prefix, '#1d2b5a', '#5a78b5')}
    ${sterrenSvg(14, -110, 100, 13, true)}
    <g transform="translate(350 200)"><path d="M0,-58 L30,10 H-30 Z" fill="#2f7a55"/><path d="M0,-58 L14,-26 Q0,-20 -14,-26 Z" fill="#fff"/><rect x="-5" y="10" width="10" height="16" fill="#6b4a2e"/></g>
    <path d="M-40,258 Q120,240 220,254 T440,250 V420 H-40Z" fill="#f4f8ff"/>`, voor: sneeuwSvg(stil) };
  return { achter: '', voor: '' };
}
