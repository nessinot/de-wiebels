import importlib.util
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parent.parent / "tools"


def laad(naam, bestand):
    spec = importlib.util.spec_from_file_location(naam, TOOLS / bestand)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


mk = laad("maak_kaart", "maak-kaart.py")
ms = laad("maak_stemmen", "maak-stemmen.py")


class VereenvoudigTest(unittest.TestCase):
    def test_bijna_rechte_lijn_wordt_een_lijn(self):
        self.assertEqual(mk.douglas_peucker([(0, 0), (1, 0.1), (2, -0.1), (3, 0)], 0.5), [(0, 0), (3, 0)])

    def test_hoek_blijft_staan(self):
        self.assertEqual(mk.douglas_peucker([(0, 0), (1, 0), (2, 0), (2, 1), (2, 2)], 0.1), [(0, 0), (2, 0), (2, 2)])

    def test_gesloten_boog_houdt_zijn_hoeken(self):
        ring = [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (1, 2), (0, 2), (0, 1), (0, 0)]
        self.assertEqual(mk.vereenvoudig(ring, 0.1), [(0, 0), (2, 0), (2, 2), (0, 2), (0, 0)])


# Twee vierkanten van 10 km naast elkaar; de gedeelde grens slingert een beetje en heeft één bocht.
GRENS = [(10_000, 0), (10_280, 2_500), (10_500, 5_000), (10_230, 7_500), (10_000, 10_000)]
LINKS = [[[(0, 0), *GRENS, (0, 10_000)]]]
RECHTS = [[[(20_000, 0), (20_000, 10_000), *reversed(GRENS)]]]


class TopologieTest(unittest.TestCase):
    def test_gedeelde_grens_is_een_boog(self):
        bogen, ref = mk.topologie({"a": LINKS[0], "b": RECHTS[0]})
        gedeeld = {b for b, _ in ref["a"][0]} & {b for b, _ in ref["b"][0]}
        self.assertEqual(len(gedeeld), 1)
        (boog,) = gedeeld
        self.assertEqual({d for b, d in ref["a"][0] + ref["b"][0] if b == boog}, {1, -1})
        self.assertEqual(sorted(bogen[boog]), sorted(GRENS))

    def test_gedeelde_grens_blijft_gelijk_na_vereenvoudigen(self):
        kaart = mk.Kaart(0, 0, 20_000, 10_000)
        groep = mk.netwerk({"a": LINKS, "b": RECHTS}, kaart)
        (a,), (b,) = groep(["a"]), groep(["b"])
        gedeeld = set(a) & set(b)
        # De kleine slingers verdwijnen, de bocht blijft; aan beide kanten precies dezelfde punten.
        self.assertEqual(gedeeld, {kaart.punt(*p) for p in [(10_000, 0), (10_500, 5_000), (10_000, 10_000)]})

    def test_samen_is_de_buitenrand(self):
        kaart = mk.Kaart(0, 0, 20_000, 10_000)
        (ring,) = mk.netwerk({"a": LINKS, "b": RECHTS}, kaart)(["a", "b"])
        self.assertNotIn(kaart.punt(10_500, 5_000), ring)
        self.assertEqual(abs(mk.oppervlak(ring)) * mk.EENHEID ** 2, 200_000_000)

    def test_eilandje_onder_de_grens_valt_weg(self):
        kaart = mk.Kaart(0, 0, 20_000, 10_000)
        eiland = [[(15_000, 15_000), (15_100, 15_000), (15_100, 15_100)]]
        ringen = mk.netwerk({"a": [LINKS[0], eiland]}, kaart)(["a"])
        self.assertEqual(len(ringen), 1)


