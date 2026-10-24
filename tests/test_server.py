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
    def setUp(self):
        self.map = tempfile.TemporaryDirectory()
        self.server = maak_server(0, self.map.name, FRONTEND)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.basis = f"http://127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.map.cleanup()

    def vraag(self, methode, pad, inhoud=None):
        data = None if inhoud is None else json.dumps(inhoud).encode()
        verzoek = Request(self.basis + pad, data=data, method=methode, headers={"Content-Type": "application/json"})
        try:
            with urlopen(verzoek) as antwoord:
                tekst = antwoord.read()
                return antwoord.status, json.loads(tekst) if tekst else None, antwoord.headers
        except HTTPError as fout:
            return fout.code, json.loads(fout.read() or "null"), fout.headers

    def test_frontend_met_juiste_types_en_zonder_cache(self):
        status, _, headers = self.vraag_ruw("/")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers["Content-Type"])
        self.assertEqual(headers["Cache-Control"], "no-cache")
        _, _, headers = self.vraag_ruw("/js/main.js")
        self.assertIn("text/javascript", headers["Content-Type"])

    def test_stem_en_muziek_als_mp3(self):
        status, _, headers = self.vraag_ruw("/geluid/stem/goed-1.mp3")
        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "audio/mpeg")
        _, _, headers = self.vraag_ruw("/geluid/muziek/ruimte.mp3")
        self.assertEqual(headers["Content-Type"], "audio/mpeg")

    def vraag_ruw(self, pad):
        with urlopen(self.basis + pad) as antwoord:
            antwoord.read()
            return antwoord.status, None, antwoord.headers

    def test_profiel_bewaren_lezen_en_verwijderen(self):
        self.assertEqual(self.vraag("GET", "/api/profielen")[:2], (200, []))
        profiel = {"id": "p-abc123", "naam": "Speler 1", "munten": 5}
        self.assertEqual(self.vraag("PUT", "/api/profielen/p-abc123", profiel)[:2], (200, profiel))
        self.assertEqual(self.vraag("GET", "/api/profielen/p-abc123")[:2], (200, profiel))
        self.assertEqual(self.vraag("GET", "/api/profielen")[:2], (200, [profiel]))
        self.assertTrue((Path(self.map.name) / "profielen" / "p-abc123.json").exists())
        self.assertEqual(self.vraag("DELETE", "/api/profielen/p-abc123")[0], 204)
        self.assertEqual(self.vraag("GET", "/api/profielen/p-abc123")[0], 404)

    def test_bijwerken_overschrijft(self):
        self.vraag("PUT", "/api/profielen/p-1", {"id": "p-1", "munten": 1})
        self.vraag("PUT", "/api/profielen/p-1", {"id": "p-1", "munten": 9})
        self.assertEqual(self.vraag("GET", "/api/profielen/p-1")[1]["munten"], 9)

    def test_ongeldige_verzoeken(self):
        self.assertEqual(self.vraag("GET", "/api/profielen/..%2Fgeheim")[0], 400)
        self.assertEqual(self.vraag("PUT", "/api/profielen/p-1", {"id": "p-2"})[0], 400)
        self.assertEqual(self.vraag("PUT", "/api/profielen/p-1", [1, 2])[0], 400)
        self.assertEqual(self.vraag("GET", "/api/iets-anders")[0], 404)
        self.assertEqual(self.vraag("DELETE", "/api/profielen")[0], 405)


if __name__ == "__main__":
    unittest.main()
