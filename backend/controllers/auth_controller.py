from backend.utils.db_connection import get_connection

def verificar_login(usuario, contrasena):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT u.*, r.nombre AS rol
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.usuario = %s AND u.activo = TRUE
    """
    cursor.execute(query, (usuario,))
    resultado = cursor.fetchone()

    cursor.close()
    conn.close()

    if resultado and resultado["contrasena"] == contrasena:
        return {
            "id": resultado["id"],
            "nombre": resultado["nombre_completo"],
            "rol": resultado["rol"]
        }
    else:
        return None
