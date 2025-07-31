import json
from ..models import problema_model


def get_all():
    datos = problema_model.listar_problemas()
    return json.dumps(datos, default=str)

def get_one(id):
    dato = problema_model.obtener_problema(id)
    return json.dumps(dato, default=str) if dato else '{}'

def create(data):
    problema_model.insertar_problema(data)
    return json.dumps({"mensaje": "Problema registrado"})

def update(id, data):
    problema_model.actualizar_problema(id, data)
    return json.dumps({"mensaje": "Problema actualizado"})

def delete(id):
    problema_model.eliminar_problema(id)
    return json.dumps({"mensaje": "Problema eliminado"})

