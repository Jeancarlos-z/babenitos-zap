from backend.controllers.cliente_controller import (
    listar_clientes,
    obtener_cliente_por_id,
    crear_cliente,
    actualizar_cliente,
    eliminar_cliente
)
import json

def handle_cliente_routes(handler):
    if handler.path == "/clientes" and handler.command == "GET":
        clientes = listar_clientes()
        return send_json(handler, clientes)

    elif handler.path.startswith("/clientes/") and handler.command == "GET":
        try:
            cliente_id = int(handler.path.split("/")[-1])
            cliente = obtener_cliente_por_id(cliente_id)
            if cliente:
                return send_json(handler, cliente)
            else:
                handler.send_error(404, "Cliente no encontrado")
                return True
        except ValueError:
            handler.send_error(400, "ID inválido")
            return True

    elif handler.path == "/clientes" and handler.command == "POST":
        length = int(handler.headers["Content-Length"])
        data = json.loads(handler.rfile.read(length))
        crear_cliente(data)
        return send_json(handler, {"mensaje": "Cliente creado correctamente"})

    elif handler.path.startswith("/clientes/") and handler.command == "PUT":
        try:
            cliente_id = int(handler.path.split("/")[-1])
            length = int(handler.headers["Content-Length"])
            data = json.loads(handler.rfile.read(length))
            actualizar_cliente(cliente_id, data)
            return send_json(handler, {"mensaje": "Cliente actualizado"})
        except ValueError:
            handler.send_error(400, "ID inválido")
            return True

    elif handler.path.startswith("/clientes/") and handler.command == "DELETE":
        try:
            cliente_id = int(handler.path.split("/")[-1])
            eliminar_cliente(cliente_id)
            return send_json(handler, {"mensaje": "Cliente eliminado"})
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
