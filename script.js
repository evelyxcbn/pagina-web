// Configuración
const API_BASE = 'php/';
let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let currentPage = 1;
const productsPerPage = 12;

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const emptyCart = document.getElementById('empty-cart');
const cartFooter = document.getElementById('cart-footer');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShopping = document.getElementById('continue-shopping');
const checkoutModal = document.getElementById('checkout-modal');
const ticketModal = document.getElementById('ticket-modal');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');
const pagination = document.getElementById('pagination');
const prevPage = document.getElementById('prev-page');
const nextPage = document.getElementById('next-page');
const pageNumbers = document.getElementById('page-numbers');

// Inicialización
document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupEventListeners();
  await cargarProductos();
  actualizarCarrito();
}

function setupEventListeners() {
  // Carrito
  cartToggle.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  continueShopping.addEventListener('click', toggleCart);
  checkoutBtn.addEventListener('click', abrirCheckout);
  
  // Búsqueda y filtros
  searchForm.addEventListener('submit', realizarBusqueda);
  sortSelect.addEventListener('change', filtrarYOrdenarProductos);
  
  // Navegación por categorías
  document.querySelectorAll('.nav-categories a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const categoria = e.target.getAttribute('data-category');
      filtrarPorCategoria(categoria);
    });
  });
  
  // Paginación
  prevPage.addEventListener('click', () => cambiarPagina(currentPage - 1));
  nextPage.addEventListener('click', () => cambiarPagina(currentPage + 1));
  
  // Cerrar modales
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      ticketModal.classList.remove('active');
    });
  });
}

// Cargar productos
async function cargarProductos() {
  try {
    productsContainer.innerHTML = `
      <div class="loading-products">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando productos...</p>
      </div>
    `;
    
    const response = await fetch(`${API_BASE}productos.php`);
    const data = await response.json();
    
    if (data.success) {
      productos = data.productos;
      mostrarProductos(productos);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    productsContainer.innerHTML = `
      <div class="loading-products">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error al cargar productos</p>
        <button class="btn btn-outline" onclick="cargarProductos()">Reintentar</button>
      </div>
    `;
  }
}

// Mostrar productos en grid
function mostrarProductos(productosMostrar) {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productosPagina = productosMostrar.slice(startIndex, endIndex);
  
  productsContainer.innerHTML = '';
  
  if (productosPagina.length === 0) {
    productsContainer.innerHTML = `
      <div class="loading-products">
        <i class="fas fa-search"></i>
        <p>No se encontraron productos</p>
      </div>
    `;
    pagination.style.display = 'none';
    return;
  }
  
  productosPagina.forEach(producto => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        ${producto.imagen ? 
          `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.style.display='none'">` : 
          `<i class="fas fa-box" style="font-size: 48px; color: #ccc;"></i>`
        }
        ${producto.stock < 10 ? '<div class="product-badge">Últimas unidades</div>' : ''}
      </div>
      <div class="product-info">
        <div class="product-price">$${parseFloat(producto.precio).toFixed(2)}</div>
        <div class="product-title">${producto.nombre}</div>
        <div class="product-shipping">
          <i class="fas fa-shipping-fast"></i> Envío gratis
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-block agregar-carrito" data-id="${producto.id}">
            <i class="fas fa-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });
  
  // Actualizar contador de resultados
  resultsCount.textContent = `${productosMostrar.length} productos encontrados`;
  
  // Configurar paginación
  configurarPaginacion(productosMostrar.length);
  
  // Event listeners para botones de agregar al carrito
  document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('button').getAttribute('data-id'));
      agregarAlCarrito(id);
    });
  });
}

// Configurar paginación
function configurarPaginacion(totalProductos) {
  const totalPages = Math.ceil(totalProductos / productsPerPage);
  
  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }
  
  pagination.style.display = 'flex';
  
  // Botones anterior/siguiente
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
  
  // Números de página
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement('div');
    pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
    pageNumber.textContent = i;
    pageNumber.addEventListener('click', () => cambiarPagina(i));
    pageNumbers.appendChild(pageNumber);
  }
}

// Cambiar página
function cambiarPagina(pagina) {
  currentPage = pagina;
  mostrarProductos(productos);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Carrito functions
function toggleCart() {
  cartSidebar.classList.toggle('open');
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  
  if (!producto) return;
  
  const itemExistente = carrito.find(item => item.id === id);
  
  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad++;
    } else {
      mostrarNotificacion('No hay suficiente stock disponible', 'warning');
      return;
    }
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }
  
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`¡${producto.nombre} agregado al carrito!`, 'success');
}

