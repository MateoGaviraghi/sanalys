"""
Post-proceso de los cuadros del generador.

Recorta, redimensiona, codifica a AVIF y escribe web/public/img/drips/ + SOURCES.md.

La caja de recorte es COMUN a los 288 cuadros, no una por cuadro: con una caja por cuadro
la bolsa cambia de tamano y de posicion al girar y al pasar de un suero a otro, y el giro
salta. Una sola caja para todo el set es lo que hace que la rotacion se lea continua.

Uso:  python server.py            (en otra consola)
      abrir http://127.0.0.1:4190/render.html?render=36
      python process.py
"""
import json, os, glob, shutil
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

AQUI = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(AQUI, "frames")
DESTINO = os.path.abspath(os.path.join(AQUI, "..", "..", "web", "public", "img", "drips"))
ANCHO = 760          # ancho de salida; el alto sale de la caja comun
CALIDAD = 58         # AVIF
PAD = 14

datos = json.load(open(os.path.join(AQUI, "drips.json"), encoding="utf-8"))
drips = datos["drips"]

archivos = sorted(glob.glob(os.path.join(FRAMES, "*.png")))
if not archivos:
    raise SystemExit("no hay cuadros en frames/ — corre el render primero")

print(f"leyendo {len(archivos)} cuadros…")
caja = None
for f in archivos:
    b = Image.open(f).convert("RGBA").getchannel("A").getbbox()
    if not b:
        continue
    caja = b if caja is None else (min(caja[0], b[0]), min(caja[1], b[1]), max(caja[2], b[2]), max(caja[3], b[3]))
caja = (max(0, caja[0] - PAD), max(0, caja[1] - PAD), caja[2] + PAD, caja[3] + PAD)
cw, ch = caja[2] - caja[0], caja[3] - caja[1]
salida = (ANCHO, round(ANCHO * ch / cw))
print(f"caja comun {cw}x{ch} -> salida {salida[0]}x{salida[1]}")

os.makedirs(DESTINO, exist_ok=True)
for viejo in glob.glob(os.path.join(DESTINO, "*.avif")) + glob.glob(os.path.join(DESTINO, "*.webp")):
    os.remove(viejo)

filas, total = [], 0
for d in drips:
    cuadros = sorted(glob.glob(os.path.join(FRAMES, f"{d['slug']}-*.png")))
    if not cuadros:
        print(f"  ! faltan cuadros de {d['slug']}")
        continue
    bytes_drip = 0
    for i, f in enumerate(cuadros):
        im = Image.open(f).convert("RGBA").crop(caja).resize(salida, Image.LANCZOS)
        p = os.path.join(DESTINO, f"{d['slug']}-{i:02d}.avif")
        im.save(p, quality=CALIDAD)
        bytes_drip += os.path.getsize(p)
        if i == 0:  # el cuadro 0 tambien en WebP: es la imagen fija y no puede fallar nunca
            pw = os.path.join(DESTINO, f"{d['slug']}-00.webp")
            im.save(pw, quality=82, method=6)
            bytes_drip += os.path.getsize(pw)
    total += bytes_drip
    filas.append((d, len(cuadros), bytes_drip))
    print(f"  {d['n']} {d['slug']:24s} {len(cuadros):3d} cuadros  {bytes_drip/1024:7.0f} KB")

print(f"\nTOTAL {total/1048576:.2f} MB en {DESTINO}")

L = []
L.append("# `web/public/img/drips/` — las ocho bolsas, generadas\n")
L.append("No son fotografias ni imagenes de banco: son **renders propios**. No existe archivo")
L.append("fuente de la marca (G-044), asi que las bolsas no se piden ni se recortan — se construyen.\n")
L.append("Generador: `tools/drips/`. Se regeneran corriendo `server.py`, abriendo")
L.append("`render.html?render=36` y despues `process.py`. La unica fuente de datos es")
L.append("`tools/drips/drips.json`, cuyos nombres, bajadas y grounds salen del manual de")
L.append("identidad p.28.\n")
L.append(f"Salida: **{salida[0]} x {salida[1]}**, AVIF calidad {CALIDAD}. Caja de recorte comun a los")
L.append("288 cuadros — con una caja por cuadro, la bolsa salta al girar.\n")
L.append("El cuadro `-00` es la vista de frente: es la imagen fija del suero, va tambien en WebP")
L.append("y es la unica que se descarga de entrada. Los otros 35 entran solo si se gira.\n")
L.append("| # | Suero | Ground etiqueta | Liquido | Cuadros | Peso |")
L.append("|---|---|---|---|---|---|")
for d, n, b in filas:
    liq = d["liquido"] + (" *(propuesto)*" if d.get("propuesto") else "")
    L.append(f"| {d['n']} | {' '.join(d['nombre'])} | `{d['ground']}` | `{liq}` | {n} | {b/1024:.0f} KB |")
L.append("")
L.append(f"Total en disco **{total/1048576:.2f} MB**. Costo real de una visita: los 8 cuadro-0")
L.append(f"({sum(os.path.getsize(os.path.join(DESTINO, d['slug'] + '-00.avif')) for d, _, _ in filas)/1024:.0f} KB), y los cuadros del suero que el visitante decida girar.\n")
L.append("**Colores de liquido**: 01 a 06 estan muestreados de los renders del manual (p.26 y p.27).")
L.append("Los de 07 y 08 no existen en ninguna fuente y los propone este proyecto — marcados arriba.")
L.append("Si alguna vez aparece un valor de marca para esos dos, manda el de marca.\n")
open(os.path.join(DESTINO, "SOURCES.md"), "w", encoding="utf-8").write("\n".join(L))
print("SOURCES.md escrito")
