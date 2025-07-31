(() => {
  const cuerpoTabla = document.getElementById("tabla-clientes");
  const btnNuevo = document.getElementById("btnNuevoCliente");
  const modal = new bootstrap.Modal(document.getElementById("modalCliente"));
  const btnGuardar = document.getElementById("btnGuardarCliente");

  const inputId = document.getElementById("clienteId");
  const inputNombre = document.getElementById("nombre");
  const inputCorreo = document.getElementById("correo");
  const inputTelefono = document.getElementById("telefono");
  const inputDireccion = document.getElementById("direccion");
  const inputRuc = document.getElementById("ruc");

  const errorNombre = document.getElementById("error-nombre");
  const errorCorreo = document.getElementById("error-correo");
  const errorTelefono = document.getElementById("error-telefono");
  const errorDireccion = document.getElementById("error-direccion");
  const errorRuc = document.getElementById("error-ruc");

  if (!cuerpoTabla || !btnNuevo || !btnGuardar) return;

  const limpiarFormulario = () => {
    inputId.value = "";
    inputNombre.value = "";
    inputCorreo.value = "";
    inputTelefono.value = "";
    inputDireccion.value = "";
    inputRuc.value = "";

    ocultarErrores();
  };

  const ocultarErrores = () => {
    errorNombre.classList.add("d-none");
    errorCorreo.classList.add("d-none");
    errorTelefono.classList.add("d-none");
    errorDireccion.classList.add("d-none");
    errorRuc.classList.add("d-none");
  };

  const validarCampos = () => {
    let valido = true;

    ocultarErrores();

    if (inputNombre.value.trim().length < 3) {
      errorNombre.classList.remove("d-none");
      valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputCorreo.value.trim())) {
      errorCorreo.classList.remove("d-none");
      valido = false;
    }

    const telefono = inputTelefono.value.trim();
    if (!/^\d{9}$/.test(telefono)) {
      errorTelefono.classList.remove("d-none");
      valido = false;
    }

    if (inputDireccion.value.trim().length < 5) {
      errorDireccion.classList.remove("d-none");
      valido = false;
    }

    const ruc = inputRuc.value.trim();
    if (!/^\d{11}$/.test(ruc)) {
      errorRuc.classList.remove("d-none");
      valido = false;
    }

    return valido;
  };

  const cargarClientes = () => {
    fetch("/clientes")
      .then(res => res.json())
      .then(clientes => {
        cuerpoTabla.innerHTML = "";
        clientes.forEach(cliente => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.ruc}</td>
            <td>
              <button class="btn btn-sm btn-warning btn-editar" data-id="${cliente.id}">Editar</button>
              <button class="btn btn-sm btn-danger btn-eliminar" data-id="${cliente.id}">Eliminar</button>
            </td>
          `;
          cuerpoTabla.appendChild(fila);
        });

        document.querySelectorAll(".btn-editar").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const res = await fetch(`/clientes/${id}`);
            const data = await res.json();

            inputId.value = data.id;
            inputNombre.value = data.nombre;
            inputCorreo.value = data.correo;
            inputTelefono.value = data.telefono;
            inputDireccion.value = data.direccion;
            inputRuc.value = data.ruc;

            ocultarErrores();
            modal.show();
          });
        });

        document.querySelectorAll(".btn-eliminar").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (confirm("¿Seguro que deseas eliminar este cliente?")) {
              await fetch(`/clientes/${id}`, { method: "DELETE" });
              cargarClientes();
            }
          });
        });
      });
  };

  btnNuevo.addEventListener("click", () => {
    limpiarFormulario();
    modal.show();
  });

  btnGuardar.addEventListener("click", async () => {
    if (!validarCampos()) return;

    const cliente = {
      nombre: inputNombre.value.trim(),
      correo: inputCorreo.value.trim(),
      telefono: inputTelefono.value.trim(),
      direccion: inputDireccion.value.trim(),
      ruc: inputRuc.value.trim()
    };

    const id = inputId.value;

    if (id) {
      await fetch(`/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    } else {
      await fetch("/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    }

    modal.hide();
    cargarClientes();
  });

  cargarClientes();
})();
