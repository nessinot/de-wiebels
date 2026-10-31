// Resultaat na een ronde: sterren en wat je verder kunt doen. De Wiebel viert linksonder mee; een
// net bevrijde Wiebel springt erbij en bij groei laat hij zijn nieuwe stadium zien. Bij te weinig
// sterren staat de Wiebel die nog gevangen zit er in zijn bel bij. Onder de munten van de ronde
// staat de bonus voor nieuwe sterren, of bij een level dat je al kende dat iets nieuws meer geeft,
// of bij twee sterren dat de derde ster nog munten geeft. Is de bel in de ronde al geknapt, dan
// springt hij hier niet nog een keer. Na een ronde in een level met drie sterren zonder volgend
// level staat de focus op terug.

import { belHtml } from '../bel.js';
import { huisdierStadium, wiebelVoor } from '../beloningen.js';
import { maakEl, opKlik } from '../dom.js';
import { maakGids } from '../gids.js';
import { LEVELS, levelOpen, levelVan } from '../levels.js';
import { staat } from '../opslag.js';
import { thema } from '../themas/index.js';
import { sterrenHtml, vriendjeHtml } from '../weergave.js';
import { STADIUM_NAMEN } from '../wiebel.js';
import { RESULTAAT_ZINNEN } from '../zinnen.js';

const TEKSTEN = ['Goed geoefend!', 'Mooi zo!', 'Heel goed!', 'Fantastisch!'];
// Na elkaar: eerst meevieren, dan de bevrijde Wiebel, dan het groeien.
const STAP = 2200;

export const resultaat = {
  maak({ toon, terug, gegevens }) {
    const p = staat.profiel;
    const t = thema(p.thema);
    const level = levelVan(gegevens.levelId);
    // Nederland heeft geen rij levels, dus ook geen volgend level.
    const lijst = LEVELS[level.vaardigheid] ?? [];
    const volgende = lijst[lijst.indexOf(level) + 1];
    const volgendeOpen = volgende && levelOpen(p, volgende);
    const drieSterren = (p.sterren[level.id] || 0) >= 3;
    const stadium = huisdierStadium(p.huisdier.xp);
    const nieuw = gegevens.nieuweWiebel ? wiebelVoor(gegevens.nieuweWiebel, t) : null;
    const gevangen = gegevens.nogGevangen ? wiebelVoor(gegevens.nogGevangen, t) : null;

    // Hooguit één regel: wie al 3 sterren had, kan geen nieuwe ster halen; anders de bonus voor nieuwe
    // sterren, of bij twee sterren dat de derde nog munten geeft.
    function muntRegel() {
      if (gegevens.alGekend) {
        const tekst = level.vaardigheid === 'nederland' ? 'Hier had je al drie sterren. Iets nieuws geeft meer munten!'
          : 'Hier had je al drie sterren. Een moeilijker level geeft meer munten!';
        return `<p class="ondertitel">${tekst}</p>`;
      }
      if (gegevens.sterBonus) return `<p class="ondertitel">+${gegevens.sterBonus} 🪙 voor je nieuwe ${gegevens.sterBonus > 5 ? 'sterren' : 'ster'}!</p>`;
      if ((p.sterren[level.id] || 0) === 2) return '<p class="ondertitel">Haal drie sterren voor 5 extra munten!</p>';
      return '';
    }

    function beloningen() {
      const delen = [];
      if (nieuw) delen.push(`<span class="beloning"><span class="wiebeltje">${vriendjeHtml(nieuw, 'res-vriend', 'stil')}</span> Je hebt ${nieuw.naam} bevrijd!</span>`);
      if (gevangen) delen.push(`<span class="beloning"><span class="wiebeltje">${belHtml(gevangen, 'res-bel')}</span> Haal twee sterren om ${gevangen.naam} te bevrijden!</span>`);
      if (gegevens.gegroeid) delen.push(`<span class="beloning">Je Wiebel is gegroeid: ${STADIUM_NAMEN[stadium]}!</span>`);
      return delen.join('');
    }

    const el = maakEl(`
      <h1 class="titel-groot">${TEKSTEN[gegevens.sterren]}</h1>
      <div class="resultaat-sterren">${sterrenHtml(gegevens.sterren)}</div>
      <p class="ondertitel">${gegevens.goedEerst} van de ${gegevens.aantal} in één keer goed · +${gegevens.munten} 🪙</p>
      ${muntRegel()}
      <div class="knoppenrij beloningen">${beloningen()}</div>
      <div class="knoppenrij">
        ${volgendeOpen ? '<button class="knop knop-hoofd" data-focus data-actie="volgende">Volgend level →</button>' : ''}
        <button class="knop" data-focus data-actie="opnieuw">Nog een keer</button>
        <button class="knop" ${drieSterren && !volgendeOpen ? 'data-focus="eerst"' : 'data-focus'} data-actie="levels">${level.vaardigheid === 'nederland' ? 'Naar de kaart' : 'Naar de levels'}</button>
      </div>
    `);
    el.classList.add('resultaat');

    // Bij groei begint de Wiebel in zijn vorige stadium.
    const gids = maakGids(p, 'gids-resultaat', { stadium: gegevens.gegroeid ? stadium - 1 : stadium });
    el.append(gids.el);
    const stappen = [() => {
      if (gegevens.sterren) gids.blij();
      gids.zeg(RESULTAAT_ZINNEN[gegevens.sterren]);
    }];
    if (nieuw && !gegevens.belGeknapt) stappen.push(() => gids.vriend(vriendjeHtml(nieuw, 'res-vriend-gids')));
    if (gegevens.gegroeid) stappen.push(() => gids.groei(stadium));
    stappen.forEach((stap, i) => setTimeout(() => el.isConnected && stap(), 400 + i * STAP));

    opKlik(el, {
      volgende: () => toon('ronde', { levelId: volgende.id }, { vervang: true }),
      opnieuw: () => toon('ronde', { levelId: level.id }, { vervang: true }),
      levels: () => terug(),
    });
    return { el };
  },
};
