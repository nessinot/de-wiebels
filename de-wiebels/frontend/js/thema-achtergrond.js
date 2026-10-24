// Achtergrond van het thema tijdens de sommen en in de levelkeuze, in twee lagen op het podium (1920×1080):
// laag 1 is de scène van het thema (met langzaam bewegende deeltjes), laag 2 de wereld zelf, groot en
// gedimd onderaan en rechts. Alles wat vastligt staat in één SVG die nooit opnieuw getekend hoeft te
// worden; elk bewegend deeltje is een eigen klein SVG-element dat alleen met transform of opacity
// beweegt (css/achtergrond.css). Deeltjes staan alleen in de zijstroken, dus nooit achter de som.

import { rng } from './scene.js';
import { thema } from './themas/index.js';

export const THEMA_SCENES = ['sterrenhemel', 'bos', 'eiland', 'zee', 'opvang'];
export const DUUR_MIN = 20;
export const DUUR_MAX = 60;

const B = 1920;
const H = 1080;

// Een x-positie in de linker of rechter zijstrook (buiten het vraagvlak).
const zijX = (r) => (r() < 0.5 ? 20 + r() * 240 : 1660 + r() * 240);
const duur = (r) => DUUR_MIN + r() * (DUUR_MAX - DUUR_MIN);

// Eén bewegend deeltje; inhoud is getekend rond (0, 0) in een vak van grootte × grootte.
function deeltje(soort, x, y, grootte, inhoud, r) {
  const d = duur(r);
  const h = grootte / 2;
  return `<svg class="ab-deeltje ab-${soort}" viewBox="${-h} ${-h} ${grootte} ${grootte}" style="left:${(x - h).toFixed(0)}px;top:${(y - h).toFixed(0)}px;width:${grootte}px;height:${grootte}px;animation-duration:${d.toFixed(1)}s;animation-delay:-${(r() * d).toFixed(1)}s">${inhoud}</svg>`;
}

const lucht = (p, boven, onder) => `
  <defs><linearGradient id="${p}-lucht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${boven}"/><stop offset="1" stop-color="${onder}"/></linearGradient></defs>
  <rect width="${B}" height="${H}" fill="url(#${p}-lucht)"/>`;

function vasteSterren(r, aantal, kleur, maxY = H) {
  let uit = '';
  for (let i = 0; i < aantal; i++) {
    uit += `<circle cx="${(r() * B).toFixed(0)}" cy="${(r() * maxY).toFixed(0)}" r="${(0.8 + r() * 1.6).toFixed(1)}" fill="${kleur}" opacity="${(0.2 + r() * 0.35).toFixed(2)}"/>`;
  }
  return uit;
}

const wolkje = (kleur) => `<g fill="${kleur}"><ellipse rx="70" ry="30"/><ellipse cx="-44" cy="10" rx="44" ry="22"/><ellipse cx="48" cy="10" rx="46" ry="22"/><ellipse cx="6" cy="-20" rx="40" ry="26"/></g>`;
const ster = '<path d="M0,-8 L2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2Z" fill="#fff8e7"/>';
const hartje = (kleur) => `<path d="M0,8 C-14,-2 -10,-12 0,-6 C10,-12 14,-2 0,8Z" fill="${kleur}"/>`;
const bloempje = (kleur) => `<g fill="${kleur}"><circle cy="-6" r="5"/><circle cx="6" cy="-1" r="5"/><circle cx="4" cy="6" r="5"/><circle cx="-4" cy="6" r="5"/><circle cx="-6" cy="-1" r="5"/></g><circle r="3.5" fill="#ffd23f"/>`;

