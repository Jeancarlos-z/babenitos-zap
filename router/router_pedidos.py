from backend.controllers import pedido_controller
from urllib.parse import parse_qs
import re

def handle_pedido_routes(self):
    path = self.path
    method = self.command

    if path == "/pedidos":
        if method == "GET":
            data = pedido_controller.listar_pedidos()
            self.send_json(data)  # ← ya convierte a JSON correctamente
            return True

        elif method == "POST":
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode("utf-8")
            data = pedido_controller.crear_pedido(body)
            self.send_json(data)
            return True

    match = re.match(r"^/pedidos/(\d+)$", path)
    if match:
        pedido_id = int(match.group(1))

        if method == "GET":
            data = pedido_controller.obtener_pedido(pedido_id)
            self.send_json(data)
            return True

        elif method == "PUT":
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode("utf-8")
            data = pedido_controller.actualizar_pedido(pedido_id, body)
            self.send_json(data)
            return True

        elif method == "DELETE":
            data = pedido_controller.eliminar_pedido(pedido_id)
            self.send_json(data)
            return True

    return False
