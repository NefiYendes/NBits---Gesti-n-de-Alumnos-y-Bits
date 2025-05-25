document.addEventListener('DOMContentLoaded', () => {
    let alumnos = [];
    let totalBits = 60;

    const savedAlumnos = localStorage.getItem('alumnos');
    const savedTotalBits = localStorage.getItem('totalBits');

    if (savedAlumnos) {
        alumnos = JSON.parse(savedAlumnos);
        alumnos.forEach(alumno => crearTarjeta(alumno));
    }

    if (savedTotalBits) {
        totalBits = parseInt(savedTotalBits);
    }

    function actualizarTotalBits() {
        document.getElementById('central-bits').value = totalBits;
        localStorage.setItem('totalBits', totalBits);
    }

    function crearTarjeta(alumno) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('container');
        tarjeta.innerHTML = `
        <div class='general'>
        <p>${alumno.nombre}</p>
        <p>${alumno.edad} años</p>
        <div class="coins">
        <label for="coins">Bits:</label>
        <input class="Bits" type="number" min="0" max="60" value="${alumno.bits}">
        </div>
        </div>
        <button class="eliminar"><img src="./Iconos/icons8-cancelar-64.png" alt="Eliminar"</button>
        `;

        const inputBits = tarjeta.querySelector('.Bits');
        inputBits.addEventListener('change', (event) => {
            const nuevoValor = parseInt(event.target.value);
            const diferencia = nuevoValor - alumno.bits;

            if (totalBits - diferencia >= 0) {
                alumno.bits = nuevoValor;
                totalBits -= diferencia;
                actualizarTotalBits();
                localStorage.setItem('alumnos', JSON.stringify(alumnos));
            } else {
                alert('No hay suficientes bits disponibles.');
                event.target.value = alumno.bits;
            }
        });

        const botonEliminar = tarjeta.querySelector('.eliminar');
        botonEliminar.addEventListener('click', () => {
            totalBits += alumno.bits;
            alumnos = alumnos.filter(a => a !== alumno);
            localStorage.setItem('alumnos', JSON.stringify(alumnos));
            tarjeta.remove();
            actualizarTotalBits();
        });

        document.getElementById("grid").appendChild(tarjeta);
    }

    document.getElementById('enviar').addEventListener('click', (event) => {
        event.preventDefault();
        const nombre = document.getElementById('Nombre').value;
        const edad = document.getElementById('edad').value;
        const monedas = parseInt(document.getElementById('monedas').value) || 0;

        if (!nombre) {
            alert('Ingrese el nombre de un alumno');
            return;
        }

        const alumno = { nombre, edad, bits: monedas };
        alumnos.push(alumno);

        if (monedas > totalBits) {
            alert('No hay suficientes bits disponibles.');
            return;
        }

        totalBits -= monedas;
        actualizarTotalBits();
        crearTarjeta(alumno);
        document.querySelector('form').reset();
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
    });

    actualizarTotalBits();
});