// Laag 1: de scène per thema. Geeft het vaste deel (SVG-inhoud) en de bewegende deeltjes.
const SCENES = {
  sterrenhemel(p) {
    const r = rng(101);
    const vast = `${lucht(p, '#0d0b26', '#1f1a52')}
      <g fill="#3a3390" opacity=".14" transform="rotate(-18 960 540)"><ellipse cx="960" cy="420" rx="1100" ry="120"/><ellipse cx="820" cy="400" rx="600" ry="60"/></g>
      ${vasteSterren(r, 70, '#fff8e7')}`;
    const deeltjes = Array.from({ length: 26 }, () => deeltje('twinkel', zijX(r), 40 + r() * 1000, 20, ster, r));
    return { vast, deeltjes };
  },
  bos(p) {
    const r = rng(202);
    const bomen = Array.from({ length: 16 }, (_, i) => {
      const x = i * 128 + r() * 60;
      const h = 220 + r() * 160;
      return `<path d="M${x.toFixed(0)},${H} l60,-${h.toFixed(0)} l60,${h.toFixed(0)}Z"/>`;
    }).join('');
    const vast = `${lucht(p, '#0b1a10', '#17361f')}
      ${vasteSterren(r, 24, '#f4fff0', 400)}
      <circle cx="1760" cy="150" r="54" fill="#f4fff0" opacity=".22"/>
      <g fill="#12301c" opacity=".85">${bomen}</g>`;
    const vlieg = '<circle r="13" fill="#ffe066" opacity=".25"/><circle r="5" fill="#ffe066"/>';
    const blad = '<path d="M0,-12 Q10,0 0,12 Q-10,0 0,-12Z" fill="#6fae5a"/>';
    const deeltjes = [
      ...Array.from({ length: 22 }, () => deeltje('vuurvlieg', zijX(r), 120 + r() * 900, 30, vlieg, r)),
      ...Array.from({ length: 6 }, () => deeltje('dwarrel', zijX(r), -40, 30, blad, r)),
    ];
    return { vast, deeltjes };
  },
  eiland(p) {
    const r = rng(303);
    const vast = `${lucht(p, '#2a1608', '#5c3014')}
      <circle cx="1480" cy="760" r="150" fill="#ff9a3c" opacity=".22"/>
      <path d="M0,820 Q300,700 620,790 T1240,760 T1920,780 V${H} H0Z" fill="#3a200c"/>`;
    const vogel = '<path d="M-16,0 Q-8,-8 0,0 Q8,-8 16,0" fill="none" stroke="#1c0e04" stroke-width="3" stroke-linecap="round"/>';
    const stuifje = '<circle r="4" fill="#e8c9a0" opacity=".6"/>';
    const deeltjes = [
      ...Array.from({ length: 5 }, () => deeltje('drijf', zijX(r), 80 + r() * 260, 200, wolkje('#7a4a1f'), r)),
      ...Array.from({ length: 4 }, () => deeltje('drijf', zijX(r), 120 + r() * 300, 40, vogel, r)),
      ...Array.from({ length: 14 }, () => deeltje('zweef', zijX(r), 300 + r() * 700, 20, stuifje, r)),
    ];
    return { vast, deeltjes };
  },
  zee(p) {
    const r = rng(404);
    const stralen = [200, 620, 1080, 1500].map((x) => `<path d="M${x},0 h120 l${180 + r() * 120},${H} h-260Z"/>`).join('');
    const vast = `${lucht(p, '#04243d', '#031a2e')}
      <g fill="#a9d8f0" opacity=".05">${stralen}</g>`;
    const bel = (s) => `<circle r="${s}" fill="none" stroke="#cdeeff" stroke-width="2.5" opacity=".55"/><circle cx="${-s / 3}" cy="${-s / 3}" r="${s / 4}" fill="#cdeeff" opacity=".5"/>`;
    const vis = '<g fill="#13608f" opacity=".75"><ellipse rx="26" ry="14"/><path d="M22,0 l20,-14 v28Z"/></g><circle cx="-14" cy="-3" r="3" fill="#effaff"/>';
    const deeltjes = [
      ...Array.from({ length: 24 }, () => deeltje('stijg', zijX(r), H + 40, 40, bel(6 + r() * 8), r)),
      ...Array.from({ length: 4 }, () => deeltje('drijf', zijX(r), 200 + r() * 600, 90, vis, r)),
    ];
    return { vast, deeltjes };
  },
  opvang(p) {
    const r = rng(505);
    const vast = `${lucht(p, '#2b1d2e', '#5a3a5c')}
      ${vasteSterren(r, 20, '#fff6fb', 360)}
      <path d="M0,800 Q360,690 760,780 T1500,740 T1920,770 V${H} H0Z" fill="#3d2a42"/>`;
    const deeltjes = [
      ...Array.from({ length: 4 }, () => deeltje('drijf', zijX(r), 90 + r() * 220, 200, wolkje('#734f7c'), r)),
      ...Array.from({ length: 12 }, () => deeltje('zweef', zijX(r), 280 + r() * 700, 30, bloempje('#ffb3d9'), r)),
      ...Array.from({ length: 6 }, () => deeltje('zweef', zijX(r), 280 + r() * 700, 30, hartje('#ff7a9c'), r)),
    ];
    return { vast, deeltjes };
  },
};

