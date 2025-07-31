from backend.utils.db_connection import get_connection

def listar_modelos_db():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM modelos")
    data = cursor.fetchall()
    conn.close()
    return data

def obtener_modelo_db(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM modelos WHERE id = %s", (id,))
    data = cursor.fetchone()
    conn.close()
    return data

def crear_modelo_db(data):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO modelos (categoria, material, colorPlanta, colorModelo, genero, imagen)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["categoria"],
        data["material"],
        data["colorPlanta"],
        data["colorModelo"],
        data["genero"],
        data["imagen"]
    ))
    conn.commit()
    conn.close()


def actualizar_modelo_db(id, data):
    conn = get_connection()
    cursor = conn.cursor()
    campos = [
        
        "categoria", "material", "colorPlanta", "colorModelo", "genero"
    ]
    valores = [data[campo] for campo in campos]

    set_clause = ", ".join([f"{campo}=%s" for campo in campos])
    
    if "imagen" in data:
        set_clause += ", imagen=%s"
        valores.append(data["imagen"])

    valores.append(id)
    cursor.execute(f"UPDATE modelos SET {set_clause} WHERE id=%s", valores)
    conn.commit()
    conn.close()

def eliminar_modelo_db(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM modelos WHERE id=%s", (id,))
    conn.commit()
    conn.close()
