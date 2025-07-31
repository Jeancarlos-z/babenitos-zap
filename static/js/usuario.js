(() => {
  const nuevoBtn = document.getElementById("btnNuevoUsuario");
  const guardarBtn = document.getElementById("guardarUsuario");
  const modalElement = document.getElementById("modalUsuario");
  const form = document.getElementById("formUsuario");

  // Verificar si el contenido existe en el DOM
  if (!nuevoBtn || !guardarBtn || !modalElement || !form) {
    console.warn("❌ Elementos no encontrados en el DOM. usuario.js no se ejecuta.");
    return;
  }

  const modalUsuario = new bootstrap.Modal(modalElement);

  cargarUsuarios();

  nuevoBtn.addEventListener("click", () => {
    document.getElementById("modalUsuarioLabel").innerText = "Nuevo Usuario";
    form.reset();
    document.getElementById("usuarioId").value = "";
    modalUsuario.show();
  });

  guardarBtn.addEventListener("click", () => {
    if (!validarFormulario()) return;

    const id = document.getElementById("usuarioId").value;
    const data = {
      nombre: document.getElementById("nombre").value.trim(),
      usuario: document.getElementById("usuario").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      rol: document.getElementById("rol").value,
      contrasena: document.getElementById("contrasena").value,
      direccion: document.getElementById("direccion").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      telefono: document.getElementById("telefono").value.trim()
    };


    const url = id ? `/usuarios/${id}` : "/usuarios";
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        alert(res.mensaje || "Usuario guardado");
        modalUsuario.hide();
        cargarUsuarios();
      });
  });

function validarFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const direccion = document.getElementById("direccion").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const rol = document.getElementById("rol").value;
  const esNuevo = !document.getElementById("usuarioId").value;



  // Validar nombre: mínimo 2 caracteres, sin números
  if (nombre.length < 2 || /\d/.test(nombre)) {
    alert("❌ El nombre debe tener al menos 2 caracteres y no debe contener números.");
    return false;
  }

  // Validar nombre de usuario: sin espacios
  if (/\s/.test(usuario)) {
    alert("❌ El nombre de usuario no debe contener espacios.");
    return false;
  }

  // Validar correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    alert("❌ Correo electrónico inválido.");
    return false;
  }

  // Validar dirección: mínimo 5 caracteres
  if (direccion.length < 5) {
    alert("❌ La dirección debe tener al menos 5 caracteres.");
    return false;
  }

  // Validar DNI: exactamente 8 dígitos
  if (!/^\d{8}$/.test(dni)) {
    alert("❌ El DNI debe tener exactamente 8 dígitos.");
    return false;
  }

  // Validar teléfono: entre 7 y 15 dígitos
  if (!/^\d{7,15}$/.test(telefono)) {
    alert("❌ El teléfono debe tener entre 7 y 15 dígitos.");
    return false;
  }

  // Validar contraseña solo si es nuevo
  if (esNuevo && contrasena.length < 6) {
    alert("🔒 La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  // Validación de rol (si es un <select>)
  if (rol === "" || rol === "0") {
    alert("❌ Debes seleccionar un rol.");
    return false;
  }

    // Validar campos vacíos
  if (!nombre || !usuario || !correo || !direccion || !dni || !telefono || !rol) {
    alert("⚠️ Todos los campos son obligatorios.");
    return false;
  }

  return true;
}


  function cargarUsuarios() {
    fetch("/usuarios")
      .then(res => res.json())
      .then(usuarios => {
        const cuerpo = document.getElementById("tabla-usuarios");
        cuerpo.innerHTML = "";

        usuarios.forEach(usuario => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre_completo}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.contrasena}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.activo ? 'Activo' : 'Inactivo'}</td>
            <td>
              <button class="btn btn-sm btn-info btn-detalle" data-id="${usuario.id}">Detalle</button>
              <button class="btn btn-sm btn-warning btn-editar" data-id="${usuario.id}">Editar</button>
              <button class="btn btn-sm btn-danger btn-eliminar" data-id="${usuario.id}">Eliminar</button>
            </td>

            </td>
          `;
          cuerpo.appendChild(fila);
        });

        asignarEventos();
      });
  }

  function asignarEventos() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const fila = btn.closest("tr");
        const id = fila.children[0].innerText;

        fetch(`/usuarios/${id}`)
          .then(res => res.json())
          .then(usuario => {
            document.getElementById("modalUsuarioLabel").innerText = "Editar Usuario";
            document.getElementById("usuarioId").value = usuario.id;
            document.getElementById("nombre").value = usuario.nombre_completo;
            document.getElementById("usuario").value = usuario.usuario;
            document.getElementById("correo").value = usuario.correo;
            document.getElementById("rol").value = usuario.rol_id;
            document.getElementById("direccion").value = usuario.direccion || "";
            document.getElementById("dni").value = usuario.dni || "";
            document.getElementById("telefono").value = usuario.telefono || "";
            document.getElementById("contrasena").value = usuario.contrasena || "";
            modalUsuario.show();
          });
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const fila = btn.closest("tr");
        const id = fila.children[0].innerText;

        if (confirm("¿Seguro que deseas eliminar este usuario?")) {
          fetch(`/usuarios/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(res => {
              alert(res.mensaje || "Usuario eliminado");
              cargarUsuarios();
            });
        }
      });
    });

    document.querySelectorAll(".btn-detalle").forEach(btn => {
      btn.addEventListener("click", () => {
        console.log("🟢 Click en DETALLE:", btn.dataset.id);  // AÑADE ESTO
        const id = btn.dataset.id;

        fetch(`/usuarios/${id}`)
          .then(res => res.json())
          .then(usuario => {
            document.getElementById("det-id").innerText = usuario.id;
            document.getElementById("det-nombre").innerText = usuario.nombre_completo;
            document.getElementById("det-usuario").innerText = usuario.usuario;
            document.getElementById("det-contrasena").innerText = usuario.contrasena;
            document.getElementById("det-rol").innerText = usuario.rol_id;
            document.getElementById("det-direccion").innerText = usuario.direccion || "";
            document.getElementById("det-dni").innerText = usuario.dni || "";
            document.getElementById("det-telefono").innerText = usuario.telefono || "";
            document.getElementById("det-estado").innerText = usuario.activo ? "Activo" : "Inactivo";

            const modalDetalle = new bootstrap.Modal(document.getElementById("modalDetalleUsuario"));
            modalDetalle.show();
          });
      });
    });


  }

  // Validaciones en tiempo real para entradas específicas
  document.getElementById("nombre").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); // Solo letras y espacios
  });

  document.getElementById("dni").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, ""); // Solo números
    if (e.target.value.length > 8) {
      e.target.value = e.target.value.slice(0, 8);
    }
  });

  document.getElementById("telefono").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, ""); // Solo números
    if (e.target.value.length > 9) {
      e.target.value = e.target.value.slice(0, 9);
    }
  });

  document.getElementById("usuario").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\s/g, ""); // No espacios
  });


})();
