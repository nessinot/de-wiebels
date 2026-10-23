// Tweede testscherm: controleert dat Terug één scherm teruggaat.

export const tweedeScherm = {
  maak({ terug }) {
    const el = document.createElement('section');
    el.innerHTML = `
      <h1>Scherm 2</h1>
      <p>Druk op <strong>Terug</strong> op de afstandsbediening om terug te gaan naar de bedieningstest.</p>
      <div class="test-rij">
        <button class="knop" data-focus>Links</button>
        <button class="knop" data-focus>Midden</button>
        <button class="knop" data-focus data-terug>← Terug</button>
      </div>
    `;
    el.querySelector('[data-terug]').addEventListener('click', () => terug('knop'));
    return { el };
  },
};
