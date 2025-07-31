import mysql.connector
from backend.utils.db_connection import get_connection

def listar_pedidos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT p.id, c.nombre AS cliente_nombre, p.fecha_pedido, p.fecha_salida,
           p.estado, p.prioridad
    FROM pedidos p
    JOIN clientes c ON p.cliente_id = c.id
    ORDER BY p.fecha_pedido DESC
    """
    cursor.execute(query)
    pedidos_raw = cursor.fetchall()

    cursor.close()
    conn.close()

    # ✅ Convertir datetime a string
    pedidos = []
    for p in pedidos_raw:
        pedidos.append({
            "id": p["id"],
            "cliente_nombre": p["cliente_nombre"],
            "fecha_pedido": p["fecha_pedido"].strftime("%Y-%m-%d %H:%M:%S") if p["fecha_pedido"] else "",
            "fecha_salida": p["fecha_salida"].strftime("%Y-%m-%d %H:%M:%S") if p["fecha_salida"] else "",
            "estado": p["estado"],
            "prioridad": p["prioridad"]
        })

    return pedidos


def obtener_pedido(pedido_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT p.*, c.nombre AS cliente_nombre
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = %s
    """, (pedido_id,))
    pedido = cursor.fetchone()

    cursor.execute("""
        SELECT dp.*, m.categoria, m.colorModelo 
        FROM detalle_pedido dp
        JOIN modelos m ON dp.modelo_id = m.id
        WHERE dp.pedido_id = %s
    """, (pedido_id,))
    detalles = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "id": pedido["id"],
        "cliente_id": pedido["cliente_id"],
        "cliente_nombre": pedido["cliente_nombre"],  # ✅ agregado para mostrar en "ver"
        "fecha_pedido": pedido["fecha_pedido"].strftime("%Y-%m-%d"),
        "fecha_salida": pedido["fecha_salida"].strftime("%Y-%m-%d") if pedido["fecha_salida"] else "",
        "estado": pedido["estado"],
        "prioridad": pedido["prioridad"],
        "observaciones": pedido["observaciones"],
        "detalles": [
            {
                "modelo_id": d["modelo_id"],
                "modelo": f"{d['categoria']} - {d['colorModelo']}",
                "cantidad": d["cantidad"],
                "precio_unitario": float(d["precio_unitario"])
            } for d in detalles
        ]
    }


def crear_pedido(data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pedidos (cliente_id, fecha_salida, prioridad, observaciones)
        VALUES (%s, %s, %s, %s)
    """, (data["cliente_id"], data["fecha_salida"], data["prioridad"], data["observaciones"]))
    pedido_id = cursor.lastrowid

    for det in data["detalles"]:
        cursor.execute("""
            INSERT INTO detalle_pedido (pedido_id, modelo_id, cantidad, precio_unitario)
            VALUES (%s, %s, %s, %s)
        """, (pedido_id, det["modelo_id"], det["cantidad"], det["precio_unitario"]))

    conn.commit()
    cursor.close()
    conn.close()
    return pedido_id


def actualizar_pedido(pedido_id, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE pedidos SET cliente_id=%s, fecha_salida=%s, prioridad=%s, observaciones=%s
        WHERE id=%s
    """, (data["cliente_id"], data["fecha_salida"], data["prioridad"], data["observaciones"], pedido_id))

    cursor.execute("DELETE FROM detalle_pedido WHERE pedido_id = %s", (pedido_id,))

    for det in data["detalles"]:
        cursor.execute("""
            INSERT INTO detalle_pedido (pedido_id, modelo_id, cantidad, precio_unitario)
            VALUES (%s, %s, %s, %s)
        """, (pedido_id, det["modelo_id"], det["cantidad"], det["precio_unitario"]))

    conn.commit()
    cursor.close()
    conn.close()
    return True


def eliminar_pedido(pedido_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM detalle_pedido WHERE pedido_id = %s", (pedido_id,))
    cursor.execute("DELETE FROM pedidos WHERE id = %s", (pedido_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return True
