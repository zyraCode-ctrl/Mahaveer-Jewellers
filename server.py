"""Local web server for the Mahaveer Jewellers site.

Serves the static files and one JSON endpoint, /api/instagram/reels, which reads the
latest Reels from the Instagram Graph API. The access token stays on the server and is
read from environment variables (or a local .env file); it is never sent to the browser.

Run:  python server.py          (then open http://localhost:5510)
"""

import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIELDS = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp"


def load_dotenv(path):
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_dotenv(ROOT / ".env")

ACCESS_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "")
# Set for tokens issued through Facebook Login (Instagram professional account linked to a Page).
# Leave empty for tokens issued through Instagram Login (graph.instagram.com /me).
USER_ID = os.environ.get("INSTAGRAM_USER_ID", "")
GRAPH_VERSION = os.environ.get("INSTAGRAM_GRAPH_VERSION", "v21.0")
CACHE_SECONDS = int(os.environ.get("INSTAGRAM_CACHE_SECONDS", "900"))
PORT = int(os.environ.get("PORT", "5510"))

_cache = {"at": 0.0, "reels": []}
_cache_lock = threading.Lock()


def media_endpoint():
    if USER_ID:
        base = f"https://graph.facebook.com/{GRAPH_VERSION}/{USER_ID}/media"
    else:
        base = f"https://graph.instagram.com/{GRAPH_VERSION}/me/media"
    query = urllib.parse.urlencode({"fields": FIELDS, "limit": 30, "access_token": ACCESS_TOKEN})
    return f"{base}?{query}"


def fetch_reels():
    with urllib.request.urlopen(media_endpoint(), timeout=10) as response:
        items = json.load(response).get("data", [])
    videos = [m for m in items if m.get("media_type") == "VIDEO" and m.get("permalink")]
    videos.sort(key=lambda m: m.get("media_product_type") != "REELS")
    return [
        {
            "id": m["id"],
            "permalink": m["permalink"],
            "caption": (m.get("caption") or "").strip(),
            "thumbnail": m.get("thumbnail_url") or "",
            "video": m.get("media_url") or "",
            "timestamp": m.get("timestamp") or "",
        }
        for m in videos
    ]


def cached_reels():
    with _cache_lock:
        if _cache["reels"] and time.time() - _cache["at"] < CACHE_SECONDS:
            return _cache["reels"]
        reels = fetch_reels()
        _cache.update(at=time.time(), reels=reels)
        return reels


class SiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        url = urllib.parse.urlsplit(self.path)
        if url.path == "/api/instagram/reels":
            self.send_reels(urllib.parse.parse_qs(url.query))
            return
        path = urllib.parse.unquote(url.path)
        if any(part.startswith(".") for part in path.split("/")) or path.endswith(".py"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        super().do_GET()

    def send_reels(self, query):
        if not ACCESS_TOKEN:
            self.send_json(HTTPStatus.SERVICE_UNAVAILABLE, {"configured": False, "reels": []})
            return
        try:
            limit = max(1, min(12, int(query.get("limit", ["5"])[0])))
        except ValueError:
            limit = 5
        try:
            reels = cached_reels()[:limit]
        except (urllib.error.URLError, TimeoutError, ValueError) as error:
            self.log_error("Instagram API request failed: %s", error)
            self.send_json(HTTPStatus.BAD_GATEWAY, {"configured": True, "reels": []})
            return
        self.send_json(HTTPStatus.OK, {"configured": True, "reels": reels}, cache_seconds=300)

    def send_json(self, status, payload, cache_seconds=0):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", f"public, max-age={cache_seconds}" if cache_seconds else "no-store")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    status = "connected" if ACCESS_TOKEN else "not configured (set INSTAGRAM_ACCESS_TOKEN)"
    print(f"Mahaveer Jewellers site on http://localhost:{PORT}  |  Instagram feed: {status}")
    ThreadingHTTPServer(("", PORT), SiteHandler).serve_forever()