// Hulpjes voor laag 2.
const grond = (kleur, y = 930) => `<path d="M0,${y} Q480,${y - 40} 960,${y} T${B},${y - 10} V${H} H0Z" fill="${kleur}"/>`;
const bot = (x, y, s, hoek) => `<g transform="translate(${x} ${y}) rotate(${hoek}) scale(${s})" fill="#fff4e0"><rect x="-60" y="-12" width="120" height="24" rx="12"/><circle cx="-60" cy="-14" r="18"/><circle cx="-60" cy="14" r="18"/><circle cx="60" cy="-14" r="18"/><circle cx="60" cy="14" r="18"/></g>`;
const paddenstoel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="-80" width="44" height="80" rx="16" fill="#f4e6c8"/><path d="M-90,-70 Q-90,-170 0,-170 Q90,-170 90,-70Z" fill="#d94b4b"/><g fill="#fff"><circle cx="-40" cy="-120" r="14"/><circle cx="20" cy="-140" r="11"/><circle cx="50" cy="-95" r="12"/></g></g>`;
const den = (x, s) => `<g transform="translate(${x} ${H}) scale(${s})"><rect x="-14" y="-60" width="28" height="60" fill="#3a2a1a"/><g fill="#1f5a34"><path d="M-120,-60 L0,-210 L120,-60Z"/><path d="M-100,-150 L0,-290 L100,-150Z"/><path d="M-76,-240 L0,-370 L76,-240Z"/></g></g>`;
const wortel = (x, y, hoek) => `<g transform="translate(${x} ${y}) rotate(${hoek})"><path d="M-16,0 L16,0 L0,90Z" fill="#ff8c2a"/><path d="M0,0 l-16,-34 M0,0 l0,-40 M0,0 l16,-34" stroke="#4caf50" stroke-width="8" stroke-linecap="round"/></g>`;
const schelp = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60,0 Q-70,-80 0,-90 Q70,-80 60,0Z" fill="#ffb3a7"/><path d="M0,0 L-40,-70 M0,0 L-14,-86 M0,0 L14,-86 M0,0 L40,-70" stroke="#e08a7a" stroke-width="6"/><rect x="-22" y="-6" width="44" height="14" rx="6" fill="#e08a7a"/></g>`;

