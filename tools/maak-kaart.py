"""Maakt de kaart van Nederland en de lijst van plaatsen, streken, eilanden en water.

Gebruik (vanuit de root van de repo):
    python tools/maak-kaart.py <downloadmap>

De open data wordt in <downloadmap> bewaard (buiten de repo) en alleen opgehaald als die er nog
niet staat. Het script schrijft de-wiebels/frontend/js/nederland/kaart.js en items.js, en drukt een
overzicht af: alle items met hun samenstelling en een voorstel voor de burentabel van de provincies.

Bronnen (zie ook de README):
- CBS/PDOK Gebiedsindelingen 2023: provincies, gemeenten, COROP-gebieden, buurtpunten (CC BY 4.0).
- CBS/PDOK Bevolkingskernen 2021: de bebouwde kernen (CC BY 4.0).
- CBS/PDOK Wijken en buurten 2023: inwoners per buurt (CC0).
- Kadaster/PDOK BAG: woonplaatsen (CC0).
- IHW/PDOK KRW-oppervlaktewaterlichamen: meren, kust- en overgangswater (publiek domein).

Werkwijze:
- Kaart: de grenzen van alle gemeenten worden in stukken geknipt waar de buurgemeente verandert.
  Elk stuk wordt één keer vereenvoudigd (Douglas-Peucker), zodat buren precies dezelfde grens
  houden. Provincies, streken en eilanden zijn groepen gemeenten; hun rand bestaat uit dezelfde
  stukken. Een los stuk van een gemeente kan een eigen vlak worden (LOSSE_STUKKEN). Water krijgt
  op dezelfde manier een eigen netwerk van grenzen.
- Coördinaten: RD (EPSG:28992), 1 eenheid = 50 m, x naar rechts en y naar beneden; paden met
  relatieve commando's.
- Plaatsen: een plaats is een BAG-woonplaats. Het inwonertal telt alleen de buurten waarvan het
  CBS-buurtpunt binnen (of tot 200 m van) een CBS-bevolkingskern ligt: de bebouwde plaats, niet het
  buitengebied of de gemeente. Zo worden aan elkaar gegroeide kernen (Den Haag en Rijswijk) weer
  aparte plaatsen. De stip is het zwaartepunt van die buurten, gewogen naar inwoners.

Alleen de standaardbibliotheek.
"""

import json
import math
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOEL = ROOT / "de-wiebels" / "frontend" / "js" / "nederland"

EENHEID = 50  # meter per eenheid op de kaart
TOLERANTIE = 120  # meter, voor Douglas-Peucker
MIN_OPPERVLAK = 300_000  # m²; kleinere eilandjes en meertjes vallen weg
MARGE = 2_000  # meter rond het land
GRENS_INWONERS = 20_000
KERN_AFSTAND = 200  # meter: een buurtpunt zo dicht bij een kern telt mee

PDOK = "https://service.pdok.nl"
GEBIEDSINDELINGEN = PDOK + "/cbs/gebiedsindelingen/2023/wfs/v1_0"
WFS = {
    "provincie": (GEBIEDSINDELINGEN, "gebiedsindelingen:provincie_gegeneraliseerd", None),
    "gemeente": (GEBIEDSINDELINGEN, "gebiedsindelingen:gemeente_gegeneraliseerd", None),
    "gemeentepunt": (GEBIEDSINDELINGEN, "gebiedsindelingen:gemeente_labelpoint", None),
    "corop": (GEBIEDSINDELINGEN, "gebiedsindelingen:coropgebied_gegeneraliseerd", None),
    "buurtpunt": (GEBIEDSINDELINGEN, "gebiedsindelingen:buurt_labelpoint", None),
    "buurtcijfer": (PDOK + "/cbs/wijkenbuurten/2023/wfs/v1_0", "wijkenbuurten:buurten",
                    "buurtcode,aantalInwoners"),
    "kern": (PDOK + "/cbs/bevolkingskernen/2021/wfs/v1_0", "bevolkingskernen:bevolkingskernen",
             "kernnummer,naam2021,geom"),
    "woonplaats": (PDOK + "/lv/bag/wfs/v2_0", "bag:woonplaats", "identificatie,woonplaats,geom"),
}
KRW = PDOK + "/ihw/krw-oppervlaktewaterlichamen-geharmoniseerd/atom/downloads/INSPIRESurfaceWaterBody.gml"

# --- Inhoud ---------------------------------------------------------------------------------------

# CBS-naam: (id, naam, hoofdstad)
PROVINCIES = {
    "Groningen": ("pv-groningen", "Groningen", "Groningen"),
    "Fryslân": ("pv-friesland", "Friesland", "Leeuwarden"),
    "Drenthe": ("pv-drenthe", "Drenthe", "Assen"),
    "Overijssel": ("pv-overijssel", "Overijssel", "Zwolle"),
    "Flevoland": ("pv-flevoland", "Flevoland", "Lelystad"),
    "Gelderland": ("pv-gelderland", "Gelderland", "Arnhem"),
    "Utrecht": ("pv-utrecht", "Utrecht", "Utrecht"),
    "Noord-Holland": ("pv-noord-holland", "Noord-Holland", "Haarlem"),
    "Zuid-Holland": ("pv-zuid-holland", "Zuid-Holland", "Den Haag"),
    "Zeeland": ("pv-zeeland", "Zeeland", "Middelburg"),
    "Noord-Brabant": ("pv-noord-brabant", "Noord-Brabant", "'s-Hertogenbosch"),
    "Limburg": ("pv-limburg", "Limburg", "Maastricht"),
}

