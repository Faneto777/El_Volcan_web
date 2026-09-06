const REGLAS_VALIDACION = {
  nombre: {
    requerido: true,
    validador: (valor) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(valor) && valor.trim().split(/\s+/).length >= 1 && valor.trim().length >= 3,
    mensaje: "Ingresa un nombre válido (mínimo 3 letras y solo letras).",
  },
  email: {
    requerido: true,
    validador: (valor) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor),
    mensaje: "Ingresa un correo electrónico válido (ej.: nombre@correo.com).",
  },
  telefono: {
    requerido: true,
    validador: (valor) => /^\d{7,15}$/.test(valor.replace(/\s/g, "")),
    mensaje: "Ingresa un teléfono válido (solo números, entre 7 y 15 dígitos).",
  },
  mensaje: {
    requerido: true,
    validador: (valor) => valor.trim().length >= 10,
    mensaje: "El mensaje debe tener al menos 10 caracteres.",
  },
  asunto: {
    requerido: true,
    validador: (valor) => valor !== "",
    mensaje: "Selecciona un asunto.",
  },
  direccion: {
    requerido: true,
    validador: (valor) => valor.trim().length >= 5,
    mensaje: "Ingresa una dirección válida (mínimo 5 caracteres).",
  },
  password: {
    requerido: true,
    validador: (valor) => /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(valor),
    mensaje: "La contraseña debe tener al menos 6 caracteres, una letra y un número.",
  },
  confirmar_password: {
    requerido: true,
    dependienteDe: "password",
    validador: (valor, formulario) => {
      const password = formulario.querySelector('[name="password"]');
      return password ? valor === password.value : false;
    },
    mensaje: "Las contraseñas no coinciden.",
  },
};

const VALORES_ASUNTO = ["", "Precios y cotizaciones", "Despacho y reparto", "Pedido de gas", "Atención a cliente", "Otro"];

function campoDe(input) {
  return input.closest(".campo-field");
}

function asignarError(input, existeError, mensaje) {
  const contenedor = campoDe(input);
  if (!contenedor) return;
  const ayuda = contenedor.querySelector(".mensaje-ayuda");
  contenedor.classList.toggle("error", existeError);
  contenedor.classList.toggle("valido", !existeError);
  if (ayuda) ayuda.textContent = existeError ? mensaje : "";
  input.setAttribute("aria-invalid", existeError ? "true" : "false");
}

function obtenerValor(input) {
  return input.type === "checkbox" ? input.checked : input.value;
}

function validarCampo(input) {
  const nombreCampo = input.getAttribute("name");
  if (!nombreCampo || !REGLAS_VALIDACION[nombreCampo]) return true;

  const regla = REGLAS_VALIDACION[nombreCampo];
  const valor = obtenerValor(input);
  const formulario = input.form;

  if (regla.requerido && String(valor).trim() === "") {
    asignarError(input, true, `Este campo es obligatorio.`);
    return false;
  }

  const esValido = regla.validador(String(valor), formulario);
  asignarError(input, !esValido, regla.mensaje);
  return esValido;
}

function configurarValidacionEnTiempoReal(formulario) {
  const campos = formulario.querySelectorAll("input, textarea, select");
  campos.forEach((input) => {
    const nombreCampo = input.getAttribute("name");
    if (!nombreCampo || !REGLAS_VALIDACION[nombreCampo]) return;

    if (input.tagName === "SELECT") {
      VALORES_ASUNTO.forEach((asunto) => {
        const opcion = document.createElement("option");
        opcion.value = asunto === "" ? "" : asunto;
        opcion.textContent = asunto === "" ? "Selecciona una opción" : asunto;
        input.appendChild(opcion);
      });
    }

    input.addEventListener("blur", () => validarCampo(input));
    input.addEventListener("input", () => {
      if (campoDe(input)) {
        const tieneError = campoDe(input).classList.contains("error");
        if (tieneError) validarCampo(input);
      }
    });

    if (nombreCampo === "confirmar_password") {
      const password = formulario.querySelector('[name="password"]');
      if (password) password.addEventListener("input", () => validarCampo(input));
    }
  });
}

function validarFormulario(formulario) {
  let formularioValido = true;
  const campos = formulario.querySelectorAll("input, textarea, select");
  const errores = [];

  campos.forEach((input) => {
    const nombreCampo = input.getAttribute("name");
    if (!nombreCampo || !REGLAS_VALIDACION[nombreCampo]) return;
    if (!validarCampo(input)) {
      formularioValido = false;
      errores.push(input);
    }
  });

  if (!formularioValido && errores.length > 0) {
    errores[0].focus();
  }
  return formularioValido;
}

function mostrarExito(formulario, texto) {
  const aviso = formulario.querySelector(".mensaje-exito");
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.classList.add("visible");
}

function limpiarCampos(formulario) {
  formulario.querySelectorAll(".campo-field").forEach((contenedor) => {
    contenedor.classList.remove("error", "valido");
  });
}

function configurarFormulario(formulario, mensajeExito, alExito) {
  configurarValidacionEnTiempoReal(formulario);
  formulario.setAttribute("novalidate", "novalidate");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (validarFormulario(formulario)) {
      if (alExito) {
        alExito(formulario);
      } else {
        mostrarExito(formulario, mensajeExito);
      }
      formulario.reset();
      limpiarCampos(formulario);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const formularioContacto = document.getElementById("formContacto");
  if (formularioContacto) {
    configurarFormulario(formularioContacto, "Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos a la brevedad.");
  }
});