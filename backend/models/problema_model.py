from backend.utils.db_connection import get_connection

def listar_problemas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.id, p.descripcion, p.estado, p.fecha, p.accion,
               p.area_id, a.nombre AS area
        FROM problemas p
        JOIN areas a ON p.area_id = a.id
        ORDER BY p.fecha DESC
    """)
    datos = cursor.fetchall()
    cursor.close()
    conn.close()
    return datos

def obtener_problema(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM problemas WHERE id = %s", (id,))
    dato = cursor.fetchone()
    cursor.close()
    conn.close()
    return dato

def insertar_problema(problema):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO problemas (descripcion, area_id, estado, accion)
        VALUES (%s, %s, %s, %s)
    """, (problema["descripcion"], problema["area_id"], problema["estado"], problema["accion"]))
    conn.commit()
    cursor.close()
    conn.close()

def actualizar_problema(id, problema):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE problemas
        SET descripcion=%s, area_id=%s, estado=%s, accion=%s
        WHERE id = %s
    """, (problema["descripcion"], problema["area_id"], problema["estado"], problema["accion"], id))
    conn.commit()
    cursor.close()
    conn.close()

def eliminar_problema(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM problemas WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

def obtener_areas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre FROM areas")
    datos = cursor.fetchall()
    cursor.close()
    conn.close()
    return datos