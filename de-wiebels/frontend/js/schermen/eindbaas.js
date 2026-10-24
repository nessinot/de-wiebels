// Eindbaas van een wereld: een snelle ronde met een levensbalk en milde, instelbare tijdsdruk.

import { geefBeloning, voegXpToe } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { BAAS_BELONING, BAAS_LEVENS, TIJD_PER_VRAAG, baasVraag, nieuwGevecht, verwerk } from '../baas.js';
import { speel } from '../geluid.js';
import { registreer } from '../leitner.js';
import { bewaar, staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';

const PAUZE_GOED = 700;

export const eindbaas = {
  maak({ terug, zetFocus, gegevens }) {
    const p = staat.profiel;
    const v = gegevens.vaardigheid;
    const baas = thema(p.thema).eindbazen[v];
    const gevecht = nieuwGevecht();
    let huidig = null;
    let timer = null;
    const achtergrond = themaAchtergrond(p.thema, v, 'ab-baas');

    const el = maakEl(`
      ${achtergrond}
      <div class="baasscherm">
        <div class="baas">
          <span class="baas-emoji">${baas.emoji}</span>
          <span class="baas-naam">${baas.naam}</span>
          <div class="levensbalk"><div class="levens"></div></div>
          ${p.instellingen.tijdsdruk ? '<div class="tijdbalk"><div></div></div>' : ''}
        </div>
        <div class="baas-vragen"></div>
      </div>
    `);
    const paneel = maakVraagpaneel({ zetFocus, opAntwoord: antwoord });
    el.querySelector('.baas-vragen').append(paneel.el);

    function startTijd() {
      const balk = el.querySelector('.tijdbalk div');
      if (!balk) return;
      balk.style.transition = 'none';
      balk.style.transform = 'scaleX(1)';
      balk.getBoundingClientRect();
      balk.style.transition = `transform ${TIJD_PER_VRAAG}s linear`;
      balk.style.transform = 'scaleX(0)';
      timer = setTimeout(() => antwoord(null, null), TIJD_PER_VRAAG * 1000);
    }

    function volgende() {
      huidig = baasVraag(p, v);
      paneel.toon(huidig.vraag);
      startTijd();
    }

    function gewonnen() {
      p.munten += BAAS_BELONING;
      geefBeloning(p, `baas:${v}`);
      voegXpToe(p, BAAS_LEVENS); // elke treffer was een goed antwoord
      bewaar();
      speel('gewonnen');
      vuurwerk(el, 600, 350);
      vuurwerk(el, 1300, 450);
      el.innerHTML = `
        ${achtergrond}
        <div class="overwinning">
          <span class="baas-emoji verslagen">${baas.emoji}</span>
          <h1 class="titel-groot">Je hebt ${baas.naam} verslagen!</h1>
          <p class="ondertitel">+${BAAS_BELONING} 🪙 en een nieuwe Wiebel voor je verzameling</p>
          <button class="knop knop-hoofd" data-focus data-actie="klaar">Naar de levels</button>
        </div>
      `;
      zetFocus(el.querySelector('[data-actie="klaar"]'));
    }

    function antwoord(sleutel, knop) {
      clearTimeout(timer);
      const goed = sleutel === huidig.vraag.goed;
      if (sleutel !== null) registreer(p.items, huidig.vraag.id, goed, huidig.level.id);
      const { verslagen } = verwerk(gevecht, goed);
      el.querySelector('.levens').style.transform = `scaleX(${gevecht.levens / BAAS_LEVENS})`;
      if (!goed) {
        speel('fout');
        paneel.toonFout(sleutel, knop, volgende);
        return;
      }
      speel('raak');
      const emoji = el.querySelector('.baas-emoji');
      emoji.classList.remove('geraakt');
      emoji.getBoundingClientRect();
      emoji.classList.add('geraakt');
      paneel.toonGoed('Raak!');
      setTimeout(verslagen ? gewonnen : volgende, PAUZE_GOED);
    }

    opKlik(el, { klaar: () => terug() });

    volgende();
    return {
      el,
      bijToets: (toets) => (el.querySelector('.vraagpaneel') ? paneel.bijToets(toets) : false),
    };
  },
};
