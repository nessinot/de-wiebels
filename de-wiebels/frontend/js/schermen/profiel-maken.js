// Nieuw profiel in drie stappen: naam, avatar, startniveau.

import { esc, maakEl, opKlik } from '../dom.js';
import { STARTNIVEAUS } from '../levels.js';
import { opslag, staat } from '../opslag.js';
import { AVATARS, MAX_NAAM, nieuwProfiel } from '../profiel.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STAPPEN = ['naam', 'avatar', 'niveau'];

export const profielMaken = {
  maak({ toon, zetFocus, herstelFocus }) {
    const el = maakEl();
    const keuze = { naam: '', avatar: null };
    let stap = 0;

    function tekenNaam() {
      return `
        <h1>Hoe heet je?</h1>
        <div class="naamveld">${esc(keuze.naam) || '&nbsp;'}<span class="cursor"></span></div>
        <div class="toetsenbord">
          ${LETTERS.map((l) => `<button class="knop toets" data-focus data-actie="letter" data-waarde="${l}">${l}</button>`).join('')}
          <button class="knop toets toets-breed" data-focus data-actie="letter" data-waarde=" ">spatie</button>
          <button class="knop toets" data-focus data-actie="wis">⌫</button>
          <button class="knop toets toets-breed knop-hoofd" data-focus data-actie="verder" ${keuze.naam.trim() ? '' : 'disabled'}>Verder →</button>
        </div>
      `;
    }

    function tekenAvatar() {
      return `
        <h1>Kies je avatar</h1>
        <div class="avatars">
          ${AVATARS.map((a) => `<button class="knop avatarknop" data-focus data-actie="avatar" data-waarde="${a}">${a}</button>`).join('')}
        </div>
      `;
    }

    function tekenNiveau() {
      return `
        <h1>Hoe goed kun je het al?</h1>
        <p class="ondertitel">Dit kan later nog worden aangepast.</p>
        <div class="keuzes">
          ${Object.entries(STARTNIVEAUS).map(([sleutel, n]) => `
            <button class="knop keuzeknop" data-focus data-actie="niveau" data-waarde="${sleutel}">
              <strong>${n.label}</strong><span>${n.uitleg}</span>
            </button>`).join('')}
        </div>
      `;
    }

    function teken() {
      el.innerHTML = { naam: tekenNaam, avatar: tekenAvatar, niveau: tekenNiveau }[STAPPEN[stap]]();
      herstelFocus();
    }

    function tekenNaamveld(focusLetter) {
      el.querySelector('.naamveld').innerHTML = `${esc(keuze.naam) || '&nbsp;'}<span class="cursor"></span>`;
      el.querySelector('[data-actie="verder"]').disabled = !keuze.naam.trim();
      if (focusLetter) zetFocus(focusLetter);
    }

    opKlik(el, {
      letter(l, knop) {
        if (keuze.naam.length >= MAX_NAAM || (l === ' ' && !keuze.naam)) return;
        keuze.naam += keuze.naam ? l.toLowerCase() : l;
        tekenNaamveld(knop);
      },
      wis(_, knop) {
        keuze.naam = keuze.naam.slice(0, -1);
        tekenNaamveld(knop);
      },
      verder() {
        stap = 1;
        teken();
      },
      avatar(a) {
        keuze.avatar = a;
        stap = 2;
        teken();
      },
      niveau(startniveau) {
        const profiel = nieuwProfiel({ ...keuze, startniveau });
        opslag.bewaarProfiel(profiel);
        staat.profiel = profiel;
        toon('wereldkaart', {}, { vervang: true });
      },
    });

    teken();
    return {
      el,
      bijToets({ actie }) {
        if (actie !== 'terug' || stap === 0) return false;
        stap -= 1;
        teken();
        return true;
      },
    };
  },
};
