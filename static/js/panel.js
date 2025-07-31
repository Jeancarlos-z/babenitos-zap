document.addEventListener("DOMContentLoaded", async () => {
  await cargarIndicadores();
  await cargarGrafica1();
  await cargarGrafica2();
});

function inicializarPanel() {
  cargarIndicadores();
  cargarGrafica1();
  cargarGrafica2();
}

// Animación numérica
function animarContadores() {
  const counters = document.querySelectorAll(".animated-counter");

  counters.forEach(counter => {
    const final = +counter.textContent;
    let actual = 0;
    const incremento = Math.ceil(final / 40);

    const actualizar = () => {
      actual += incremento;
      if (actual < final) {
        counter.textContent = actual;
        requestAnimationFrame(actualizar);
      } else {
        counter.textContent = final;
      }
    };

    actualizar();
  });
}

async function cargarIndicadores() {
  const res = await fetch("/panel/indicadores");
  const data = await res.json();

  document.getElementById("ind-total").textContent = data.total_pedidos;
  document.getElementById("ind-pendientes").textContent = data.pendientes;
  document.getElementById("ind-produccion").textContent = data.en_produccion;
  document.getElementById("ind-completados").textContent = data.completados;
  document.getElementById("ind-mes").textContent = data.pedidos_mes_actual;

  animarContadores();
}

// Gráfica 1
async function cargarGrafica1() {
  const res = await fetch("/panel/grafica1");
  const data = await res.json();

  const labels = data.map(d => d.estado.toUpperCase());
  const valores = data.map(d => d.cantidad);

  const ctx = document.getElementById("grafica1").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Pedidos por Estado",
        data: valores,
        backgroundColor: [
          "rgba(255, 177, 52, 0.98)",
          "rgba(45, 169, 251, 1)",
          "rgba(35, 252, 125, 0.82)"
        ],
        borderRadius: 10,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#222",
          titleColor: "#fff",
          bodyColor: "#fff"
        }
      },
      animation: {
        duration: 1000,
        easing: "easeOutBounce"
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#ffffff", // texto blanco
            font: { size: 14 }
          },
          grid: {
            color: "rgba(255,255,255,0.1)" // líneas de fondo claras
          }
        },
        x: {
          ticks: {
            color: "#ffffff", // texto blanco
            font: { weight: 'bold' }
          },
          grid: {
            color: "rgba(255,255,255,0.05)"
          }
        }
      }
    }
  });
}

// Gráfica 2
async function cargarGrafica2() {
  const res = await fetch("/panel/grafica2");
  const data = await res.json();

  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const cantidades = Array(12).fill(0);
  data.forEach(d => cantidades[d.mes - 1] = d.cantidad);

  const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
                        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const ctx = document.getElementById("grafica2").getContext("2d");
  const gradiente = ctx.createLinearGradient(0, 0, 0, 300);
  gradiente.addColorStop(0, "rgba(7, 243, 255, 0.98)");
  gradiente.addColorStop(1, "rgba(28, 142, 218, 0.1)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: nombresMeses,
      datasets: [{
        label: "Pedidos por Mes",
        data: cantidades,
        fill: true,
        backgroundColor: gradiente,
        borderColor: "#2980b9",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          backgroundColor: "#2c3e50",
          titleColor: "#ecf0f1",
          bodyColor: "#ecf0f1"
        }
      },
      animation: {
        duration: 1500,
        easing: "easeOutQuart"
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        x: {
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });
}
