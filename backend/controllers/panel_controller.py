from backend.models import panel_model

def indicadores_panel():
    return panel_model.obtener_indicadores()

def grafica_estado():
    return panel_model.pedidos_por_estado()

def grafica_mensual():
    return panel_model.pedidos_por_mes()
