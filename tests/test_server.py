import json
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "de-wiebels" / "backend"))
from server import maak_server  # noqa: E402

FRONTEND = Path(__file__).resolve().parent.parent / "de-wiebels" / "frontend"


class ServerTest(unittest.TestCase):
    """De spelpoort en de beheerpoort, met dezelfde datamap."""

    def setUp(self):
        self.map = tempfile.TemporaryDirectory()
        self.servers = []
        self.spel = self.start(maak_server(0, self.map.name, FRONTEND))
        self.beheer = self.start(maak_server(0, self.map.name, FRONTEND, beheer=True))

    def start(self, server):
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.servers.append(server)
        return f"http://127.0.0.1:{server.server_port}"

    def tearDown(self):
        for server in self.servers:
            server.shutdown()
            server.server_close()
        self.map.cleanup()

    def vraag(self, methode, adres, inhoud=None):
        data = None if inhoud is None else json.dumps(inhoud).encode()
        verzoek = Request(adres, data=data, method=methode, headers={"Content-Type": "application/json"})
        try:
            with urlopen(verzoek) as antwoord:
                tekst = antwoord.read()
                return antwoord.status, json.loads(tekst) if tekst else None, antwoord.headers
        except HTTPError as fout:
            tekst = fout.read()
            fout.close()
            try:
                return fout.code, json.loads(tekst or "null"), fout.headers
            except ValueError:
                return fout.code, None, fout.headers

    def vraag_ruw(self, adres):
        with urlopen(adres) as antwoord:
            return antwoord.status, antwoord.read(), antwoord.headers

    def maak(self, profiel):
        status, _, _ = self.vraag("PUT", f"{self.beheer}/api/profielen/{profiel['id']}", profiel)
        self.assertEqual(status, 200)

    def test_frontend_met_juiste_types_en_zonder_cache(self):
        status, _, headers = self.vraag_ruw(f"{self.spel}/")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers["Content-Type"])
        self.assertEqual(headers["Cache-Control"], "no-cache")
        _, _, headers = self.vraag_ruw(f"{self.spel}/js/main.js")
        self.assertIn("text/javascript", headers["Content-Type"])

    def test_stem_en_muziek_als_mp3(self):
        status, _, headers = self.vraag_ruw(f"{self.spel}/geluid/stem/goed-1.mp3")
        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "audio/mpeg")
        _, _, headers = self.vraag_ruw(f"{self.spel}/geluid/muziek/ruimte.mp3")
        self.assertEqual(headers["Content-Type"], "audio/mpeg")

    def test_beheerpoort_toont_de_ouderpagina(self):
        _, spel, _ = self.vraag_ruw(f"{self.spel}/")
        _, ouder, headers = self.vraag_ruw(f"{self.beheer}/")
        self.assertIn("text/html", headers["Content-Type"])
        self.assertIn(b"ouder/ouder.js", ouder)
        self.assertNotIn(b"ouder/ouder.js", spel)
        # Alles met relatieve paden, want achter ingress staat er een voorvoegsel voor.
        self.assertNotIn(b'="/', ouder)
        self.assertEqual(self.vraag_ruw(f"{self.beheer}/js/leitner.js")[0], 200)

    def test_beheerpoort_alleen_voor_home_assistant_en_de_eigen_machine(self):
        self.assertEqual(self.servers[1].toegestaan, {"172.30.32.2", "127.0.0.1"})
        self.assertIsNone(self.servers[0].toegestaan)
        self.servers[1].toegestaan = {"172.30.32.2"}
        self.assertEqual(self.vraag("GET", f"{self.beheer}/api/profielen")[0], 403)
        self.assertEqual(self.vraag("GET", f"{self.beheer}/")[0], 403)
        self.assertEqual(self.vraag("DELETE", f"{self.beheer}/api/profielen/p-1")[0], 403)

    def test_profiel_aanmaken_lezen_bijwerken_en_verwijderen(self):
        profiel = {"id": "p-abc123", "naam": "Speler 1", "munten": 5, "bijgewerkt": "2026-10-20T10:00:00.000Z"}
        self.maak(profiel)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen")[:2], (200, [profiel]))
        self.assertEqual(self.vraag("GET", f"{self.beheer}/api/profielen/p-abc123")[:2], (200, profiel))
        self.assertTrue((Path(self.map.name) / "profielen" / "p-abc123.json").exists())

        # De tv bewaart voortgang van een bestaand profiel.
        voortgang = {**profiel, "munten": 9}
        self.assertEqual(self.vraag("PUT", f"{self.spel}/api/profielen/p-abc123", voortgang)[:2], (200, voortgang))
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen/p-abc123")[1]["munten"], 9)

        self.assertEqual(self.vraag("DELETE", f"{self.beheer}/api/profielen/p-abc123")[0], 204)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen/p-abc123")[0], 404)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/verwijderd")[:2], (200, ["p-abc123"]))

    def test_spelpoort_kan_geen_profielen_aanmaken_of_verwijderen(self):
        self.assertEqual(self.vraag("PUT", f"{self.spel}/api/profielen/p-nieuw", {"id": "p-nieuw"})[0], 403)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen")[1], [])
        self.maak({"id": "p-1", "naam": "Speler 1"})
        self.assertEqual(self.vraag("DELETE", f"{self.spel}/api/profielen/p-1")[0], 405)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen/p-1")[0], 200)

    def test_verwijderd_profiel_komt_niet_terug_via_de_tv(self):
        self.maak({"id": "p-1", "naam": "Speler 1"})
        self.vraag("DELETE", f"{self.beheer}/api/profielen/p-1")
        self.assertEqual(self.vraag("PUT", f"{self.spel}/api/profielen/p-1", {"id": "p-1", "munten": 3})[0], 410)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen")[1], [])
        self.vraag("DELETE", f"{self.beheer}/api/profielen/p-1")
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/verwijderd")[1], ["p-1"], "maar één keer in de lijst")
        # Opnieuw aanmaken via de ouderpagina haalt het van de lijst.
        self.maak({"id": "p-1", "naam": "Speler 1"})
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/verwijderd")[1], [])

    def test_instellingen_standaard_aan_en_alleen_via_de_ouderpagina_te_wijzigen(self):
        alles_aan = {"geluid": True, "stem": True, "muziek": True}
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/instellingen")[:2], (200, alles_aan))
        self.assertEqual(self.vraag("PUT", f"{self.spel}/api/instellingen", {"muziek": False})[0], 405)
        status, inhoud, _ = self.vraag("PUT", f"{self.beheer}/api/instellingen", {"muziek": False, "pin": "1234", "stem": "nee"})
        self.assertEqual((status, inhoud), (200, {"geluid": True, "stem": True, "muziek": False}))
        self.vraag("PUT", f"{self.beheer}/api/instellingen", {"geluid": False})
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/instellingen")[1], {"geluid": False, "stem": True, "muziek": False})
        self.assertEqual(self.vraag("PUT", f"{self.beheer}/api/instellingen", [1])[0], 400)

    def test_export_en_import(self):
        self.maak({"id": "p-1", "naam": "Speler 1", "munten": 5, "bijgewerkt": "2026-10-20T10:00:00.000Z"})
        self.vraag("PUT", f"{self.beheer}/api/instellingen", {"stem": False})
        status, export, headers = self.vraag("GET", f"{self.beheer}/api/export")
        self.assertEqual(status, 200)
        self.assertIn("attachment", headers["Content-Disposition"])
        self.assertEqual(export["app"], "de-wiebels")
        self.assertEqual([p["id"] for p in export["profielen"]], ["p-1"])
        self.assertEqual(export["instellingen"], {"geluid": True, "stem": False, "muziek": True})
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/export")[0], 404)
        self.assertEqual(self.vraag("POST", f"{self.spel}/api/import", export)[0], 404)

        # Na verwijderen en ander gebruik: de import zet het profiel terug, het nieuwste wint.
        self.vraag("DELETE", f"{self.beheer}/api/profielen/p-1")
        self.maak({"id": "p-2", "naam": "Speler 2", "munten": 8, "bijgewerkt": "2026-10-22T10:00:00.000Z"})
        self.vraag("PUT", f"{self.beheer}/api/instellingen", {"stem": True})
        export["profielen"].append({"id": "p-2", "naam": "Speler 2", "munten": 1, "bijgewerkt": "2026-10-21T10:00:00.000Z"})
        export["profielen"].append({"id": "../geheim", "bijgewerkt": "x"})
        export["instellingen"]["pin"] = "1234"
        self.assertEqual(self.vraag("POST", f"{self.beheer}/api/import", export)[:2], (200, {"aantal": 2}))
        profielen = {p["id"]: p for p in self.vraag("GET", f"{self.spel}/api/profielen")[1]}
        self.assertEqual({k: p["munten"] for k, p in profielen.items()}, {"p-1": 5, "p-2": 8})
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/verwijderd")[1], [])
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/instellingen")[1], {"geluid": True, "stem": False, "muziek": True})

    def test_import_weigert_vreemde_bestanden(self):
        self.assertEqual(self.vraag("POST", f"{self.beheer}/api/import", {"app": "iets"})[0], 400)
        self.assertEqual(self.vraag("POST", f"{self.beheer}/api/import", [1])[0], 400)

    def test_ongeldige_verzoeken(self):
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/profielen/..%2Fgeheim")[0], 400)
        self.assertEqual(self.vraag("PUT", f"{self.beheer}/api/profielen/p-1", {"id": "p-2"})[0], 400)
        self.assertEqual(self.vraag("PUT", f"{self.beheer}/api/profielen/p-1", [1, 2])[0], 400)
        self.assertEqual(self.vraag("GET", f"{self.spel}/api/iets-anders")[0], 404)
        self.assertEqual(self.vraag("DELETE", f"{self.beheer}/api/profielen")[0], 405)


if __name__ == "__main__":
    unittest.main()
