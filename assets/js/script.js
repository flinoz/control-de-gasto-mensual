let listaNombresGastos = [];
let listaValoresGastos = [];

function clickBoton() {
    const nombreGasto = document.getElementById("nombreGasto").value;
    const valorGasto = document.getElementById("valorGasto").value;

    listaNombresGastos.push(nombreGasto);
    listaValoresGastos.push(valorGasto);

    actualizarListaGastos();
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
        totalGastos += valorGasto; // Sumamos al total

        htmlLista += `<li>${elemento} - mx ${valorGasto}
                       <button onclick="eliminarGasto(${posicion})">Eliminar</button>
                       </li>`;
    });

    listaElementos.innerHTML = htmlLista;
    totalGastosElement.textContent =`mxn${totalGastos.toFixed(2)}`;
    limpiar();
}

function limpiar() {
    document.getElementById("nombreGasto").value = "";
    document.getElementById("valorGasto").value = "";
}

function eliminarGasto(posicion) {
    listaNombresGastos.splice(posicion, 1);
    listaValoresGastos.splice(posicion, 1);
    actualizarListaGastos();
}
