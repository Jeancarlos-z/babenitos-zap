def handle_dashboard_routes(handler):
    if handler.path == "/dashboard" and handler.command == "GET":
        rol = handler.server.user_session.get("rol", "")
        nombre = handler.server.user_session.get("nombre", "")
        send_dashboard(handler, "frontend/templates/dashboard.html", rol, nombre)
        return True
    return False


def send_dashboard(handler, filepath, rol, nombre):
    import os
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            contenido = f.read()

        contenido = contenido.replace("{{ROL_OPCIONES}}", generar_opciones_por_rol(rol))
        contenido = contenido.replace("{{NOMBRE_USUARIO}}", nombre)
        contenido = contenido.replace("{{ROL_NOMBRE}}", rol)

        handler.send_response(200)
        handler.send_header("Content-Type", "text/html")
        handler.end_headers()
        handler.wfile.write(contenido.encode())
    else:
        handler.send_error(404, f"Archivo HTML no encontrado: {filepath}")




def generar_opciones_por_rol(rol):
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
