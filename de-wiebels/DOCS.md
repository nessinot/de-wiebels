# De Wiebels

Een spel waarmee kinderen rekenen (plus, min, keer, delen), klokkijken en topografie van Nederland oefenen op de tv, volledig te bedienen met de afstandsbediening.

## Openen op de tv

1. Installeer en start de app.
2. Open de browser op de tv.
3. Ga naar `http://<ip-adres-van-home-assistant>:8765`.

Gebruik het IP-adres van Home Assistant, niet een `.local`-adres. Tip: zet de pagina als favoriet in de tv-browser.

## Bediening

- **Pijltjes**: van knop naar knop. Bij wijzers zetten draaien de pijltjes de klok; op de kaart van Nederland ga je met de pijltjes naar een provincie, plaats of gebied.
- **OK**: kiezen.
- **Terug**: een scherm terug.
- **Cijfertoetsen**: antwoord intypen.
- **Magic Remote**: aanwijzen en klikken werkt ook.

## Sterren en munten

Elk level en elke toets geeft 0 tot 3 sterren. Elke nieuwe ster levert 5 munten op. In een level of toets met al 3 sterren krijgt je kind geen munt meer per goed antwoord, alleen nog munten voor een reeks goede antwoorden op rij. Zo loont het om nieuwe levels te proberen.

## Ouderpagina in Home Assistant

Open **De Wiebels** in de zijbalk van Home Assistant. Daar beheer je alles, ook vanaf je telefoon:

- profielen aanmaken: naam, avatar en startniveau;
- per kind de naam en avatar wijzigen, de niveaus per vaardigheid en de tijdsdruk bij eindbazen instellen;
- per kind kiezen welke plaatsen, streken, eilanden en wateren in de wereld Nederland voorkomen (provincies en hoofdsteden staan altijd aan);
- de zwakke plekken per kind bekijken;
- profielen verwijderen;
- het geluid, de stem van de Wiebel en de muziek elk apart aan- of uitzetten (dit geldt voor elk scherm);
- alle data exporteren en importeren als JSON-bestand (handig als back-up).

Op de tv kiest een kind alleen zijn profiel. De eerste keer kiest het daarna zijn Wiebel en zijn wereld, en volgt een kort verhaal. Een nieuw profiel verschijnt binnen een paar seconden op de tv; andere wijzigingen neemt de tv binnen een minuut over. Zijn er nog geen profielen, dan vraagt het spel om er een aan te maken in Home Assistant.

Een pincode of geheime knop op de tv is er niet meer: de ouderpagina is beschermd door de login van Home Assistant. Staat de app niet in de zijbalk, zet dan op de infopagina van de app de optie voor de zijbalk aan.

## Opslag

De voortgang wordt bewaard in de map `/data` van de app op de Home Assistant-server en blijft dus behouden als de cache van de tv-browser wordt gewist. Zonder verbinding met de server speelt het spel gewoon door en wordt de voortgang later gesynchroniseerd. Er zijn geen accounts: de app is bedoeld voor gebruik binnen het thuisnetwerk.

## Poort wijzigen

Is poort 8765 al in gebruik, pas hem dan aan op het tabblad **Netwerk** van de app.
