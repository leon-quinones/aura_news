const CLAVE_MENSAJES = 'auraMensajesContacto';

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formulario = document.getElementById('formulario-contacto');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputAsunto = document.getElementById('asunto');
const inputMensaje = document.getElementById('mensaje');
const seccionFormulario = document.getElementById('seccion-formulario');
const seccionConfirmacion = document.getElementById('seccion-confirmacion');
const botonOtroMensaje = document.getElementById('boton-otro-mensaje');

function mostrarError(input, texto) {
  const campo = input.parentElement;
  campo.classList.add('error');
  campo.querySelector('.mensaje-error').textContent = texto;
}

function quitarError(input) {
  const campo = input.parentElement;
  campo.classList.remove('error');
  campo.querySelector('.mensaje-error').textContent = '';
}

function validarNombre() {
  const nombre = inputNombre.value.trim();
  if (nombre === '') {
    mostrarError(inputNombre, 'Escribe tu nombre completo');
    return false;
  }
  if (nombre.length < 3) {
    mostrarError(inputNombre, 'El nombre debe tener al menos 3 caracteres');
    return false;
  }
  quitarError(inputNombre);
  return true;
}

function validarCorreo() {
  const correo = inputCorreo.value.trim();
  if (correo === '') {
    mostrarError(inputCorreo, 'Escribe tu correo electrónico');
    return false;
  }
  if (FORMATO_CORREO.test(correo) === false) {
    mostrarError(inputCorreo, 'Ingresa un correo válido (ejemplo@correo.com)');
    return false;
  }
  quitarError(inputCorreo);
  return true;
}

function validarAsunto() {
  const asunto = inputAsunto.value.trim();
  if (asunto === '') {
    mostrarError(inputAsunto, 'Escribe el asunto de tu mensaje');
    return false;
  }
  quitarError(inputAsunto);
  return true;
}

function validarMensaje() {
  const mensaje = inputMensaje.value.trim();
  if (mensaje === '') {
    mostrarError(inputMensaje, 'Escribe tu mensaje');
    return false;
  }
  if (mensaje.length < 20) {
    mostrarError(inputMensaje, 'El mensaje debe tener al menos 20 caracteres (llevas ' + mensaje.length + ')');
    return false;
  }
  quitarError(inputMensaje);
  return true;
}

function guardarMensaje(nombre, correo, asunto, mensaje) {
  const mensajes = leerLista(CLAVE_MENSAJES);
  mensajes.push({
    nombre: nombre,
    correo: correo,
    asunto: asunto,
    mensaje: mensaje,
    fecha: new Date().toISOString()
  });
  guardarLista(CLAVE_MENSAJES, mensajes);
}

function mostrarConfirmacion(nombre, correo, asunto) {
  const primerNombre = nombre.split(' ')[0];

  document.getElementById('confirmacion-nombre').textContent = primerNombre;
  document.getElementById('confirmacion-correo').textContent = correo;
  document.getElementById('confirmacion-asunto').textContent = asunto;

  seccionFormulario.classList.add('oculto');
  seccionConfirmacion.classList.remove('oculto');
  window.scrollTo(0, 0);
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nombreValido = validarNombre();
  const correoValido = validarCorreo();
  const asuntoValido = validarAsunto();
  const mensajeValido = validarMensaje();

  if (nombreValido && correoValido && asuntoValido && mensajeValido) {
    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const asunto = inputAsunto.value.trim();
    const mensaje = inputMensaje.value.trim();

    guardarMensaje(nombre, correo, asunto, mensaje);
    mostrarConfirmacion(nombre, correo, asunto);
  }
});

inputNombre.addEventListener('input', function () {
  if (inputNombre.parentElement.classList.contains('error')) {
    validarNombre();
  }
});

inputCorreo.addEventListener('input', function () {
  if (inputCorreo.parentElement.classList.contains('error')) {
    validarCorreo();
  }
});

inputAsunto.addEventListener('input', function () {
  if (inputAsunto.parentElement.classList.contains('error')) {
    validarAsunto();
  }
});

inputMensaje.addEventListener('input', function () {
  if (inputMensaje.parentElement.classList.contains('error')) {
    validarMensaje();
  }
});

botonOtroMensaje.addEventListener('click', function () {
  formulario.reset();
  seccionConfirmacion.classList.add('oculto');
  seccionFormulario.classList.remove('oculto');
  window.scrollTo(0, 0);
});
