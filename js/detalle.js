const contenedorDetalle = document.getElementById('detalle-noticia');

const idNoticia = Number(obtenerParametroUrl('id'));

function mostrarNoEncontrada() {
  document.title = 'Noticia no encontrada | Aura News';
  contenedorDetalle.innerHTML = `
    <div class="no-encontrada">
      <h1>No encontramos esta noticia</h1>
      <p>Puede que haya sido eliminada o que el enlace no sea correcto.</p>
      <a class="boton" href="noticias.html">Ver todas las noticias</a>
    </div>
  `;
}

function crearLineaDatos(noticia) {
  const partes = [];
  if (noticia.autor) {
    partes.push('Por ' + noticia.autor);
  }
  if (noticia.fuente) {
    partes.push(noticia.fuente);
  }
  partes.push(noticia.tiempoLectura + ' min de lectura');
  partes.push(formatearFecha(noticia.fecha));
  return partes.join(' · ');
}

function crearParrafos(noticia) {
  let html = '';
  for (let i = 0; i < noticia.contenido.length; i++) {
    html += `<p>${noticia.contenido[i]}</p>`;
  }
  return html;
}

function crearEtiquetas(noticia) {
  if (!noticia.etiquetas || noticia.etiquetas.length === 0) {
    return '';
  }
  let html = '<div class="lista-chips etiquetas-noticia">';
  for (let i = 0; i < noticia.etiquetas.length; i++) {
    html += `<span class="chip">${noticia.etiquetas[i]}</span>`;
  }
  html += '</div>';
  return html;
}

function crearEnlaceNavegacion(noticia, etiqueta, textoVacio, clase) {
  if (noticia === null) {
    return `
      <div class="nav-articulo ${clase} vacio">
        <span class="nav-etiqueta">${etiqueta}</span>
        <span class="nav-titulo">${textoVacio}</span>
      </div>
    `;
  }
  return `
    <a class="nav-articulo ${clase}" href="detalle.html?id=${noticia.id}">
      <span class="nav-etiqueta">${etiqueta}</span>
      <span class="nav-titulo">${noticia.titulo}</span>
    </a>
  `;
}

function actualizarBotonFavorito(boton, guardada) {
  if (guardada) {
    boton.classList.add('boton-secundario');
    boton.innerHTML = '<img src="img/iconos/guardado-lleno.svg" alt="" width="20" height="20"> Guardado en favoritos';
  } else {
    boton.classList.remove('boton-secundario');
    boton.innerHTML = '<img src="img/iconos/guardar-blanco.svg" alt="" width="20" height="20"> Guardar en favoritos';
  }
}

function mostrarNoticia(noticia, anterior, siguiente) {
  document.title = noticia.titulo + ' | Aura News';

  let enlaceOriginal = '';
  if (noticia.urlOriginal) {
    enlaceOriginal = `<a class="enlace-original" href="${noticia.urlOriginal}" target="_blank">Leer artículo original →</a>`;
  }

  let credito = '';
  if (noticia.imagenCredito) {
    credito = `<p class="credito-imagen">Imagen: ${noticia.imagenCredito}</p>`;
  }

  contenedorDetalle.innerHTML = `
    <article class="articulo">
      <figure class="figura-noticia">
        <img class="imagen-noticia" src="${noticia.imagen}" alt="${noticia.imagenAlt}">
        ${credito}
      </figure>

      <a class="etiqueta" href="noticias.html?categoria=${encodeURIComponent(noticia.categoria)}">${noticia.categoria}</a>
      <p class="datos-noticia">${crearLineaDatos(noticia)}</p>
      <h1 class="titulo-noticia">${noticia.titulo}</h1>
      <hr class="divisor">

      <div class="contenido-noticia">
        ${crearParrafos(noticia)}
      </div>

      ${crearEtiquetas(noticia)}
      ${enlaceOriginal}

      <div class="fila-botones botones-detalle">
        <button type="button" class="boton" id="boton-favorito"></button>
        <button type="button" class="boton boton-secundario" id="boton-compartir">
          <img src="img/iconos/compartir.svg" alt="" width="20" height="20"> Compartir
        </button>
      </div>
      <p class="mensaje-exito mensaje-copiado oculto" id="mensaje-copiado">Enlace copiado</p>
    </article>

    <nav class="navegacion-articulos">
      ${crearEnlaceNavegacion(anterior, 'Anterior', 'Ninguna anterior', 'nav-anterior')}
      ${crearEnlaceNavegacion(siguiente, 'Siguiente artículo', 'Ninguna siguiente', 'nav-siguiente')}
    </nav>
  `;

  const botonFavorito = document.getElementById('boton-favorito');
  actualizarBotonFavorito(botonFavorito, esFavorito(noticia.id));
  botonFavorito.addEventListener('click', function () {
    const guardada = alternarFavorito(noticia.id);
    actualizarBotonFavorito(botonFavorito, guardada);
  });

  const botonCompartir = document.getElementById('boton-compartir');
  const mensajeCopiado = document.getElementById('mensaje-copiado');
  botonCompartir.addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href)
      .then(function () {
        mensajeCopiado.textContent = 'Enlace copiado';
        mensajeCopiado.classList.remove('oculto');

        setTimeout(function () {
          mensajeCopiado.classList.add('oculto');
        }, 3000);
      })
      .catch(function () {
        alert('No se pudo copiar el enlace. Cópialo desde la barra de direcciones.');
      });
  });
}

cargarNoticias().then(function (noticias) {
  const noticia = buscarNoticiaPorId(noticias, idNoticia);

  if (noticia === null) {
    mostrarNoEncontrada();
    return;
  }

  const posicion = noticias.indexOf(noticia);
  let anterior = null;
  let siguiente = null;
  if (posicion > 0) {
    anterior = noticias[posicion - 1];
  }
  if (posicion < noticias.length - 1) {
    siguiente = noticias[posicion + 1];
  }

  mostrarNoticia(noticia, anterior, siguiente);
});
