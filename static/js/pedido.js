// Variables de estado
let pedidoInicializado = false;
let modalPedido = null;  // Mover a variable global
let modelosPedidoss = [];

// Función para limpiar el estado al salir de la vista
function limpiarEstadoPedido() {
    // No necesitamos limpiar modelosPedidoss para mantener datos cacheados
    pedidoInicializado = false;
    modalPedido = null;
}

function inicializarPedido(forzarRecarga = false) {
    // Si ya está inicializado y no es recarga forzada, salir
    if (pedidoInicializado && !forzarRecarga) return;

    // Limpiar estado si es recarga forzada
    if (forzarRecarga) {
        limpiarEstadoPedido();
    }

    cargarPedidos();
    cargarClientes();
    
    // Solo cargar modelos si no están cargados
    if (modelosPedidoss.length === 0) {
        cargarModelos();
    }

    // Configurar modal solo si no existe
    if (!modalPedido) {
        const modalPedidoEl = document.getElementById("modalPedido");
        modalPedido = new bootstrap.Modal(modalPedidoEl);
    }

    // Configurar eventos (usando onclick para evitar duplicados)
    const btnNuevo = document.getElementById("btnNuevoPedido");
    if (btnNuevo) {
        btnNuevo.onclick = () => {
            limpiarFormulario();
            document.getElementById("modalPedidoLabel").textContent = "Nuevo Pedido";
            modalPedido.show();
        };
    }

    const formPedido = document.getElementById("formPedido");
    if (formPedido) {
        formPedido.onsubmit = async (e) => {
            e.preventDefault();
            await guardarPedido(modalPedido);
        };
    }

    pedidoInicializado = true;
    document.getElementById("btnBuscarPedido").onclick = () => aplicarFiltro();

    ["Cliente", "Fecha", "Estado", "Prioridad"].forEach(campo => {
  const chk = document.getElementById(`chk${campo}`);
  const input = document.getElementById(`filtro${campo}`);
  if (chk && input) {
    chk.onchange = () => {
      input.disabled = !chk.checked;
      if (!chk.checked) input.value = "";  // limpia si se desactiva
    };
  }
});

// Asignar evento al botón de buscar
const btnBuscar = document.getElementById("btnBuscarPedido");
if (btnBuscar) btnBuscar.onclick = aplicarFiltro;


}

//FILTROS
function normalizar(str) {
  return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}



async function aplicarFiltro() {
  const usarCliente = document.getElementById("chkCliente").checked;
  const usarFecha = document.getElementById("chkFecha").checked;
  const usarEstado = document.getElementById("chkEstado").checked;
  const usarPrioridad = document.getElementById("chkPrioridad").checked;

  const clienteValor = document.getElementById("filtroCliente").value.toLowerCase();
  const fechaValor = document.getElementById("filtroFecha").value;
  const estadoValor = document.getElementById("filtroEstado").value;
  const prioridadValor = document.getElementById("filtroPrioridad").value;

  const res = await fetch("/pedidos");
  const pedidos = await res.json();

  const filtrados = pedidos.filter(pedido => {
    if (usarCliente && !pedido.cliente_nombre.toLowerCase().startsWith(clienteValor)) return false;
    if (usarFecha && pedido.fecha_salida?.substring(0, 10) !== fechaValor) return false;
    if (usarEstado && normalizar(pedido.estado) !== normalizar(estadoValor)) return false;

    if (usarPrioridad && pedido.prioridad?.toLowerCase() !== prioridadValor.toLowerCase()) return false;
    return true;
  });

  mostrarPedidosFiltrados(filtrados);
}


