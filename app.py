from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs
import os
import json

# Importación de routers
from router.router_login import handle_login_routes
from router.router_usuarios import handle_usuario_routes
from router.router_clientes import handle_cliente_routes  # si ya lo tienes
from router.router_dashboard import handle_dashboard_routes
from router.router_modelos import handle_modelo_routes
from router.router_pedidos import handle_pedido_routes
from router.router_panel import handle_panel_routes
from router.router_problemas import handle_problema_routes



user_session = {}  # Sesión básica

class RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if handle_login_routes(self): return
        if handle_dashboard_routes(self): return
        if handle_panel_routes(self): return
        if handle_usuario_routes(self): return
        if handle_cliente_routes(self): return
        if handle_modelo_routes(self): return
        if handle_pedido_routes(self): return
        if handle_problema_routes(self): return 



        if self.path.startswith("/static/"):
            self.serve_static(self.path[1:])

        elif self.path.endswith(".html"):
            self.send_html(self.path.lstrip("/"))
        else:
            self.send_error(404, "Ruta GET no encontrada")

    def do_POST(self):
        if handle_login_routes(self): return
        if handle_usuario_routes(self): return
        if handle_cliente_routes(self): return
        if handle_modelo_routes(self): return
        if handle_pedido_routes(self): return
        if handle_problema_routes(self): return 

        self.send_error(404, "Ruta POST no encontrada")

    def do_PUT(self):
        if handle_usuario_routes(self): return
        if handle_cliente_routes(self): return
        if handle_modelo_routes(self): return
        if handle_pedido_routes(self): return
        if handle_problema_routes(self): return 

        self.send_error(404, "Ruta PUT no encontrada")

    def do_DELETE(self):
        if handle_usuario_routes(self): return
        if handle_cliente_routes(self): return
        if handle_modelo_routes(self): return
        if handle_pedido_routes(self): return
        if handle_problema_routes(self): return 
        

        self.send_error(404, "Ruta DELETE no encontrada")

    # Funciones comunes
    def send_html(self, filepath, error_message="", rol=""):
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                contenido = f.read()

            if filepath.endswith("login.html"):
                contenido = contenido.replace("{{ERROR}}", f"<p class='text-danger text-center'>{error_message}</p>")


            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(contenido.encode())
        else:
            self.send_error(404, f"Archivo HTML no encontrado: {filepath}")

    def send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def serve_static(self, relative_path):
        local_path = os.path.join(os.getcwd(), relative_path.replace("/", os.sep))
        if os.path.exists(local_path):
            ext = relative_path.split(".")[-1]
            content_types = {
                "css": "text/css",
                "js": "application/javascript",
                "png": "image/png",
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "svg": "image/svg+xml"
            }
            content_type = content_types.get(ext, "application/octet-stream")
            with open(local_path, "rb") as f:
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.end_headers()
                self.wfile.write(f.read())
        else:
            self.send_error(404, f"Archivo estático no encontrado: {relative_path}")

    def generar_opciones_por_rol(self, rol):
        opciones = {
            "Gerente": ["Panel", "Pedido", "Cliente", "Modelo", "Usuario", "Reporte"],
            "Producción": ["Pedido", "Problema"],
            "Área": ["Estado"]
        }
        items = opciones.get(rol, [])
        return "".join(f'''
            <li class="nav-item">
                <a class="nav-link text-white" href="#" data-seccion="{item.lower()}">{item}</a>
            </li>
        ''' for item in items)


# Iniciar servidor
if __name__ == "__main__":
    puerto = 8000
    servidor = ThreadingHTTPServer(("0.0.0.0", puerto), RequestHandler)
    servidor.user_session = user_session

    print(f"🚀 Servidor ejecutándose en http://localhost:{puerto}")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido con Ctrl+C")
        servidor.server_close()
