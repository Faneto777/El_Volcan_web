const CLAVE_SESION = "elvolcan_sesion";
const CLAVE_USUARIOS = "elvolcan_usuarios";

function obtenerUsuarioDemo() {
  return {
    id: "demo",
    nombre: "Cliente Demo",
    email: "clientedemo@gmail.com",
    password: "demo123",
  };
}

function obtenerUsuarios() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
    if (Array.isArray(datos)) return datos;
  } catch (error) {}
  const inicial = [obtenerUsuarioDemo()];
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(inicial));
  return inicial;
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function buscarUsuario(email) {
  return obtenerUsuarios().find((usuario) => String(usuario.email).toLowerCase() === String(email).toLowerCase());
}

function crearUsuario(datos) {
  if (buscarUsuario(datos.email)) return false;
  const usuarios = obtenerUsuarios();
  usuarios.push({
    id: "u" + Date.now(),
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono || "",
    direccion: datos.direccion || "",
    password: datos.password,
  });
  guardarUsuarios(usuarios);
  return true;
}

function iniciarSesion(email, password) {
  const usuario = buscarUsuario(email);
  if (!usuario || usuario.password !== password) return false;
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: usuario.nombre, email: usuario.email }));
  return true;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

function estaLogueado() {
  return obtenerSesion() !== null;
}

function paginaActual() {
  return location.pathname.split("/").pop() || "index.html";
}

function obtenerRedireccion() {
  const params = new URLSearchParams(location.search);
  let destino = params.get("redirect");
  if (!destino) destino = "index.html";
  if (destino === "login.html" || destino === "registro.html") destino = "index.html";
  return destino;
}

function urlLoginConRedireccion() {
  return "login.html?redirect=" + encodeURIComponent(paginaActual());
}

function escaparHTMLSesion(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function notificarSesion(mensaje) {
  let aviso = document.getElementById("notificacion");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "notificacion";
    aviso.className = "notificacion";
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  clearTimeout(aviso._temporizador);
  aviso._temporizador = setTimeout(() => {
    aviso.classList.remove("visible");
  }, 2400);
}

function enlacesCuenta() {
  return '<a href="login.html">Ingresar</a><a href="registro.html">Registro</a>';
}

function actualizarAreaCuenta() {
  const area = document.getElementById("areaCuenta");
  if (!area) return;
  const sesion = obtenerSesion();
  area.innerHTML = sesion
    ? '<span class="usuario-activo">Hola, ' + escaparHTMLSesion(sesion.nombre) + "</span>" +
      '<button type="button" class="boton-cerrar-sesion" id="btnCerrarSesion">Cerrar sesión</button>'
    : enlacesCuenta();
}

document.addEventListener("click", (evento) => {
  if (evento.target.closest("#btnCerrarSesion")) {
    cerrarSesion();
    actualizarAreaCuenta();
    notificarSesion("Has cerrado tu sesión.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarAreaCuenta();

  const formularioLogin = document.getElementById("formLogin");
  if (formularioLogin) {
    configurarFormulario(formularioLogin, "", (formulario) => {
      const email = formulario.querySelector('[name="email"]').value.trim();
      const password = formulario.querySelector('[name="password"]').value;
      const aviso = formulario.querySelector(".mensaje-exito");
      if (iniciarSesion(email, password)) {
        aviso.className = "mensaje-exito visible";
        aviso.textContent = "Sesión iniciada correctamente. Redirigiendo...";
        setTimeout(() => {
          window.location.href = obtenerRedireccion();
        }, 900);
      } else {
        aviso.className = "mensaje-exito visible error";
        aviso.textContent = "Correo o contraseña incorrectos. Revisa tus datos o usa la cuenta de prueba.";
      }
    });
  }

  const formularioRegistro = document.getElementById("formRegistro");
  if (formularioRegistro) {
    configurarFormulario(formularioRegistro, "", (formulario) => {
      const nombre = formulario.querySelector('[name="nombre"]').value.trim();
      const email = formulario.querySelector('[name="email"]').value.trim();
      const telefono = formulario.querySelector('[name="telefono"]').value.trim();
      const direccion = formulario.querySelector('[name="direccion"]').value.trim();
      const password = formulario.querySelector('[name="password"]').value;
      const aviso = formulario.querySelector(".mensaje-exito");
      if (crearUsuario({ nombre, email, telefono, direccion, password })) {
        iniciarSesion(email, password);
        aviso.className = "mensaje-exito visible";
        aviso.textContent = "Cuenta creada correctamente. Iniciando sesión...";
        setTimeout(() => {
          window.location.href = obtenerRedireccion();
        }, 900);
      } else {
        aviso.className = "mensaje-exito visible error";
        aviso.textContent = "Ya existe una cuenta registrada con ese correo electrónico.";
      }
    });
  }

  const botonDemo = document.getElementById("btnUsarDemo");
  if (botonDemo && formularioLogin) {
    botonDemo.addEventListener("click", () => {
      formularioLogin.querySelector('[name="email"]').value = obtenerUsuarioDemo().email;
      formularioLogin.querySelector('[name="password"]').value = obtenerUsuarioDemo().password;
      formularioLogin.requestSubmit();
    });
  }
});