function mostrarPedidosFiltrados(pedidos) {
  const tbody = document.getElementById("tabla-pedidos");
  tbody.innerHTML = "";

  pedidos.forEach(pedido => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.cliente_nombre}</td>
      <td>${pedido.fecha_pedido}</td>
      <td>${pedido.fecha_salida || ''}</td>
      <td>${pedido.estado}</td>
      <td>${pedido.prioridad}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="verDetalle(${pedido.id})">Ver</button>
        <button class="btn btn-sm btn-warning" onclick="editarPedido(${pedido.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}


// El resto de tus funciones se mantienen EXACTAMENTE igual:
async function cargarPedidos() {
  const res = await fetch("/pedidos");
  const pedidos = await res.json();

  const tbody = document.getElementById("tabla-pedidos");
  tbody.innerHTML = "";

  pedidos.forEach(pedido => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.cliente_nombre}</td>
      <td>${pedido.fecha_pedido}</td>
      <td>${pedido.fecha_salida || ''}</td>
      <td>${pedido.estado}</td>
      <td>${pedido.prioridad}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="verDetalle(${pedido.id})">Ver</button>
        <button class="btn btn-sm btn-warning" onclick="editarPedido(${pedido.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function cargarClientes() {
  const res = await fetch("/clientes");
  const clientes = await res.json();

  const select = document.getElementById("cliente_id");
  const lista = document.getElementById("listaClientes");
  select.innerHTML = "";
  lista.innerHTML = "";

  clientes.forEach(cli => {
    const option = document.createElement("option");
    option.value = cli.nombre;
    lista.appendChild(option);

    const optCliente = document.createElement("option");
    optCliente.value = cli.id;
    optCliente.textContent = cli.nombre;
    select.appendChild(optCliente);
  });
}


async function cargarModelos() {
  const res = await fetch("/modelos");
  modelosPedidoss = await res.json();
}

function agregarDetalle() {
  const cont = document.getElementById("contenedorDetalles");
  const div = document.createElement("div");
  div.className = "row mb-2 align-items-end";
  div.innerHTML = `
    <div class="col-md-5">
      <label class="form-label">Modelo</label>
      <select class="form-select modelo-id" required>
        ${modelosPedidoss.map(m => `<option value="${m.id}">${m.categoria} - ${m.colorModelo}</option>`).join("")}
      </select>
    </div>
    <div class="col-md-3">
      <label class="form-label">Cantidad</label>
      <input type="number" class="form-control cantidad" min="1" required>
    </div>
    <div class="col-md-3">
      <label class="form-label">Precio Unitario</label>
      <input type="number" class="form-control precio" step="0.01" required>
    </div>
    <div class="col-md-1">
      <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.row').remove()">✕</button>
    </div>
  `;
  cont.appendChild(div);
}

function limpiarFormulario() {
  document.getElementById("formPedido").reset();
  document.getElementById("contenedorDetalles").innerHTML = "";
  document.getElementById("pedidoId").value = "";
  agregarDetalle();
}

async function guardarPedido(modal) {
  const id = document.getElementById("pedidoId").value;
  const cliente_id = document.getElementById("cliente_id").value;
  const fecha_salida = document.getElementById("fecha_salida").value;
  const prioridad = document.getElementById("prioridad").value;
  const observaciones = document.getElementById("observaciones").value;

  const detalles = Array.from(document.querySelectorAll("#contenedorDetalles .row")).map(row => ({
    modelo_id: row.querySelector(".modelo-id").value,
    cantidad: row.querySelector(".cantidad").value,
    precio_unitario: row.querySelector(".precio").value
  }));

  const datos = { cliente_id, fecha_salida, prioridad, observaciones, detalles };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `/pedidos/${id}` : "/pedidos";

  const res = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  if (res.ok) {
    modal.hide();
    cargarPedidos();
  } else {
    alert("Error al guardar el pedido");
  }
}

async function verDetalle(id) {
  const res = await fetch(`/pedidos/${id}`);
  const data = await res.json();

  document.getElementById("det-id").textContent = data.id;
  document.getElementById("det-cliente").textContent = data.cliente_nombre;
  document.getElementById("det-fecha_pedido").textContent = data.fecha_pedido;
  document.getElementById("det-fecha_salida").textContent = data.fecha_salida;
  document.getElementById("det-estado").textContent = data.estado;
  document.getElementById("det-prioridad").textContent = data.prioridad;
  document.getElementById("det-observaciones").textContent = data.observaciones;

  const tbody = document.getElementById("detalle-modelos");
  tbody.innerHTML = "";

  data.detalles.forEach(d => {
    const tr = document.createElement("tr");
    const subtotal = d.cantidad * d.precio_unitario;
    tr.innerHTML = `
      <td>${d.modelo}</td>
      <td>${d.cantidad}</td>
      <td>${d.precio_unitario}</td>
      <td>${subtotal.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });

  new bootstrap.Modal(document.getElementById("modalDetallePedido")).show();
}

async function editarPedido(id) {
  const res = await fetch(`/pedidos/${id}`);
  const data = await res.json();

  document.getElementById("pedidoId").value = data.id;
  document.getElementById("cliente_id").value = data.cliente_id;
  document.getElementById("fecha_salida").value = data.fecha_salida;
  document.getElementById("prioridad").value = data.prioridad;
  document.getElementById("observaciones").value = data.observaciones;

  const cont = document.getElementById("contenedorDetalles");
  cont.innerHTML = "";

  data.detalles.forEach(d => {
    const div = document.createElement("div");
    div.className = "row mb-2 align-items-end";
    div.innerHTML = `
      <div class="col-md-5">
        <label class="form-label">Modelo</label>
        <select class="form-select modelo-id">
          ${modelosPedidoss.map(m => `<option value="${m.id}" ${m.id == d.modelo_id ? "selected" : ""}>${m.categoria} - ${m.colorModelo}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Cantidad</label>
        <input type="number" class="form-control cantidad" value="${d.cantidad}" required>
      </div>
      <div class="col-md-3">
        <label class="form-label">Precio Unitario</label>
        <input type="number" class="form-control precio" step="0.01" value="${d.precio_unitario}" required>
      </div>
      <div class="col-md-1">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.row').remove()">✕</button>
      </div>`;
    cont.appendChild(div);
  });

  document.getElementById("modalPedidoLabel").textContent = "Editar Pedido";
  modalPedido.show();
}

async function eliminarPedido(id) {
  if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;
  const res = await fetch(`/pedidos/${id}`, { method: "DELETE" });
  if (res.ok) cargarPedidos();
  else alert("Error al eliminar");
}

// Asegurar que las funciones estén disponibles globalmente
window.verDetalle = verDetalle;
window.editarPedido = editarPedido;
window.eliminarPedido = eliminarPedido;
window.agregarDetalle = agregarDetalle;
window.inicializarPedido = inicializarPedido;