// Laag 2: per wereld een accent. Groot, gedimd en zonder beweging.
const ACCENT_TEKENING = {
  ringplaneet: () => `<g transform="translate(1720 940)"><circle r="260" fill="#c96a4a"/>
    <ellipse cy="-90" rx="236" ry="34" fill="#b0573b"/><ellipse cy="40" rx="250" ry="28" fill="#e08a5a"/>
    <ellipse rx="430" ry="90" fill="none" stroke="#ffd23f" stroke-width="22" transform="rotate(-15)"/></g>`,
  maan: () => `<g transform="translate(1730 700)"><circle r="92" fill="#2f7fd0"/>
    <path d="M-60,-40 Q-20,-70 10,-40 Q30,-10 0,10 Q-40,20 -60,-40Z M20,30 Q60,10 70,40 Q50,70 20,60Z" fill="#4caf50"/></g>
    <path d="M0,900 Q960,830 ${B},900 V${H} H0Z" fill="#8d8aa8"/>
    <g fill="#6f6c8c"><ellipse cx="300" cy="970" rx="70" ry="18"/><ellipse cx="900" cy="1010" rx="110" ry="24"/><ellipse cx="1500" cy="950" rx="80" ry="18"/><ellipse cx="1760" cy="1030" rx="60" ry="14"/></g>`,
  komeet: () => `<path d="M1500,820 L2000,960 L2000,1140 L1560,920Z" fill="#8fd0ff" opacity=".45"/>
    <path d="M1520,850 L2000,1060 L2000,1120 L1540,900Z" fill="#cdeeff" opacity=".5"/>
    <circle cx="1530" cy="860" r="74" fill="#bfe9ff"/><circle cx="1510" cy="840" r="34" fill="#effaff"/>`,
  zon: () => {
    const stralen = Array.from({ length: 9 }, (_, i) => {
      const a = Math.PI + (i + 0.5) * (Math.PI / 2 / 9);
      const punt = (straal, da) => `${(B + Math.cos(a + da) * straal).toFixed(0)},${(H + Math.sin(a + da) * straal).toFixed(0)}`;
      return `<path d="M${punt(410, -0.06)} L${punt(540, 0)} L${punt(410, 0.06)}Z"/>`;
    }).join('');
    return `<g fill="#ffb43a">${stralen}</g><circle cx="${B}" cy="${H}" r="380" fill="#ffb43a"/><circle cx="${B}" cy="${H}" r="300" fill="#ffd23f"/>`;
  },
  aarde: (p) => `<defs><clipPath id="${p}-aarde"><circle cx="960" cy="2620" r="1700"/></clipPath></defs>
    <circle cx="960" cy="2620" r="1700" fill="#2f7fd0" stroke="#8fd0ff" stroke-width="16"/>
    <g clip-path="url(#${p}-aarde)" fill="#4caf50"><ellipse cx="520" cy="960" rx="190" ry="44"/><ellipse cx="1300" cy="935" rx="250" ry="52"/><ellipse cx="1720" cy="1030" rx="160" ry="40"/><ellipse cx="160" cy="1060" rx="120" ry="30"/></g>
    <g clip-path="url(#${p}-aarde)" fill="#effaff" opacity=".7"><ellipse cx="900" cy="960" rx="160" ry="16"/><ellipse cx="1560" cy="990" rx="120" ry="14"/></g>`,

  paddenstoelenpad: () => `${grond('#1f4a2c')}
    <path d="M760,1100 Q900,980 1120,950 T1560,900" fill="none" stroke="#3b6b45" stroke-width="70" stroke-linecap="round"/>
    ${paddenstoel(1680, 900, 1.6)}${paddenstoel(1850, 990, 1.1)}${paddenstoel(1300, 1040, 0.8)}${paddenstoel(420, 1000, 0.6)}`,
  dennenwoud: () => `${grond('#163a22', 960)}${den(1560, 1.3)}${den(1730, 1.8)}${den(1880, 1.2)}${den(120, 0.8)}${den(300, 0.6)}`,
  toverkristal: () => `${grond('#1f4a2c')}
    <g transform="translate(1700 1010)"><path d="M-40,0 L-60,-220 L0,-330 L50,-220 L30,0Z" fill="#9b6bff"/>
    <path d="M-150,0 L-170,-130 L-120,-200 L-80,-120 L-90,0Z" fill="#7a4bd6"/><path d="M70,0 L60,-160 L110,-240 L150,-150 L130,0Z" fill="#c7a6ff"/>
    <path d="M0,-330 L50,-220 L0,-160Z" fill="#e6d9ff" opacity=".6"/></g>
    <g transform="translate(320 1040) scale(.4)" fill="#9b6bff"><path d="M-40,0 L-60,-220 L0,-330 L50,-220 L30,0Z"/></g>`,
  drankjeskeuken: () => `${grond('#1f4a2c')}
    <g transform="translate(1700 960)"><ellipse cy="10" rx="160" ry="120" fill="#2a2a33"/><ellipse cy="-90" rx="150" ry="30" fill="#44444f"/>
    <ellipse cy="-90" rx="124" ry="20" fill="#7cf06b"/><g fill="#b8ff9e"><circle cx="-30" cy="-120" r="14"/><circle cx="34" cy="-140" r="10"/><circle cx="6" cy="-170" r="7"/></g>
    <rect x="-120" y="110" width="30" height="40" fill="#2a2a33"/><rect x="90" y="110" width="30" height="40" fill="#2a2a33"/></g>
    <g transform="translate(1440 1020)"><path d="M-14,-90 h28 v30 l40,60 h-108 l40,-60Z" fill="#5ac8fa"/><rect x="-18" y="-104" width="36" height="16" rx="4" fill="#8a5a3a"/></g>
    <g transform="translate(1340 1040) scale(.8)"><circle cy="-40" r="44" fill="#ff7ac8"/><rect x="-12" y="-110" width="24" height="34" fill="#ff7ac8"/></g>`,
  uilentoren: () => `${grond('#1f4a2c', 980)}
    <g transform="translate(1740 0)"><rect x="-110" y="420" width="220" height="660" fill="#2b3d33"/>
    <path d="M-140,430 L0,250 L140,430Z" fill="#3a2a4a"/><circle cy="560" r="56" fill="#ffe066" opacity=".75"/>
    <g fill="#2b3d33"><circle cx="-20" cy="560" r="12"/><circle cx="20" cy="560" r="12"/><path d="M-6,578 h12 l-6,12Z"/></g>
    <g stroke="#22322a" stroke-width="6"><path d="M-110,700 h220 M-110,820 h220 M-110,940 h220 M-40,700 v120 M40,820 v120 M-40,940 v140"/></g></g>`,

  vulkaan: () => `${grond('#3a2410', 960)}
    <path d="M1360,${H} L1600,640 L1720,640 L1960,${H}Z" fill="#5a3415"/>
    <path d="M1600,640 L1720,640 L1700,680 L1660,660 L1620,690Z" fill="#ff7a2a"/>
    <path d="M1650,660 Q1630,760 1660,860 M1690,670 Q1720,780 1700,900" fill="none" stroke="#ff7a2a" stroke-width="16" stroke-linecap="round"/>
    <g fill="#5a4a40" opacity=".8"><circle cx="1680" cy="560" r="40"/><circle cx="1720" cy="490" r="54"/><circle cx="1660" cy="420" r="66"/></g>`,
  moeras: () => `<path d="M0,900 Q960,860 ${B},900 V${H} H0Z" fill="#2f4a2a"/>
    <g fill="none" stroke="#4a6a3a" stroke-width="5"><ellipse cx="600" cy="980" rx="160" ry="14"/><ellipse cx="1200" cy="1030" rx="200" ry="16"/></g>
    <g fill="#5a8a3a"><ellipse cx="1380" cy="960" rx="50" ry="18"/><ellipse cx="1000" cy="940" rx="40" ry="14"/></g>
    <g fill="#3f6a2a"><ellipse cx="1560" cy="920" rx="90" ry="26"/><circle cx="1520" cy="896" r="22"/><circle cx="1580" cy="896" r="22"/></g>
    <g fill="#fff4e0"><circle cx="1520" cy="892" r="9"/><circle cx="1580" cy="892" r="9"/></g>
    <g stroke="#5a7a3a" stroke-width="8" stroke-linecap="round"><path d="M1760,1000 v-260 M1820,1000 v-320 M1880,1000 v-220"/></g>
    <g fill="#7a4a1f"><rect x="1750" y="720" width="20" height="70" rx="10"/><rect x="1810" y="660" width="20" height="70" rx="10"/><rect x="1870" y="760" width="20" height="60" rx="10"/></g>`,
  krater: () => `${grond('#3a2410', 940)}
    <ellipse cx="1360" cy="1000" rx="400" ry="70" fill="#7a4a1f"/><ellipse cx="1360" cy="1006" rx="350" ry="52" fill="#2a1608"/>
    ${bot(1740, 880, 1.6, -25)}${bot(1500, 1050, 0.9, 15)}`,
  strand: () => `<path d="M0,880 H${B} V960 H0Z" fill="#2e6b8f"/>
    <path d="M0,960 Q960,920 ${B},960 V${H} H0Z" fill="#d9b26a"/>
    <path d="M1760,1010 Q1730,820 1680,640" fill="none" stroke="#7a4a1f" stroke-width="30" stroke-linecap="round"/>
    <g fill="#3f8a3a" transform="translate(1680 640)"><path d="M0,0 Q-120,-60 -230,20 Q-110,-10 0,0Z"/><path d="M0,0 Q120,-70 230,10 Q110,-20 0,0Z"/>
    <path d="M0,0 Q-60,-120 -150,-140 Q-50,-80 0,0Z"/><path d="M0,0 Q70,-120 170,-130 Q60,-70 0,0Z"/></g>
    <g fill="#8a5a2a"><circle cx="1660" cy="660" r="16"/><circle cx="1690" cy="670" r="16"/></g>`,
  tempel: () => {
    const treden = [440, 360, 280, 200, 120].map((b, i) => `<rect x="${1700 - b / 2}" y="${H - (i + 1) * 80}" width="${b}" height="80" fill="${i % 2 ? '#7a5a2a' : '#8a6a3a'}"/>`).join('');
    return `${grond('#3a2410', 980)}${treden}<rect x="1670" y="${H - 380}" width="60" height="60" rx="30" fill="#2a1608"/>
      <g transform="translate(1700 ${H - 450})" fill="#e8c9a0"><path d="M-24,-30 h48 l-24,30 l24,30 h-48 l24,-30Z"/></g>`;
  },

  rif: () => `${grond('#c9a46a', 950)}
    <g fill="none" stroke="#ff7a8a" stroke-width="18" stroke-linecap="round"><path d="M1540,960 V760 M1540,860 L1480,790 M1540,820 L1600,740 M1480,790 V720"/></g>
    ${schelp(1720, 980, 1.3)}${schelp(1860, 1030, 0.8)}${schelp(420, 1030, 0.6)}`,
  grot: () => `${grond('#1a4058', 980)}
    <path d="M1360,${H} L1400,720 Q1640,500 ${B},620 V${H}Z" fill="#1c3a4f"/>
    <path d="M1520,${H} Q1540,830 1690,820 Q1830,820 1840,${H}Z" fill="#04213a"/>
    <path d="M1420,720 Q1640,540 1900,640" fill="none" stroke="#2a5470" stroke-width="20"/>`,
  inktvis: () => `<path d="M0,960 Q960,920 ${B},960 V${H} H0Z" fill="#021626"/>
    <g fill="none" stroke="#8a3a7a" stroke-width="34" stroke-linecap="round"><path d="M1660,900 Q1600,1000 1500,990"/><path d="M1710,930 Q1690,1040 1620,1060"/><path d="M1800,930 Q1820,1040 1890,1050"/><path d="M1850,900 Q1920,980 1980,960"/></g>
    <ellipse cx="1760" cy="780" rx="150" ry="170" fill="#8a3a7a"/>
    <g fill="#effaff"><circle cx="1710" cy="800" r="26"/><circle cx="1810" cy="800" r="26"/></g>
    <g fill="#021626"><circle cx="1714" cy="806" r="12"/><circle cx="1814" cy="806" r="12"/></g>`,
  krabben: () => `${grond('#c9a46a', 960)}
    <g fill="#4a5a66"><ellipse cx="1840" cy="960" rx="160" ry="90"/><ellipse cx="1300" cy="1010" rx="110" ry="50"/></g>
    <g transform="translate(1640 960)"><g stroke="#e0523a" stroke-width="10" stroke-linecap="round"><path d="M-80,10 l-50,40 M-70,30 l-40,50 M80,10 l50,40 M70,30 l40,50 M-30,-40 v-40 M30,-40 v-40"/></g>
    <ellipse rx="110" ry="60" fill="#e0523a"/><circle cx="-150" cy="-40" r="36" fill="#e0523a"/><circle cx="150" cy="-40" r="36" fill="#e0523a"/>
    <g fill="#effaff"><circle cx="-30" cy="-84" r="12"/><circle cx="30" cy="-84" r="12"/></g></g>`,
  anker: () => `${grond('#c9a46a', 980)}
    <g fill="#5a6a78">${Array.from({ length: 6 }, (_, i) => `<circle cx="${1730 + i * 32}" cy="${560 - i * 52}" r="16"/>`).join('')}</g>
    <g transform="translate(1720 640)" fill="none" stroke="#7a8a96" stroke-linecap="round"><circle r="40" stroke-width="22"/>
    <path d="M0,40 V380 M-90,120 H90 M-200,280 Q-160,400 0,400 Q160,400 200,280" stroke-width="34"/>
    <path d="M-200,280 l-20,40 M200,280 l20,40" stroke-width="28"/></g>`,

  hondenhok: () => `${grond('#3f6a3a', 980)}
    <rect x="1560" y="820" width="280" height="260" fill="#b5653a"/><path d="M1530,840 L1700,680 L1870,840Z" fill="#7a3a2a"/>
    <path d="M1640,${H} V940 Q1640,890 1700,890 Q1760,890 1760,940 V${H}Z" fill="#2b1d2e"/>
    ${bot(1420, 1030, 0.7, -10)}<ellipse cx="1300" cy="1050" rx="70" ry="22" fill="#4da3ff"/>`,
  kattenmand: () => `<path d="M0,940 H${B} V${H} H0Z" fill="#6a4a3a"/>
    <g transform="translate(1700 980)"><ellipse rx="230" ry="90" fill="#c48a4a"/><ellipse cy="-30" rx="200" ry="50" fill="#e6c7e0"/>
    <g fill="none" stroke="#9a6a3a" stroke-width="8"><path d="M-200,10 Q0,70 200,10 M-180,50 Q0,100 180,50"/></g></g>
    <g transform="translate(1400 1010)"><circle r="54" fill="#ff7ac8"/><g fill="none" stroke="#d94b9a" stroke-width="6"><path d="M-40,-30 Q0,0 40,-34 M-50,6 Q0,30 50,0 M-30,40 Q10,10 44,30"/></g>
    <path d="M50,10 Q120,60 200,30" fill="none" stroke="#ff7ac8" stroke-width="6"/></g>`,
  konijnenren: () => `${grond('#3f6a3a', 980)}
    <g fill="#c4a07a">${Array.from({ length: 7 }, (_, i) => `<rect x="${1320 + i * 96}" y="820" width="22" height="200" rx="8"/>`).join('')}
    <rect x="1300" y="860" width="620" height="18"/><rect x="1300" y="950" width="620" height="18"/></g>
    ${wortel(1480, 1000, -70)}${wortel(1600, 1030, -100)}`,
  paardenstal: () => `${grond('#3f6a3a', 980)}
    <rect x="1540" y="720" width="380" height="360" fill="#a03a3a"/><path d="M1500,740 L1730,560 L1960,740Z" fill="#7a2a2a"/>
    <rect x="1640" y="880" width="180" height="200" fill="#7a2a2a"/>
    <path d="M1640,880 L1820,${H} M1820,880 L1640,${H}" stroke="#fff6fb" stroke-width="12"/><rect x="1680" y="760" width="100" height="70" fill="#2b1d2e"/>
    <g fill="#e0b84a"><rect x="1340" y="980" width="160" height="90" rx="16"/><rect x="1400" y="900" width="140" height="80" rx="16"/></g>`,
  kippenhok: () => `${grond('#3f6a3a', 980)}
    <g stroke="#7a4a1f" stroke-width="18"><path d="M1600,${H} V960 M1820,${H} V960"/></g>
    <rect x="1560" y="760" width="300" height="200" fill="#d9a04a"/><path d="M1530,780 L1710,640 L1890,780Z" fill="#a03a3a"/>
    <g transform="translate(1710 860)"><circle r="64" fill="#fff6fb"/><path d="M0,0 V-44 M0,0 L32,10" stroke="#2b1d2e" stroke-width="10" stroke-linecap="round"/></g>
    <g fill="#fff6fb"><ellipse cx="1420" cy="1040" rx="26" ry="34"/><ellipse cx="1480" cy="1050" rx="24" ry="30"/></g>`,
};

export const ACCENTEN = Object.keys(ACCENT_TEKENING);

// Laag 1 los: { vast: SVG-inhoud, deeltjes: [SVG-tekst per bewegend deeltje] }.
export function sceneVan(soort, prefix) {
  return SCENES[soort](prefix);
}

// Laag 2 los: SVG-inhoud, gedimd.
export function accentSvg(soort, prefix) {
  return `<g opacity=".5">${ACCENT_TEKENING[soort](prefix)}</g>`;
}

// De hele achtergrond voor een scherm. prefix maakt de id's binnen de SVG uniek per scherm.
export function themaAchtergrond(themaId, vaardigheid, prefix) {
  const t = thema(themaId);
  const accent = t.werelden[vaardigheid]?.accent;
  const { vast, deeltjes } = sceneVan(t.scene, prefix);
  return `<div class="thema-achtergrond" aria-hidden="true">
    <svg class="ab-vast" viewBox="0 0 ${B} ${H}" preserveAspectRatio="xMidYMid slice">${vast}${accent ? accentSvg(accent, prefix) : ''}</svg>
    ${deeltjes.join('')}
  </div>`;
}
