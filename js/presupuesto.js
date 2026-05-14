// Precios de productos
const preciosProductos = {
  89: 89,
  59: 59,
  29: 29,
};

// Función para validar nombre (solo letras, max 15)
function validarNombre(nombre) {
  const regex = /^[A-Za-záéíóúñÁÉÍÓÚÑ]+$/;
  return regex.test(nombre) && nombre.length <= 15;
}

// Función para validar apellidos (solo letras, max 40)
function validarApellidos(apellidos) {
  const regex = /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/;
  return regex.test(apellidos) && apellidos.length <= 40;
}

// Función para validar teléfono (solo números, max 9)
function validarTelefono(telefono) {
  const regex = /^\d+$/;
  return regex.test(telefono) && telefono.length <= 9;
}

// Función para validar email
function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

// Función para validar todos los campos de contacto
function validarContacto() {
  let isValid = true;

  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;

  // Validar nombre
  if (!validarNombre(nombre)) {
    document.getElementById("errorNombre").classList.add("active");
    document.getElementById("nombre").classList.add("input-error");
    isValid = false;
  } else {
    document.getElementById("errorNombre").classList.remove("active");
    document.getElementById("nombre").classList.remove("input-error");
  }

  // Validar apellidos
  if (!validarApellidos(apellidos)) {
    document.getElementById("errorApellidos").classList.add("active");
    document.getElementById("apellidos").classList.add("input-error");
    isValid = false;
  } else {
    document.getElementById("errorApellidos").classList.remove("active");
    document.getElementById("apellidos").classList.remove("input-error");
  }

  // Validar teléfono
  if (!validarTelefono(telefono)) {
    document.getElementById("errorTelefono").classList.add("active");
    document.getElementById("telefono").classList.add("input-error");
    isValid = false;
  } else {
    document.getElementById("errorTelefono").classList.remove("active");
    document.getElementById("telefono").classList.remove("input-error");
  }

  // Validar email
  if (!validarEmail(email)) {
    document.getElementById("errorEmail").classList.add("active");
    document.getElementById("email").classList.add("input-error");
    isValid = false;
  } else {
    document.getElementById("errorEmail").classList.remove("active");
    document.getElementById("email").classList.remove("input-error");
  }

  return isValid;
}

// Función para calcular el presupuesto en tiempo real
function calcularPresupuesto() {
  // Obtener producto seleccionado
  const productoSelect = document.getElementById("producto");
  const precioProducto = parseFloat(productoSelect.value);

  if (isNaN(precioProducto) || precioProducto === 0) {
    document.getElementById("presupuestoTotal").textContent = "$0.00";
    document.getElementById("presupuestoDetalle").textContent =
      "Selecciona un producto";
    return;
  }

  // Obtener plazo
  let plazo = parseInt(document.getElementById("plazo").value);
  if (isNaN(plazo)) plazo = 30;

  // Calcular descuento por plazo
  let descuento = 0;
  if (plazo >= 60) {
    descuento = 0.1; // 10% de descuento
  } else if (plazo >= 30) {
    descuento = 0.05; // 5% de descuento
  }

  // Calcular subtotal con descuento
  let subtotal = precioProducto * (1 - descuento);

  // Calcular extras seleccionados
  let extrasTotal = 0;
  const extras = document.querySelectorAll('input[type="checkbox"]:checked');
  extras.forEach((extra) => {
    extrasTotal += parseFloat(extra.value);
  });

  // Calcular total final
  const total = subtotal + extrasTotal;

  // Mostrar presupuesto
  document.getElementById("presupuestoTotal").textContent =
    `$${total.toFixed(2)}`;

  // Mostrar detalle
  let detalle = `Producto: $${precioProducto.toFixed(2)} | `;
  if (descuento > 0) {
    detalle += `Descuento: ${descuento * 100}% | `;
  }
  detalle += `Extras: +$${extrasTotal.toFixed(2)}`;
  document.getElementById("presupuestoDetalle").textContent = detalle;
}