# Streken en eilanden: (id, naam, noem, soort, gemeenten of ("corop", naam))
GEBIEDEN = [
    ("st-hogeland", "Hogeland", "het Hogeland", "streek", ["Het Hogeland"]),
    ("st-westerkwartier", "Westerkwartier", "het Westerkwartier", "streek", ["Westerkwartier"]),
    ("st-oldambt", "Oldambt", "het Oldambt", "streek", ["Oldambt"]),
    ("st-westerwolde", "Westerwolde", "Westerwolde", "streek", ["Westerwolde"]),
    ("ei-vlieland", "Vlieland", "Vlieland", "eiland", ["Vlieland"]),
    ("ei-terschelling", "Terschelling", "Terschelling", "eiland", ["Terschelling"]),
    ("ei-ameland", "Ameland", "Ameland", "eiland", ["Ameland"]),
    ("ei-schiermonnikoog", "Schiermonnikoog", "Schiermonnikoog", "eiland", ["Schiermonnikoog"]),
    ("st-twente", "Twente", "Twente", "streek", ("corop", "Twente")),
    ("st-salland", "Salland", "Salland", "streek", ("corop", "Zuidwest-Overijssel")),
    ("st-noordoostpolder", "Noordoostpolder", "de Noordoostpolder", "streek", ["Noordoostpolder", "Urk"]),
    ("ei-flevopolder", "Flevopolder", "de Flevopolder", "eiland", ["Almere", "Dronten", "Lelystad", "Zeewolde"]),
    ("st-veluwe", "Veluwe", "de Veluwe", "streek", ("corop", "Veluwe")),
    ("st-achterhoek", "Achterhoek", "de Achterhoek", "streek", ("corop", "Achterhoek")),
    ("st-betuwe", "Betuwe", "de Betuwe", "streek",
     ["Lingewaard", "Overbetuwe", "Neder-Betuwe", "Buren", "Tiel", "Culemborg", "West Betuwe"]),
    ("st-bommelerwaard", "Bommelerwaard", "de Bommelerwaard", "streek", ["Maasdriel", "Zaltbommel"]),
    ("st-maas-en-waal", "Land van Maas en Waal", "het Land van Maas en Waal", "streek",
     ["West Maas en Waal", "Druten", "Beuningen", "Wijchen"]),
    ("st-vijfheerenlanden", "Vijfheerenlanden", "de Vijfheerenlanden", "streek", ["Vijfheerenlanden"]),
    ("ei-texel", "Texel", "Texel", "eiland", ["Texel"]),
    ("st-kop-van-noord-holland", "Kop van Noord-Holland", "de Kop van Noord-Holland", "streek",
     ["Den Helder", "Hollands Kroon", "Schagen"]),
    ("st-west-friesland", "West-Friesland", "West-Friesland", "streek",
     ["Drechterland", "Enkhuizen", "Hoorn", "Koggenland", "Medemblik", "Opmeer", "Stede Broec"]),
    ("st-zaanstreek", "Zaanstreek", "de Zaanstreek", "streek", ("corop", "Zaanstreek")),
    ("st-kennemerland", "Kennemerland", "Kennemerland", "streek",
     ["Beverwijk", "Bloemendaal", "Castricum", "Haarlem", "Heemskerk", "Heemstede", "Heiloo", "Velsen", "Zandvoort"]),
    ("st-haarlemmermeer", "Haarlemmermeer", "de Haarlemmermeer", "streek", ["Haarlemmermeer"]),
    ("st-gooi", "Het Gooi", "het Gooi", "streek", ["Blaricum", "Gooise Meren", "Hilversum", "Huizen", "Laren"]),
    ("st-westland", "Westland", "het Westland", "streek", ["Westland"]),
    ("st-bollenstreek", "Bollenstreek", "de Bollenstreek", "streek", ["Hillegom", "Katwijk", "Lisse", "Noordwijk", "Teylingen"]),
    ("st-alblasserwaard", "Alblasserwaard", "de Alblasserwaard", "streek",
     ["Alblasserdam", "Gorinchem", "Hardinxveld-Giessendam", "Molenlanden", "Papendrecht", "Sliedrecht"]),
    ("st-krimpenerwaard", "Krimpenerwaard", "de Krimpenerwaard", "streek", ["Krimpenerwaard"]),
    ("ei-goeree-overflakkee", "Goeree-Overflakkee", "Goeree-Overflakkee", "eiland", ["Goeree-Overflakkee"]),
    ("ei-voorne-putten", "Voorne-Putten", "Voorne-Putten", "eiland", ["Voorne aan Zee", "Nissewaard"]),
    ("ei-hoeksche-waard", "Hoeksche Waard", "de Hoeksche Waard", "eiland", ["Hoeksche Waard"]),
    ("ei-dordrecht", "Eiland van Dordrecht", "het Eiland van Dordrecht", "eiland", ["Dordrecht"]),
    ("ei-walcheren", "Walcheren", "Walcheren", "eiland", ["Middelburg", "Vlissingen", "Veere"]),
    ("ei-noord-beveland", "Noord-Beveland", "Noord-Beveland", "eiland", ["Noord-Beveland"]),
    ("ei-zuid-beveland", "Zuid-Beveland", "Zuid-Beveland", "eiland", ["Borsele", "Goes", "Kapelle", "Reimerswaal"]),
    ("ei-schouwen-duiveland", "Schouwen-Duiveland", "Schouwen-Duiveland", "eiland", ["Schouwen-Duiveland"]),
    ("ei-tholen", "Tholen", "Tholen", "eiland", ["Tholen"]),
    ("ei-neeltje-jans", "Neeltje Jans", "Neeltje Jans", "eiland", ["Neeltje Jans"]),
    ("st-zeeuws-vlaanderen", "Zeeuws-Vlaanderen", "Zeeuws-Vlaanderen", "streek", ("corop", "Zeeuwsch-Vlaanderen")),
    ("st-kempen", "Kempen", "de Kempen", "streek", ["Bergeijk", "Bladel", "Eersel", "Oirschot", "Reusel-De Mierden"]),
    ("st-land-van-cuijk", "Land van Cuijk", "het Land van Cuijk", "streek", ["Land van Cuijk"]),
    ("st-zuid-limburg", "Zuid-Limburg", "Zuid-Limburg", "streek", ("corop", "Zuid-Limburg")),
]

