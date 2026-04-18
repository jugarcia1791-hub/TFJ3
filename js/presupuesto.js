
  // Elementos DOM
  // Contacto
  const nombreInput = document.getElementById('nombre');
  const apellidosInput = document.getElementById('apellidos');
  const telefonoInput = document.getElementById('telefono');
  const emailInput = document.getElementById('email');
  // Errores
  const nombreError = document.getElementById('nombreError');
  const apellidosError = document.getElementById('apellidosError');
  const telefonoError = document.getElementById('telefonoError');
  const emailError = document.getElementById('emailError');
  // Presupuesto
  const productRadios = document.querySelectorAll('input[name="producto"]');
  const plazoInput = document.getElementById('plazo');
  const extraGrabado = document.getElementById('extraGrabado');
  const extraCaja = document.getElementById('extraCaja');
  const extraMuestra = document.getElementById('extraMuestra');
  const presupuestoValorSpan = document.getElementById('presupuestoValor');
  const presupuestoDetalleSpan = document.getElementById('presupuestoDetalle');
  // Checkbox condiciones
  const condicionesCheck = document.getElementById('condiciones');
  const btnEnviar = document.getElementById('btnEnviar');
  const btnReset = document.getElementById('btnReset');
  const formFeedback = document.getElementById('formFeedback');

  // ----- Funciones de validación individuales (solo letras, longitud, etc) -----
  function validarNombre() {
    const nombre = nombreInput.value.trim();
    // Solo letras (incluye acentos y ñ) y espacios? El criterio dice "solo letras", sin espacios normalmente. Permitimos letras y espacios? Para apellidos completos permitimos espacios pero la consigna dice solo letras y max 40. Lo más estricto: letras y espacios simples entre palabras es razonable.
    // Usamos regex: letras y espacios (para nombre compuesto). Sin números ni símbolos.
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (nombre === '') {
      nombreError.innerHTML = '<i class="fas fa-exclamation-circle"></i> El nombre es obligatorio.';
      nombreInput.classList.add('input-error');
      return false;
    }
    if (!regexLetras.test(nombre)) {
      nombreError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Solo letras (sin números ni caracteres especiales).';
      nombreInput.classList.add('input-error');
      return false;
    }
    if (nombre.length > 15) {
      nombreError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Máximo 15 caracteres.';
      nombreInput.classList.add('input-error');
      return false;
    }
    nombreError.innerHTML = '';
    nombreInput.classList.remove('input-error');
    return true;
  }

  function validarApellidos() {
    const apellidos = apellidosInput.value.trim();
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (apellidos === '') {
      apellidosError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Los apellidos son obligatorios.';
      apellidosInput.classList.add('input-error');
      return false;
    }
    if (!regexLetras.test(apellidos)) {
      apellidosError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Solo letras y espacios.';
      apellidosInput.classList.add('input-error');
      return false;
    }
    if (apellidos.length > 40) {
      apellidosError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Máximo 40 caracteres.';
      apellidosInput.classList.add('input-error');
      return false;
    }
    apellidosError.innerHTML = '';
    apellidosInput.classList.remove('input-error');
    return true;
  }

  function validarTelefono() {
    let telefono = telefonoInput.value.trim();
    const regexNumeros = /^\d+$/;
    if (telefono === '') {
      telefonoError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Teléfono obligatorio.';
      telefonoInput.classList.add('input-error');
      return false;
    }
    if (!regexNumeros.test(telefono)) {
      telefonoError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Solo números (sin espacios, ni guiones).';
      telefonoInput.classList.add('input-error');
      return false;
    }
    if (telefono.length > 9) {
      telefonoError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Máximo 9 dígitos.';
      telefonoInput.classList.add('input-error');
      return false;
    }
    telefonoError.innerHTML = '';
    telefonoInput.classList.remove('input-error');
    return true;
  }

  function validarEmail() {
    const email = emailInput.value.trim();
    // Estándar de email básico
    const regexEmail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (email === '') {
      emailError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Correo electrónico obligatorio.';
      emailInput.classList.add('input-error');
      return false;
    }
    if (!regexEmail.test(email)) {
      emailError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Formato inválido (ej: nombre@dominio.com).';
      emailInput.classList.add('input-error');
      return false;
    }
    emailError.innerHTML = '';
    emailInput.classList.remove('input-error');
    return true;
  }

  // Validación global de contacto
  function validarContacto() {
    const nombreOk = validarNombre();
    const apellidosOk = validarApellidos();
    const telefonoOk = validarTelefono();
    const emailOk = validarEmail();
    return nombreOk && apellidosOk && telefonoOk && emailOk;
  }

  // ----- Cálculo de presupuesto dinámico (producto, plazo, extras) -----
  function calcularPresupuesto() {
    // 1. Producto seleccionado
    let productoSeleccionado = null;
    let precioBase = 0;
    let nombreProducto = '';
    for (const radio of productRadios) {
      if (radio.checked) {
        productoSeleccionado = radio.value;
        precioBase = parseFloat(radio.getAttribute('data-price'));
        if (productoSeleccionado === 'ambar') nombreProducto = 'Ámbar Nocturno';
        else if (productoSeleccionado === 'jardin') nombreProducto = 'Jardín Secreto';
        else if (productoSeleccionado === 'oud') nombreProducto = 'Rey de Oud';
        break;
      }
    }

    if (!productoSeleccionado) {
      presupuestoValorSpan.innerText = '$0.00';
      presupuestoDetalleSpan.innerText = 'Selecciona un producto para comenzar';
      return 0;
    }

    // 2. Plazo (días) y descuento
    let plazo = parseInt(plazoInput.value);
    if (isNaN(plazo) || plazo < 1) plazo = 1;
    if (plazo > 90) plazo = 90; // clamp visual
    let descuento = 0;
    if (plazo > 45) descuento = 0.10;   // 10% descuento
    else if (plazo > 20) descuento = 0.05; // 5% descuento
    else descuento = 0;

    // 3. Extras
    let extrasTotal = 0;
    let extrasList = [];
    if (extraGrabado.checked) {
      extrasTotal += 15;
      extrasList.push('Grabado (+$15)');
    }
    if (extraCaja.checked) {
      extrasTotal += 25;
      extrasList.push('Caja lujo (+$25)');
    }
    if (extraMuestra.checked) {
      extrasTotal += 10;
      extrasList.push('Muestra extra (+$10)');
    }

    // Cálculo final
    let subtotal = precioBase + extrasTotal;
    let descuentoAplicado = subtotal * descuento;
    let total = subtotal - descuentoAplicado;
    total = Math.round(total * 100) / 100;

    // Mostrar detalle formateado
    let descuentoTexto = descuento > 0 ? ` (${descuento * 100}% descuento por plazo >${plazo > 45 ? '45' : '20'} días)` : '';
    presupuestoValorSpan.innerText = `$${total.toFixed(2)}`;
    let extrasTexto = extrasList.length ? ` + Extras: ${extrasList.join(', ')}` : ' sin extras';
    presupuestoDetalleSpan.innerHTML = `${nombreProducto} ($${precioBase})${extrasTexto} - Plazo: ${plazo} días${descuentoTexto}<br><strong>Total: $${total.toFixed(2)}</strong>`;
    return total;
  }

  // Escuchar cambios en producto, plazo, extras
  function bindBudgetEvents() {
    productRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        calcularPresupuesto();
        actualizarBotonEnviar();
      });
    });
    plazoInput.addEventListener('input', () => {
      let val = parseInt(plazoInput.value);
      if (isNaN(val) || val < 1) plazoInput.value = 1;
      if (val > 90) plazoInput.value = 90;
      calcularPresupuesto();
      actualizarBotonEnviar();
    });
    extraGrabado.addEventListener('change', () => { calcularPresupuesto(); actualizarBotonEnviar(); });
    extraCaja.addEventListener('change', () => { calcularPresupuesto(); actualizarBotonEnviar(); });
    extraMuestra.addEventListener('change', () => { calcularPresupuesto(); actualizarBotonEnviar(); });
  }

  // Validación de que todos los campos contacto + producto seleccionado + condiciones marcadas
  function isFormCompleto() {
    // Contacto validado
    const contactoValido = validarContacto();
    // Producto seleccionado
    let productSelected = false;
    for (const radio of productRadios) {
      if (radio.checked) { productSelected = true; break; }
    }
    const condicionesOk = condicionesCheck.checked;
    // Plazo debe ser válido
    let plazoValido = true;
    const plazoVal = parseInt(plazoInput.value);
    if (isNaN(plazoVal) || plazoVal < 1 || plazoVal > 90) plazoValido = false;

    return contactoValido && productSelected && condicionesOk && plazoValido;
  }

  function actualizarBotonEnviar() {
    if (isFormCompleto()) {
      btnEnviar.disabled = false;
    } else {
      btnEnviar.disabled = true;
    }
  }

  // Resetear formulario completo
  function resetFormulario() {
    // Limpiar campos contacto
    nombreInput.value = '';
    apellidosInput.value = '';
    telefonoInput.value = '';
    emailInput.value = '';
    // Limpiar errores visuales
    [nombreInput, apellidosInput, telefonoInput, emailInput].forEach(inp => inp.classList.remove('input-error'));
    nombreError.innerHTML = '';
    apellidosError.innerHTML = '';
    telefonoError.innerHTML = '';
    emailError.innerHTML = '';
    // Resetear producto (ninguno seleccionado)
    productRadios.forEach(radio => radio.checked = false);
    // Resetear plazo a 15 por defecto
    plazoInput.value = 15;
    // Desmarcar extras
    extraGrabado.checked = false;
    extraCaja.checked = false;
    extraMuestra.checked = false;
    // Desmarcar condiciones
    condicionesCheck.checked = false;
    // Recalcular presupuesto (mostrará 0)
    calcularPresupuesto();
    formFeedback.innerHTML = '';
    btnEnviar.disabled = true;  // porque falta producto, condiciones y contacto
  }

  // Envío del presupuesto
  function enviarPresupuesto() {
    if (!isFormCompleto()) {
      formFeedback.innerHTML = '<span style="color:#d9534f;"><i class="fas fa-times-circle"></i> Completa todos los datos de contacto, selecciona un producto, acepta las condiciones y verifica el plazo.</span>';
      return;
    }
    // Validación extra de email etc ya está hecha.
    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const email = emailInput.value.trim();

    let productoSeleccionadoNombre = '';
    let precioFinal = 0;
    for (const radio of productRadios) {
      if (radio.checked) {
        if (radio.value === 'ambar') productoSeleccionadoNombre = 'Ámbar Nocturno';
        else if (radio.value === 'jardin') productoSeleccionadoNombre = 'Jardín Secreto';
        else productoSeleccionadoNombre = 'Rey de Oud';
        break;
      }
    }
    precioFinal = parseFloat(presupuestoValorSpan.innerText.replace('$', ''));
    const plazo = plazoInput.value;
    const extras = [];
    if (extraGrabado.checked) extras.push('Grabado');
    if (extraCaja.checked) extras.push('Caja lujo');
    if (extraMuestra.checked) extras.push('Muestra extra');
    const extrasStr = extras.length ? extras.join(', ') : 'Ninguno';

    // Simular envío satisfactorio
    formFeedback.innerHTML = `<span style="color:#2c7a4a;"><i class="fas fa-check-circle"></i> ¡Presupuesto enviado! Hemos recibido tu solicitud. Revisaremos los datos: ${nombre} ${apellidos}, tel: ${telefono}, email: ${email}. Producto: ${productoSeleccionadoNombre}, plazo: ${plazo} días, extras: ${extrasStr}. Total: $${precioFinal.toFixed(2)}. Te contactaremos pronto.</span>`;
    // Opcional: reset? No se pide, pero se puede dejar mensaje.
    // Deshabilitar botón momentáneamente para evitar doble envío?
    btnEnviar.disabled = true;
    setTimeout(() => {
      if (isFormCompleto()) btnEnviar.disabled = false;
    }, 2000);
  }

  // Listeners adicionales a inputs de contacto para actualizar botón y validación en tiempo real
  function bindContactEvents() {
    nombreInput.addEventListener('input', () => { validarNombre(); actualizarBotonEnviar(); });
    apellidosInput.addEventListener('input', () => { validarApellidos(); actualizarBotonEnviar(); });
    telefonoInput.addEventListener('input', () => { validarTelefono(); actualizarBotonEnviar(); });
    emailInput.addEventListener('input', () => { validarEmail(); actualizarBotonEnviar(); });
    condicionesCheck.addEventListener('change', () => actualizarBotonEnviar());
    plazoInput.addEventListener('input', () => actualizarBotonEnviar());
  }

  // Inicializar
  function init() {
    bindBudgetEvents();
    bindContactEvents();
    // Seleccionar un producto por defecto? La consigna no lo exige, pero para que el usuario vea ejemplo opcional mejor dejamos sin ninguno seleccionado. Así obliga a elegir.
    // Calculamos presupuesto inicial (0)
    calcularPresupuesto();
    actualizarBotonEnviar();
    btnEnviar.addEventListener('click', enviarPresupuesto);
    btnReset.addEventListener('click', resetFormulario);
    // Validación extra en submit manual
  }
  init();
