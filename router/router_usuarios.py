from backend.controllers.usuario_controller import (
    listar_usuarios,
    obtener_usuario_por_id,
    crear_usuario,
    actualizar_usuario,
    eliminar_usuario
)
import json

def handle_usuario_routes(handler):
    if handler.path == "/usuarios" and handler.command == "GET":
        usuarios = listar_usuarios()
        send_json(handler, usuarios)
        return True

    elif handler.path.startswith("/usuarios/") and handler.command == "GET":
        try:
            user_id = int(handler.path.split("/")[-1])
            usuario = obtener_usuario_por_id(user_id)
            if usuario:
                send_json(handler, usuario)
            else:
                handler.send_error(404, "Usuario no encontrado")
        except ValueError:
            handler.send_error(400, "ID inválido")
        return True

    elif handler.path == "/usuarios" and handler.command == "POST":
        content_length = int(handler.headers["Content-Length"])
        data = handler.rfile.read(content_length).decode()
        usuario_data = json.loads(data)
        crear_usuario(usuario_data)
        send_json(handler, {"mensaje": "Usuario creado"})
        return True

    elif handler.path.startswith("/usuarios/") and handler.command == "PUT":
        user_id = int(handler.path.split("/")[-1])
        content_length = int(handler.headers["Content-Length"])
        data = handler.rfile.read(content_length).decode()
        usuario_data = json.loads(data)
        actualizar_usuario(user_id, usuario_data)
        send_json(handler, {"mensaje": "Usuario actualizado"})
        return True

    elif handler.path.startswith("/usuarios/") and handler.command == "DELETE":
        user_id = int(handler.path.split("/")[-1])
        eliminar_usuario(user_id)
        send_json(handler, {"mensaje": "Usuario eliminado"})
        return True

    return False

def send_json(handler, data):
    handler.send_response(200)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode())