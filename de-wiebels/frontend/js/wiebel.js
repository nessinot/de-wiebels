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

// Lege plek waar later een spul in getekend kan worden.
const plek = (naam) => `<g class="w-plek" data-plek="${naam}"></g>`;

// staat: { kleur }. prefix maakt de ids uniek als er meer Wiebels op één pagina staan.
// x, y en schaal plaatsen de Wiebel in de omringende SVG (schaal 1 = 240×260).
export function wiebelSvg(staat, prefix, { x = 0, y = 0, schaal = 1 } = {}) {
  const k = KLEUREN[staat.kleur] ?? KLEUREN.paars;
  return `<svg class="wiebel" x="${x}" y="${y}" width="${240 * schaal}" height="${260 * schaal}" viewBox="0 0 240 260"
      style="overflow:visible;--lijf:${k.lijf};--donker:${k.donker};--buik:${k.buik};--spriet:${k.spriet}" data-mond="rust">
    <defs><clipPath id="${prefix}-romp"><path d="${ROMP}"/></clipPath></defs>
    <ellipse class="w-schaduw" cx="120" cy="238" rx="58" ry="9"/>
    <g class="w-sprong"><g class="w-kantel"><g class="w-lijf">
      <g class="w-spriet-basis l"><g class="w-spriet l"><path class="w-spriet-steel" d="M106,76 Q98,56 92,40"/><circle class="w-spriet-bol" cx="92" cy="38" r="9"/></g></g>
      <g class="w-spriet-basis r"><g class="w-spriet r"><path class="w-spriet-steel" d="M134,76 Q142,56 150,40"/><circle class="w-spriet-bol" cx="150" cy="38" r="9"/></g></g>
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
