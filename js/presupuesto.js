document.addEventListener('DOMContentLoaded', function() {
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const producto = document.getElementById('producto');
    const plazo = document.getElementById('plazo');
    const extras = document.querySelectorAll('input[type="checkbox"]:not(#condiciones)');
    const condiciones = document.getElementById('condiciones');
    const presupuestoFinal = document.getElementById('presupuestoFinal');
    const form = document.getElementById('presupuestoForm');
    const resetBtn = document.getElementById('resetBtn');

    const regexNombre = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{1,15}$/;
    const regexApellidos = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{1,40}$/;
    const regexTelefono = /^\d{1,9}$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    function validarCampo(input, regex, errorId) {
        const errorElement = document.getElementById(errorId);
        if (!regex.test(input.value)) {
            input.classList.add('error');
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    }

    function calcularPresupuesto() {
        let precioBase = parseFloat(producto.value);
        let meses = parseInt(plazo.value) || 1;
        let descuento = Math.min(meses * 5, 25);
        let precioConDescuento = precioBase * (1 - descuento / 100);
        
        let precioExtras = 0;
        extras.forEach(extra => {
            if (extra.checked) {
                if (extra.id === 'extra2') {
                    precioExtras += parseFloat(extra.value) * meses;
                } else {
                    precioExtras += parseFloat(extra.value);
                }
            }
        });
        
        let precioFinal = precioConDescuento + precioExtras;
        presupuestoFinal.textContent = precioFinal.toFixed(2) + '€';
        return precioFinal;
    }

    producto.addEventListener('change', calcularPresupuesto);
    plazo.addEventListener('input', calcularPresupuesto);
    extras.forEach(extra => extra.addEventListener('change', calcularPresupuesto));

    nombre.addEventListener('input', function() {
        validarCampo(this, regexNombre, 'error-nombre');
    });
    apellidos.addEventListener('input', function() {
        validarCampo(this, regexApellidos, 'error-apellidos');
    });
    telefono.addEventListener('input', function() {
        validarCampo(this, regexTelefono, 'error-telefono');
    });
    email.addEventListener('input', function() {
        validarCampo(this, regexEmail, 'error-email');
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombreValido = validarCampo(nombre, regexNombre, 'error-nombre');
        const apellidosValido = validarCampo(apellidos, regexApellidos, 'error-apellidos');
        const telefonoValido = validarCampo(telefono, regexTelefono, 'error-telefono');
        const emailValido = validarCampo(email, regexEmail, 'error-email');
        const condicionesAceptadas = condiciones.checked;
        
        if (nombreValido && apellidosValido && telefonoValido && emailValido && condicionesAceptadas) {
            const presupuesto = calcularPresupuesto();
            alert(`¡Presupuesto enviado correctamente!\n\nDatos:\nNombre: ${nombre.value} ${apellidos.value}\nEmail: ${email.value}\nTeléfono: ${telefono.value}\nPresupuesto final: ${presupuestoFinal.textContent}\n\nPronto nos pondremos en contacto contigo.`);
            form.reset();
            presupuestoFinal.textContent = '0€';
        } else {
            if (!condicionesAceptadas) {
                alert('Debes aceptar las condiciones de privacidad');
            } else {
                alert('Por favor, corrige los errores en el formulario');
            }
        }
    });

    resetBtn.addEventListener('click', function() {
        form.reset();
        presupuestoFinal.textContent = '0€';
        [nombre, apellidos, telefono, email].forEach(campo => campo.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
    });

    calcularPresupuesto();
});