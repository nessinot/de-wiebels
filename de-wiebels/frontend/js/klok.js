// SVG-wijzerklok en notaties van tijd.

export function hoeken(uur, minuut) {
  return { uur: ((uur % 12) + minuut / 60) * 30, minuut: minuut * 6 };
}

export function digitaal(uur, minuut) {
  return `${uur}:${String(minuut).padStart(2, '0')}`;
}

function streepjes() {
  let svg = '';
  for (let i = 0; i < 60; i++) {
    const lang = i % 5 === 0;
    svg += `<line class="streep${lang ? ' streep-lang' : ''}" x1="0" y1="${lang ? -80 : -85}" x2="0" y2="-92" transform="rotate(${i * 6})"/>`;
  }
  return svg;
}

function cijfers() {
  let svg = '';
  for (let i = 1; i <= 12; i++) {
    const hoek = (i * 30 * Math.PI) / 180;
    svg += `<text x="${(Math.sin(hoek) * 66).toFixed(1)}" y="${(-Math.cos(hoek) * 66 + 7).toFixed(1)}">${i}</text>`;
  }
  return svg;
}

export function klokSvg(uur, minuut, klasse = '') {
  const h = hoeken(uur, minuut);
  return `
    <svg class="klok ${klasse}" viewBox="-100 -100 200 200" aria-label="${digitaal(uur, minuut)}">
      <circle class="wijzerplaat" r="97"/>
      ${streepjes()}
      <g class="cijfers">${cijfers()}</g>
      <line class="wijzer wijzer-uur" x1="0" y1="10" x2="0" y2="-45" style="transform: rotate(${h.uur}deg)"/>
      <line class="wijzer wijzer-minuut" x1="0" y1="12" x2="0" y2="-74" style="transform: rotate(${h.minuut}deg)"/>
      <circle class="as" r="6"/>
    </svg>
  `;
}

// Zet de wijzers van een bestaande klok; met CSS-transitie draaien ze er vloeiend heen.
export function zetKlok(svg, uur, minuut) {
  const h = hoeken(uur, minuut);
  svg.querySelector('.wijzer-uur').style.transform = `rotate(${h.uur}deg)`;
  svg.querySelector('.wijzer-minuut').style.transform = `rotate(${h.minuut}deg)`;
}
