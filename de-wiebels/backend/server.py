"""Webserver voor De Wiebels: serveert de frontend en een kleine JSON-API voor profielen.

Alleen de standaardbibliotheek, zodat de image niets hoeft te installeren.
"""

import json
import os
import re
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

GELDIG_ID = re.compile(r"^[a-z0-9-]{1,64}$")
MAX_GROOTTE = 1_000_000


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".mp3": "audio/mpeg",
    }

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

    def do_DELETE(self):
        self.api("DELETE")

    def stuur_json(self, status, inhoud=None):
        data = b"" if inhoud is None else json.dumps(inhoud, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        if inhoud is not None:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def api(self, methode):
        delen = self.path.split("?")[0].strip("/").split("/")
        if delen[:2] != ["api", "profielen"] or len(delen) > 3:
            return self.stuur_json(HTTPStatus.NOT_FOUND, {"fout": "onbekend adres"})
        map_ = self.server.data / "profielen"
        map_.mkdir(parents=True, exist_ok=True)

        if len(delen) == 2:
            if methode != "GET":
                return self.stuur_json(HTTPStatus.METHOD_NOT_ALLOWED, {"fout": "niet toegestaan"})
            profielen = [json.loads(p.read_text("utf-8")) for p in sorted(map_.glob("*.json"))]
            return self.stuur_json(HTTPStatus.OK, profielen)

        profiel_id = delen[2]
        if not GELDIG_ID.match(profiel_id):
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "ongeldig id"})
        bestand = map_ / f"{profiel_id}.json"

        if methode == "GET":
            if not bestand.exists():
                return self.stuur_json(HTTPStatus.NOT_FOUND, {"fout": "profiel niet gevonden"})
            return self.stuur_json(HTTPStatus.OK, json.loads(bestand.read_text("utf-8")))

        if methode == "DELETE":
            bestand.unlink(missing_ok=True)
            return self.stuur_json(HTTPStatus.NO_CONTENT)

        lengte = int(self.headers.get("Content-Length") or 0)
        if lengte > MAX_GROOTTE:
            return self.stuur_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"fout": "te groot"})
        try:
            profiel = json.loads(self.rfile.read(lengte))
        except ValueError:
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "geen geldige JSON"})
        if not isinstance(profiel, dict) or profiel.get("id") != profiel_id:
            return self.stuur_json(HTTPStatus.BAD_REQUEST, {"fout": "id klopt niet"})
        tijdelijk = bestand.with_suffix(".tmp")
        tijdelijk.write_text(json.dumps(profiel, ensure_ascii=False), "utf-8")
        tijdelijk.replace(bestand)
        return self.stuur_json(HTTPStatus.OK, profiel)


def maak_server(poort, data, frontend):
    server = ThreadingHTTPServer(("", poort), partial(Handler, directory=str(frontend)))
    server.data = Path(data)
    return server


if __name__ == "__main__":
    standaard_frontend = Path(__file__).resolve().parent.parent / "frontend"
    server = maak_server(
        int(os.environ.get("WIEBELS_POORT", "8765")),
        os.environ.get("WIEBELS_DATA", "/data"),
        os.environ.get("WIEBELS_FRONTEND", standaard_frontend),
    )
    print(f"De Wiebels draait op poort {server.server_port}", flush=True)
    server.serve_forever()
