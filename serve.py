"""Local dev server that resolves extensionless URLs the way Netlify does.

Netlify serves /submit from submit.html automatically. Python's stock
http.server does not, so previewing locally would 404 on every nav link.
This keeps local behaviour identical to production.
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4321


class PrettyURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        if not os.path.exists(local) and not os.path.splitext(local)[1]:
            candidate = local.rstrip(os.sep) + ".html"
            if os.path.isfile(candidate):
                return candidate
        return local

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PrettyURLHandler)
    server.daemon_threads = True
    server.serve_forever()
