# De Wiebels

Een spel waarmee kinderen rekenen (plus, min, keer, delen) en klokkijken oefenen op de tv, volledig te bedienen met de afstandsbediening.

## Openen op de tv

1. Installeer en start de app.
2. Open de browser op de tv.
3. Ga naar `http://<ip-adres-van-home-assistant>:8765`.

Gebruik het IP-adres van Home Assistant, niet een `.local`-adres. Tip: zet de pagina als favoriet in de tv-browser.

## Bediening

- **Pijltjes**: van knop naar knop. Bij wijzers zetten draaien de pijltjes de klok.
- **OK**: kiezen.
- **Terug**: een scherm terug.
- **Cijfertoetsen**: antwoord intypen.
- **Magic Remote**: aanwijzen en klikken werkt ook.

## Ouderscherm

Druk op het profielscherm drie keer snel op de **blauwe** knop en voer de pincode in. De standaardpincode is **1234**; wijzig die in het ouderscherm.

In het ouderscherm kun je:

- per kind de niveaus per vaardigheid en de tijdsdruk bij eindbazen instellen;
- de zwakke plekken per kind bekijken;
- profielen verwijderen;
- het geluid aan- of uitzetten;
- alle data exporteren en importeren als JSON-bestand (handig als back-up, vooral op een computer);
- de bedieningstest openen.

## Opslag

De voortgang wordt bewaard in de map `/data` van de app op de Home Assistant-server en blijft dus behouden als de cache van de tv-browser wordt gewist. Zonder verbinding met de server speelt het spel gewoon door en wordt de voortgang later gesynchroniseerd. Er zijn geen accounts: de app is bedoeld voor gebruik binnen het thuisnetwerk.

## Poort wijzigen

Is poort 8765 al in gebruik, pas hem dan aan op het tabblad **Netwerk** van de app.
