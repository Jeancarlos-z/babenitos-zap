from backend.controllers import panel_controller

def handle_panel_routes(self):
    from backend.controllers import panel_controller

    if self.path == "/panel/indicadores" and self.command == "GET":
        data = panel_controller.indicadores_panel()
        self.send_json(data)
        return True

    if self.path == "/panel/grafica1" and self.command == "GET":
        data = panel_controller.grafica_estado()
        self.send_json(data)
        return True

    if self.path == "/panel/grafica2" and self.command == "GET":
        data = panel_controller.grafica_mensual()
        self.send_json(data)
        return True

    return False
