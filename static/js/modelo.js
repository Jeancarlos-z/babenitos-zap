(() => {
  const tabla = document.getElementById("tabla-modelos");
  const modal = new bootstrap.Modal(document.getElementById("modalModelo"));
  const btnNuevo = document.getElementById("btnNuevoModelo");
  const btnGuardar = document.getElementById("btnGuardarModelo");

  const inputId = document.getElementById("modeloId");
  const inputCategoria = document.getElementById("categoria");
  const inputMaterial = document.getElementById("material");
  const inputColorPlanta = document.getElementById("colorPlanta");
  const inputColorModelo = document.getElementById("colorModelo");
  const inputGenero = document.getElementById("genero");
  const inputImagen = document.getElementById("imagen");

  let modelos = [];

  const cargarModelos = async () => {
    const res = await fetch("/modelos");
    modelos = await res.json();
    renderTabla();
  };

const renderTabla = () => {
  tabla.innerHTML = "";
  modelos.forEach(modelo => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${modelo.id}</td>
      
      <td>${modelo.categoria}</td>
      <td>${modelo.material}</td>
      <td>${modelo.colorPlanta}</td>
      <td>${modelo.colorModelo}</td>
      <td>${modelo.genero}</td>
      <td><img src="/static/img/modelos/${modelo.imagen}" alt="modelo" width="60"></td>
      <td>
        <button class="btn btn-sm btn-warning" data-id="${modelo.id}">Editar</button>
        <button class="btn btn-sm btn-danger" data-id="${modelo.id}">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  tabla.querySelectorAll(".btn-warning").forEach(btn => {
    btn.onclick = () => editarModelo(btn.dataset.id);
  });

  tabla.querySelectorAll(".btn-danger").forEach(btn => {
    btn.onclick = () => eliminarModelo(btn.dataset.id);
  });
};


  const editarModelo = async (id) => {
    const res = await fetch(`/modelos/${id}`);
    const modelo = await res.json();

    inputId.value = modelo.id;
    inputCategoria.value = modelo.categoria;
    inputMaterial.value = modelo.material;
    inputColorPlanta.value = modelo.colorPlanta;
    inputColorModelo.value = modelo.colorModelo;
    inputGenero.value = modelo.genero;
    inputImagen.value = ""; // no prellenamos archivo

    // Mostrar imagen actual
    const preview = document.getElementById("previewImagen");
    preview.src = `/static/img/modelos/${modelo.imagen}`;
    preview.style.display = "block";

    modal.show();
  };

  const eliminarModelo = async (id) => {
    if (!confirm("¿Eliminar modelo?")) return;
    await fetch(`/modelos/${id}`, { method: "DELETE" });
    cargarModelos();
  };

  btnNuevo.onclick = () => {
    inputId.value = "";
    inputCategoria.value = "";
    inputMaterial.value = "";
    inputColorPlanta.value = "";
    inputColorModelo.value = "";
    inputGenero.value = "";
    inputImagen.value = "";
    modal.show();
  };

  btnGuardar.onclick = async () => {
    const formData = new FormData();
    formData.append("categoria", inputCategoria.value);
    formData.append("material", inputMaterial.value);
    formData.append("colorPlanta", inputColorPlanta.value);
    formData.append("colorModelo", inputColorModelo.value);
    formData.append("genero", inputGenero.value);

    if (inputImagen.files[0]) {
      formData.append("imagen", inputImagen.files[0]);
    }

    const id = inputId.value;
    if (id) {
      await fetch(`/modelos/${id}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      await fetch("/modelos", {
        method: "POST",
        body: formData,
      });
    }

    modal.hide();
    cargarModelos();
  };

  cargarModelos();
})();
