import json
from backend.controllers import problema_controller

def handle_problema_routes(handler):
    path = handler.path
    method = handler.command

    if path == "/problemas" and method == "GET":
        data = problema_controller.get_all()
        # handler.send_json(json.loads(data))  # ← Esto está mal
        handler.send_response(200)
        handler.send_header('Content-type', 'application/json')
        handler.end_headers()
        handler.wfile.write(data.encode())  # ← Envía el JSON directamente
        return True

    if path.startswith("/problemas/") and method == "GET":
        id = path.split("/")[-1]
        data = problema_controller.get_one(id)
        handler.send_json(json.loads(data))
        return True

    if path == "/problemas" and method == "POST":
        content_len = int(handler.headers.get("Content-Length", 0))
        body = handler.rfile.read(content_len).decode("utf-8")
        data = json.loads(body)
        result = problema_controller.create(data)
        handler.send_json(json.loads(result))
        return True

    if path.startswith("/problemas/") and method == "PUT":
        id = path.split("/")[-1]
        content_len = int(handler.headers.get("Content-Length", 0))
        body = handler.rfile.read(content_len).decode("utf-8")
        data = json.loads(body)
        result = problema_controller.update(id, data)
        handler.send_json(json.loads(result))
        return True

    if path.startswith("/problemas/") and method == "DELETE":
        id = path.split("/")[-1]
        result = problema_controller.delete(id)
        handler.send_json(json.loads(result))
        return True

    if path == "/areas" and method == "GET":
        from backend.models import problema_model
        handler.send_json(problema_model.obtener_areas())
        return True

    return False
