const sectores = {
    1: { nombre: 'Sector GENERAL 1', tickets: [{ type: 'Entrada GENERAL 1', precio: 8000 }] },
    2: { nombre: 'Sector VIP', tickets: [{ type: 'Entrada VIP', precio: 10000 }] },
    3: { nombre: 'Sector GENERAL 2', tickets: [{ type: 'Entrada GENERAL 2', precio: 8000 }] },
    4: { nombre: 'Sector BALCON 4', tickets: [{ type: 'Entrada BALCON 4', precio: 6000 }] },
    5: { nombre: 'Sector BALCON 5', tickets: [{ type: 'Entrada BALCON 5', precio: 6000 }] },
};


const obtenerNombreSector = (numeroSector) => sectores[numeroSector].nombre;

const obtenerOpcionesEntradas = (numeroSector) => sectores[numeroSector].tickets;

const mostrarOpcionesEntradas = (numeroSector) => {
    const nombreSector = obtenerNombreSector(numeroSector);
    const ticket = obtenerOpcionesEntradas(numeroSector)[0];
    const ticketInfo = `
        <h3>Opciones para ${nombreSector}</h3>
        <p>${ticket.type} - $${ticket.precio}</p>
        <input type="number" id="cantidad-entradas" min="1" placeholder="Cantidad de entradas">
        <button onclick="seleccionarEntrada(${numeroSector})">Confirmar</button>
    `;

    document.getElementById('entradas').innerHTML = ticketInfo;

    
    localStorage.setItem('sectorSeleccionado', numeroSector);
};

let entradasSeleccionadas = [];

const seleccionarEntrada = (numeroSector) => {
    const cantidad = document.getElementById('cantidad-entradas').value;
    const ticket = obtenerOpcionesEntradas(numeroSector)[0];

    if (cantidad && cantidad > 0) {
    
        const seleccion = {
            sector: sectores[numeroSector].nombre,
            tipo: ticket.type,
            precio: ticket.precio,
            cantidad: parseInt(cantidad),
            total: calcularTotal(ticket.precio, cantidad)
        };

        entradasSeleccionadas.push(seleccion);

        localStorage.setItem('entradasSeleccionadas', JSON.stringify(entradasSeleccionadas));

        actualizarResumenEntradas();
    } else {
        alert('Por favor ingresa una cantidad válida');
    }
};


const actualizarResumenEntradas = () => {
    let resumenHTML = '<h3>Resumen de tus entradas:</h3>';
    let totalFinal = 0;

    entradasSeleccionadas.forEach((entrada, index) => {
        resumenHTML += `
            <p><strong>Sector:</strong> ${entrada.sector}</p>
            <p><strong>Tipo:</strong> ${entrada.tipo}</p>
            <p><strong>Cantidad:</strong> ${entrada.cantidad}</p>
            <p><strong>Total:</strong> $${entrada.total}</p>
            <hr>
        `;
        totalFinal += entrada.total;
    });

    resumenHTML += `<h4>Total acumulado a pagar: $${totalFinal}</h4>`;

    
    resumenHTML += `<button id="iniciar-pago" style="margin-top: 20px;">Iniciar Pago</button>`;

    document.getElementById('total').innerHTML = resumenHTML;

    
    document.getElementById('iniciar-pago').addEventListener('click', () => {
        iniciarProcesoPago();
    });
};

const iniciarProcesoPago = () => {
    Swal.fire({
        title: '¿Eres mayor de edad para realizar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Perfecto!',
                'Puedes proceder con la compra.',
                'success'
            ).then(() => {
                entradasSeleccionadas = [];
                localStorage.removeItem('entradasSeleccionadas');

                location.reload();
            });
        } else {
            Swal.fire(
                'Lo sentimos',
                'Debes ser mayor de edad para realizar la compra.',
                'error'
            );
        }
    });
};


const cargarEntradasDesdeStorage = () => {
    const entradasGuardadas = localStorage.getItem('entradasSeleccionadas');
    if (entradasGuardadas) {
        entradasSeleccionadas = JSON.parse(entradasGuardadas);
        actualizarResumenEntradas();
    }
};


cargarEntradasDesdeStorage();

const calcularTotal = (precio, cantidad) => precio * cantidad;

const asignarManejadoresEventos = () => {
    console.log("Asignando manejadores de eventos...");
    document.querySelectorAll('.sector').forEach(sector => {
        sector.addEventListener('click', (event) => {
            const numeroSector = event.target.getAttribute('data-sector');
            mostrarOpcionesEntradas(numeroSector);
        });
    });
};


asignarManejadoresEventos();
