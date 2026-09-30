const inputBuscador = document.getElementById('buscador');
const contenedorCategorias = document.getElementById('categorias');
const listaNoticias = document.getElementById('lista-noticias');
const contador = document.getElementById('contador');
const sinResultados = document.getElementById('sin-resultados');

let todasLasNoticias = [];

let categoriaActual = 'Todas';

const categoriaUrl = obtenerParametroUrl('categoria');
if (categoriaUrl !== null && CATEGORIAS.includes(categoriaUrl)) {
  categoriaActual = categoriaUrl;
}

function crearTarjetaListado(noticia) {
  return `
    <article class="tarjeta tarjeta-horizontal">
      <div class="tarjeta-contenido">
        <div class="tarjeta-meta">
          <span class="fuente">${noticia.categoria}</span>
          <span>•</span>
          <span class="fecha">${formatearFecha(noticia.fecha)}</span>
        </div>
        <h3 class="tarjeta-titulo">${noticia.titulo}</h3>
        <p class="tarjeta-resumen">${noticia.resumen}</p>
        <div class="tarjeta-acciones">
          <span>${noticia.tiempoLectura} min de lectura</span>
          <a class="boton-ver-mas" href="detalle.html?id=${noticia.id}">Ver más →</a>
        </div>
      </div>
      <img class="tarjeta-imagen" src="${noticia.imagen}" alt="${noticia.imagenAlt}">
    </article>
  `;
}

function crearPestanas() {
  const nombres = ['Todas'].concat(CATEGORIAS);
  let html = '';

  for (let i = 0; i < nombres.length; i++) {
    let clase = 'chip';
    if (nombres[i] === categoriaActual) {
      clase = 'chip activo';
    }
    html += `<button type="button" class="${clase}" data-categoria="${nombres[i]}">${nombres[i]}</button>`;
  }

  contenedorCategorias.innerHTML = html;

  const botones = contenedorCategorias.querySelectorAll('.chip');
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', function () {
      for (let j = 0; j < botones.length; j++) {
        botones[j].classList.remove('activo');
      }
      botones[i].classList.add('activo');

      categoriaActual = botones[i].dataset.categoria;
      mostrarNoticias();
    });
  }
}

function mostrarNoticias() {
  const textoBuscado = inputBuscador.value.trim().toLowerCase();
  const filtradas = [];

  for (let i = 0; i < todasLasNoticias.length; i++) {
    const noticia = todasLasNoticias[i];

    const coincideCategoria = categoriaActual === 'Todas' || noticia.categoria === categoriaActual;

    const titulo = noticia.titulo.toLowerCase();
    const resumen = noticia.resumen.toLowerCase();
    const coincideTexto = titulo.includes(textoBuscado) || resumen.includes(textoBuscado);

    if (coincideCategoria && coincideTexto) {
      filtradas.push(noticia);
    }
  }

  let html = '';
  for (let i = 0; i < filtradas.length; i++) {
    html += crearTarjetaListado(filtradas[i]);
  }
  listaNoticias.innerHTML = html;

  if (filtradas.length === 1) {
    contador.textContent = '1 noticia';
  } else {
    contador.textContent = filtradas.length + ' noticias';
  }

  if (filtradas.length === 0) {
    sinResultados.classList.remove('oculto');
  } else {
    sinResultados.classList.add('oculto');
  }
}

inputBuscador.addEventListener('input', mostrarNoticias);

crearPestanas();
cargarNoticias().then(function (noticias) {
  todasLasNoticias = noticias;
  mostrarNoticias();
});
