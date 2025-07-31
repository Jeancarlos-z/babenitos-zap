from backend.utils.db_connection import get_connection

def listar_usuarios():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.nombre_completo, u.usuario, u.contrasena, u.rol_id, r.nombre AS rol, u.activo
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        ORDER BY u.id
    """)
    resultado = cursor.fetchall()
    conn.close()
    return resultado


def obtener_usuario_por_id(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.nombre_completo, u.usuario, u.correo, u.contrasena,
               u.rol_id, u.activo, u.direccion, u.dni, u.telefono 
        FROM usuarios u
        WHERE u.id = %s
    """, (id,))
    usuario = cursor.fetchone()
    conn.close()
    return usuario



def crear_usuario(data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO usuarios (
            nombre_completo,
            usuario,
            correo,
            contrasena,
            rol_id,
            activo,
            direccion,
            dni,
            telefono
        ) VALUES (%s, %s, %s, %s, %s, TRUE, %s, %s, %s)
    """, (
        data["nombre"],
        data["usuario"],
        data["correo"],
        data["contrasena"],
        data["rol"],
        data["direccion"],
        data["dni"],
        data["telefono"]
    ))
    conn.commit()
    conn.close()
    return True




def actualizar_usuario(id, data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE usuarios
        SET nombre_completo=%s, usuario=%s, correo=%s, contrasena=%s,
            rol_id=%s, direccion=%s, dni=%s, telefono=%s
        WHERE id=%s
    """, (
        data["nombre"],
        data["usuario"],
        data["correo"],
        data["contrasena"],
        data["rol"],
        data["direccion"],
        data["dni"],
        data["telefono"],
        id
    ))
    conn.commit()
    conn.close()
    return True


def eliminar_usuario(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return True
