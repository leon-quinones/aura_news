const CLAVE_PERFIL = 'auraPerfil';

const MAXIMO_CATEGORIAS = 3;

const PERFIL_POR_DEFECTO = {
  nombre: 'Sofía Alana',
  correo: 'sofia.alana@auranews.com',
  categorias: ['Modelos', 'Ciencia']
};

const formularioPerfil = document.getElementById('formulario-perfil');
const campoNombre = document.getElementById('nombre');
const campoCorreo = document.getElementById('correo');
const listaCategorias = document.getElementById('lista-categorias');
const avisoLimite = document.getElementById('aviso-limite');
const mensajeExito = document.getElementById('mensaje-exito');
const avatarInicial = document.getElementById('avatar-inicial');
const nombreUsuario = document.getElementById('nombre-usuario');
const enlaceMisTemas = document.getElementById('enlace-mis-temas');
const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');

let categoriasElegidas = [];

function leerPerfil() {
  const texto = localStorage.getItem(CLAVE_PERFIL);
  if (texto === null) {
    return PERFIL_POR_DEFECTO;
  }
  return JSON.parse(texto);
}

function guardarPerfil(perfil) {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
}

function mostrarTarjetaUsuario(nombre) {
  avatarInicial.textContent = nombre.charAt(0).toUpperCase();
  nombreUsuario.textContent = nombre;
}

function actualizarEnlaceTemas(categorias) {
  if (categorias.length > 0) {
    enlaceMisTemas.href = 'noticias.html?categoria=' + categorias[0];
    enlaceMisTemas.classList.remove('oculto');
  } else {
    enlaceMisTemas.classList.add('oculto');
  }
}

function dibujarChips() {
  let html = '';
  for (let i = 0; i < CATEGORIAS.length; i++) {
    const categoria = CATEGORIAS[i];
    let clase = 'chip';
    if (categoriasElegidas.includes(categoria)) {
      clase = 'chip activo';
    }
    html += `<button type="button" class="${clase}" data-categoria="${categoria}">${categoria}</button>`;
  }
  listaCategorias.innerHTML = html;

  const chips = listaCategorias.querySelectorAll('.chip');
  for (let i = 0; i < chips.length; i++) {
    chips[i].addEventListener('click', function () {
      alternarCategoria(chips[i]);
    });
  }
}

function alternarCategoria(chip) {
  const categoria = chip.dataset.categoria;
  const posicion = categoriasElegidas.indexOf(categoria);

  if (posicion !== -1) {
    categoriasElegidas.splice(posicion, 1);
    chip.classList.remove('activo');
    avisoLimite.classList.add('oculto');
  } else if (categoriasElegidas.length >= MAXIMO_CATEGORIAS) {
    avisoLimite.classList.remove('oculto');
  } else {
    categoriasElegidas.push(categoria);
    chip.classList.add('activo');
  }
}

function cargarPerfilEnPagina() {
  const perfil = leerPerfil();
  campoNombre.value = perfil.nombre;
  campoCorreo.value = perfil.correo;

  categoriasElegidas = perfil.categorias.slice();

  mostrarTarjetaUsuario(perfil.nombre);
  actualizarEnlaceTemas(perfil.categorias);
  dibujarChips();
}

function mostrarError(campo, mensaje) {
  const contenedor = campo.parentElement;
  contenedor.classList.add('error');
  contenedor.querySelector('.mensaje-error').textContent = mensaje;
}

function quitarError(campo) {
  campo.parentElement.classList.remove('error');
}

function validarPerfil() {
  let esValido = true;
  const nombre = campoNombre.value.trim();
  const correo = campoCorreo.value.trim();

  const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nombre === '') {
    mostrarError(campoNombre, 'El nombre es obligatorio.');
    esValido = false;
  }

  if (correo === '') {
    mostrarError(campoCorreo, 'El correo es obligatorio.');
    esValido = false;
  } else if (!formatoCorreo.test(correo)) {
    mostrarError(campoCorreo, 'Escribe un correo válido, por ejemplo nombre@correo.com');
    esValido = false;
  }

  return esValido;
}

function guardarCambios(evento) {
  evento.preventDefault();

  if (!validarPerfil()) {
    return;
  }

  const perfil = {
    nombre: campoNombre.value.trim(),
    correo: campoCorreo.value.trim(),
    categorias: categoriasElegidas.slice()
  };
  guardarPerfil(perfil);

  mostrarTarjetaUsuario(perfil.nombre);
  actualizarEnlaceTemas(perfil.categorias);
  avisoLimite.classList.add('oculto');

  mensajeExito.classList.remove('oculto');
  setTimeout(function () {
    mensajeExito.classList.add('oculto');
  }, 3000);
}

function cerrarSesion() {
  if (confirm('¿Quieres cerrar sesión?')) {
    localStorage.removeItem(CLAVE_PERFIL);
    window.location.href = 'index.html';
  }
}

campoNombre.addEventListener('input', function () {
  quitarError(campoNombre);
});
campoCorreo.addEventListener('input', function () {
  quitarError(campoCorreo);
});

formularioPerfil.addEventListener('submit', guardarCambios);
botonCerrarSesion.addEventListener('click', cerrarSesion);

cargarPerfilEnPagina();
