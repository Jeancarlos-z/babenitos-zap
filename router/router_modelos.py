import os
import json
from io import BytesIO
from email.parser import BytesParser
from email.policy import default
from backend.controllers.modelo_controller import (
    listar_modelos,
    obtener_modelo_por_id,
    crear_modelo,
    actualizar_modelo,
    eliminar_modelo
)


UPLOAD_DIR = "static/img/modelos"

def handle_modelo_routes(handler):
    if handler.path == "/modelos" and handler.command == "GET":
        modelos = listar_modelos()
        return send_json(handler, modelos)

    elif handler.path.startswith("/modelos/") and handler.command == "GET":
        try:
            modelo_id = int(handler.path.split("/")[-1])
            modelo = obtener_modelo_por_id(modelo_id)
            if modelo:
                return send_json(handler, modelo)
            else:
                handler.send_error(404, "Modelo no encontrado")
                return True
        except ValueError:
            handler.send_error(400, "ID inválido")
            return True

    elif handler.path == "/modelos" and handler.command == "POST":
        content_type = handler.headers.get("Content-Type", "")
        if "multipart/form-data" in content_type:
            modelo, imagen_filename = parse_multipart(handler, content_type)
            crear_modelo(modelo, imagen_filename)
            return send_json(handler, {"mensaje": "Modelo creado"})
        else:
            handler.send_error(400, "Formato no soportado")
            return True

    elif handler.path.startswith("/modelos/") and handler.command == "PUT":
        try:
            modelo_id = int(handler.path.split("/")[-1])
            content_type = handler.headers.get("Content-Type", "")
            if "multipart/form-data" in content_type:
                modelo, imagen_filename = parse_multipart(handler, content_type)
                actualizar_modelo(modelo_id, modelo, imagen_filename)
                return send_json(handler, {"mensaje": "Modelo actualizado"})
            else:
                handler.send_error(400, "Formato no soportado")
                return True
        except ValueError:
            handler.send_error(400, "ID inválido")
            return True

    elif handler.path.startswith("/modelos/") and handler.command == "DELETE":
        try:
            modelo_id = int(handler.path.split("/")[-1])
            eliminar_modelo(modelo_id)
            return send_json(handler, {"mensaje": "Modelo eliminado"})
        except ValueError:
            handler.send_error(400, "ID inválido")
            return True

    return False

def send_json(handler, data):
    handler.send_response(200)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode())
    return True

def parse_multipart(handler, content_type):
    boundary = content_type.split("boundary=")[-1].encode()
    content_length = int(handler.headers.get("Content-Length", 0))
    body = handler.rfile.read(content_length)

    # Preparar para analizar el cuerpo
    parser = BytesParser(policy=default)
    full_body = b"Content-Type: multipart/form-data; boundary=" + boundary + b"\r\nMIME-Version: 1.0\r\n\r\n" + body
    msg = parser.parsebytes(full_body)

    modelo = {
        "categoria": "",
        "material": "",
        "colorPlanta": "",
        "colorModelo": "",
        "genero": ""
    }
    imagen_filename = None

    for part in msg.iter_parts():
        disposition = part.get("Content-Disposition", "")
        if "form-data" not in disposition:
            continue

        name = part.get_param("name", header="content-disposition")
        if name in modelo:
            modelo[name] = part.get_content().strip()
        elif name == "imagen":
            filename = part.get_param("filename", header="content-disposition")
            if filename:
                if not os.path.exists(UPLOAD_DIR):
                    os.makedirs(UPLOAD_DIR)
                imagen_filename = filename.replace(" ", "_")
                filepath = os.path.join(UPLOAD_DIR, imagen_filename)
                with open(filepath, "wb") as f:
                    f.write(part.get_content())

    return modelo, imagen_filename
