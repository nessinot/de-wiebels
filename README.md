# De Wiebels

Een educatief spel voor kinderen om rekenen (plus, min, keer, delen) en klokkijken te oefenen op een smart-tv, bediend met de afstandsbediening.

Het spel draait als app op Home Assistant en wordt geopend in de browser van de tv.

## Wat zit erin

- Profielen per kind met eigen avatar, Wiebel, thema en startniveau.
- Vijf werelden (Plus, Min, Keer, Delen, Klok) met levels, sterren en een eindbaas.
- Klokkijken: wijzerklok lezen, wijzers zetten, digitaal, tijd in woorden en de 24-uursklok.
- Adaptieve herhaling: lastige sommen komen vaker terug, de moeilijkheid past zich aan.
- Een eigen Wiebel die meespeelt, praat en meegroeit, met een winkeltje vol spullen om hem aan te kleden.
- Munten, combo's, Wiebels bevrijden van de eindbazen en een tijdrace tegen je eigen record.
- Rustige thema-achtergronden tijdens de sommen en een zacht muziekje per thema.
- Vijf thema's: Ruimte, Magisch bos, Dino-eiland, Onderwater en Dierenopvang.
- Ouderpagina in de zijbalk van Home Assistant: profielen, niveaus, tijdsdruk, zwakke plekken, geluid, stem, muziek en export/import.
- Voortgang wordt op de Home Assistant-server bewaard.

## Installeren

1. Ga in Home Assistant naar **Instellingen → Apps** en kies voor het installeren van een app.
2. Kies in het menu rechtsboven **Repositories** en voeg toe: `https://github.com/nessinot/de-wiebels`
3. Installeer **De Wiebels** en start de app.
4. Maak profielen aan via **De Wiebels** in de zijbalk van Home Assistant.
5. Open op de tv `http://<ip-adres-van-home-assistant>:8765`.

Meer uitleg staat in [DOCS.md](de-wiebels/DOCS.md).

## Ontwikkelen

De frontend is vanilla HTML, CSS en JavaScript zonder build-stap; de backend gebruikt alleen de standaardbibliotheek van Python.

```sh
npm test                                   # alle tests (Node en Python)
python de-wiebels/backend/server.py        # lokaal starten: spel op poort 8765, ouderpagina op 8099 (zet WIEBELS_DATA op een eigen map)
```

De stem en de muziek zijn vooraf gemaakt met ElevenLabs en staan in `de-wiebels/frontend/geluid/`. Na het wijzigen van zinnen in `zinnen.js` maakt `python tools/maak-stemmen.py` (met `ELEVENLABS_API_KEY` in de omgeving) alleen de nieuwe of gewijzigde opnamen.

## Licentie

MIT, zie [LICENSE](LICENSE).
