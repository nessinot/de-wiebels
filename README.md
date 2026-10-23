# De Wiebels

Een educatief spel voor kinderen om rekenen (plus, min, keer, delen) en klokkijken te oefenen op een smart-tv, bediend met de afstandsbediening.

Het spel draait als app op Home Assistant en wordt geopend in de browser van de tv.

## Wat zit erin

- Profielen per kind met eigen avatar, thema en startniveau.
- Vijf werelden (Plus, Min, Keer, Delen, Klok) met levels, sterren en een eindbaas.
- Klokkijken: wijzerklok lezen, wijzers zetten, digitaal, tijd in woorden en de 24-uursklok.
- Adaptieve herhaling: lastige sommen komen vaker terug, de moeilijkheid past zich aan.
- Munten, combo's, Wiebels verzamelen, een huisdier dat groeit, een winkeltje en een tijdrace tegen je eigen record.
- Vijf thema's: Ruimte, Magisch bos, Dino-eiland, Onderwater en Dierenopvang.
- Ouderscherm met niveaus, tijdsdruk, zwakke plekken, geluid en export/import.
- Voortgang wordt op de Home Assistant-server bewaard.

## Installeren

1. Ga in Home Assistant naar **Instellingen → Apps** en kies voor het installeren van een app.
2. Kies in het menu rechtsboven **Repositories** en voeg toe: `https://github.com/nessinot/de-wiebels`
3. Installeer **De Wiebels** en start de app.
4. Open op de tv `http://<ip-adres-van-home-assistant>:8765`.

Meer uitleg staat in [DOCS.md](de-wiebels/DOCS.md).

## Ontwikkelen

De frontend is vanilla HTML, CSS en JavaScript zonder build-stap; de backend gebruikt alleen de standaardbibliotheek van Python.

```sh
npm test                                   # alle tests (Node en Python)
python de-wiebels/backend/server.py        # lokaal starten op poort 8765 (zet WIEBELS_DATA op een eigen map)
```

## Licentie

MIT, zie [LICENSE](LICENSE).
