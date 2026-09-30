const RUTA_NOTICIAS = 'db/noticias.json';

const CLAVE_FAVORITOS = 'auraFavoritos';
const CLAVE_CREADAS = 'auraNoticiasCreadas';
const CLAVE_ELIMINADAS = 'auraNoticiasEliminadas';

const CATEGORIAS = [
  'Modelos',
  'Productos',
  'Investigación',
  'Ciencia',
  'Salud',
  'Hardware',
  'Economía',
  'Regulación'
];

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function leerLista(clave) {
  const texto = localStorage.getItem(clave);
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

function cargarNoticias() {
  return fetch(RUTA_NOTICIAS)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (noticiasDelJson) {
      const creadas = leerLista(CLAVE_CREADAS);
      const eliminadas = leerLista(CLAVE_ELIMINADAS);

      const todas = noticiasDelJson.concat(creadas);

      const visibles = [];
      for (let i = 0; i < todas.length; i++) {
        if (!eliminadas.includes(todas[i].id)) {
          visibles.push(todas[i]);
        }
      }

      visibles.sort(function (a, b) {
        if (a.fecha < b.fecha) return 1;
        if (a.fecha > b.fecha) return -1;
        return 0;
      });

      return visibles;
    })
    .catch(function (error) {
      console.error('No se pudieron cargar las noticias:', error);
      alert('No se pudieron cargar las noticias. Abre el proyecto con Live Server.');
      return [];
    });
}

function buscarNoticiaPorId(noticias, id) {
  for (let i = 0; i < noticias.length; i++) {
    if (noticias[i].id === id) {
      return noticias[i];
    }
  }
  return null;
}

function obtenerFavoritos() {
  return leerLista(CLAVE_FAVORITOS);
}

function esFavorito(id) {
  return obtenerFavoritos().includes(id);
}

function alternarFavorito(id) {
  const favoritos = obtenerFavoritos();
  const posicion = favoritos.indexOf(id);

  if (posicion === -1) {
    favoritos.push(id);
    guardarLista(CLAVE_FAVORITOS, favoritos);
    return true;
  } else {
    favoritos.splice(posicion, 1);
    guardarLista(CLAVE_FAVORITOS, favoritos);
    return false;
  }
}

function agregarNoticia(noticia) {
  const creadas = leerLista(CLAVE_CREADAS);

  noticia.id = Date.now();
  creadas.push(noticia);
  guardarLista(CLAVE_CREADAS, creadas);
  return noticia;
}

function eliminarNoticia(id) {
  const creadas = leerLista(CLAVE_CREADAS);
  const restantes = [];
  let estabaEnCreadas = false;

  for (let i = 0; i < creadas.length; i++) {
    if (creadas[i].id === id) {
      estabaEnCreadas = true;
    } else {
      restantes.push(creadas[i]);
    }
  }
  guardarLista(CLAVE_CREADAS, restantes);

  if (!estabaEnCreadas) {
    const eliminadas = leerLista(CLAVE_ELIMINADAS);
    eliminadas.push(id);
    guardarLista(CLAVE_ELIMINADAS, eliminadas);
  }

  if (esFavorito(id)) {
    alternarFavorito(id);
  }
}

function formatearFecha(fecha) {
  const partes = fecha.split('-');
  const anio = partes[0];
  const mes = MESES[Number(partes[1]) - 1];
  const dia = Number(partes[2]);
  return dia + ' de ' + mes + ' de ' + anio;
}

function obtenerParametroUrl(nombre) {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get(nombre);
}

function crearTarjeta(noticia) {
  return `
    <article class="tarjeta">
      <img class="tarjeta-imagen" src="${noticia.imagen}" alt="${noticia.imagenAlt}">
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
    </article>
  `;
}

function crearTarjetaHorizontal(noticia) {
  return `
    <article class="tarjeta tarjeta-horizontal">
      <div class="tarjeta-contenido">
        <div class="tarjeta-meta">
          <span class="fuente">${noticia.categoria}</span>
          <span>•</span>
          <span class="fecha">${formatearFecha(noticia.fecha)}</span>
        </div>
        <h3 class="tarjeta-titulo">${noticia.titulo}</h3>
        <div class="tarjeta-acciones">
          <span>${noticia.tiempoLectura} min de lectura</span>
          <a class="boton-ver-mas" href="detalle.html?id=${noticia.id}">Ver más →</a>
        </div>
      </div>
      <img class="tarjeta-imagen" src="${noticia.imagen}" alt="${noticia.imagenAlt}">
    </article>
  `;
}
