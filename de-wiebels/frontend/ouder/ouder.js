// Ouderpagina (in de zijbalk van Home Assistant): profielen aanmaken, wijzigen en verwijderen,
// niveaus, tijdsdruk, zwakke plekken, geluid, stem, muziek, export en import. Praat met de
// beheer-API van de server; alle adressen zijn relatief vanwege het voorvoegsel van de ingress.
// De pagina draait binnen Home Assistant: alles uit een profiel gaat door esc().

import { esc } from '../js/dom.js';
import { zwakkePlekken } from '../js/leitner.js';
import { NIVEAUS, STARTNIVEAUS, VAARDIGHEDEN } from '../js/levels.js';
import { AVATARS, MAX_NAAM, nieuwProfiel, vulAan } from '../js/profiel.js';
import { itemTekst } from '../js/weergave.js';

const NAMEN = { plus: 'Plus', min: 'Min', keer: 'Keer', delen: 'Delen', klok: 'Klok' };
const BEVESTIG_TIJD = 4000;
const MELDING_TIJD = 3000;

const lijst = document.getElementById('profielen');
const nieuw = document.getElementById('nieuw');
const meldingEl = document.getElementById('melding');
const open = new Set(); // profielen die uitgeklapt staan
let bevestig = null; // id van het profiel waarvan verwijderen nog bevestigd moet worden

async function api(pad, opties = {}) {
  const antwoord = await fetch(pad, { ...opties, headers: { 'Content-Type': 'application/json' } });
  const inhoud = antwoord.status === 204 ? null : await antwoord.json().catch(() => null);
  if (!antwoord.ok) throw new Error(inhoud?.fout || `fout ${antwoord.status}`);
  return inhoud;
}

let meldingTimer;
function meld(tekst) {
  meldingEl.textContent = tekst;
  meldingEl.hidden = false;
  clearTimeout(meldingTimer);
  meldingTimer = setTimeout(() => { meldingEl.hidden = true; }, MELDING_TIJD);
}

async function poging(actie) {
  try {
    await actie();
  } catch (fout) {
    meld(`Dat lukte niet: ${fout.message}`);
  }
}

function avatarKeuze(naam, gekozen) {
  return AVATARS.map((a) => `
    <label class="avatar"><input type="radio" name="${naam}" value="${a}" ${a === gekozen ? 'checked' : ''} required><span>${a}</span></label>`).join('');
}

function profielKaart(p) {
  const zwak = zwakkePlekken(p.items, 8);
  return `
    <details class="kaart" data-id="${esc(p.id)}" ${open.has(p.id) ? 'open' : ''}>
      <summary><span class="avatar-groot">${esc(p.avatar)}</span> ${esc(p.naam)}</summary>
      <form data-actie="naam">
        <label class="veld">Naam <input name="naam" value="${esc(p.naam)}" maxlength="${MAX_NAAM}" required></label>
        <fieldset><legend>Avatar</legend><div class="avatars">${avatarKeuze(`avatar-${p.id}`, p.avatar)}</div></fieldset>
        <button class="knop">Naam en avatar opslaan</button>
      </form>
      <h3>Niveaus</h3>
      <div class="niveaus">
        ${VAARDIGHEDEN.map((v) => `
          <label class="veld">${NAMEN[v]}
            <select data-niveau="${v}">
              ${NIVEAUS[v].map((n, i) => `<option value="${i}" ${p.niveaus[v] === i ? 'selected' : ''}>${n.label}</option>`).join('')}
            </select>
          </label>`).join('')}
      </div>
      <label class="schakel"><input type="checkbox" data-tijdsdruk ${p.instellingen?.tijdsdruk ? 'checked' : ''}> Tijdsdruk bij eindbazen</label>
      <h3>Zwakke plekken</h3>
      <p class="zwak">${zwak.length ? zwak.map((z) => `<span>${esc(itemTekst(z.id))} <small>${Number(z.fout)}× fout, ${Number(z.goed)}× goed</small></span>`).join('') : 'Nog geen lastige sommen gevonden.'}</p>
      <button class="knop knop-gevaar" data-verwijder>${bevestig === p.id ? 'Zeker weten? Klik nog een keer' : 'Profiel verwijderen'}</button>
    </details>`;
}

async function laadProfielen() {
  const profielen = (await api('api/profielen')).map(vulAan).sort((a, b) => a.aangemaakt.localeCompare(b.aangemaakt));
  lijst.innerHTML = profielen.length
    ? profielen.map(profielKaart).join('')
    : '<p class="uitleg">Nog geen profielen. Maak hieronder het eerste profiel aan.</p>';
}

