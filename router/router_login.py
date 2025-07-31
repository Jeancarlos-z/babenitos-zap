from backend.controllers.auth_controller import verificar_login
from urllib.parse import parse_qs
import os

def handle_login_routes(handler):
    # Aceptar también la raíz ("/") además de "/login"
    if (handler.path == "/" or handler.path.startswith("/login")) and handler.command == "GET":
        error_message = ""
        if "?" in handler.path and "error=1" in handler.path:
            error_message = "⚠️ Completa todos los campos."
        elif "?" in handler.path and "error=2" in handler.path:
            error_message = "❌ Credenciales inválidas."
        send_html(handler, "frontend/templates/login.html", error_message)
        return True

    elif handler.path == "/login" and handler.command == "POST":
        content_length = int(handler.headers["Content-Length"])
        post_data = handler.rfile.read(content_length).decode()
        data = parse_qs(post_data)

        usuario = data.get("usuario", [""])[0]
        contrasena = data.get("contrasena", [""])[0]

        if not usuario or not contrasena:
            redirect(handler, "/login?error=1")
            return True

        user = verificar_login(usuario, contrasena)
        if user:
            handler.server.user_session["rol"] = user["rol"]
            handler.server.user_session["nombre"] = user["nombre"]
            redirect(handler, "/dashboard")
        else:
            redirect(handler, "/login?error=2")
        return True

    return False


def redirect(handler, location):
    handler.send_response(302)
    handler.send_header("Location", location)
    handler.end_headers()


def send_html(handler, filepath, error_message=""):
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            contenido = f.read()

        if filepath.endswith("login.html"):
            contenido = contenido.replace("{{ERROR}}", f"<p class='text-danger text-center'>{error_message}</p>")

        handler.send_response(200)
        handler.send_header("Content-Type", "text/html")
        handler.end_headers()
        handler.wfile.write(contenido.encode())
    else:
        handler.send_error(404, f"Archivo HTML no encontrado: {filepath}")
