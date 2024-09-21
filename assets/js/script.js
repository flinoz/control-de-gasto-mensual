let listaNombresGastos = [];
let listaValoresGastos = [];
let listaFechasGastos = [];
let listaDescripcionesGastos = [];

// Cargar gastos al inicio
window.onload = cargarGastos;

function clickBoton() {
  const nombreGasto = document.getElementById("nombreGasto").value.trim();
  const valorGasto = parseFloat(document.getElementById("valorGasto").value);
  const descripcionGasto = document
    .getElementById("descripcionGasto")
    .value.trim();
  const errorMensaje = document.getElementById("errorMensaje");

  errorMensaje.style.display = "none"; // Ocultar mensaje de error

  if (!nombreGasto || isNaN(valorGasto) || valorGasto <= 0) {
    errorMensaje.textContent =
      "Por favor, ingresa un nombre y un valor de gasto válido.";
    errorMensaje.style.display = "block"; // Mostrar mensaje de error
    return;
  }

  const fechaActual = new Date().toLocaleString(); // Obtener fecha y hora actual

  listaNombresGastos.push(nombreGasto);
  listaValoresGastos.push(valorGasto);
  listaFechasGastos.push(fechaActual); // Agregar fecha a la lista
  listaDescripcionesGastos.push(descripcionGasto); // Agregar descripción a la lista

  // Alerta si el gasto es mayor a 150$
  if (valorGasto > 3000) {
    alert("¡Atención! Has registrado un gasto mayor a $3000 mxn.");
  }

  actualizarListaGastos();
  limpiar(); // Llama a la función limpiar para autolimpiar los campos
}

function actualizarListaGastos() {
  const listaElementos = document.getElementById("listaGastos");
  const totalGastosElement = document.getElementById("totalGastos");

  if (!listaElementos || !totalGastosElement) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  let htmlLista = "";
  let totalGastos = 0;

  listaNombresGastos.forEach((elemento, posicion) => {
    const valorGasto = Number(listaValoresGastos[posicion]);
    const fechaGasto = listaFechasGastos[posicion]; // Obtener la fecha de la lista
    totalGastos += valorGasto; // Sumamos al total

    htmlLista += `<li>${elemento} - mx ${valorGasto.toFixed(
      2
    )} - Descripción: ${
      listaDescripcionesGastos[posicion]
    } - Fecha: ${fechaGasto}
                       <button onclick="eliminarGasto(${posicion})">Eliminar</button>
                       <button onclick="modificarGasto(${posicion})">Modificar</button>
                       </li>`;
  });

  listaElementos.innerHTML = htmlLista;
  totalGastosElement.textContent = `mxn ${totalGastos.toFixed(2)}`;

  // Guardar en localStorage
  localStorage.setItem(
    "gastos",
    JSON.stringify({
      nombres: listaNombresGastos,
      valores: listaValoresGastos,
      fechas: listaFechasGastos,
      descripciones: listaDescripcionesGastos,
    })
  );
}

function limpiar() {
  document.getElementById("nombreGasto").value = "";
  document.getElementById("valorGasto").value = "";
  document.getElementById("descripcionGasto").value = ""; // Limpiar descripción
}

function eliminarGasto(posicion) {
  listaNombresGastos.splice(posicion, 1);
  listaValoresGastos.splice(posicion, 1);
  listaFechasGastos.splice(posicion, 1); // Eliminar fecha
  listaDescripcionesGastos.splice(posicion, 1); // Eliminar descripción
  actualizarListaGastos();
}

function modificarGasto(posicion) {
  const nuevoNombre = prompt(
    "Ingrese el nuevo nombre del gasto:",
    listaNombresGastos[posicion]
  );
  const nuevoValor = prompt(
    "Ingrese el nuevo valor del gasto:",
    listaValoresGastos[posicion]
  );
  const nuevaDescripcion = prompt(
    "Ingrese la nueva descripción del gasto:",
    listaDescripcionesGastos[posicion]
  );

  if (
    nuevoNombre &&
    nuevoValor &&
    !isNaN(nuevoValor) &&
    parseFloat(nuevoValor) > 0
  ) {
    listaNombresGastos[posicion] = nuevoNombre;
    listaValoresGastos[posicion] = parseFloat(nuevoValor);
    listaDescripcionesGastos[posicion] = nuevaDescripcion; // Actualizar descripción
    actualizarListaGastos();
  } else {
    alert("Por favor, ingrese datos válidos.");
  }
}

function exportarGastos() {
  // Crear un nuevo libro de trabajo
  const wb = XLSX.utils.book_new();

  // Crear una hoja de trabajo a partir de los datos
  const wsData = [
    ["Nombre del Gasto", "Valor del Gasto", "Descripción", "Fecha"],
  ];
  listaNombresGastos.forEach((nombre, index) => {
    wsData.push([
      nombre,
      listaValoresGastos[index].toFixed(2),
      listaDescripcionesGastos[index],
      listaFechasGastos[index],
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Aplicar estilo a la hoja de trabajo
  const range = XLSX.utils.decode_range(ws["!ref"]); // Obtener el rango de la hoja
  for (let C = range.s.c; C <= range.e.c; ++C) {
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })]; // Obtener la celda
      if (cell) {
        // Estilo de borde completo
        cell.s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        // Aplicar formato especial
        if (R === 0) {
          // Encabezados
          const headerColors = ["FF9999", "99FF99", "9999FF", "FFFF99"]; // Colores para cada encabezado
          cell.s.fill = { fgColor: { rgb: headerColors[C] } }; // Color de fondo específico para cada encabezado
          cell.s.font = { bold: true, color: { rgb: "FFFFFF" } }; // Texto en negrita y blanco
          cell.s.alignment = { horizontal: "center", vertical: "center" }; // Centrados
        } else {
          // Datos
          cell.s.fill = { fgColor: { rgb: "D3D3D3" } }; // Color de fondo gris claro para datos
          cell.s.alignment = { horizontal: "left", vertical: "center" }; // Alinear a la izquierda
        }
      }
    }
  }

  // Ajustar ancho de columnas
  ws["!cols"] = [
    { wch: 20 }, // Nombre del Gasto
    { wch: 15 }, // Valor del Gasto
    { wch: 30 }, // Descripción
    { wch: 20 }, // Fecha
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Gastos");

  // Generar un archivo Excel
  XLSX.writeFile(wb, "gastos.xlsx");
}