// Altijd de nieuwste versie van de server aanpassen, zodat voortgang van de tv niet verloren gaat.
async function wijzig(id, aanpassing, tekst) {
  const p = vulAan(await api(`api/profielen/${id}`));
  aanpassing(p);
  p.bijgewerkt = new Date().toISOString();
  await api(`api/profielen/${id}`, { method: 'PUT', body: JSON.stringify(p) });
  meld(tekst);
  await laadProfielen();
}

lijst.addEventListener('toggle', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.open) open.add(id);
  else open.delete(id);
}, true);

lijst.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = e.target.closest('[data-id]').dataset.id;
  const data = new FormData(e.target);
  const naam = data.get('naam').trim().slice(0, MAX_NAAM);
  if (!naam) return meld('Vul een naam in.');
  poging(() => wijzig(id, (p) => {
    p.naam = naam;
    p.avatar = data.get(`avatar-${id}`);
  }, 'Naam en avatar opgeslagen.'));
});

lijst.addEventListener('change', (e) => {
  const id = e.target.closest('[data-id]')?.dataset.id;
  const v = e.target.dataset.niveau;
  if (v) poging(() => wijzig(id, (p) => { p.niveaus[v] = Number(e.target.value); }, `Niveau ${NAMEN[v]} opgeslagen.`));
  if (e.target.hasAttribute('data-tijdsdruk')) {
    const aan = e.target.checked;
    poging(() => wijzig(id, (p) => { p.instellingen = { ...p.instellingen, tijdsdruk: aan }; }, `Tijdsdruk ${aan ? 'aan' : 'uit'}.`));
  }
});

let bevestigTimer;
lijst.addEventListener('click', (e) => {
  const knop = e.target.closest('[data-verwijder]');
  if (!knop) return;
  const id = knop.closest('[data-id]').dataset.id;
  clearTimeout(bevestigTimer);
  if (bevestig !== id) {
    bevestig = id;
    knop.textContent = 'Zeker weten? Klik nog een keer';
    bevestigTimer = setTimeout(() => {
      bevestig = null;
      knop.textContent = 'Profiel verwijderen';
    }, BEVESTIG_TIJD);
    return;
  }
  bevestig = null;
  poging(async () => {
    await api(`api/profielen/${id}`, { method: 'DELETE' });
    open.delete(id);
    meld('Profiel verwijderd.');
    await laadProfielen();
  });
});

nieuw.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(nieuw);
  const naam = data.get('naam').trim();
  if (!naam) return meld('Vul een naam in.');
  const profiel = nieuwProfiel({ naam, avatar: data.get('nieuw-avatar'), startniveau: data.get('startniveau') });
  poging(async () => {
    await api(`api/profielen/${profiel.id}`, { method: 'PUT', body: JSON.stringify(profiel) });
    nieuw.reset();
    meld(`Profiel ${profiel.naam} aangemaakt.`);
    await laadProfielen();
  });
});

document.querySelectorAll('[data-instelling]').forEach((vak) => {
  vak.addEventListener('change', () => poging(async () => {
    await api('api/instellingen', { method: 'PUT', body: JSON.stringify({ [vak.dataset.instelling]: vak.checked }) });
    meld('Opgeslagen.');
  }));
});

document.getElementById('importeer').addEventListener('change', (e) => {
  const bestand = e.target.files[0];
  if (!bestand) return;
  poging(async () => {
    const { aantal } = await api('api/import', { method: 'POST', body: await bestand.text() });
    meld(`${aantal} profiel(en) ingelezen.`);
    await Promise.all([laadProfielen(), laadInstellingen()]);
  }).finally(() => { e.target.value = ''; });
});

async function laadInstellingen() {
  const inst = await api('api/instellingen');
  document.querySelectorAll('[data-instelling]').forEach((vak) => { vak.checked = inst[vak.dataset.instelling]; });
}

nieuw.naam.maxLength = MAX_NAAM;
nieuw.querySelector('[data-avatars]').innerHTML = avatarKeuze('nieuw-avatar', AVATARS[0]);
document.getElementById('startniveaus').innerHTML = Object.entries(STARTNIVEAUS).map(([sleutel, n], i) => `
  <label class="keuze"><input type="radio" name="startniveau" value="${sleutel}" ${i === 0 ? 'checked' : ''}>
    <span><strong>${n.label}</strong><small>${n.uitleg}</small></span></label>`).join('');
poging(() => Promise.all([laadProfielen(), laadInstellingen()]));
