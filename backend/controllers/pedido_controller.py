import json
from backend.models import pedido_model

def listar_pedidos():
    pedidos = pedido_model.listar_pedidos()
    return pedidos  # ✅ devuelve objeto Python (correcto)

def obtener_pedido(pedido_id):
    pedido = pedido_model.obtener_pedido(pedido_id)
    return pedido  # ✅ CORREGIDO: antes decía 'return pedidos'

def crear_pedido(body):
    try:
        data = json.loads(body)
        pedido_id = pedido_model.crear_pedido(data)
        return {"mensaje": "Pedido creado", "id": pedido_id}
    except Exception as e:
        return {"error": str(e)}

def actualizar_pedido(pedido_id, body):
    try:
        data = json.loads(body)
        pedido_model.actualizar_pedido(pedido_id, data)
        return {"mensaje": "Pedido actualizado"}
    except Exception as e:
        return {"error": str(e)}

def eliminar_pedido(pedido_id):
    try:
        pedido_model.eliminar_pedido(pedido_id)
        return {"mensaje": "Pedido eliminado"}
    except Exception as e:
        return {"error": str(e)}
