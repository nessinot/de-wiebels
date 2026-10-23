// Werelden, levels en startniveaus. Thema's bepalen alleen hoe dit eruitziet.

export const VAARDIGHEDEN = ['plus', 'min', 'keer', 'delen', 'klok'];

const TAFELVOLGORDE = [1, 2, 10, 5, 3, 4, 6, 7, 8, 9];

function tafels(vaardigheid, label) {
  return [
    ...TAFELVOLGORDE.map((tafel) => ({ id: `${vaardigheid}:${tafel}`, label: label(tafel), tafels: [tafel] })),
    { id: `${vaardigheid}:mix`, label: 'Alles door elkaar', tafels: TAFELVOLGORDE },
  ];
}

function sommen(vaardigheid, onthouden) {
  return [
    { id: `${vaardigheid}:10`, label: 'Tot 10', max: 10 },
    { id: `${vaardigheid}:20`, label: 'Tot 20', max: 20 },
    { id: `${vaardigheid}:tiental`, label: 'Over het tiental', max: 20, tiental: true },
    { id: `${vaardigheid}:tientallen`, label: 'Tientallen', max: 100, tientallen: true },
    { id: `${vaardigheid}:100`, label: 'Tot 100', max: 100 },
    { id: `${vaardigheid}:1000`, label: 'Tot 1000', max: 1000, onthouden: false },
    { id: `${vaardigheid}:1000-${onthouden}`, label: `Tot 1000 met ${onthouden}`, max: 1000, onthouden: true },
  ];
}

export const LEVELS = {
  plus: sommen('plus', 'onthouden'),
  min: sommen('min', 'lenen'),
  keer: tafels('keer', (t) => `Tafel van ${t}`),
  delen: tafels('delen', (t) => `Delen door ${t}`),
  klok: [
    { id: 'klok:uren', label: 'Hele uren', stap: 60 },
    { id: 'klok:half', label: 'Halve uren', stap: 30 },
    { id: 'klok:kwart', label: 'Kwartieren', stap: 15 },
    { id: 'klok:vijf', label: 'Per vijf minuten', stap: 5 },
    { id: 'klok:minuut', label: 'Op de minuut', stap: 1 },
    { id: 'klok:24', label: '24-uursklok', stap: 5, uur24: true },
  ],
};

for (const v of VAARDIGHEDEN) for (const level of LEVELS[v]) level.vaardigheid = v;

// Startniveaus: hoeveel levels van een wereld meteen open zijn.
export const NIVEAUS = {
  plus: [{ label: 'Tot 20', open: 2 }, { label: 'Tot 100', open: 5 }, { label: 'Tot 1000', open: 7 }],
  min: [{ label: 'Tot 20', open: 2 }, { label: 'Tot 100', open: 5 }, { label: 'Tot 1000', open: 7 }],
  keer: [{ label: 'Tafels van 1, 2, 5 en 10', open: 4 }, { label: 'Alle tafels', open: 11 }],
  delen: [{ label: 'Na de keertafels', open: 0 }, { label: 'Alle tafels', open: 11 }],
  klok: [{ label: 'Hele en halve uren, kwartieren', open: 3 }, { label: 'Op de minuut, 24-uursklok', open: 6 }],
};

export const STARTNIVEAUS = {
  starter: { label: 'Starter', uitleg: 'Plus en min tot 20, tafels van 1, 2, 5 en 10, hele en halve uren', niveaus: { plus: 0, min: 0, keer: 0, delen: 0, klok: 0 } },
  gevorderd: { label: 'Gevorderd', uitleg: 'Tot 1000, alle tafels, delen, op de minuut en 24-uursklok', niveaus: { plus: 2, min: 2, keer: 1, delen: 1, klok: 1 } },
};

export function levelVan(id) {
  return LEVELS[id.split(':')[0]].find((l) => l.id === id);
}

export function levelOpen(profiel, level) {
  const lijst = LEVELS[level.vaardigheid];
  const i = lijst.indexOf(level);
  if (i < NIVEAUS[level.vaardigheid][profiel.niveaus[level.vaardigheid]].open) return true;
  if (level.vaardigheid === 'delen' && level.tafels.length === 1 && (profiel.sterren[`keer:${level.tafels[0]}`] || 0) >= 2) return true;
  return i > 0 && (profiel.sterren[lijst[i - 1].id] || 0) >= 1;
}

export function baasOpen(profiel, vaardigheid) {
  return LEVELS[vaardigheid].every((l) => (profiel.sterren[l.id] || 0) >= 1);
}

// Alle mogelijke beloningen in vaste volgorde: elk level en elke eindbaas.
export const BELONINGEN = VAARDIGHEDEN.flatMap((v) => [...LEVELS[v].map((l) => l.id), `baas:${v}`]);
