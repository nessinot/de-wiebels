// Nieuw profiel in vijf stappen: naam, avatar, Wiebel-kleur, thema, startniveau.

import { esc, maakEl, opKlik } from '../dom.js';
import { STARTNIVEAUS } from '../levels.js';
import { opslag, staat } from '../opslag.js';
import { AVATARS, MAX_NAAM, nieuwProfiel } from '../profiel.js';
import { pasThemaToe, STANDAARD_THEMA } from '../themas/index.js';
import { themaKnoppen } from '../weergave.js';
import { KLEUREN, wiebelSvg } from '../wiebel.js';
import { blij, maakSpreker } from '../wiebel-beweging.js';
import { willekeurigeZin } from '../zinnen.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STAPPEN = ['naam', 'avatar', 'wiebel', 'thema', 'niveau'];
const NA_KLEURKEUZE = 2400; // ms: de gekozen Wiebel springt en zegt iets voor de volgende stap

export const profielMaken = {
  maak({ toon, zetFocus, herstelFocus }) {
    const el = maakEl();
    const keuze = { naam: '', avatar: null, thema: STANDAARD_THEMA };
    let stap = 0;
    let wachtOpVolgende = null;

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

    // De Wiebels als grote kaarten, in het stadium waarin een nieuw profiel begint.
    function tekenWiebel() {
      return `
        <h1>Kies je Wiebel</h1>
        <div class="wiebelkaarten">
          ${Object.entries(KLEUREN).map(([id, k]) => `
            <button class="knop wiebelkaart" data-focus data-actie="kleur" data-waarde="${id}">
              <span class="bubbel" hidden></span>
              ${wiebelSvg({ kleur: id, stadium: 0 }, `kies-${id}`, { schaal: 1.6 })}
              <span>${k.naam}</span>
            </button>`).join('')}
        </div>
      `;
    }

    function tekenThema() {
      return `<h1>Kies je wereld</h1>${themaKnoppen(keuze.thema)}`;
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
      el.innerHTML = { naam: tekenNaam, avatar: tekenAvatar, wiebel: tekenWiebel, thema: tekenThema, niveau: tekenNiveau }[STAPPEN[stap]]();
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
      kleur(id, kaart) {
        if (wachtOpVolgende) return;
        keuze.kleur = id;
        blij(kaart.querySelector('.wiebel'));
        maakSpreker(kaart, true)(willekeurigeZin('kleurGekozen').tekst);
        wachtOpVolgende = setTimeout(() => {
          wachtOpVolgende = null;
          stap = 3;
          teken();
        }, NA_KLEURKEUZE);
      },
      thema(id) {
        keuze.thema = id;
        stap = 4;
        teken();
      },
      niveau(startniveau) {
        const profiel = nieuwProfiel({ ...keuze, startniveau });
        opslag.bewaarProfiel(profiel);
        staat.profiel = profiel;
        pasThemaToe(profiel.thema);
        toon('wereldkaart', {}, { vervang: true });
      },
    });

    teken();
    return {
      el,
      bijToets({ actie }) {
        if (actie !== 'terug' || stap === 0) return false;
        clearTimeout(wachtOpVolgende);
        wachtOpVolgende = null;
        stap -= 1;
        teken();
        return true;
      },
    };
  },
};
