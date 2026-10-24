"""Webserver voor De Wiebels: serveert de frontend en een kleine JSON-API voor profielen.

Twee poorten:
- de spelpoort (WIEBELS_POORT, standaard 8765) voor de tv: profielen lezen en voortgang bewaren,
  instellingen en verwijderde profielen alleen lezen;
- de beheerpoort (WIEBELS_BEHEER_POORT, standaard 8099) voor de ouderpagina in de zijbalk van
  Home Assistant (ingress): profielen aanmaken, wijzigen en verwijderen, instellingen, export en
  import. Alleen voor verzoeken van Home Assistant (172.30.32.2) en van de eigen machine.

Verder: WIEBELS_DATA (standaard /data) en WIEBELS_FRONTEND (de map met de frontend).
Alleen de standaardbibliotheek, zodat de image niets hoeft te installeren.
"""

import json
import os
import re
import threading
from datetime import datetime, timezone
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

GELDIG_ID = re.compile(r"^[a-z0-9-]{1,64}$")
MAX_GROOTTE = 1_000_000
MAX_IMPORT = 20_000_000
BEHEER_TOEGESTAAN = {"172.30.32.2", "127.0.0.1"}
STANDAARD_INSTELLINGEN = {"geluid": True, "stem": True, "muziek": True}

# Eén schrijver tegelijk, zodat de tv en de ouderpagina elkaars bestanden niet half overschrijven.
SCHRIJVEN = threading.Lock()


def schrijf_json(bestand, inhoud):
    tijdelijk = bestand.with_suffix(".tmp")
    tijdelijk.write_text(json.dumps(inhoud, ensure_ascii=False), "utf-8")
    tijdelijk.replace(bestand)


def lees_json(bestand, standaard):
    try:
        return json.loads(bestand.read_text("utf-8"))
    except (OSError, ValueError):
        return standaard


