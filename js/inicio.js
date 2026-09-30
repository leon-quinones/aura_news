const listaDestacadas = document.getElementById('lista-destacadas');

function mostrarDestacadas(noticias) {
  let destacadas = [];
  for (let i = 0; i < noticias.length; i++) {
    if (noticias[i].destacada === true) {
      destacadas.push(noticias[i]);
    }
  }

  if (destacadas.length === 0) {
    destacadas = noticias.slice(0, 3);
  }

  if (destacadas.length === 0) {
    listaDestacadas.innerHTML = '<p>Todavía no hay noticias para mostrar.</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < destacadas.length; i++) {
    html += crearTarjeta(destacadas[i]);
  }
  listaDestacadas.innerHTML = html;
}

cargarNoticias().then(function (noticias) {
  mostrarDestacadas(noticias);
});
