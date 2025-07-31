from backend.utils.db_connection import get_connection

def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre, correo, telefono, direccion, ruc FROM clientes")
    resultado = cursor.fetchall()
    conn.close()
    return resultado

def obtener_cliente_por_id(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes WHERE id = %s", (id,))
    cliente = cursor.fetchone()
    conn.close()
    return cliente

def crear_cliente(data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO clientes (nombre, correo, telefono, direccion, ruc)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["nombre"],
        data["correo"],
        data["telefono"],
        data["direccion"],
        data["ruc"]
    ))
    conn.commit()
    conn.close()

def actualizar_cliente(id, data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE clientes SET nombre=%s, correo=%s, telefono=%s, direccion=%s, ruc=%s
        WHERE id=%s
    """, (
        data["nombre"],
        data["correo"],
        data["telefono"],
        data["direccion"],
        data["ruc"],
        id
    ))
    conn.commit()
    conn.close()

def eliminar_cliente(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id=%s", (id,))
    conn.commit()
    conn.close()
