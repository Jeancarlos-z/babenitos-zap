document.addEventListener("DOMContentLoaded", () => {
    const enlaces = document.querySelectorAll('[data-seccion]');
    const contenedor = document.getElementById("contenido");

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", async (e) => {
            e.preventDefault();
            const seccion = enlace.getAttribute("data-seccion");

            try {
                const respuesta = await fetch(`/static/secciones/${seccion}.html`);
                if (!respuesta.ok) throw new Error("No se pudo cargar la sección");

                const html = await respuesta.text();
                contenedor.innerHTML = html;

                setTimeout(() => {
                    if (seccion === "usuario") {
                        cargarScriptUsuario();
                    } else if (seccion === "cliente") {
                        cargarScriptCliente();
                    } else if (seccion === "modelo") {
                        cargarScriptModelo(); // ✅ nueva línea
                    } else if (seccion === "pedido") {
                        cargarScriptPedido(); // ✅ nueva línea
                    }else if (seccion === "panel") {
                        cargarScriptPanel(); // ✅ nuevo
                    }else if (seccion === "problema") {
                        cargarScriptProblema(); // ✅ necesario para que funcione
                    }



                    
                }, 100);

            } catch (error) {
                contenedor.innerHTML = `<div class="alert alert-danger">Error al cargar: ${error.message}</div>`;
            }
        });
    });
});

// Ya existentes
function cargarScriptUsuario() {
    const scriptId = "usuario-script";
    const existente = document.getElementById(scriptId);
    if (existente) existente.remove();

    const script = document.createElement("script");
    script.src = "/static/js/usuario.js";
    script.id = scriptId;
    script.onload = () => {
        console.log("✅ usuario.js cargado correctamente");
        setTimeout(() => {
            if (!document.getElementById("btnNuevoUsuario")) {
                console.error("❌ El botón #btnNuevoUsuario aún no está en el DOM.");
            } else {
                console.log("🎯 El botón está presente. Listo para eventos.");
            }
        }, 100);
    };
    script.onerror = () => console.error("❌ Error al cargar usuario.js");
    document.body.appendChild(script);
}

function cargarScriptCliente() {
    const scriptId = "cliente-script";
    const existente = document.getElementById(scriptId);
    if (existente) existente.remove();

    const script = document.createElement("script");
    script.src = "/static/js/cliente.js";
    script.id = scriptId;
    script.onload = () => console.log("✅ cliente.js cargado correctamente");
    script.onerror = () => console.error("❌ Error al cargar cliente.js");
    document.body.appendChild(script);
}

// ✅ NUEVA función
function cargarScriptModelo() {
    const scriptId = "modelo-script";
    const existente = document.getElementById(scriptId);
    if (existente) existente.remove();

    const script = document.createElement("script");
    script.src = "/static/js/modelo.js";
    script.id = scriptId;
    script.onload = () => console.log("✅ modelo.js cargado correctamente");
    script.onerror = () => console.error("❌ Error al cargar modelo.js");
    document.body.appendChild(script);
}

function cargarScriptPedido() {
    const scriptId = "pedido-script";
    const existente = document.getElementById(scriptId);
    
    // Limpiar completamente antes de recargar
    if (existente) {
        existente.remove();
        // Limpiar cualquier estado o evento pendiente
        if (typeof limpiarPedido === 'function') {
            limpiarPedido();
        }
    }

    const script = document.createElement("script");
    script.src = "/static/js/pedido.js";
    script.id = scriptId;

    script.onload = () => {
        console.log("✅ pedido.js cargado correctamente");
        if (typeof inicializarPedido === "function") {
            inicializarPedido(true); // Forzar recarga de datos
        } else {
            console.error("❌ inicializarPedido no está definida");
        }
    };

    script.onerror = () => console.error("❌ Error al cargar pedido.js");
    document.body.appendChild(script);
}

function cargarScriptPanel() {
  const scriptId = "panel-script";
  const existente = document.getElementById(scriptId);
  if (existente) existente.remove();

  const script = document.createElement("script");
  script.src = "/static/js/panel.js";
  script.id = scriptId;

  script.onload = () => {
    console.log("✅ panel.js cargado correctamente");
    if (typeof inicializarPanel === "function") {
      inicializarPanel(); // 🧠 aquí se llama al inicializador del panel
    } else {
      console.error("❌ inicializarPanel no está definida en panel.js");
    }
  };

  script.onerror = () => console.error("❌ Error al cargar panel.js");
  document.body.appendChild(script);
}

function cargarScriptProblema() {
  const scriptId = "problema-script";
  const existente = document.getElementById(scriptId);
  if (existente) existente.remove();

  const script = document.createElement("script");
  script.src = "/static/js/problema.js";
  script.id = scriptId;

  script.onload = () => {
    console.log("✅ problema.js cargado");
    if (typeof inicializarProblemas === "function") {
      inicializarProblemas(); // 👈 aquí se llama explícitamente
    } else {
      console.error("❌ inicializarProblemas no está definida");
    }
  };

  script.onerror = () => console.error("❌ Error al cargar problema.js");
  document.body.appendChild(script);
}

