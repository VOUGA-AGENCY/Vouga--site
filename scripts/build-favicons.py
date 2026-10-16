"""Generate correctly sized browser icons from the existing Vouga artwork."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Image.open(root / "assets/img/favicon.png").convert("RGBA")
for name, size in (
    ("favicon-96x96.png", 96),
    ("apple-touch-icon.png", 180),
    ("web-app-manifest-192x192.png", 192),
    ("web-app-manifest-512x512.png", 512),
):
    source.resize((size, size), Image.Resampling.LANCZOS).save(root / name)
source.save(root / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
