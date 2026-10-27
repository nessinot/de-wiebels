// Ouderpagina (in de zijbalk van Home Assistant): profielen aanmaken, wijzigen en verwijderen,
// niveaus, tijdsdruk, Nederland aan/uit, zwakke plekken, geluid, stem, muziek, export en import.
// Praat met de beheer-API van de server; alle adressen zijn relatief vanwege het voorvoegsel van
// de ingress.
// De pagina draait binnen Home Assistant: alles uit een profiel gaat door esc().

import { esc } from '../js/dom.js';
import { zwakkePlekken } from '../js/leitner.js';
import { NIVEAUS, STARTNIVEAUS, VAARDIGHEDEN } from '../js/levels.js';
import { ITEMS } from '../js/nederland/items.js';
import { AVATARS, MAX_NAAM, nieuwProfiel, vulAan } from '../js/profiel.js';
import { itemTekst } from '../js/weergave.js';

const NAMEN = { plus: 'Plus', min: 'Min', keer: 'Keer', delen: 'Delen', klok: 'Klok' };
const BEVESTIG_TIJD = 4000;
const MELDING_TIJD = 3000;

const lijst = document.getElementById('profielen');
const nieuw = document.getElementById('nieuw');
const meldingEl = document.getElementById('melding');
const terugKnop = document.getElementById('terug');
let huidig = null; // het profiel dat open staat; dan is alleen dat profiel te zien
let bevestig = null; // id van het profiel waarvan verwijderen nog bevestigd moet worden

// Nederland: per provincie wat je aan- en uitzet. Wat in meer provincies ligt (zoals water), staat
// bij elk ervan. In het profiel staat alleen wat uitstaat (profiel.nederland.uit).
const SOORTEN = { plaats: 'Plaatsen', streek: 'Streken', eiland: 'Eilanden', water: 'Water' };
const PROVINCIES = ITEMS.filter((it) => it.soort === 'provincie');
const HOOFDSTEDEN = new Set(PROVINCIES.map((pv) => pv.hoofdstad));
const NL_ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
const PER_PROVINCIE = Object.fromEntries(PROVINCIES.map((pv) => [pv.id, ITEMS
  .filter((it) => SOORTEN[it.soort] && it.provincies.includes(pv.id))
  .sort((a, b) => a.naam.localeCompare(b.naam, 'nl'))]));
const openGroepen = new Set(); // "profiel-id provincie-id": wat openblijft als de lijst opnieuw getekend wordt

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

function nederlandGroep(p, pv, uit) {
  const items = PER_PROVINCIE[pv.id];
  const aan = items.filter((it) => !uit.has(it.id)).length;
  const soorten = Object.entries(SOORTEN).map(([soort, kop]) => {
    const deel = items.filter((it) => it.soort === soort);
    return deel.length ? `
      <fieldset><legend>${kop}</legend><div class="vinkjes">
        ${deel.map((it) => `<label class="schakel"><input type="checkbox" data-nl-item="${it.id}" ${uit.has(it.id) ? '' : 'checked'}> ${esc(it.naam)}${HOOFDSTEDEN.has(it.id) ? ' <small>(hoofdstad)</small>' : ''}</label>`).join('')}
      </div></fieldset>` : '';
  }).join('');
  return `
    <details class="groep" data-groep="${pv.id}" ${openGroepen.has(`${p.id} ${pv.id}`) ? 'open' : ''}>
      <summary>${esc(pv.naam)} <small>${aan} van ${items.length} aan</small></summary>
      <div class="knoppen">
        <button class="knop" type="button" data-nl-alles="aan">Alles aan</button>
        <button class="knop" type="button" data-nl-alles="uit">Alles uit</button>
      </div>
      ${soorten}
    </details>`;
}

