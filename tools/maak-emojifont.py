"""Maakt het kleuren-emojilettertype van het spel: een uitsnede van Noto Color Emoji (COLRv1).

Gebruik (vanuit de root van de repo, in een venv buiten de repo):
    python -m venv <venv>
    <venv>/bin/pip install fonttools brotli regex
    <venv>/bin/python tools/maak-emojifont.py <pad>/Noto-COLRv1.ttf <pad>/LICENSE

Noto-COLRv1.ttf en LICENSE komen uit 2D/fonts/ van github.com/googlefonts/noto-emoji.

Het script verzamelt alle emoji (ook met variatiekiezer en ZWJ-reeksen) uit de-wiebels/frontend/js
en index.html en schrijft naar de-wiebels/frontend/fonts/:
- wiebel-emoji.woff2: alleen de tekens van die emoji, zonder cijfers, letters, #, * of spatie;
- emoji.json: de gevonden emoji (tests/emojifont.test.js controleert dat de lijst bijblijft);
- OFL.txt: de licentie van het lettertype.

Een teken zonder variatiekiezer dat standaard als tekst wordt getoond (zoals ▶ in "Verder ▶")
telt niet als emoji en blijft in het systeemlettertype.

Bouwhulpmiddel: fonttools, brotli en regex horen niet in de image.
"""

import json
import sys
from pathlib import Path

import regex
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "de-wiebels" / "frontend"
UIT = FRONTEND / "fonts"
NAAM = "Wiebel Emoji"

# Eén emoji: een teken dat standaard als emoji wordt getoond, of een pictogram met variatiekiezer 16;
# eventueel met ZWJ aan elkaar geregen. Dezelfde regel staat in tests/emojifont.test.js.
_DEEL = r"(?:\p{Extended_Pictographic}️|\p{Emoji_Presentation})"
EMOJI = regex.compile(_DEEL + r"(?:‍" + _DEEL + r")*")


def bronbestanden():
    return sorted((FRONTEND / "js").rglob("*.js")) + [FRONTEND / "index.html"]


def verzamel(teksten):
    """Alle verschillende emoji in de teksten, gesorteerd."""
    return sorted({e for tekst in teksten for e in EMOJI.findall(tekst)})


def tekens(emoji):
    """De codepunten van de emoji. Spatie, cijfers, letters, # en * zitten er nooit in."""
    return sorted({ord(c) for e in emoji for c in e if ord(c) > 0x7F})


def maak(noto, licentie):
    emoji = verzamel(b.read_text("utf-8") for b in bronbestanden())
    codepunten = tekens(emoji)

    font = TTFont(noto)
    opties = subset.Options()
    opties.flavor = "woff2"
    opties.layout_features = ["*"]  # o.a. de ligaturen voor ZWJ-reeksen
    opties.name_IDs = ["*"]
    opties.notdef_outline = False
    s = subset.Subsetter(opties)
    s.populate(unicodes=codepunten)
    s.subset(font)

    cmap = font.getBestCmap()
    ascii_ = [chr(c) for c in cmap if c < 0x80]
    if ascii_:
        sys.exit(f"Gewone tekens in het lettertype: {ascii_}")
    ontbreekt = [e for e in emoji if any(ord(c) not in cmap for c in e if c not in "️")]
    if ontbreekt:
        sys.exit(f"Niet in Noto: {' '.join(ontbreekt)}")

    UIT.mkdir(parents=True, exist_ok=True)
    pad = UIT / "wiebel-emoji.woff2"
    font.save(pad)
    copyright_ = next(r.toUnicode() for r in TTFont(noto)["name"].names if r.nameID == 0)
    (UIT / "OFL.txt").write_text(
        f"{copyright_}\n\nDe Wiebels gebruikt een uitsnede van Noto Color Emoji onder de naam "
        f"\"{NAAM}\" (tools/maak-emojifont.py).\n\n" + Path(licentie).read_text("utf-8"),
        "utf-8",
    )
    (UIT / "emoji.json").write_text(json.dumps(emoji, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"{len(emoji)} emoji, {len(codepunten)} tekens, {pad.stat().st_size // 1024} kB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Gebruik: python tools/maak-emojifont.py <Noto-COLRv1.ttf> <LICENSE>")
    maak(sys.argv[1], sys.argv[2])