# Water: (id, naam, noem, KRW-codes)
WATER = [
    ("wa-noordzee", "Noordzee", "de Noordzee",
     ["NL95_1A", "NL95_2A", "NL95_3A", "NL95_4A", "NL95_EEMS_TEW", "NL95_MAAS_TEW", "NL95_RIJN_TEW", "NL95_SCHELDE_TEW"]),
    ("wa-waddenzee", "Waddenzee", "de Waddenzee", ["NL81_1", "NL81_10"]),
    ("wa-eems-dollard", "Eems-Dollard", "de Eems-Dollard", ["NL81_2"]),
    ("wa-ijsselmeer", "IJsselmeer", "het IJsselmeer", ["NL92_IJSSELMEER"]),
    ("wa-markermeer", "Markermeer", "het Markermeer", ["NL92_MARKERMEER"]),
    ("wa-ketelmeer", "Ketelmeer", "het Ketelmeer", ["NL92_KETELMEER_VOSSEMEER"]),
    ("wa-zwarte-meer", "Zwarte Meer", "het Zwarte Meer", ["NL92_ZWARTEMEER"]),
    ("wa-randmeren", "Randmeren", "de Randmeren", ["NL92_RANDMEREN_OOST", "NL92_RANDMEREN_ZUID"]),
    ("wa-lauwersmeer", "Lauwersmeer", "het Lauwersmeer", ["NL34M108"]),
    ("wa-zuidlaardermeer", "Zuidlaardermeer", "het Zuidlaardermeer", ["NL33ZM"]),
    ("wa-paterswoldsemeer", "Paterswoldsemeer", "het Paterswoldsemeer", ["NL34M114"]),
    ("wa-schildmeer", "Schildmeer", "het Schildmeer", ["NL33SM"]),
    ("wa-oldambtmeer", "Oldambtmeer", "het Oldambtmeer", ["NL33OM"]),
    ("wa-alkmaardermeer", "Alkmaardermeer", "het Alkmaardermeer", ["NL12_201"]),
    ("wa-loosdrechtse-plassen", "Loosdrechtse Plassen", "de Loosdrechtse Plassen", ["NL11_5_5"]),
    ("wa-vinkeveense-plassen", "Vinkeveense Plassen", "de Vinkeveense Plassen", ["NL11_3_4"]),
    ("wa-westeinderplassen", "Westeinderplassen", "de Westeinderplassen", ["NL13_07"]),
    ("wa-kagerplassen", "Kagerplassen", "de Kagerplassen", ["NL13_06_2"]),
    ("wa-nieuwkoopse-plassen", "Nieuwkoopse Plassen", "de Nieuwkoopse Plassen", ["NL13_20"]),
    ("wa-reeuwijkse-plassen", "Reeuwijkse Plassen", "de Reeuwijkse Plassen", ["NL13_11"]),
    ("wa-brielse-meer", "Brielse Meer", "het Brielse Meer", ["NL40_17_3"]),
    ("wa-haringvliet", "Haringvliet", "het Haringvliet", ["NL94_11"]),
    ("wa-grevelingenmeer", "Grevelingenmeer", "het Grevelingenmeer", ["NL89_GREVLEMR"]),
    ("wa-volkerak", "Volkerak", "het Volkerak", ["NL89_VOLKERAK"]),
    ("wa-zoommeer", "Zoommeer", "het Zoommeer", ["NL89_ZOOMMEDT"]),
    ("wa-oosterschelde", "Oosterschelde", "de Oosterschelde", ["NL89_OOSTSDE_OWL"]),
    ("wa-veerse-meer", "Veerse Meer", "het Veerse Meer", ["NL89_VEERSMR"]),
    ("wa-westerschelde", "Westerschelde", "de Westerschelde", ["NL89_WESTSDE_OWL"]),
]

# Namen die "liggen" krijgen in plaats van "ligt".
MEERVOUD = {"st-vijfheerenlanden", "st-kempen", "wa-randmeren", "wa-loosdrechtse-plassen", "wa-vinkeveense-plassen",
            "wa-westeinderplassen", "wa-kagerplassen", "wa-nieuwkoopse-plassen", "wa-reeuwijkse-plassen"}

# Plaatsen die er altijd bij horen, ook onder de grens.
EXTRA_PLAATSEN = ["Urk", "Breskens", "Domburg", "Hulst", "Sluis", "Veere", "Yerseke", "Zierikzee"]
# Losse stukken van een gemeente die een eigen vlak worden: naam: (gemeente, RD-punt in het stuk).
LOSSE_STUKKEN = {"Neeltje Jans": ("Veere", (38_200, 406_000))}
# Woonplaatsen die een wijk zijn van een stad in dezelfde gemeente: hun inwoners tellen bij die stad.
SAMENVOEGEN = {"Hoogvliet Rotterdam": "Rotterdam", "Vleuten": "Utrecht", "De Meern": "Utrecht", "Zwaag": "Hoorn"}
# Naam in het spel als die anders is dan de BAG-naam.
NAMEN = {"'s-Gravenhage": "Den Haag", "Beuningen Gld": "Beuningen", "Haren Gn": "Haren"}


# --- Downloaden -----------------------------------------------------------------------------------

def haal_wfs(map_, naam):
    """Alle objecten van een WFS-laag, per 1000 opgehaald en als één bestand bewaard."""
    pad = map_ / f"{naam}.json"
    if not pad.exists():
        url, laag, velden = WFS[naam]
        objecten, start = [], 0
        while True:
            vraag = {"service": "WFS", "version": "2.0.0", "request": "GetFeature", "typeNames": laag,
                     "outputFormat": "application/json", "count": 1000, "startIndex": start}
            if velden:
                vraag["propertyName"] = velden
            with urllib.request.urlopen(url + "?" + urllib.parse.urlencode(vraag), timeout=600) as antwoord:
                deel = json.load(antwoord)["features"]
            if naam == "buurtcijfer":
                deel = [{"properties": f["properties"]} for f in deel]  # de vlakken zijn niet nodig
            objecten += deel
            print(f"  {naam}: {len(objecten)}", file=sys.stderr)
            if len(deel) < 1000:
                break
            start += 1000
        pad.write_text(json.dumps({"features": objecten}), "utf-8")
    return json.loads(pad.read_text("utf-8"))["features"]


