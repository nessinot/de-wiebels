# De Wiebels

Een educatief spel voor kinderen om rekenen (plus, min, keer, delen), klokkijken en topografie van Nederland te oefenen op een smart-tv, bediend met de afstandsbediening.

Het spel draait als app op Home Assistant en wordt geopend in de browser van de tv.

## Wat zit erin

- Profielen per kind met eigen avatar, Wiebel, thema en startniveau.
- Vijf werelden (Plus, Min, Keer, Delen, Klok) met levels, sterren en een eindbaas.
- Een zesde wereld Nederland: provincies, hoofdsteden en de grote plaatsen, streken, eilanden en wateren op een echte kaart, met oefenen en een toets, 13 eigen Wiebels en een kaart die inkleurt.
- Klokkijken: wijzerklok lezen, wijzers zetten, digitaal, tijd in woorden en de 24-uursklok.
- Adaptieve herhaling: lastige sommen komen vaker terug, de moeilijkheid past zich aan.
- Een eigen Wiebel die meespeelt, praat en meegroeit, met een winkeltje vol spullen om hem aan te kleden.
- Munten, combo's, Wiebels bevrijden van de eindbazen en een tijdrace tegen je eigen record.
- 47 Wiebels per thema, elk met een eigen naam en kaartje: waar hij woont, wat hij lekker vindt en een geheimpje, ingesproken door de stem. Nieuw bevrijde Wiebels krijgen een sterretje en je kunt ze een feestje geven.
- Rustige thema-achtergronden tijdens de sommen en een zacht muziekje per thema.
- Vijf thema's: Ruimte, Magisch bos, Dino-eiland, Onderwater en Dierenopvang.
- Ouderpagina in de zijbalk van Home Assistant: profielen, niveaus, tijdsdruk, wat er in de wereld Nederland voorkomt, zwakke plekken, geluid, stem, muziek en export/import.
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

De emoji komen uit een eigen kleurenlettertype in `de-wiebels/frontend/fonts/`, een uitsnede van Noto Color Emoji (OFL). Na het toevoegen van nieuwe emoji maakt `python tools/maak-emojifont.py <Noto-COLRv1.ttf> <LICENSE>` (met fonttools, brotli en regex) het lettertype opnieuw; de test `tests/emojifont.test.js` meldt ontbrekende emoji.

De kaart van Nederland en de lijst van plaatsen, streken, eilanden en water in `de-wiebels/frontend/js/nederland/` maakt `python tools/maak-kaart.py <downloadmap>` uit open data; de downloads komen in `<downloadmap>`, buiten de repo.

## Bronnen

- Kaart: CBS/PDOK (Gebiedsindelingen 2023), CC BY 4.0.
- Plaatsen: woonplaatsen uit de BAG (Kadaster/PDOK), CC0; inwoners per buurt uit Wijken en buurten 2023 (CBS/PDOK), CC0; bevolkingskernen 2021 (CBS/PDOK), CC BY 4.0.
- Water: KRW-oppervlaktewaterlichamen (Informatiehuis Water/PDOK), publiek domein.

## Licentie

MIT, zie [LICENSE](LICENSE).
