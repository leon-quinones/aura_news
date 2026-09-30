const listaGuardados = document.getElementById('lista-guardados');
const textoConteo = document.getElementById('conteo-guardados');
const mensajeVacio = document.getElementById('guardados-vacio');

let todasLasNoticias = [];

function obtenerNoticiasGuardadas() {
  const favoritos = obtenerFavoritos();
  const guardadas = [];
  for (let i = 0; i < todasLasNoticias.length; i++) {
    if (favoritos.includes(todasLasNoticias[i].id)) {
      guardadas.push(todasLasNoticias[i]);
    }
  }
  return guardadas;
}

function mostrarConteo(cantidad) {
  if (cantidad === 1) {
    textoConteo.textContent = '1 artículo guardado para leer después.';
  } else {
    textoConteo.textContent = cantidad + ' artículos guardados para leer después.';
  }
}

function mostrarGuardados() {
  const guardadas = obtenerNoticiasGuardadas();
  mostrarConteo(guardadas.length);

  if (guardadas.length === 0) {
    listaGuardados.innerHTML = '';
    listaGuardados.classList.add('oculto');
    mensajeVacio.classList.remove('oculto');
    return;
  }

  listaGuardados.classList.remove('oculto');
  mensajeVacio.classList.add('oculto');

  let html = '';
  for (let i = 0; i < guardadas.length; i++) {
    html += `
      <div class="item-guardado">
        ${crearTarjetaHorizontal(guardadas[i])}
        <button class="boton-quitar" type="button" data-id="${guardadas[i].id}">
          <img src="img/iconos/eliminar.svg" alt="" width="16" height="16">
          Quitar
        </button>
      </div>
    `;
  }
  listaGuardados.innerHTML = html;

  const botones = listaGuardados.querySelectorAll('.boton-quitar');
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', quitarGuardado);
  }
}

function quitarGuardado(evento) {
  const id = Number(evento.currentTarget.dataset.id);
  alternarFavorito(id);
  mostrarGuardados();
}

cargarNoticias().then(function (noticias) {
  todasLasNoticias = noticias;
  mostrarGuardados();
});
