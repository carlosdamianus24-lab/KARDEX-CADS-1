// ===============================
// KARDEX 
// ===============================

let movimientos = JSON.parse(localStorage.getItem("kardex")) || [];

mostrarMovimientos();
mostrarStock();

// ===============================
// Registrar Movimiento
// ===============================
function registrar() {

    let lote = document.getElementById("lote").value.trim();
    let producto = document.getElementById("producto").value.trim();
    let movimiento = document.getElementById("movimiento").value;
    let cantidad = parseInt(document.getElementById("cantidad").value);

    if (lote === "" || producto === "" || isNaN(cantidad) || cantidad <= 0) {
        alert("Complete todos los datos.");
        return;
    }

    // Buscar último stock del lote
    let stock = 0;

    for (let i = movimientos.length - 1; i >= 0; i--) {

        if (movimientos[i].lote === lote) {
            stock = movimientos[i].stock;
            break;
        }

    }

    if (movimiento === "Entrada") {

        stock += cantidad;

    } else {

        if (cantidad > stock) {
            alert("Stock insuficiente");
            return;
        }

        stock -= cantidad;

    }

    let fecha = new Date().toLocaleString();

    movimientos.push({

        fecha: fecha,
        lote: lote,
        producto: producto,
        movimiento: movimiento,
        cantidad: cantidad,
        stock: stock

    });

    guardar();

    limpiar();

    mostrarMovimientos();

    mostrarStock();

}

// ===============================
// Guardar
// ===============================
function guardar() {

    localStorage.setItem(
        "kardex",
        JSON.stringify(movimientos)
    );

}

// ===============================
// MOSTRAR MOVIMIENTOS
// ===============================
function mostrarMovimientos() {

    let tbody = document.querySelector("#tablaMovimientos tbody");

    tbody.innerHTML = "";

    movimientos.forEach((m, indice) => {

        tbody.innerHTML += `

        <tr>

        <td>${m.fecha}</td>

        <td>${m.lote}</td>

        <td>${m.producto}</td>

        <td>${m.movimiento}</td>

        <td>${m.cantidad}</td>

        <td>${m.stock}</td>

        <td>

        <button onclick="eliminar(${indice})">

        Eliminar

        </button>

        </td>

        </tr>

        `;

    });

}

// ===============================
// MOSTRAR STOCK
// ===============================
function mostrarStock() {

    let tbody = document.querySelector("#tablaStock tbody");

    tbody.innerHTML = "";

    let stockActual = {};

    movimientos.forEach(m => {

        stockActual[m.lote] = {

            producto: m.producto,

            stock: m.stock

        };

    });

    for (let lote in stockActual) {

        tbody.innerHTML += `

        <tr>

        <td>${lote}</td>

        <td>${stockActual[lote].producto}</td>

        <td>${stockActual[lote].stock}</td>

        </tr>

        `;

    }

}

// ===============================
// Eliminar movimiento
// ===============================
function eliminar(indice) {

    if (!confirm("¿Eliminar este movimiento?"))
        return;

    movimientos.splice(indice, 1);

    // Recalcular stock
    recalcularStock();

    guardar();

    mostrarMovimientos();

    mostrarStock();

}

// ===============================
// Recalcular Stock
// ===============================
function recalcularStock() {

    let stockLotes = {};

    movimientos.forEach(m => {

        if (!(m.lote in stockLotes))
            stockLotes[m.lote] = 0;

        if (m.movimiento === "Entrada")
            stockLotes[m.lote] += m.cantidad;
        else
            stockLotes[m.lote] -= m.cantidad;

        m.stock = stockLotes[m.lote];

    });

}

// ===============================
// Nuevo Inventario
// ===============================
function nuevoInventario() {

    if (!confirm("¿Eliminar todo el inventario?"))
        return;

    movimientos = [];

    guardar();

    mostrarMovimientos();

    mostrarStock();

}

// ===============================
// Limpiar cajas
// ===============================
function limpiar() {

    document.getElementById("lote").value = "";

    document.getElementById("producto").value = "";

    document.getElementById("cantidad").value = "";

    document.getElementById("lote").focus();

}