def haal_krw(map_):
    pad = map_ / "krw.gml"
    if not pad.exists():
        with urllib.request.urlopen(KRW, timeout=1800) as antwoord:
            pad.write_bytes(antwoord.read())
    return pad


# --- Geometrie ------------------------------------------------------------------------------------

_RX = {(0, 1): 190094.945, (1, 1): -11832.228, (2, 1): -114.221, (0, 3): -32.391, (1, 0): -0.705,
       (3, 1): -2.340, (1, 3): -0.608, (0, 2): -0.008, (2, 3): 0.148}
_RY = {(1, 0): 309056.544, (0, 2): 3638.893, (2, 0): 73.077, (1, 2): -157.984, (3, 0): 59.788,
       (0, 1): 0.433, (2, 2): -6.439, (1, 1): -0.032, (0, 4): 0.092, (1, 4): -0.054}


def rd_uit_etrs(lat, lon):
    """ETRS89/WGS84 naar RD met de benaderingsformule van Schreutelkamp en Strang van Hees (±1 m)."""
    df, dl = 0.36 * (lat - 52.15517440), 0.36 * (lon - 5.38720621)
    x = 155000 + sum(c * df ** p * dl ** q for (p, q), c in _RX.items())
    y = 463000 + sum(c * df ** p * dl ** q for (p, q), c in _RY.items())
    return x, y


def oppervlak(ring):
    """Getekende oppervlakte (positief = tegen de klok in, bij y omhoog)."""
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1])) / 2


def zwaartepunt(ringen):
    """Zwaartepunt van een vlak met eilanden en gaten (gaten draaien andersom)."""
    a = sx = sy = 0
    for r in ringen:
        for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
            k = x1 * y2 - x2 * y1
            a += k
            sx += (x1 + x2) * k
            sy += (y1 + y2) * k
    return (sx / (3 * a), sy / (3 * a)) if a else ringen[0][0]


def in_ring(x, y, ring):
    binnen = False
    j = len(ring) - 1
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[j]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            binnen = not binnen
        j = i
    return binnen


def in_ringen(x, y, ringen):
    """Even-oneven-regel: een punt ligt binnen als het een oneven aantal ringen omsluit."""
    return sum(in_ring(x, y, r) for r in ringen) % 2 == 1


def douglas_peucker(punten, tol):
    """Vereenvoudigt een lijn; begin- en eindpunt blijven staan."""
    if len(punten) < 3:
        return list(punten)
    houd = [False] * len(punten)
    houd[0] = houd[-1] = True
    stapel = [(0, len(punten) - 1)]
    while stapel:
        a, b = stapel.pop()
        (xa, ya), (xb, yb) = punten[a], punten[b]
        dx, dy = xb - xa, yb - ya
        lengte = math.hypot(dx, dy)
        beste, verst = 0, -1
        for i in range(a + 1, b):
            x, y = punten[i]
            d = abs(dy * (x - xa) - dx * (y - ya)) / lengte if lengte else math.hypot(x - xa, y - ya)
            if d > verst:
                verst, beste = d, i
        if verst > tol:
            houd[beste] = True
            stapel += [(a, beste), (beste, b)]
    return [p for p, h in zip(punten, houd) if h]


def vereenvoudig(boog, tol):
    """Een open boog met Douglas-Peucker; een gesloten boog wordt eerst bij het verste punt geknipt."""
    if boog[0] != boog[-1]:
        return douglas_peucker(boog, tol)
    x0, y0 = boog[0]
    verst = max(range(len(boog)), key=lambda i: math.hypot(boog[i][0] - x0, boog[i][1] - y0))
    return douglas_peucker(boog[:verst + 1], tol) + douglas_peucker(boog[verst:], tol)[1:]


def richt(ringen):
    """Buitenring tegen de klok in, gaten met de klok mee, zodat buren een grens andersom doorlopen."""
    uit = []
    for i, r in enumerate(ringen):
        if (oppervlak(r) > 0) != (i == 0):
            r = r[::-1]
        uit.append(r)
    return uit


def topologie(vlakken):
    """Knipt de ringen van alle vlakken in bogen tussen knooppunten (punten met meer dan twee buren).

    vlakken: {id: [ring, ...]}, ringen als lijsten van (x, y) zonder herhaald eindpunt.
    Geeft (bogen, verwijzingen): bogen is een lijst van puntlijsten, verwijzingen is
    {id: [[(boog, richting), ...] per ring]} met richting 1 (zoals de boog) of -1 (andersom)."""
    buren = defaultdict(set)
    for ringen in vlakken.values():
        for r in ringen:
            for i, p in enumerate(r):
                q = r[(i + 1) % len(r)]
                buren[p].add(q)
                buren[q].add(p)
    knoop = {p for p, s in buren.items() if len(s) != 2}
    bogen, index, verwijzingen = [], {}, {}
    for vid, ringen in vlakken.items():
        verwijzingen[vid] = []
        for r in ringen:
            begin = next((i for i, p in enumerate(r) if p in knoop), None)
            if begin is None:
                k = min(range(len(r)), key=lambda i: r[i])
                stukken = [r[k:] + r[:k] + [r[k]]]
            else:
                rond = r[begin:] + r[:begin] + [r[begin]]
                stukken, huidig = [], [rond[0]]
                for p in rond[1:]:
                    huidig.append(p)
                    if p in knoop:
                        stukken.append(huidig)
                        huidig = [p]
            ring_ref = []
            for stuk in stukken:
                heen, terug = tuple(stuk), tuple(reversed(stuk))
                if heen in index:
                    ring_ref.append((index[heen], 1))
                elif terug in index:
                    ring_ref.append((index[terug], -1))
                else:
                    index[heen] = len(bogen)
                    bogen.append(stuk)
                    ring_ref.append((index[heen], 1))
            verwijzingen[vid].append(ring_ref)
    return bogen, verwijzingen