function actualizarCarrito() {
  // Actualizar contador
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  cartCount.textContent = totalItems;
  
  // Actualizar contenido del carrito
  if (carrito.length === 0) {
    emptyCart.style.display = 'block';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartItems.style.display = 'block';
  cartFooter.style.display = 'block';
  
  cartItems.innerHTML = '';
  let total = 0;
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        ${item.imagen ? 
          `<img src="${item.imagen}" alt="${item.nombre}" style="max-width: 40px; max-height: 40px;">` : 
          `<i class="fas fa-box" style="color: #ccc;"></i>`
        }
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.nombre}</div>
        <div class="cart-item-price">$${parseFloat(item.precio).toFixed(2)}</div>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="quantity-btn disminuir" data-id="${item.id}">
              <i class="fas fa-minus"></i>
            </button>
            <span>${item.cantidad}</span>
            <button class="quantity-btn aumentar" data-id="${item.id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });
  
  totalAmount.textContent = total.toFixed(2);
  
  // Event listeners para controles del carrito
  document.querySelectorAll('.aumentar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('button').getAttribute('data-id'));
      cambiarCantidad(id, 1);
    });
  });
  
  document.querySelectorAll('.disminuir').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('button').getAttribute('data-id'));
      cambiarCantidad(id, -1);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('button').getAttribute('data-id'));
      eliminarDelCarrito(id);
    });
  });
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(item => item.id === id);
  const producto = productos.find(p => p.id === id);
  
  if (!item || !producto) return;
  
  item.cantidad += cambio;
  
  if (item.cantidad < 1) {
    eliminarDelCarrito(id);
  } else if (item.cantidad > producto.stock) {
    item.cantidad = producto.stock;
    mostrarNotificacion('No hay suficiente stock disponible', 'warning');
  } else {
    guardarCarrito();
    actualizarCarrito();
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion('Producto eliminado del carrito', 'info');
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function abrirCheckout() {
  if (carrito.length === 0) {
    mostrarNotificacion('El carrito está vacío', 'warning');
    return;
  }
  
  // Actualizar resumen del pedido
  actualizarResumenPedido();
  checkoutModal.classList.add('active');
  cartSidebar.classList.remove('open');
  
  // Configurar steps del checkout
  configurarCheckoutSteps();
}

function configurarCheckoutSteps() {
  const steps = document.querySelectorAll('.checkout-step');
  const stepIndicators = document.querySelectorAll('.step');
  
  steps.forEach(step => step.classList.remove('active'));
  stepIndicators.forEach(step => step.classList.remove('active'));
  
  steps[0].classList.add('active');
  stepIndicators[0].classList.add('active');
  
  // Event listeners para botones de navegación
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextStep = e.target.getAttribute('data-next');
      cambiarStep(nextStep);
    });
  });
  
  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prevStep = e.target.getAttribute('data-prev');
      cambiarStep(prevStep);
    });
  });
}

function cambiarStep(stepNumber) {
  const steps = document.querySelectorAll('.checkout-step');
  const stepIndicators = document.querySelectorAll('.step');
  
  steps.forEach(step => step.classList.remove('active'));
  stepIndicators.forEach(step => step.classList.remove('active'));
  
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
}

function actualizarResumenPedido() {
  const orderItems = document.getElementById('order-items');
  const orderSubtotal = document.getElementById('order-subtotal');
  const orderShipping = document.getElementById('order-shipping');
  const orderTotal = document.getElementById('order-total');
  
  let subtotal = 0;
  orderItems.innerHTML = '';
  
  carrito.forEach(item => {
    const itemTotal = item.precio * item.cantidad;
    subtotal += itemTotal;
    
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    orderItems.appendChild(orderItem);
  });
  
  const shipping = subtotal > 500 ? 0 : 50; // Envío gratis sobre $500
  const total = subtotal + shipping;
  
  orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  orderShipping.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
  orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
    <div class="notificacion-content">
      <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'warning' ? 'exclamation-triangle' : 'info'}"></i>
      <span>${mensaje}</span>
    </div>
  `;
  
  // Estilos para notificación
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#00a650' : tipo === 'warning' ? '#ff8800' : '#3483fa'};
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    transform: translateX(400px);
    transition: transform 0.3s;
  `;
  
  document.body.appendChild(notificacion);
  
  // Animación de entrada
  setTimeout(() => {
    notificacion.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Exportar funciones globales
window.cargarProductos = cargarProductos;