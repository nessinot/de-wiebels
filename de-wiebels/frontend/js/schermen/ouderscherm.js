// Ouderscherm: profielen beheren, niveaus en tijdsdruk per kind, zwakke plekken, geluid, pincode,
// export en import.

import { esc, maakEl, opKlik } from '../dom.js';
import { zwakkePlekken } from '../leitner.js';
import { NIVEAUS, VAARDIGHEDEN } from '../levels.js';
import { opslag } from '../opslag.js';
import { downloadExport, leesImport } from '../sync.js';
import { itemTekst } from '../weergave.js';

const NAMEN = { plus: 'Plus', min: 'Min', keer: 'Keer', delen: 'Delen', klok: 'Klok' };
const BEVESTIG_TIJD = 3000;

export const ouderscherm = {
  maak({ toon, terug, zetFocus }) {
    const el = maakEl();
    let gekozen = 'algemeen';
    let melding = '';
    let bevestigVerwijderen = null;
    let nieuwePin = null; // tijdens het wijzigen van de pincode: de cijfers tot nu toe

    const bestand = document.createElement('input');
    bestand.type = 'file';
    bestand.accept = 'application/json,.json';
    bestand.addEventListener('change', async () => {
      const f = bestand.files[0];
      if (!f) return;
      const uitslag = leesImport(await f.text());
      melding = uitslag.ok ? `${uitslag.aantal} profiel(en) geïmporteerd.` : uitslag.reden;
      bestand.value = '';
      teken('importeer');
    });

    function profielPaneel(p) {
      const zwak = zwakkePlekken(p.items, 8);
      return `
        <h2>${p.avatar} ${esc(p.naam)}</h2>
        <div class="ouder-niveaus">
          ${VAARDIGHEDEN.map((v) => `
            <span class="ouder-label">${NAMEN[v]}</span>
            <button class="knop knop-klein" data-focus data-actie="niveau" data-waarde="${v}:-1" ${p.niveaus[v] === 0 ? 'disabled' : ''}>◀</button>
            <span class="ouder-waarde">${NIVEAUS[v][p.niveaus[v]].label}</span>
            <button class="knop knop-klein" data-focus data-actie="niveau" data-waarde="${v}:1" ${p.niveaus[v] === NIVEAUS[v].length - 1 ? 'disabled' : ''}>▶</button>
          `).join('')}
        </div>
        <div class="knoppenrij links">
          <button class="knop" data-focus data-actie="tijdsdruk">Tijdsdruk bij eindbazen: ${p.instellingen.tijdsdruk ? 'aan' : 'uit'}</button>
          <button class="knop knop-gevaar" data-focus data-actie="verwijder">${bevestigVerwijderen === p.id ? 'Zeker weten? Druk nog een keer' : 'Profiel verwijderen'}</button>
        </div>
        <h3>Zwakke plekken</h3>
        <p class="zwakke-plekken">${zwak.length ? zwak.map((z) => `<span>${itemTekst(z.id)} <small>${z.fout}× fout, ${z.goed}× goed</small></span>`).join('') : 'Nog geen lastige sommen gevonden.'}</p>
      `;
    }

    function algemeenPaneel() {
      const inst = opslag.instellingen();
      const pinTekst = nieuwePin === null ? 'Pincode wijzigen' : `Nieuwe pincode: ${'•'.repeat(nieuwePin.length)}${'_'.repeat(4 - nieuwePin.length)}`;
      return `
        <h2>Algemeen</h2>
        <div class="ouder-knoppen">
          <button class="knop" data-focus data-actie="geluid">Geluid: ${inst.geluid ? 'aan' : 'uit'}</button>
          <button class="knop" data-focus data-actie="pin">${pinTekst}</button>
          <button class="knop" data-focus data-actie="exporteer">Alle data exporteren</button>
          <button class="knop" data-focus data-actie="importeer">Data importeren</button>
          <button class="knop" data-focus data-actie="test">Bedieningstest</button>
          <button class="knop" data-focus data-actie="proef">Animatieproef</button>
        </div>
        ${nieuwePin === null ? '' : '<p class="ondertitel">Typ vier cijfers met de afstandsbediening.</p>'}
      `;
    }

    function teken(focusActie) {
      const profielen = opslag.alleProfielen();
      const p = profielen.find((x) => x.id === gekozen);
      if (!p) gekozen = 'algemeen';
      el.innerHTML = `
        <div class="kopregel">
          <button class="knop" data-focus data-actie="terug">← Klaar</button>
          <h1>Ouderscherm</h1>
        </div>
        <div class="ouder-indeling">
          <div class="ouder-menu">
            <button class="knop${gekozen === 'algemeen' ? ' winkel-aan' : ''}" data-focus data-actie="kies" data-waarde="algemeen">⚙️ Algemeen</button>
            ${profielen.map((x) => `<button class="knop${gekozen === x.id ? ' winkel-aan' : ''}" data-focus data-actie="kies" data-waarde="${x.id}">${x.avatar} ${esc(x.naam)}</button>`).join('')}
          </div>
          <div class="ouder-paneel">${p ? profielPaneel(p) : algemeenPaneel()}</div>
        </div>
        <p class="ondertitel">${esc(melding)}</p>
      `;
      if (!focusActie) return;
      let doel = el.querySelector(`[data-actie="${focusActie}"]`) || el.querySelector(`[data-waarde="${focusActie}"]`);
      // Een niveauknop die aan het eind uitgeschakeld raakt: focus naar de knop de andere kant op.
      if (doel?.disabled) doel = el.querySelector(`[data-waarde="${focusActie.replace(/:(-?)1$/, (_, min) => (min ? ':1' : ':-1'))}"]`);
      zetFocus(doel);
    }

    function wijzigProfiel(aanpassing, focus) {
      const p = opslag.alleProfielen().find((x) => x.id === gekozen);
      aanpassing(p);
      opslag.bewaarProfiel(p);
      teken(focus);
    }

    opKlik(el, {
      terug: () => terug(),
      kies(id) {
        gekozen = id;
        melding = '';
        nieuwePin = null;
        teken(id);
      },
      niveau(waarde) {
        const [v, stap] = waarde.split(':');
        wijzigProfiel((p) => {
          p.niveaus[v] = Math.min(NIVEAUS[v].length - 1, Math.max(0, p.niveaus[v] + Number(stap)));
        }, waarde);
      },
      tijdsdruk: () => wijzigProfiel((p) => { p.instellingen.tijdsdruk = !p.instellingen.tijdsdruk; }, 'tijdsdruk'),
      verwijder() {
        if (bevestigVerwijderen !== gekozen) {
          bevestigVerwijderen = gekozen;
          setTimeout(() => { bevestigVerwijderen = null; }, BEVESTIG_TIJD);
          return teken('verwijder');
        }
        opslag.verwijderProfiel(gekozen);
        melding = 'Profiel verwijderd.';
        gekozen = 'algemeen';
        bevestigVerwijderen = null;
        teken('algemeen');
      },
      geluid() {
        const inst = opslag.instellingen();
        opslag.bewaarInstellingen({ ...inst, geluid: !inst.geluid });
        teken('geluid');
      },
      pin() {
        nieuwePin = '';
        melding = '';
        teken('pin');
      },
      exporteer() {
        downloadExport();
        melding = 'Het exportbestand wordt gedownload.';
        teken('exporteer');
      },
      importeer: () => bestand.click(),
      test: () => toon('bedieningstest'),
      proef: () => toon('animatieproef'),
    });

    teken();
    return {
      el,
      bijTerugkomst: () => teken(),
      bijToets({ actie, cijfer }) {
        if (actie !== 'cijfer' || nieuwePin === null) return false;
        nieuwePin += cijfer;
        if (nieuwePin.length === 4) {
          opslag.bewaarInstellingen({ ...opslag.instellingen(), pin: nieuwePin });
          melding = 'De nieuwe pincode is opgeslagen.';
          nieuwePin = null;
        }
        teken('pin');
        return true;
      },
    };
  },
};