def rand(verwijzingen, leden, bogen, eindpunten=None):
    """De buitenrand van een groep vlakken als ringen. Bogen tussen twee leden vallen weg.

    eindpunten: per boog (begin, eind) om de bogen aan elkaar te knopen; standaard de eerste en
    laatste punten. Na het afronden kunnen twee knooppunten samenvallen, daarom geeft netwerk() de
    originele eindpunten mee."""
    eindpunten = eindpunten or [(b[0], b[-1]) for b in bogen]
    refs = [ref for lid in leden for ring in verwijzingen[lid] for ref in ring]
    telling = Counter(b for b, _ in refs)
    over = [(b, d) for b, d in refs if telling[b] == 1]

    def begin(i):
        b, d = over[i]
        return eindpunten[b][0 if d == 1 else 1]

    def eind(i):
        b, d = over[i]
        return eindpunten[b][1 if d == 1 else 0]

    def punten(i):
        b, d = over[i]
        return bogen[b] if d == 1 else bogen[b][::-1]

    per_begin = defaultdict(list)
    for i in range(len(over)):
        per_begin[begin(i)].append(i)
    vrij = set(range(len(over)))
    ringen = []
    for i in range(len(over)):
        if i not in vrij:
            continue
        vrij.remove(i)
        ring, start, e = list(punten(i)), begin(i), eind(i)
        while e != start:
            j = next(j for j in per_begin[e] if j in vrij)
            vrij.remove(j)
            ring += punten(j)[1:]
            e = eind(j)
        ringen.append(ring[:-1])
    return ringen


def pad(ringen):
    """SVG-pad: per ring een absoluut beginpunt en daarna relatieve stappen."""
    def getallen(lijst):
        return "".join(("" if i == 0 or v < 0 else " ") + str(v) for i, v in enumerate(lijst))
    delen = []
    for r in ringen:
        stappen = []
        for (x1, y1), (x2, y2) in zip(r, r[1:]):
            stappen += [x2 - x1, y2 - y1]
        delen.append(f"M{getallen(list(r[0]))}l{getallen(stappen)}z")
    return "".join(delen)


def zonder_dubbel(punten):
    uit = punten[:1]
    for p in punten[1:]:
        if p != uit[-1]:
            uit.append(p)
    return uit


class Kaart:
    """Zet RD-coördinaten om naar kaarteenheden (y naar beneden) binnen een vast kader."""

    def __init__(self, xmin, ymin, xmax, ymax):
        self.x0 = math.floor((xmin - MARGE) / EENHEID) * EENHEID
        self.y1 = math.ceil((ymax + MARGE) / EENHEID) * EENHEID
        self.breedte = math.ceil((xmax + MARGE - self.x0) / EENHEID)
        self.hoogte = math.ceil((self.y1 - (ymin - MARGE)) / EENHEID)

    def punt(self, x, y):
        return round((x - self.x0) / EENHEID), round((self.y1 - y) / EENHEID)


def netwerk(vlakken, kaart):
    """Topologie, vereenvoudiging en omzetting; geeft een functie die de rand van een groep geeft."""
    bogen, verwijzingen = topologie({k: [r for poly in v for r in richt(poly)] for k, v in vlakken.items()})
    klein = [zonder_dubbel([kaart.punt(*p) for p in vereenvoudig(b, TOLERANTIE)]) for b in bogen]
    eindpunten = [(b[0], b[-1]) for b in bogen]

    def groep(leden):
        uit = []
        for r in rand(verwijzingen, leden, klein, eindpunten):
            r = zonder_dubbel(r)
            if len(r) > 1 and r[0] == r[-1]:
                r = r[:-1]
            if len(r) >= 3 and abs(oppervlak(r)) * EENHEID ** 2 >= MIN_OPPERVLAK:
                uit.append(r)
        return uit
    return groep


# --- Hulpjes ----------------------------------------------------------------------------------

def vlakken_van(geometrie):
    """GeoJSON-(multi)polygoon als lijst van polygonen, elk een lijst ringen zonder herhaald eindpunt."""
    polys = geometrie["coordinates"] if geometrie["type"] == "MultiPolygon" else [geometrie["coordinates"]]
    uit = []
    for poly in polys:
        ringen = [zonder_dubbel([(p[0], p[1]) for p in ring]) for ring in poly]
        uit.append([r[:-1] if r[0] == r[-1] else r for r in ringen])
    return uit


def in_vlakken(x, y, polys):
    return any(in_ring(x, y, p[0]) and not any(in_ring(x, y, h) for h in p[1:]) for p in polys)


def afstand_tot(x, y, polys):
    """Kortste afstand van een punt tot de randen van de vlakken."""
    beste = math.inf
    for poly in polys:
        for r in poly:
            for (x1, y1), (x2, y2) in zip(r, r[1:] + r[:1]):
                dx, dy = x2 - x1, y2 - y1
                t = 0 if dx == dy == 0 else max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
                beste = min(beste, math.hypot(x - x1 - t * dx, y - y1 - t * dy))
    return beste


def splits_af(gemeenten, punt, stukken):
    """Maakt van het losse stuk van een gemeente waarin een vast punt ligt een eigen vlak, met dat punt."""
    for naam, (gemeente, (x, y)) in stukken.items():
        (stuk,) = [p for p in gemeenten[gemeente] if in_vlakken(x, y, [p])]
        gemeenten[gemeente] = [p for p in gemeenten[gemeente] if p is not stuk]
        assert in_vlakken(*punt[gemeente], gemeenten[gemeente]), naam
        gemeenten[naam] = [stuk]
        punt[naam] = (x, y)


def kader(polys):
    xs = [p[0] for poly in polys for p in poly[0]]
    ys = [p[1] for poly in polys for p in poly[0]]
    return min(xs), min(ys), max(xs), max(ys)


def slug(tekst):
    tekst = unicodedata.normalize("NFKD", tekst).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", tekst.replace("'s-", "s-")).strip("-")


