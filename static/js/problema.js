let eventosAsignados = false;


(() => {
  // Elementos del DOM
  const cuerpoTabla = document.getElementById("tabla-problemas");
  const btnNuevo = document.getElementById("btnNuevoProblema");
  const btnGuardar = document.getElementById("btnGuardarProblema");
  const modalElement = document.getElementById("modalProblema");

  // Validación inicial de elementos críticos
  if (!cuerpoTabla || !btnNuevo || !btnGuardar || !modalElement) {
    console.error("❌ Elementos esenciales no encontrados en problema.js");
    return;
  }

  const modal = new bootstrap.Modal(modalElement);

  // Inputs del formulario
  const inputId = document.getElementById("problemaId");
  const inputArea = document.getElementById("area");
  const inputDescripcion = document.getElementById("descripcion");
  const inputEstado = document.getElementById("estado");
  const inputAccion = document.getElementById("accion");

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    inputId.value = "";
    inputArea.value = "";
    inputDescripcion.value = "";
    inputEstado.value = "pendiente"; // Valor por defecto
    inputAccion.value = "";
    ocultarErrores();
  };

  // Oculta todos los mensajes de error
  const ocultarErrores = () => {
    document.querySelectorAll(".form-text.text-danger").forEach(el => {
      el.classList.add("d-none");
    });
  };

  // Valida el formulario antes de enviar
  const validarFormulario = () => {
    ocultarErrores();
    let valido = true;

    if (!inputArea.value) {
      document.getElementById("error-area").classList.remove("d-none");
      valido = false;
    }

    if (!inputDescripcion.value.trim()) {
      document.getElementById("error-descripcion").classList.remove("d-none");
      valido = false;
    }

    if (!inputEstado.value) {
      document.getElementById("error-estado").classList.remove("d-none");
      valido = false;
    }

    if (!inputAccion.value.trim()) {
      document.getElementById("error-accion").classList.remove("d-none");
      valido = false;
    }

    return valido;
  };

  // Muestra una alerta al usuario
  const mostrarAlerta = (mensaje, tipo = "danger") => {
    // Limpiar alertas existentes
    const alertas = document.querySelectorAll('.alert');
    alertas.forEach(alerta => alerta.remove());
    
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector(".container") || document.body;
    container.prepend(alerta);
    
    setTimeout(() => {
      alerta.classList.remove("show");
      setTimeout(() => alerta.remove(), 150);
    }, 5000);
  };

  // Carga las áreas desde el servidor y las muestra en el select
  const cargarAreas = async () => {
    try {
      const res = await fetch("/areas");
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Formato de respuesta inválido, se esperaba un array");
      }

      // Limpiar y cargar opciones del select
      inputArea.innerHTML = '<option value="">Seleccione un área</option>';
      
      data.forEach(area => {
        const option = document.createElement("option");
        option.value = area.id;
        option.textContent = area.nombre;
        inputArea.appendChild(option);
      });

      return true;
    } catch (error) {
      console.error("Error al cargar áreas:", error);
      mostrarAlerta("No se pudieron cargar las áreas. Recargue la página.", "danger");
      return false;
    }
  };

  // Formatea la fecha para mostrarla
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    
    try {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) return fechaStr;
      
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaStr;
    }
  };

  // Clases CSS para los estados
  const getEstadoBadgeClass = (estado) => {
    if (!estado) return 'bg-secondary';
    
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'bg-warning text-dark';
    if (estadoLower.includes('proceso')) return 'bg-info text-dark';
    if (estadoLower.includes('resuelto')) return 'bg-success';
    return 'bg-secondary';
  };

  // Carga los problemas y los muestra en la tabla
  const cargarProblemas = async () => {
    try {
      // Mostrar estado de carga
      cuerpoTabla.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando problemas...</p>
          </td>
        </tr>
      `;

      const res = await fetch("/problemas");
      
      if (!res.ok) {
        throw new Error(`Error al obtener problemas: ${res.status} ${res.statusText}`);
      }

      const problemas = await res.json();
      
      if (!Array.isArray(problemas)) {
        throw new Error("La respuesta no contiene un array de problemas");
      }

      // Limpiar tabla
      cuerpoTabla.innerHTML = "";

      if (problemas.length === 0) {
        cuerpoTabla.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">No hay problemas registrados</td>
          </tr>
        `;
        return;
      }

      // Llenar tabla con los problemas
      problemas.forEach(problema => {
        const fila = document.createElement("tr");
        
        // Validar y formatear datos
        const areaNombre = problema.area || 'N/A';

        const descripcion = problema.descripcion || 'Sin descripción';
        const estado = problema.estado || 'desconocido';
        const fechaFormateada = formatFecha(problema.fecha || problema.created_at);
        
        fila.innerHTML = `
          <td>${problema.id || 'N/A'}</td>
          <td>${areaNombre}</td>
          <td>${descripcion}</td>
          <td><span class="badge ${getEstadoBadgeClass(estado)}">${estado}</span></td>
          <td>${fechaFormateada}</td>
          <td>
            <button class="btn btn-sm btn-warning btn-editar me-1" data-id="${problema.id}">
              <i class="bi bi-pencil-square"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${problema.id}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </td>
        `;
        
        cuerpoTabla.appendChild(fila);
      });

      // Asignar eventos a los botones
      asignarEventosBotones();

    } catch (error) {
      console.error("Error al cargar problemas:", error);
      
      cuerpoTabla.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">
            <i class="bi bi-exclamation-triangle-fill"></i> ${error.message}
          </td>
        </tr>
      `;
      
      mostrarAlerta("Error al cargar los problemas. Intente recargar la página.", "danger");
    }
  };

  // Asigna eventos a los botones de editar y eliminar
  const asignarEventosBotones = () => {

     if (eventosAsignados) return;
      eventosAsignados = true;
    // Delegación de eventos para mejor performance
    cuerpoTabla.addEventListener('click', async (e) => {
      const btnEditar = e.target.closest('.btn-editar');
      const btnEliminar = e.target.closest('.btn-eliminar');
      
      if (btnEditar) {
        const id = btnEditar.getAttribute('data-id');
        await editarProblema(id);
      }
      
      if (btnEliminar) {
        const id = btnEliminar.getAttribute('data-id');
        await eliminarProblema(id);
      }
    });
  };

  // Función para editar un problema
  const editarProblema = async (id) => {
    try {
      const res = await fetch(`/problemas/${id}`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const problema = await res.json();
      
      // Validar datos recibidos
      if (!problema || !problema.id) {
        throw new Error("Datos del problema incompletos");
      }
      
      // Llenar el formulario
      inputId.value = problema.id;
      inputArea.value = problema.area_id || problema.area?.id || '';
      inputDescripcion.value = problema.descripcion || '';
      inputEstado.value = problema.estado || 'pendiente';
      inputAccion.value = problema.accion || '';
      
      // Mostrar el modal
      modal.show();
      
    } catch (error) {
      console.error("Error al cargar problema para editar:", error);
      mostrarAlerta("No se pudo cargar el problema para editar", "danger");
    }
  };

  // Función para eliminar un problema
  const eliminarProblema = async (id) => {
    if (!confirm("¿Está seguro que desea eliminar este problema? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      const res = await fetch(`/problemas/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      mostrarAlerta("Problema eliminado correctamente", "success");
      await cargarProblemas(); // Recargar la tabla
      
    } catch (error) {
      console.error("Error al eliminar problema:", error);
      mostrarAlerta("No se pudo eliminar el problema", "danger");
    }
  };

  // Función para guardar un problema (nuevo o editado)
  const guardarProblema = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    const problemaData = {
      area_id: inputArea.value,
      descripcion: inputDescripcion.value.trim(),
      estado: inputEstado.value,
      accion: inputAccion.value.trim()
    };
    
    // Si es una edición, agregar el ID
    if (inputId.value) {
      problemaData.id = inputId.value;
    }
    
    try {
      const url = inputId.value ? `/problemas/${inputId.value}` : '/problemas';
      const method = inputId.value ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemaData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      
      const resultado = await res.json();
      
      mostrarAlerta(
        `Problema ${inputId.value ? 'actualizado' : 'creado'} correctamente`, 
        "success"
      );
      
      modal.hide();
      await cargarProblemas(); // Recargar la tabla
      
    } catch (error) {
      console.error("Error al guardar problema:", error);
      mostrarAlerta(
        error.message || "Error al guardar el problema. Intente nuevamente.", 
        "danger"
      );
    }
  };

  // Evento para el botón Nuevo Problema
  btnNuevo.addEventListener('click', async () => {
    limpiarFormulario();
    
    // Asegurarse de que las áreas estén cargadas
    if (inputArea.options.length <= 1) {
      const areasCargadas = await cargarAreas();
      if (!areasCargadas) return;
    }
    
    modal.show();
  });

  // Evento para el botón Guardar
  btnGuardar.addEventListener('click', guardarProblema);

  // Inicialización cuando el DOM esté listo
  window.inicializarProblemas = async () => {
    await cargarAreas();
    await cargarProblemas();
  };


})();