// Función para resetear el formulario
function resetFormulario() {
  document.getElementById("presupuestoForm").reset();
  document.getElementById("nombre").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("email").value = "";
  document.getElementById("plazo").value = "30";

  // Quitar clases de error
  document.querySelectorAll(".error-message").forEach((error) => {
    error.classList.remove("active");
  });
  document.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });

  // Ocultar mensaje de éxito
  document.getElementById("successMessage").classList.remove("active");

  // Recalcular presupuesto
  calcularPresupuesto();
}

// Función para enviar el formulario
function enviarFormulario() {
  // Validar datos de contacto
  if (!validarContacto()) {
    alert("❌ Por favor, corrige los errores en el formulario de contacto.");
    return;
  }

  // Validar que se haya seleccionado un producto
  const producto = document.getElementById("producto").value;
  if (producto === "0") {
    alert("❌ Por favor, selecciona un producto.");
    return;
  }

  // Validar que se acepten las condiciones
  const condiciones = document.getElementById("condiciones").checked;
  if (!condiciones) {
    alert(
      "❌ Debes aceptar las condiciones de privacidad para enviar el presupuesto.",
    );
    return;
  }

  // Mostrar mensaje de éxito
  const successMessage = document.getElementById("successMessage");
  successMessage.classList.add("active");

  // Opcional: Aquí podrías enviar los datos a un servidor
  console.log("Formulario enviado:", {
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    producto: document.getElementById("producto").value,
    plazo: document.getElementById("plazo").value,
    extras: obtenerExtras(),
    total: document.getElementById("presupuestoTotal").textContent,
  });

  // Scroll al mensaje de éxito
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Opcional: Resetear después de 3 segundos
  setTimeout(() => {
    if (
      confirm("¿Quieres resetear el formulario para hacer otro presupuesto?")
    ) {
      resetFormulario();
    }
  }, 3000);
}

// Función auxiliar para obtener los extras seleccionados
function obtenerExtras() {
  const extras = [];
  if (document.getElementById("extra1").checked) extras.push("frasco de 500ml");
  if (document.getElementById("extra2").checked) extras.push("Envío Express");
  if (document.getElementById("extra3").checked)
    extras.push(" Seguro de Daños");
  if (document.getElementById("extra4").checked)
    extras.push("extracto puro de vainilla");
  return extras;
}

// Event listeners para actualizar presupuesto en tiempo real
document
  .getElementById("producto")
  .addEventListener("change", calcularPresupuesto);
document.getElementById("plazo").addEventListener("input", calcularPresupuesto);

// Event listeners para los extras
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", calcularPresupuesto);
});

// Validación en tiempo real para los campos de contacto
document.getElementById("nombre").addEventListener("input", function () {
  if (this.value === "") return;
  if (!validarNombre(this.value)) {
    document.getElementById("errorNombre").classList.add("active");
    this.classList.add("input-error");
  } else {
    document.getElementById("errorNombre").classList.remove("active");
    this.classList.remove("input-error");
  }
});

document.getElementById("apellidos").addEventListener("input", function () {
  if (this.value === "") return;
  if (!validarApellidos(this.value)) {
    document.getElementById("errorApellidos").classList.add("active");
    this.classList.add("input-error");
  } else {
    document.getElementById("errorApellidos").classList.remove("active");
    this.classList.remove("input-error");
  }
});

document.getElementById("telefono").addEventListener("input", function () {
  if (this.value === "") return;
  if (!validarTelefono(this.value)) {
    document.getElementById("errorTelefono").classList.add("active");
    this.classList.add("input-error");
  } else {
    document.getElementById("errorTelefono").classList.remove("active");
    this.classList.remove("input-error");
  }
});

document.getElementById("email").addEventListener("input", function () {
  if (this.value === "") return;
  if (!validarEmail(this.value)) {
    document.getElementById("errorEmail").classList.add("active");
    this.classList.add("input-error");
  } else {
    document.getElementById("errorEmail").classList.remove("active");
    this.classList.remove("input-error");
  }
});

// Calcular presupuesto inicial
calcularPresupuesto();
