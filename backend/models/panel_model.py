from backend.utils.db_connection import get_connection
from datetime import datetime

def obtener_indicadores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM pedidos")
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'pendiente'")
    pendientes = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'en_produccion'")
    en_produccion = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'completado'")
    completados = cursor.fetchone()["total"]

    mes_actual = datetime.now().month
    anio_actual = datetime.now().year
    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM pedidos
        WHERE MONTH(fecha_pedido) = %s AND YEAR(fecha_pedido) = %s
    """, (mes_actual, anio_actual))
    pedidos_mes = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return {
        "total_pedidos": total,
        "pendientes": pendientes,
        "en_produccion": en_produccion,
        "completados": completados,
        "pedidos_mes_actual": pedidos_mes
    }

def pedidos_por_estado():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT estado, COUNT(*) AS cantidad
        FROM pedidos
        GROUP BY estado
    """)
    datos = cursor.fetchall()

    cursor.close()
    conn.close()

    return datos

def pedidos_por_mes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT MONTH(fecha_pedido) AS mes, COUNT(*) AS cantidad
        FROM pedidos
        WHERE YEAR(fecha_pedido) = YEAR(CURDATE())
        GROUP BY mes
        ORDER BY mes
    """)
    datos = cursor.fetchall()

    cursor.close()
    conn.close()

    return datos