# Alleen geluid, stem en muziek, als true/false; wat ontbreekt of ongeldig is, komt uit de basis.
def geldige_instellingen(inhoud, basis=STANDAARD_INSTELLINGEN):
    inhoud = inhoud if isinstance(inhoud, dict) else {}
    return {k: inhoud[k] if isinstance(inhoud.get(k), bool) else v for k, v in basis.items()}


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".mp3": "audio/mpeg",
        ".woff2": "font/woff2",
    }

    def parse_request(self):
        if not super().parse_request():
            return False
        toegestaan = self.server.toegestaan
        if toegestaan is not None and self.client_address[0] not in toegestaan:
            self.send_error(HTTPStatus.FORBIDDEN)
            return False
        return True

    def translate_path(self, path):
        # Op de beheerpoort is de ouderpagina de startpagina.
        if self.server.beheer and path.split("?")[0] == "/":
            path = "/ouder/index.html"
        return super().translate_path(path)

    def end_headers(self):
        # Altijd opnieuw controleren, zodat de tv na een update meteen de nieuwe bestanden laadt.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.startswith("/api/"):
            return self.api("GET")
        return super().do_GET()

    def do_PUT(self):
        self.api("PUT")

    def do_POST(self):
        self.api("POST")

    def do_DELETE(self):
        self.api("DELETE")

    def stuur_json(self, status, inhoud=None, extra_headers=()):
        data = b"" if inhoud is None else json.dumps(inhoud, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        if inhoud is not None:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        for naam, waarde in extra_headers:
            self.send_header(naam, waarde)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def lees_inhoud(self, maximum):
        lengte = int(self.headers.get("Content-Length") or 0)
        if lengte > maximum:
            self.stuur_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"fout": "te groot"})
            return None
        try:
            return json.loads(self.rfile.read(lengte))
        except ValueError:
            self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "geen geldige JSON"})
            return None

    @property
    def profielmap(self):
        map_ = self.server.data / "profielen"
        map_.mkdir(parents=True, exist_ok=True)
        return map_

    @property
    def verwijderd_bestand(self):
        return self.server.data / "verwijderd.json"

    @property
    def instellingen_bestand(self):
        return self.server.data / "instellingen.json"

    def alle_profielen(self):
        return [json.loads(p.read_text("utf-8")) for p in sorted(self.profielmap.glob("*.json"))]

    def verwijderd(self):
        return lees_json(self.verwijderd_bestand, [])

    def instellingen(self):
        return geldige_instellingen(lees_json(self.instellingen_bestand, {}))

    def api(self, methode):
        delen = self.path.split("?")[0].strip("/").split("/")
        if delen[:2] == ["api", "profielen"] and len(delen) <= 3:
            return self.api_profielen(methode, delen)
        adres = "/".join(delen)
        routes = {
            ("GET", "api/verwijderd"): lambda: self.stuur_json(HTTPStatus.OK, self.verwijderd()),
            ("GET", "api/instellingen"): lambda: self.stuur_json(HTTPStatus.OK, self.instellingen()),
        }
        if self.server.beheer:
            routes |= {
                ("PUT", "api/instellingen"): self.zet_instellingen,
                ("GET", "api/export"): self.export,
                ("POST", "api/import"): self.importeer,
            }
        if (methode, adres) in routes:
            return routes[(methode, adres)]()
        if any(a == adres for _, a in routes):
            return self.stuur_json(HTTPStatus.METHOD_NOT_ALLOWED, {"fout": "niet toegestaan"})
        return self.stuur_json(HTTPStatus.NOT_FOUND, {"fout": "onbekend adres"})

    def zet_instellingen(self):
        inhoud = self.lees_inhoud(MAX_GROOTTE)
        if inhoud is None:
            return None
        if not isinstance(inhoud, dict):
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "geen instellingen"})
        with SCHRIJVEN:
            nieuw = geldige_instellingen(inhoud, self.instellingen())
            schrijf_json(self.instellingen_bestand, nieuw)
        return self.stuur_json(HTTPStatus.OK, nieuw)

    def api_profielen(self, methode, delen):
        if len(delen) == 2:
            if methode != "GET":
                return self.stuur_json(HTTPStatus.METHOD_NOT_ALLOWED, {"fout": "niet toegestaan"})
            return self.stuur_json(HTTPStatus.OK, self.alle_profielen())

        profiel_id = delen[2]
        if not GELDIG_ID.match(profiel_id):
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "ongeldig id"})
        bestand = self.profielmap / f"{profiel_id}.json"

        if methode == "GET":
            if not bestand.exists():
                return self.stuur_json(HTTPStatus.NOT_FOUND, {"fout": "profiel niet gevonden"})
            return self.stuur_json(HTTPStatus.OK, json.loads(bestand.read_text("utf-8")))

        if methode == "DELETE":
            if not self.server.beheer:
                return self.stuur_json(HTTPStatus.METHOD_NOT_ALLOWED, {"fout": "alleen via de ouderpagina"})
            with SCHRIJVEN:
                bestand.unlink(missing_ok=True)
                verwijderd = self.verwijderd()
                if profiel_id not in verwijderd:
                    schrijf_json(self.verwijderd_bestand, [*verwijderd, profiel_id])
            return self.stuur_json(HTTPStatus.NO_CONTENT)

        if methode != "PUT":
            return self.stuur_json(HTTPStatus.METHOD_NOT_ALLOWED, {"fout": "niet toegestaan"})
        profiel = self.lees_inhoud(MAX_GROOTTE)
        if profiel is None:
            return None
        if not isinstance(profiel, dict) or profiel.get("id") != profiel_id:
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "id klopt niet"})
        with SCHRIJVEN:
            if not self.server.beheer:
                # De tv bewaart alleen voortgang van bestaande profielen; een verwijderd profiel komt niet terug.
                if profiel_id in self.verwijderd():
                    return self.stuur_json(HTTPStatus.GONE, {"fout": "profiel is verwijderd"})
                if not bestand.exists():
                    return self.stuur_json(HTTPStatus.FORBIDDEN, {"fout": "nieuwe profielen alleen via de ouderpagina"})
            else:
                self.niet_meer_verwijderd([profiel_id])
            schrijf_json(bestand, profiel)
        return self.stuur_json(HTTPStatus.OK, profiel)

    def niet_meer_verwijderd(self, ids):
        verwijderd = self.verwijderd()
        over = [i for i in verwijderd if i not in ids]
        if over != verwijderd:
            schrijf_json(self.verwijderd_bestand, over)

    def export(self):
        nu = datetime.now(timezone.utc)
        inhoud = {
            "app": "de-wiebels",
            "versie": 1,
            "gemaakt": nu.isoformat(timespec="milliseconds").replace("+00:00", "Z"),
            "profielen": self.alle_profielen(),
            "instellingen": self.instellingen(),
        }
        naam = f"de-wiebels-{nu.date().isoformat()}.json"
        return self.stuur_json(HTTPStatus.OK, inhoud, [("Content-Disposition", f'attachment; filename="{naam}"')])

    # Een exportbestand terugzetten: per profiel wint de nieuwste versie; ingelezen profielen
    # tellen niet meer als verwijderd. Ook exportbestanden van het oude ouderscherm op de tv werken.
    def importeer(self):
        data = self.lees_inhoud(MAX_IMPORT)
        if data is None:
            return None
        if not isinstance(data, dict) or data.get("app") != "de-wiebels" or not isinstance(data.get("profielen"), list):
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "Dit is geen exportbestand van De Wiebels."})
        geldig = [
            p for p in data["profielen"]
            if isinstance(p, dict) and isinstance(p.get("id"), str) and GELDIG_ID.match(p["id"]) and isinstance(p.get("bijgewerkt"), str)
        ]
        with SCHRIJVEN:
            for p in geldig:
                bestand = self.profielmap / f"{p['id']}.json"
                bestaand = lees_json(bestand, None)
                if not isinstance(bestaand, dict) or str(bestaand.get("bijgewerkt", "")) < p["bijgewerkt"]:
                    schrijf_json(bestand, p)
            self.niet_meer_verwijderd([p["id"] for p in geldig])
            if isinstance(data.get("instellingen"), dict):
                schrijf_json(self.instellingen_bestand, geldige_instellingen(data["instellingen"]))
        return self.stuur_json(HTTPStatus.OK, {"aantal": len(geldig)})


def maak_server(poort, data, frontend, beheer=False):
    server = ThreadingHTTPServer(("", poort), partial(Handler, directory=str(frontend)))
    server.data = Path(data)
    server.beheer = beheer
    server.toegestaan = BEHEER_TOEGESTAAN if beheer else None
    return server


if __name__ == "__main__":
    standaard_frontend = Path(__file__).resolve().parent.parent / "frontend"
    data = os.environ.get("WIEBELS_DATA", "/data")
    frontend = os.environ.get("WIEBELS_FRONTEND", standaard_frontend)
    beheer = maak_server(int(os.environ.get("WIEBELS_BEHEER_POORT", "8099")), data, frontend, beheer=True)
    threading.Thread(target=beheer.serve_forever, daemon=True).start()
    server = maak_server(int(os.environ.get("WIEBELS_POORT", "8765")), data, frontend)
    print(f"De Wiebels draait op poort {server.server_port}, de ouderpagina op poort {beheer.server_port}", flush=True)
    server.serve_forever()
