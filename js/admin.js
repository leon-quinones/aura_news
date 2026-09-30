const formulario = document.getElementById('formulario-noticia');
const campoTitulo = document.getElementById('titulo');
const campoCategoria = document.getElementById('categoria');
const campoFuente = document.getElementById('fuente');
const campoImagen = document.getElementById('imagen');
const campoResumen = document.getElementById('resumen');
const campoContenido = document.getElementById('contenido');
const contadorResumen = document.getElementById('contador-resumen');
const mensajeExito = document.getElementById('mensaje-exito');
const listaAdmin = document.getElementById('lista-admin');
const contadorNoticias = document.getElementById('contador-noticias');
const botonRestaurar = document.getElementById('boton-restaurar');

const MAXIMO_RESUMEN = 160;

function llenarCategorias() {
  for (let i = 0; i < CATEGORIAS.length; i++) {
    campoCategoria.innerHTML += `<option value="${CATEGORIAS[i]}">${CATEGORIAS[i]}</option>`;
  }
}

function mostrarError(campo, mensaje) {
  const contenedor = campo.parentElement;
  contenedor.classList.add('error');
  contenedor.querySelector('.mensaje-error').textContent = mensaje;
}

function quitarError(campo) {
  campo.parentElement.classList.remove('error');
}

function validarFormulario() {
  let esValido = true;

  const titulo = campoTitulo.value.trim();
  const categoria = campoCategoria.value;
  const fuente = campoFuente.value.trim();
  const imagen = campoImagen.value.trim();
  const resumen = campoResumen.value.trim();
  const contenido = campoContenido.value.trim();

  if (titulo === '') {
    mostrarError(campoTitulo, 'El título es obligatorio.');
    esValido = false;
  } else if (titulo.length < 10) {
    mostrarError(campoTitulo, 'El título debe tener al menos 10 caracteres.');
    esValido = false;
  }

  if (categoria === '') {
    mostrarError(campoCategoria, 'Elige una categoría.');
    esValido = false;
  }

  if (fuente === '') {
    mostrarError(campoFuente, 'La fuente es obligatoria.');
    esValido = false;
  }

  if (imagen === '') {
    mostrarError(campoImagen, 'La URL de la imagen es obligatoria.');
    esValido = false;
  } else if (!imagen.startsWith('http') && !imagen.startsWith('db/img/')) {
    mostrarError(campoImagen, 'La imagen debe empezar por "http" o "db/img/".');
    esValido = false;
  }

  if (resumen === '') {
    mostrarError(campoResumen, 'El resumen es obligatorio.');
    esValido = false;
  } else if (resumen.length > MAXIMO_RESUMEN) {
    mostrarError(campoResumen, 'El resumen puede tener máximo 160 caracteres.');
    esValido = false;
  }

  if (contenido === '') {
    mostrarError(campoContenido, 'El contenido es obligatorio.');
    esValido = false;
  } else if (contenido.length < 50) {
    mostrarError(campoContenido, 'El contenido debe tener al menos 50 caracteres.');
    esValido = false;
  }

  return esValido;
}

function actualizarContador() {
  const largo = campoResumen.value.length;
  contadorResumen.textContent = largo + '/' + MAXIMO_RESUMEN;

  if (largo > MAXIMO_RESUMEN) {
    contadorResumen.classList.add('excedido');
  } else {
    contadorResumen.classList.remove('excedido');
  }
}

function obtenerFechaHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();

  let mes = String(hoy.getMonth() + 1);
  let dia = String(hoy.getDate());

  if (mes.length === 1) {
    mes = '0' + mes;
  }
  if (dia.length === 1) {
    dia = '0' + dia;
  }
  return anio + '-' + mes + '-' + dia;
}

function separarParrafos(texto) {
  const partes = texto.split('\n\n');
  const parrafos = [];
  for (let i = 0; i < partes.length; i++) {
    const parrafo = partes[i].trim();

    if (parrafo !== '') {
      parrafos.push(parrafo);
    }
  }
  return parrafos;
}

function calcularTiempoLectura(texto) {
  const palabras = texto.trim().split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200);
  if (minutos < 1) {
    return 1;
  }
  return minutos;
}

function publicarNoticia(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const titulo = campoTitulo.value.trim();
  const fuente = campoFuente.value.trim();
  const contenido = campoContenido.value.trim();

  const noticia = {
    titulo: titulo,
    resumen: campoResumen.value.trim(),
    contenido: separarParrafos(contenido),
    categoria: campoCategoria.value,
    etiquetas: [],
    fuente: fuente,
    autor: 'Redacción Aura',
    fecha: obtenerFechaHoy(),
    tiempoLectura: calcularTiempoLectura(contenido),
    imagen: campoImagen.value.trim(),
    imagenAlt: titulo,
    imagenCredito: fuente,
    urlOriginal: '',
    destacada: false
  };

  agregarNoticia(noticia);

  mensajeExito.classList.remove('oculto');
  setTimeout(function () {
    mensajeExito.classList.add('oculto');
  }, 3000);

  formulario.reset();
  actualizarContador();

  mostrarNoticias();
}

function crearFilaAdmin(noticia) {
  return `
    <article class="fila-admin">
      <img class="fila-admin-imagen" src="${noticia.imagen}" alt="${noticia.imagenAlt}">
      <div class="fila-admin-texto">
        <span class="etiqueta">${noticia.categoria}</span>
        <a class="fila-admin-titulo" href="detalle.html?id=${noticia.id}">${noticia.titulo}</a>
      </div>
      <button type="button" class="boton-eliminar" data-id="${noticia.id}" aria-label="Eliminar noticia">
        <img src="img/iconos/eliminar.svg" alt="" width="20" height="20">
      </button>
    </article>
  `;
}

function mostrarNoticias() {
  cargarNoticias().then(function (noticias) {
    contadorNoticias.textContent = noticias.length;

    if (noticias.length === 0) {
      listaAdmin.innerHTML = '<p class="lista-vacia">No hay noticias publicadas.</p>';
      return;
    }

    let html = '';
    for (let i = 0; i < noticias.length; i++) {
      html += crearFilaAdmin(noticias[i]);
    }
    listaAdmin.innerHTML = html;

    const botones = listaAdmin.querySelectorAll('.boton-eliminar');
    for (let i = 0; i < botones.length; i++) {
      botones[i].addEventListener('click', function () {
        const id = Number(botones[i].dataset.id);
        const noticia = buscarNoticiaPorId(noticias, id);
        confirmarEliminar(noticia);
      });
    }
  });
}

function confirmarEliminar(noticia) {
  if (noticia === null) {
    return;
  }
  if (confirm('¿Eliminar "' + noticia.titulo + '"?')) {
    eliminarNoticia(noticia.id);
    mostrarNoticias();
  }
}

function restaurarNoticias() {
  if (confirm('¿Restaurar las noticias originales que eliminaste?')) {
    localStorage.removeItem(CLAVE_ELIMINADAS);
    mostrarNoticias();
  }
}

const campos = [campoTitulo, campoCategoria, campoFuente, campoImagen, campoResumen, campoContenido];
for (let i = 0; i < campos.length; i++) {
  campos[i].addEventListener('input', function () {
    quitarError(campos[i]);
  });
}

campoResumen.addEventListener('input', actualizarContador);
formulario.addEventListener('submit', publicarNoticia);
botonRestaurar.addEventListener('click', restaurarNoticias);

llenarCategorias();
mostrarNoticias();
