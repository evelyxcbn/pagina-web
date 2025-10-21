// Búsqueda y filtrado de productos
let productosFiltrados = [];

// Realizar búsqueda
function realizarBusqueda(e) {
  e.preventDefault();
  const termino = searchInput.value.trim().toLowerCase();
  
  if (termino === '') {
    productosFiltrados = [...productos];
  } else {
    productosFiltrados = productos.filter(producto => 
      producto.nombre.toLowerCase().includes(termino) ||
      producto.descripcion.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  }
  
  currentPage = 1;
  mostrarProductos(productosFiltrados);
}

// Filtrar por categoría
function filtrarPorCategoria(categoria) {
  if (categoria === 'todos') {
    productosFiltrados = [...productos];
  } else {
    productosFiltrados = productos.filter(producto => 
      producto.categoria === categoria
    );
  }
  
  currentPage = 1;
  mostrarProductos(productosFiltrados);
  
  // Actualizar navegación activa
  document.querySelectorAll('.nav-categories a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-category="${categoria}"]`).classList.add('active');
}

// Filtrar y ordenar productos
function filtrarYOrdenarProductos() {
  const orden = sortSelect.value;
  let productosAOrdenar = productosFiltrados.length > 0 ? productosFiltrados : productos;
  
  switch (orden) {
    case 'precio_asc':
      productosAOrdenar.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio_desc':
      productosAOrdenar.sort((a, b) => b.precio - a.precio);
      break;
    case 'nombre':
      productosAOrdenar.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'relevancia':
    default:
      // Mantener orden original o por relevancia de búsqueda
      break;
  }
  
  currentPage = 1;
  mostrarProductos(productosAOrdenar);
}

// Búsqueda en tiempo real (opcional)
searchInput.addEventListener('input', function() {
  const termino = this.value.trim().toLowerCase();
  
  if (termino.length >= 3) {
    // Podrías implementar búsqueda en tiempo real aquí
    // Por ahora solo actualizamos cuando se envía el formulario
  }
});