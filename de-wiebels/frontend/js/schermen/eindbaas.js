// Eindbaas van een wereld: een snelle ronde met een levensbalk en milde, instelbare tijdsdruk.
// Naast de baas zit de Wiebel die hij gevangen houdt in een bel (als die nog niet bevrijd is); bij
// winst knapt de bel en is hij vrij.

import { belHtml, laatVrij } from '../bel.js';
import { geefBeloning, voegXpToe, wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { BAAS_BELONING, BAAS_LEVENS, TIJD_PER_VRAAG, baasVraag, nieuwGevecht, verwerk } from '../baas.js';
import { speel } from '../geluid.js';
import { maakGids } from '../gids.js';
import { registreer } from '../leitner.js';
import { bewaar, staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { themaAchtergrond } from '../thema-achtergrond.js';
import { maakVraagpaneel } from '../vraagpaneel.js';
import { vuurwerk } from '../vuurwerk.js';

const PAUZE_GOED = 700;
const NA_WINST = 1600; // ms: eerst juichen, dan knapt de bel

export const eindbaas = {
  maak({ terug, zetFocus, gegevens }) {
    const p = staat.profiel;
    const v = gegevens.vaardigheid;
    const baas = thema(p.thema).eindbazen[v];
    const beloning = `baas:${v}`;
    const gevangen = p.verzameling.includes(beloning) ? null : wiebelVoor(beloning, thema(p.thema));
    const bel = (prefix) => (gevangen ? `<div class="baas-bel">${belHtml(gevangen, prefix)}</div>` : '');
    const gevecht = nieuwGevecht();
    let huidig = null;
    let timer = null;

    const el = maakEl(`
      ${themaAchtergrond(p.thema, v, 'ab-baas')}
      <div class="baasscherm">
        <div class="baas">
          <div class="baas-kop"><span class="baas-emoji">${baas.emoji}</span>${bel('baasbel')}</div>
          <span class="baas-naam">${baas.naam}</span>
          <div class="levensbalk"><div class="levens"></div></div>
          ${p.instellingen.tijdsdruk ? '<div class="tijdbalk"><div></div></div>' : ''}
        </div>
        <div class="baas-vragen"></div>
      </div>
    `);
    const paneel = maakVraagpaneel({ zetFocus, opAntwoord: antwoord });
    el.querySelector('.baas-vragen').append(paneel.el);
    const gids = maakGids(p, 'gids-baas');
    el.classList.add('met-gids');
    el.append(gids.el);

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
      geefBeloning(p, beloning);
      voegXpToe(p, BAAS_LEVENS); // elke treffer was een goed antwoord
      bewaar();
      speel('gewonnen');
      // Alleen het gevecht maakt plaats voor de overwinning; de achtergrond en de Wiebel blijven.
      el.querySelector('.baasscherm').remove();
      el.insertAdjacentHTML('beforeend', `
        <div class="overwinning">
          <div class="baas-kop"><span class="baas-emoji verslagen">${baas.emoji}</span>${bel('baasbel-vrij')}</div>
          <h1 class="titel-groot">Je hebt ${baas.naam} verslagen!</h1>
          <p class="ondertitel">+${BAAS_BELONING} 🪙${gevangen ? ` en je hebt ${gevangen.naam} bevrijd!` : ''}</p>
          <button class="knop knop-hoofd" data-focus data-actie="klaar">Naar de levels</button>
        </div>
      `);
      vuurwerk(el, 760, 350);
      vuurwerk(el, 1400, 450);
      gids.blij();
      gids.zeg('baasGewonnen');
      if (gevangen) {
        setTimeout(() => {
          if (!el.isConnected) return;
          laatVrij(el.querySelector('.overwinning .vangbel'));
          gids.zeg('bevrijd');
        }, NA_WINST);
      }
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
        gids.fout();
        return;
      }
      // De Wiebel gooit een ster; bij aankomst schudt de baas.
      const emoji = el.querySelector('.baas-emoji');
      gids.gooiSter(emoji, () => {
        speel('raak');
        emoji.classList.remove('geraakt');
        emoji.getBoundingClientRect();
        emoji.classList.add('geraakt');
      });
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
