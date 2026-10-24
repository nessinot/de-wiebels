import importlib.util
import json
import unittest
from pathlib import Path

PAD = Path(__file__).resolve().parent.parent / "tools" / "maak-stemmen.py"
spec = importlib.util.spec_from_file_location("maak_stemmen", PAD)
ms = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ms)


class ZinnenLezenTest(unittest.TestCase):
    def test_leest_id_en_tekst(self):
        bron = """
          goed: [
            { id: 'goed-1', tekst: 'Goed zo!' },
            { id: 'mooi-2', tekst: 'Mooi, hè?' },
            { id: 'kijk-1', tekst: 'Kijk \\'s hier!' },
            { id: 'dubbel-1', tekst: "Wat 'n plek!" },
          ],
        """
        self.assertEqual(ms.lees_zinnen(bron), {
            "goed-1": "Goed zo!",
            "mooi-2": "Mooi, hè?",
            "kijk-1": "Kijk 's hier!",
            "dubbel-1": "Wat 'n plek!",
        })

    def test_leest_de_zin_van_een_wiebel(self):
        bron = """
          {
            id: 'plus:20', naam: 'Pixel', kleur: 'blauw', spul: 'zonnebril',
            zin: { id: 'wiebel-ruimte-plus-20', tekst: 'Hoi, ik ben Pixel!' },
          },
        """
        self.assertEqual(ms.lees_zinnen(bron), {"wiebel-ruimte-plus-20": "Hoi, ik ben Pixel!"})

    def test_alle_zinnen_ook_van_de_wiebels(self):
        zinnen = ms.lees_alle_zinnen()
        wiebels = [z for z in zinnen if z.startswith("wiebel-")]
        self.assertEqual(len(wiebels), 5 * 47)
        self.assertIn("wiebel-ruimte-plus-20", zinnen)
        self.assertIn("wiebel-dierenopvang-baas-klok", zinnen)
        self.assertEqual(len(zinnen) - len(wiebels), len(ms.lees_zinnen(ms.ZINNEN_JS.read_text("utf-8"))))

    def test_dubbele_id_is_een_fout(self):
        with self.assertRaises(ValueError):
            ms.lees_zinnen("{ id: 'a-1', tekst: 'x' }, { id: 'a-1', tekst: 'y' }")


class TagTest(unittest.TestCase):
    def test_tag_voor_elke_zin(self):
        self.assertEqual(ms.TAG, "[excited]")
        self.assertEqual(ms.met_tag("Bijna! Kijk, zo zit het."), "[excited] Bijna! [excited] Kijk, zo zit het.")
        self.assertEqual(ms.met_tag("Goed zo!"), "[excited] Goed zo!")
        self.assertEqual(ms.met_tag("Hmm… Wat is dit? Een ster."), "[excited] Hmm… [excited] Wat is dit? [excited] Een ster.")
        # Geen nieuwe zin zonder spatie erna, zoals in een getal.
        self.assertEqual(ms.met_tag("Dat is 2.5 keer zo veel."), "[excited] Dat is 2.5 keer zo veel.")


class TeMakenTest(unittest.TestCase):
    def manifest(self, **anders):
        m = {"stem": ms.STEM_ID, "model": ms.MODEL, "tag": ms.TAG, "zinnen": {
            "a-1": {"tekst": "Hoi!", "bestand": "a-1.mp3"},
            "b-1": {"tekst": "Dag!", "bestand": "b-1.mp3"},
        }}
        m.update(anders)
        return m

    def test_alleen_nieuwe_en_gewijzigde_zinnen(self):
        zinnen = {"a-1": "Hoi!", "b-1": "Dag hoor!", "c-1": "Nieuw!"}
        self.assertEqual(ms.te_maken(zinnen, self.manifest(), lambda b: True), ["b-1", "c-1"])

    def test_ontbrekend_bestand_opnieuw(self):
        zinnen = {"a-1": "Hoi!", "b-1": "Dag!"}
        self.assertEqual(ms.te_maken(zinnen, self.manifest(), lambda b: b != "a-1.mp3"), ["a-1"])

    def test_andere_stem_model_of_tag_alles_opnieuw(self):
        zinnen = {"a-1": "Hoi!", "b-1": "Dag!"}
        self.assertEqual(ms.te_maken(zinnen, self.manifest(stem="iemand-anders"), lambda b: True), ["a-1", "b-1"])
        self.assertEqual(ms.te_maken(zinnen, self.manifest(model="ander-model"), lambda b: True), ["a-1", "b-1"])
        self.assertEqual(ms.te_maken(zinnen, self.manifest(tag="[calm]"), lambda b: True), ["a-1", "b-1"])
        self.assertEqual(ms.te_maken(zinnen, {}, lambda b: True), ["a-1", "b-1"])


class VolledigTest(unittest.TestCase):
    def test_elke_zin_heeft_een_stem(self):
        zinnen = ms.lees_alle_zinnen()
        manifest = json.loads((ms.STEM_MAP / "manifest.json").read_text("utf-8"))
        self.assertEqual((manifest["stem"], manifest["model"], manifest["tag"]), (ms.STEM_ID, ms.MODEL, ms.TAG))
        self.assertGreater(len(zinnen), 60)
        # Faalt dit na het toevoegen of wijzigen van een zin: draai tools/maak-stemmen.py.
        self.assertEqual(ms.te_maken(zinnen, manifest, lambda b: (ms.STEM_MAP / b).exists()), [])
        self.assertEqual(set(manifest["zinnen"]), set(zinnen))

    def test_elk_thema_heeft_muziek(self):
        manifest = json.loads((ms.MUZIEK_MAP / "manifest.json").read_text("utf-8"))
        self.assertEqual(set(manifest), set(ms.MUZIEK))
        for stuk in manifest.values():
            self.assertTrue((ms.MUZIEK_MAP / stuk["bestand"]).exists(), stuk["bestand"])


if __name__ == "__main__":
    unittest.main()