function profielKaart(p) {
  const zwak = zwakkePlekken(p.items, 8);
  const uit = new Set(p.nederland.uit);
  return `
    <details class="kaart" data-id="${esc(p.id)}" ${huidig === p.id ? 'open' : ''}>
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
      <h3>Nederland</h3>
      <p class="uitleg">Kies welke plaatsen, streken, eilanden en wateren in het spel voorkomen. Provincies en hoofdsteden staan altijd aan bij Provincies en Hoofdsteden; een hoofdstad uitzetten geldt alleen voor Plaatsen.</p>
      ${PROVINCIES.map((pv) => nederlandGroep(p, pv, uit)).join('')}
      <h3>Zwakke plekken</h3>
      <p class="zwak">${zwak.length ? zwak.map((z) => `<span>${esc(itemTekst(z.id))} <small>${Number(z.fout)}× fout, ${Number(z.goed)}× goed</small></span>`).join('') : 'Nog geen lastige vragen gevonden.'}</p>
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
// Wijzigingen gaan na elkaar, zodat snel achter elkaar klikken (vinkjes) niets kwijtraakt.
let wachtrij = Promise.resolve();
function wijzig(id, aanpassing, tekst) {
  const klaar = wachtrij.then(async () => {
    const p = vulAan(await api(`api/profielen/${id}`));
    aanpassing(p);
    p.bijgewerkt = new Date().toISOString();
    await api(`api/profielen/${id}`, { method: 'PUT', body: JSON.stringify(p) });
    meld(tekst);
    await laadProfielen();
  });
  wachtrij = klaar.catch(() => {});
  return klaar;
}

function zetNederland(p, ids, aan) {
  const uit = new Set(p.nederland.uit);
  ids.forEach((id) => (aan ? uit.delete(id) : uit.add(id)));
  p.nederland.uit = [...uit];
}

// Een geopend profiel staat alleen, als eigen pagina met bovenin de terugknop.
function toonProfiel(id) {
  if (huidig === id) return;
  huidig = id;
  lijst.querySelectorAll('details[open]').forEach((d) => { if (d.dataset.id !== id) d.open = false; });
  document.body.classList.add('profiel-open');
  terugKnop.hidden = false;
  window.scrollTo(0, 0);
}

function toonOverzicht() {
  huidig = null;
  lijst.querySelectorAll('details[open]').forEach((d) => { d.open = false; });
  document.body.classList.remove('profiel-open');
  terugKnop.hidden = true;
}

lijst.addEventListener('toggle', (e) => {
  const groep = e.target.dataset.groep;
  if (groep) {
    const sleutel = `${e.target.closest('[data-id]').dataset.id} ${groep}`;
    if (e.target.open) openGroepen.add(sleutel);
    else openGroepen.delete(sleutel);
    return;
  }
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.open) toonProfiel(id);
  else if (id === huidig) toonOverzicht();
}, true);

terugKnop.addEventListener('click', toonOverzicht);

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
  const item = e.target.dataset.nlItem;
  if (item) {
    const aan = e.target.checked;
    poging(() => wijzig(id, (p) => zetNederland(p, [item], aan), `${NL_ITEM[item].naam} ${aan ? 'aan' : 'uit'}.`));
  }
});

let bevestigTimer;
lijst.addEventListener('click', (e) => {
  const alles = e.target.closest('[data-nl-alles]');
  if (alles) {
    const pv = alles.closest('[data-groep]').dataset.groep;
    const aan = alles.dataset.nlAlles === 'aan';
    const ids = PER_PROVINCIE[pv].map((it) => it.id);
    poging(() => wijzig(alles.closest('[data-id]').dataset.id, (p) => zetNederland(p, ids, aan), `${NL_ITEM[pv].naam}: alles ${aan ? 'aan' : 'uit'}.`));
    return;
  }
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
    toonOverzicht();
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

// Downloaden zonder naar een andere pagina te gaan: in de app op de telefoon kom je daar niet meer vandaan.
document.getElementById('exporteer').addEventListener('click', () => poging(async () => {
  const data = await api('api/export');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  link.download = `de-wiebels-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  meld('Het exportbestand wordt gedownload.');
}));

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
