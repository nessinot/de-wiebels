"""Maakt de stem van de Wiebel en de muziek per thema met ElevenLabs.

Gebruik (vanuit de root van de repo):
    ELEVENLABS_API_KEY=... python tools/maak-stemmen.py

- Stem: leest alle zinnen uit de-wiebels/frontend/js/zinnen.js en maakt per zin een mp3 in
  de-wiebels/frontend/geluid/stem/. Voor elke zin binnen een tekst komt de tag [excited], alleen
  bij het versturen (zinnen.js en het manifest blijven zonder tag). Alleen ontbrekende of gewijzigde
  zinnen worden opnieuw gemaakt; een andere stem, model of tag maakt alles opnieuw. Zinnen die niet
  meer bestaan, gaan weg.
- Muziek: per thema één zacht muziekje in de-wiebels/frontend/geluid/muziek/, alleen als het
  ontbreekt of als de beschrijving is veranderd.

De sleutel komt alleen uit de omgevingsvariabele en wordt nooit getoond of opgeslagen.
Alleen de standaardbibliotheek.
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

# De stem: "Roos" uit de stemmenbibliotheek van ElevenLabs (Nederlands, jong, vrolijk en warm).
STEM_ID = "7qdUFMklKPaaAVMsBTBt"
# Model dat Nederlands goed uitspreekt en tags voor de toon begrijpt.
MODEL = "eleven_v4"
# Toon van de stem, voor elke zin.
TAG = "[excited]"

STEM_FORMAAT = "mp3_22050_32"  # mono, 32 kbps: klein en goed genoeg voor spraak
MUZIEK_FORMAAT = "mp3_44100_64"
MUZIEK_LENGTE_MS = 40_000

_ZACHT = (
    "Quiet, calm background music for a children's learning game, instrumental only, no vocals, "
    "no drums, slow tempo, gentle and friendly, seamless loop that ends the way it begins. "
)
MUZIEK = {
    "ruimte": _ZACHT + "Space theme: soft dreamy synth pads, twinkling bells and a light music box melody.",
    "magisch-bos": _ZACHT + "Magical forest theme: soft harp, gentle flute and a little celesta.",
    "dino-eiland": _ZACHT + "Playful tropical island theme: soft marimba, light ukulele and shakers.",
    "onderwater": _ZACHT + "Underwater theme: mellow vibraphone, bubbly soft synth and warm pads.",
    "dierenopvang": _ZACHT + "Cosy animal shelter theme: soft acoustic guitar, glockenspiel and pizzicato strings.",
}

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "de-wiebels" / "frontend"
ZINNEN_JS = FRONTEND / "js" / "zinnen.js"
STEM_MAP = FRONTEND / "geluid" / "stem"
MUZIEK_MAP = FRONTEND / "geluid" / "muziek"
API = "https://api.elevenlabs.io"

# { id: 'goed-1', tekst: 'Goed zo!' }, met enkele of dubbele aanhalingstekens.
_ZIN = re.compile(r"""\{\s*id:\s*'([a-z0-9-]+)',\s*tekst:\s*(['"])((?:\\.|(?!\2).)*)\2\s*\}""")


def lees_zinnen(bron):
    """Alle zinnen uit de broncode van zinnen.js als { id: tekst }, in volgorde."""
    zinnen = {}
    for m in _ZIN.finditer(bron):
        zin_id, tekst = m.group(1), re.sub(r"\\(.)", r"\1", m.group(3))
        if zin_id in zinnen:
            raise ValueError(f"dubbele zin-id: {zin_id}")
        zinnen[zin_id] = tekst
    return zinnen


def met_tag(tekst):
    """De tekst met TAG voor elke zin (een zin eindigt op . ! ? of … gevolgd door een spatie)."""
    return " ".join(f"{TAG} {zin}" for zin in re.split(r"(?<=[.!?…]) +", tekst.strip()))


def andere_stem(manifest):
    return (manifest.get("stem"), manifest.get("model"), manifest.get("tag")) != (STEM_ID, MODEL, TAG)


def te_maken(zinnen, manifest, bestaat):
    """De id's die (opnieuw) gemaakt moeten worden. bestaat(bestand) zegt of het bestand er is."""
    alles = andere_stem(manifest)
    oud = manifest.get("zinnen", {})
    return [
        zin_id for zin_id, tekst in zinnen.items()
        if alles or oud.get(zin_id, {}).get("tekst") != tekst or not bestaat(oud[zin_id]["bestand"])
    ]


class ApiFout(Exception):
    pass


def vraag(sleutel, pad, inhoud):
    verzoek = urllib.request.Request(
        API + pad,
        data=json.dumps(inhoud).encode("utf-8"),
        method="POST",
        headers={"xi-api-key": sleutel, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    try:
        with urllib.request.urlopen(verzoek, timeout=600) as antwoord:
            return antwoord.read()
    except urllib.error.HTTPError as fout:
        # Alleen de foutcode en de uitleg van de API; nooit de headers van het verzoek.
        raise ApiFout(f"HTTP {fout.code}: {fout.read().decode('utf-8', 'replace')[:500]}") from None
    except urllib.error.URLError as fout:
        raise ApiFout(f"geen verbinding: {fout.reason}") from None


def lees_json(pad, standaard):
    return json.loads(pad.read_text("utf-8")) if pad.exists() else standaard


def schrijf_json(pad, inhoud):
    pad.write_text(json.dumps(inhoud, ensure_ascii=False, indent=1, sort_keys=True) + "\n", "utf-8")


def maak_stemmen(sleutel):
    zinnen = lees_zinnen(ZINNEN_JS.read_text("utf-8"))
    STEM_MAP.mkdir(parents=True, exist_ok=True)
    pad_manifest = STEM_MAP / "manifest.json"
    manifest = lees_json(pad_manifest, {})
    lijst = te_maken(zinnen, manifest, lambda bestand: (STEM_MAP / bestand).exists())
    if andere_stem(manifest):
        manifest = {"stem": STEM_ID, "model": MODEL, "tag": TAG, "zinnen": {}}
    oud = manifest.setdefault("zinnen", {})

    # Zinnen die niet meer in zinnen.js staan, gaan weg.
    for zin_id in [z for z in oud if z not in zinnen]:
        (STEM_MAP / oud.pop(zin_id)["bestand"]).unlink(missing_ok=True)
    schrijf_json(pad_manifest, manifest)

    print(f"Stem: {len(zinnen)} zinnen, {len(lijst)} te maken.")
    mislukt = []
    for i, zin_id in enumerate(lijst, 1):
        try:
            data = vraag(sleutel, f"/v1/text-to-speech/{STEM_ID}?output_format={STEM_FORMAAT}",
                         {"text": met_tag(zinnen[zin_id]), "model_id": MODEL})
        except ApiFout as fout:
            # Eén zin die niet lukt, houdt de rest niet tegen; in het spel krijgt die de letters.
            print(f"  {i}/{len(lijst)} {zin_id}: NIET GELUKT ({fout})")
            mislukt.append(zin_id)
            continue
        bestand = f"{zin_id}.mp3"
        (STEM_MAP / bestand).write_bytes(data)
        oud[zin_id] = {"tekst": zinnen[zin_id], "bestand": bestand}
        schrijf_json(pad_manifest, manifest)
        print(f"  {i}/{len(lijst)} {zin_id}: {zinnen[zin_id]}")
    return mislukt


def maak_muziek(sleutel):
    MUZIEK_MAP.mkdir(parents=True, exist_ok=True)
    pad_manifest = MUZIEK_MAP / "manifest.json"
    manifest = lees_json(pad_manifest, {})
    for thema, beschrijving in MUZIEK.items():
        bestand = f"{thema}.mp3"
        wens = {"beschrijving": beschrijving, "lengte_ms": MUZIEK_LENGTE_MS, "bestand": bestand}
        if manifest.get(thema) == wens and (MUZIEK_MAP / bestand).exists():
            continue
        print(f"Muziek: {thema} maken...")
        try:
            data = vraag(sleutel, f"/v1/music?output_format={MUZIEK_FORMAAT}", {
                "prompt": beschrijving,
                "music_length_ms": MUZIEK_LENGTE_MS,
                "model_id": "music_v1",
                "force_instrumental": True,
            })
        except ApiFout as fout:
            print(f"Muziek is niet gelukt ({fout}). Verder zonder muziek.")
            return
        (MUZIEK_MAP / bestand).write_bytes(data)
        manifest[thema] = wens
        schrijf_json(pad_manifest, manifest)
    print(f"Muziek: {len(manifest)} thema's klaar.")


def main():
    sleutel = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not sleutel:
        sys.exit("Zet eerst de omgevingsvariabele ELEVENLABS_API_KEY.")
    mislukt = maak_stemmen(sleutel)
    maak_muziek(sleutel)
    if mislukt:
        sys.exit(f"Deze zinnen hebben nog geen stem: {', '.join(mislukt)}")


if __name__ == "__main__":
    main()
