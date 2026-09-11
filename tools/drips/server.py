"""Sirve render.html y acepta POST /save?name=... para escribir cada cuadro a frames/.

Se corre a mano cuando hay que regenerar las bolsas:  python server.py
y despues se abre http://127.0.0.1:4190/render.html?render=36
"""
import http.server, socketserver, os, urllib.parse

RAIZ = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(RAIZ, "frames")
os.makedirs(SALIDA, exist_ok=True)
PORT = 4190


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        if u.path != "/save":
            self.send_error(404); return
        q = urllib.parse.parse_qs(u.query)
        nombre = (q.get("name") or ["frame"])[0]
        nombre = os.path.basename(nombre)
        n = int(self.headers.get("Content-Length", 0))
        datos = self.rfile.read(n)
        with open(os.path.join(SALIDA, nombre), "wb") as f:
            f.write(datos)
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", "2")
        self.end_headers()
        self.wfile.write(b"ok")

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, *a):
        pass


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), H) as s:
    print(f"listo en http://127.0.0.1:{PORT}/  -> guarda en {SALIDA}")
    s.serve_forever()