class AfsplitsenTest(unittest.TestCase):
    def test_los_stuk_wordt_een_eigen_vlak(self):
        # Gemeente a heeft een los stuk rechts van b; dat stuk grenst aan b.
        stuk = [[(20_000, 0), (30_000, 0), (30_000, 10_000), (20_000, 10_000)]]
        gemeenten = {"a": [LINKS[0], stuk], "b": RECHTS}
        punt = {"a": (5_000, 5_000), "b": (15_000, 5_000)}
        mk.splits_af(gemeenten, punt, {"c": ("a", (25_000, 5_000))})
        self.assertEqual(gemeenten["a"], LINKS)
        self.assertEqual(gemeenten["c"], [stuk])
        self.assertEqual(punt["c"], (25_000, 5_000))
        kaart = mk.Kaart(0, 0, 30_000, 10_000)
        groep = mk.netwerk(gemeenten, kaart)
        (b,), (c,) = groep(["b"]), groep(["c"])
        self.assertEqual(set(b) & set(c), {kaart.punt(20_000, 0), kaart.punt(20_000, 10_000)})
        (samen,) = groep(["a", "b", "c"])
        self.assertEqual(abs(mk.oppervlak(samen)) * mk.EENHEID ** 2, 300_000_000)

    def test_punt_buiten_elk_stuk_faalt(self):
        gemeenten, punt = {"a": LINKS}, {"a": (5_000, 5_000)}
        with self.assertRaises(ValueError):
            mk.splits_af(gemeenten, punt, {"c": ("a", (50_000, 5_000))})


class OmzettenTest(unittest.TestCase):
    def test_rd_uit_etrs(self):
        # Labelpunten van twee provincies uit de PDOK-dienst, opgevraagd in EPSG:4258 en EPSG:28992.
        for (lat, lon), (x, y) in [((53.29203058778453, 6.705090032048272), (242878, 590308)),
                                   ((51.465237089716524, 3.855601424694521), (48575, 387359))]:
            rx, ry = mk.rd_uit_etrs(lat, lon)
            self.assertLess(abs(rx - x), 1)
            self.assertLess(abs(ry - y), 1)

    def test_kaart_draait_y_om_en_rekent_in_eenheden(self):
        kaart = mk.Kaart(10_000, 300_000, 20_000, 310_000)
        self.assertEqual(kaart.punt(10_000 - mk.MARGE, 310_000 + mk.MARGE), (0, 0))
        self.assertEqual(kaart.punt(10_050 - mk.MARGE, 309_900 + mk.MARGE), (1, 2))

    def test_pad_relatief(self):
        self.assertEqual(mk.pad([[(0, 0), (10, 0), (10, -5)]]), "M0 0l10 0 0-5z")
        self.assertEqual(mk.pad([[(3, 4), (5, 4), (5, 6)], [(1, 1), (2, 1), (2, 2)]]), "M3 4l2 0 0 2zM1 1l1 0 0 1z")


class PuntInVlakTest(unittest.TestCase):
    VLAK = [[(0, 0), (10, 0), (10, 10), (0, 10)], [(4, 4), (6, 4), (6, 6), (4, 6)]]

    def test_binnen_buiten_en_in_het_gat(self):
        self.assertTrue(mk.in_vlakken(2, 2, [self.VLAK]))
        self.assertFalse(mk.in_vlakken(5, 5, [self.VLAK]))
        self.assertFalse(mk.in_vlakken(12, 5, [self.VLAK]))
        self.assertTrue(mk.in_ringen(2, 2, self.VLAK))
        self.assertFalse(mk.in_ringen(5, 5, self.VLAK))


class TekstTest(unittest.TestCase):
    def test_id_van_een_naam(self):
        self.assertEqual(mk.slug("'s-Hertogenbosch"), "s-hertogenbosch")
        self.assertEqual(mk.slug("Fryslân"), "fryslan")
        self.assertEqual(mk.slug("Kop van Noord-Holland"), "kop-van-noord-holland")

    def test_zinnen_zijn_leesbaar_voor_het_stemscript(self):
        bron = mk.zin("nl-waar-pl-s-hertogenbosch", "Waar ligt 's-Hertogenbosch?") + mk.zin("nl-dat-pl-urk", "Dat is Urk.")
        self.assertEqual(ms.lees_zinnen(bron), {"nl-waar-pl-s-hertogenbosch": "Waar ligt 's-Hertogenbosch?",
                                                "nl-dat-pl-urk": "Dat is Urk."})


class BurenTest(unittest.TestCase):
    def test_voorstel_kiest_de_dichtste_in_de_richting(self):
        voorstel = mk.burenvoorstel({"a": (0, 0), "b": (10, 1), "c": (30, 0), "d": (0, 20)})
        self.assertEqual(voorstel["a"], {"links": None, "rechts": "b", "boven": None, "onder": "d"})
        self.assertEqual(voorstel["c"]["links"], "b")


if __name__ == "__main__":
    unittest.main()