def lees_krw(pad_gml, codes):
    """De vlakken van de gevraagde KRW-waterlichamen, omgezet naar RD."""
    gml = "{http://www.opengis.net/gml/3.2}"
    am = "{http://inspire.ec.europa.eu/schemas/am/4.0}"
    base = "{http://inspire.ec.europa.eu/schemas/base/3.3}"
    uit = {}
    for _, el in ET.iterparse(pad_gml):
        if el.tag != am + "ManagementRestrictionOrRegulationZone":
            continue
        code = el.find(f"{am}inspireId/{base}Identifier/{base}localId").text
        if code in codes:
            polys = []
            for vlak in [*el.iter(gml + "Polygon"), *el.iter(gml + "PolygonPatch")]:
                ringen = []
                for deel in ("exterior", "interior"):
                    for pl in vlak.findall(f"{gml}{deel}/{gml}LinearRing/{gml}posList"):
                        getallen = [float(g) for g in pl.text.split()]
                        ring = zonder_dubbel([rd_uit_etrs(getallen[i], getallen[i + 1])
                                              for i in range(0, len(getallen), 2)])
                        ringen.append(ring[:-1] if ring[0] == ring[-1] else ring)
                polys.append(ringen)
            uit[code] = polys
        el.clear()
    return uit


def raakt(ringen_a, ringen_b, afstand):
    """Hoeveel punten van a binnen de afstand (kaarteenheden) van een punt van b liggen."""
    rooster = defaultdict(list)
    for r in ringen_b:
        for x, y in r:
            rooster[(x // afstand, y // afstand)].append((x, y))
    n = 0
    for r in ringen_a:
        for x, y in r:
            cx, cy = x // afstand, y // afstand
            if any(math.hypot(x - u, y - v) <= afstand
                   for i in (-1, 0, 1) for j in (-1, 0, 1) for u, v in rooster.get((cx + i, cy + j), ())):
                n += 1
    return n


def burenvoorstel(middens):
    """Per pijl de provincie die het best in die richting ligt (kegel van 70°, afstand × (1 + hoek/45))."""
    richtingen = {"links": (-1, 0), "rechts": (1, 0), "boven": (0, -1), "onder": (0, 1)}
    voorstel = {}
    for a, (ax, ay) in middens.items():
        rij = {}
        for r, (rx, ry) in richtingen.items():
            beste = None
            for b, (bx, by) in middens.items():
                if b == a:
                    continue
                dx, dy = bx - ax, by - ay
                afst = math.hypot(dx, dy)
                hoek = math.degrees(math.acos(max(-1, min(1, (dx * rx + dy * ry) / afst))))
                if hoek <= 70:
                    score = afst * (1 + hoek / 45)
                    if beste is None or score < beste[0]:
                        beste = (score, b)
            rij[r] = beste[1] if beste else None
        voorstel[a] = rij
    return voorstel


# --- Uitvoer ----------------------------------------------------------------------------------

def js_tekst(tekst):
    return '"' + tekst + '"' if "'" in tekst else "'" + tekst + "'"


def zin(zin_id, tekst):
    return f"{{ id: '{zin_id}', tekst: {js_tekst(tekst)} }}"


def zinnen_van(item):
    i, noem = item["id"], item["noem"]
    z = {"waar": zin(f"nl-waar-{i}", f"Waar ligt {noem}?"), "dat": zin(f"nl-dat-{i}", f"Het goede antwoord is {noem}.")}
    z["hier"] = zin(f"nl-hier-{i}", f"{noem[:1].upper() + noem[1:]} {'liggen' if i in MEERVOUD else 'ligt'} hier.")
    if item["soort"] == "provincie":
        z["hoofdstad"] = zin(f"nl-hoofdstad-{i}", f"Wat is de hoofdstad van {noem}?")
        z["hoofdstadWaar"] = zin(f"nl-hoofdstad-waar-{i}", f"Waar ligt de hoofdstad van {noem}?")
    if item.get("hoofdstadVan"):
        z["hoofdstadVan"] = zin(f"nl-hoofdstad-van-{i}", f"Van welke provincie is {noem} de hoofdstad?")
        provincienaam = next(naam for pid, naam, _ in PROVINCIES.values() if pid == item["hoofdstadVan"])
        z["hoofdstadIs"] = zin(f"nl-hoofdstad-is-{i}", f"{noem} is de hoofdstad van {provincienaam}.")
    return z


def schrijf_items(items):
    regels = [
        "// Plaatsen, streken, eilanden en water van Nederland, met de zinnen voor de stem.",
        "// Gemaakt door tools/maak-kaart.py uit open data (zie de README); niet met de hand wijzigen.",
        "// Gebieden verwijzen naar een pad in kaart.js; plaatsen hebben een stip in kaarteenheden.",
        "",
        "export const ITEMS = [",
    ]
    for it in items:
        velden = [f"id: '{it['id']}'", f"naam: {js_tekst(it['naam'])}", f"noem: {js_tekst(it['noem'])}",
                  f"soort: '{it['soort']}'", "provincies: [" + ", ".join(f"'{p}'" for p in it["provincies"]) + "]"]
        if "stip" in it:
            velden.append(f"stip: [{it['stip'][0]}, {it['stip'][1]}]")
        else:
            velden.append(f"gebied: '{it['id']}'")
        if "hoofdstad" in it:
            velden.append(f"hoofdstad: '{it['hoofdstad']}'")
        regels.append("  {")
        regels.append("    " + ", ".join(velden) + ",")
        regels.append("    zinnen: {")
        for k, v in zinnen_van(it).items():
            regels.append(f"      {k}: {v},")
        regels.append("    },")
        regels.append("  },")
    regels.append("];")
    (DOEL / "items.js").write_text("\n".join(regels) + "\n", "utf-8")


def schrijf_kaart(kaart, gebieden):
    regels = [
        "// Kaart van Nederland: RD-coördinaten, 1 eenheid = 50 m, x naar rechts, y naar beneden.",
        "// Gemaakt door tools/maak-kaart.py uit open data (zie de README); niet met de hand wijzigen.",
        "// Per gebied: d = SVG-pad, vak = [x, y, breedte, hoogte], midden = zwaartepunt [x, y].",
        "// Buren delen exact dezelfde grens. Water ligt deels onder het land: teken het land erover.",
        "",
        f"export const VIEWBOX = [0, 0, {kaart.breedte}, {kaart.hoogte}];",
        "",
        "export const GEBIEDEN = {",
    ]
    for gid, ringen in gebieden.items():
        xs = [x for r in ringen for x, _ in r]
        ys = [y for r in ringen for _, y in r]
        mx, my = zwaartepunt(ringen)
        regels.append(f"  '{gid}': {{ vak: [{min(xs)}, {min(ys)}, {max(xs) - min(xs)}, {max(ys) - min(ys)}], "
                      f"midden: [{round(mx)}, {round(my)}], d: '{pad(ringen)}' }},")
    regels.append("};")
    (DOEL / "kaart.js").write_text("\n".join(regels) + "\n", "utf-8")


# --- Hoofdprogramma ---------------------------------------------------------------------------

def plaatsen_bepalen(dl, provincie_vlakken):
    """Woonplaatsen met hun inwoners binnen de bebouwde kernen en een gewogen zwaartepunt (RD)."""
    woonplaatsen = []
    for f in haal_wfs(dl, "woonplaats"):
        polys = vlakken_van(f["geometry"])
        woonplaatsen.append((f["properties"]["identificatie"], f["properties"]["woonplaats"], polys, kader(polys)))
    kernen = []
    for f in haal_wfs(dl, "kern"):
        polys = vlakken_van(f["geometry"])
        kernen.append((polys, kader(polys)))
    inwoners = {f["properties"]["buurtcode"]: f["properties"]["aantalInwoners"] for f in haal_wfs(dl, "buurtcijfer")}

    def zoek(x, y, lijst):
        return next((el for el in lijst if el[-1][0] <= x <= el[-1][2] and el[-1][1] <= y <= el[-1][3]
                     and in_vlakken(x, y, el[-2])), None)

    def bij_kern(x, y):
        # Het punt van een buurt aan de rand van een kern valt soms net buiten het vlak.
        d = KERN_AFSTAND
        return any(k[0] - d <= x <= k[2] + d and k[1] - d <= y <= k[3] + d
                   and (in_vlakken(x, y, polys) or afstand_tot(x, y, polys) <= d) for polys, k in kernen)

    som = {}
    for f in haal_wfs(dl, "buurtpunt"):
        n = inwoners.get(f["properties"]["statcode"]) or 0
        if n <= 0:
            continue
        x, y = f["geometry"]["coordinates"][:2]
        wp = zoek(x, y, woonplaatsen)
        if wp is None or not bij_kern(x, y):
            continue
        s = som.setdefault(wp[0], {"naam": wp[1], "inwoners": 0, "sx": 0, "sy": 0})
        s["inwoners"] += n
        s["sx"] += n * x
        s["sy"] += n * y
    per_naam = defaultdict(list)
    for s in som.values():
        # De stip komt van de woonplaats zelf, ook als er wijken bij worden geteld.
        s["x"], s["y"] = s["sx"] / s["inwoners"], s["sy"] / s["inwoners"]
        per_naam[s["naam"]].append(s)
    for bron, doel in SAMENVOEGEN.items():
        (b,), d = per_naam[bron], max(per_naam[doel], key=lambda s: s["inwoners"])
        d["inwoners"] += b["inwoners"]
        d["samengevoegd"] = d.get("samengevoegd", []) + [f"{bron} {b['inwoners']}"]
        b["inwoners"] = 0
    gekozen = [s for s in som.values() if s["inwoners"] > GRENS_INWONERS or s["naam"] in EXTRA_PLAATSEN]
    for naam in EXTRA_PLAATSEN:
        assert len(per_naam[naam]) == 1, naam
    for s in gekozen:
        s["provincie"] = next((p for p, polys in provincie_vlakken.items() if in_vlakken(s["x"], s["y"], polys)), None)
        assert s["provincie"], s["naam"]
    assert {s["naam"] for s in gekozen} >= set(EXTRA_PLAATSEN)
    return gekozen


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.stdout.reconfigure(encoding="utf-8")
    dl = Path(sys.argv[1])
    dl.mkdir(parents=True, exist_ok=True)

    # Gemeenten en provincies
    gemeenten = {f["properties"]["statnaam"]: vlakken_van(f["geometry"]) for f in haal_wfs(dl, "gemeente")}
    provincie_vlakken = {f["properties"]["statnaam"]: vlakken_van(f["geometry"]) for f in haal_wfs(dl, "provincie")}
    corop_vlakken = {f["properties"]["statnaam"]: vlakken_van(f["geometry"]) for f in haal_wfs(dl, "corop")}
    punt = {}
    for f in haal_wfs(dl, "gemeentepunt"):
        punt.setdefault(f["properties"]["statnaam"], f["geometry"]["coordinates"][:2])
    splits_af(gemeenten, punt, LOSSE_STUKKEN)
    assert set(punt) == set(gemeenten)

    def leden_van(vlakken):
        return sorted(g for g, (x, y) in punt.items() if in_vlakken(x, y, vlakken))

    prov_leden = {p: leden_van(v) for p, v in provincie_vlakken.items()}
    assert sorted(g for l in prov_leden.values() for g in l) == sorted(gemeenten)

    alle = [p for polys in provincie_vlakken.values() for poly in polys for p in poly[0]]
    kaart = Kaart(min(x for x, _ in alle), min(y for _, y in alle), max(x for x, _ in alle), max(y for _, y in alle))

    land = netwerk(gemeenten, kaart)

    gebieden, items, verslag = {}, [], []
    provincie_id = {cbs: pid for cbs, (pid, _, _) in PROVINCIES.items()}
    for cbs, (pid, naam, _) in PROVINCIES.items():
        gebieden[pid] = land(prov_leden[cbs])
    prov_klein = {cbs: gebieden[provincie_id[cbs]] for cbs in PROVINCIES}

    # Plaatsen
    plaatsen = plaatsen_bepalen(dl, provincie_vlakken)

    # Streken en eilanden
    gebied_items = []
    for gid, naam, noem, soort, bron in GEBIEDEN:
        if isinstance(bron, tuple):
            leden = leden_van(corop_vlakken[bron[1]])
            herkomst = f"COROP-gebied {bron[1]}: " + ", ".join(leden)
        else:
            assert all(g in gemeenten for g in bron), (gid, [g for g in bron if g not in gemeenten])
            leden = list(bron)
            herkomst = "gemeenten " + ", ".join(leden)
        provs = sorted({cbs for cbs, l in prov_leden.items() if set(l) & set(leden)}, key=list(PROVINCIES).index)
        gebieden[gid] = land(leden)
        gebied_items.append({"id": gid, "naam": naam, "noem": noem, "soort": soort,
                             "provincies": [provincie_id[p] for p in provs], "herkomst": herkomst})

    # Water
    krw = lees_krw(haal_krw(dl), {c for *_, codes in WATER for c in codes})
    water_vlakken = {}
    for wid, _, _, codes in WATER:
        for c in codes:
            assert c in krw, c
            for i, poly in enumerate(krw[c]):
                water_vlakken[f"{c}#{i}"] = [poly]
    water = netwerk(water_vlakken, kaart)
    water_items = []
    for wid, naam, noem, codes in WATER:
        ringen = water([k for k in water_vlakken if k.split("#")[0] in codes])
        if not ringen:
            verslag.append(f"water {naam}: te klein, weggelaten")
            continue
        gebieden[wid] = ringen
        # Bij welke provincies hoort het water: punten vlak bij de grens of binnen de provincie.
        punten = [p for r in ringen for p in r]
        steekproef = punten[::max(1, len(punten) // 300)]
        contact = {cbs: raakt(ringen, prov_klein[cbs], 20) + sum(in_ringen(x, y, prov_klein[cbs]) for x, y in steekproef)
                   for cbs in PROVINCIES}
        totaal = sum(contact.values())
        provs = [cbs for cbs in PROVINCIES if contact[cbs] >= max(3, 0.08 * totaal)]
        water_items.append({"id": wid, "naam": naam, "noem": noem, "soort": "water",
                            "provincies": [provincie_id[p] for p in provs],
                            "herkomst": "KRW " + ", ".join(codes)})

    # Items in vaste volgorde: provincies, dan per provincie plaatsen, streken, eilanden; water achteraan.
    plaats_items = []
    for s in sorted(plaatsen, key=lambda s: -s["inwoners"]):
        naam = NAMEN.get(s["naam"], s["naam"])
        plaats_items.append({"id": "pl-" + slug(naam), "naam": naam, "noem": naam, "soort": "plaats",
                             "provincies": [provincie_id[s["provincie"]]], "stip": list(kaart.punt(s["x"], s["y"])),
                             "inwoners": s["inwoners"], "samengevoegd": s.get("samengevoegd", [])})
    per_naam = {it["naam"]: it for it in plaats_items}
    for cbs, (pid, naam, hoofdstad) in PROVINCIES.items():
        stad = per_naam[hoofdstad]
        assert stad["provincies"] == [pid], hoofdstad
        stad["hoofdstadVan"] = pid
        items.append({"id": pid, "naam": naam, "noem": naam, "soort": "provincie", "provincies": [pid],
                      "hoofdstad": stad["id"]})
    for pid in provincie_id.values():
        for soort, lijst in (("plaats", plaats_items), ("streek", gebied_items), ("eiland", gebied_items)):
            items += [it for it in lijst if it["soort"] == soort and it["provincies"][0] == pid]
    items += water_items
    ids = [it["id"] for it in items]
    assert len(ids) == len(set(ids)), [i for i, n in Counter(ids).items() if n > 1]

    DOEL.mkdir(parents=True, exist_ok=True)
    schrijf_kaart(kaart, {k: gebieden[k] for k in [*provincie_id.values(), *(it["id"] for it in gebied_items),
                                                   *(it["id"] for it in water_items)]})
    schrijf_items(items)

    # Overzicht
    namen = {it["id"]: it["naam"] for it in items}
    print(f"Kaart {kaart.breedte} × {kaart.hoogte} eenheden; kaart.js {(DOEL / 'kaart.js').stat().st_size / 1024:.0f} KB, "
          f"items.js {(DOEL / 'items.js').stat().st_size / 1024:.0f} KB")
    for pid in provincie_id.values():
        print(f"\n## {namen[pid]} (hoofdstad {namen[next(it for it in items if it['id'] == pid)['hoofdstad']]})")
        for it in items:
            if it["soort"] == "plaats" and it["provincies"][0] == pid:
                extra = f" (met {', '.join(it['samengevoegd'])})" if it["samengevoegd"] else ""
                print(f"- plaats {it['naam']}: {it['inwoners']}{extra}")
        for it in gebied_items:
            if it["provincies"][0] == pid:
                print(f"- {it['soort']} {it['naam']}: {it['herkomst']}")
    print("\n## Water")
    for it in water_items:
        print(f"- {it['naam']}: {it['herkomst']}; provincies {', '.join(namen[p] for p in it['provincies'])}")
    for regel in verslag:
        print("-", regel)
    print(f"\nAantal: {len(plaats_items)} plaatsen, {len(gebied_items)} streken en eilanden, {len(water_items)} water")

    middens = {provincie_id[cbs]: zwaartepunt(prov_klein[cbs]) for cbs in PROVINCIES}
    print("\n## Voorstel burentabel (pijl → provincie)")
    for pid, rij in burenvoorstel(middens).items():
        print(f"  '{pid}': {{ " + ", ".join(f"{r}: {('null' if b is None else repr(b))}" for r, b in rij.items()) + " },")


if __name__ == "__main__":
    main()
