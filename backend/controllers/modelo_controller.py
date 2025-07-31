from backend.models.modelo_model import (
    listar_modelos_db,
    obtener_modelo_db,
    crear_modelo_db,
    actualizar_modelo_db,
    eliminar_modelo_db
)

def listar_modelos():
    return listar_modelos_db()

def obtener_modelo_por_id(id):
    return obtener_modelo_db(id)

def crear_modelo(data, imagen):
    data["imagen"] = imagen
    return crear_modelo_db(data)

def actualizar_modelo(id, data, imagen):
    if imagen:
        data["imagen"] = imagen
    return actualizar_modelo_db(id, data)

def eliminar_modelo(id):
    return eliminar_modelo_db(id)
