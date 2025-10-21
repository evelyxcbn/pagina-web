// Variables globales
let cart = [];
let products = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Cargar productos
  loadProducts();
  
  // Cargar carrito desde localStorage
  loadCart();
  
  // Configurar event listeners
  setupEventListeners();
});

// Cargar productos
function loadProducts() {
  products = [
    {
      id: 1,
      name: "Taza Personalizada",
      description: "Taza de cerámica con logo escolar de alta calidad. Diseño exclusivo hecho por estudiantes.",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Playera Estampada",
      description: "Playera de algodón 100% con diseño escolar exclusivo. Varios colores disponibles.",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
    },
    {
      id: 3,
      name: "Mochila Escolar",
      description: "Mochila resistente con compartimentos múltiples. Ideal para estudiantes activos.",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 4,
      name: "Lapicera Personalizada",
      description: "Set de lapiceras con el nombre de la escuela. Incluye 5 colores diferentes.",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 5,
      name: "Cuaderno Decorado",
      description: "Cuaderno de 100 hojas con diseño estudiantil. Portada resistente y diseño único.",
      price: 60.00,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 6,
      name: "Gorra Escolar",
      description: "Gorra ajustable con el emblema de la escuela. Perfecta para días soleados.",
      price: 150.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80"
    },
    {
      id: 7,
      name: "Stickers Decorativos",
      description: "Pack de 50 stickers con diseños escolares. Ideales para personalizar tus cosas.",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 8,
      name: "Llavero Escolar",
      description: "Llavero metálico con el logo de la escuela. Duradero y elegante.",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1608344805836-bc1c979fde9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];
  
  renderProducts();
}

// Renderizar productos en el DOM
function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0jOTk5IHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPiR7cHJvZHVjdC5uYW1lfTwvdGV4dD48L3N2Zz4='">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${product.id}">-</button>
            <input type="number" class="quantity-input" data-id="${product.id}" value="1" min="1">
            <button class="quantity-btn plus" data-id="${product.id}">+</button>
          </div>
          <button class="btn-primary add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    
    productsGrid.appendChild(productCard);
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Icono del carrito
  document.querySelector('.cart-icon').addEventListener('click', openCartModal);
  
  // Botones de cerrar modales
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModal);
  });
  
  // Cerrar modal al hacer clic fuera
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  });
  
  // Botones de cantidad en productos
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
      handleQuantityChange(e.target);
    }
  });
  
  // Botones de agregar al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      addToCart(e.target.dataset.id);
    }
  });
  
  // Botón de proceder al pago
  document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
  
  // Botones de navegación en el proceso de compra
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('next-step')) {
      goToStep(parseInt(e.target.dataset.next));
    }
    
    if (e.target.classList.contains('prev-step')) {
      goToStep(parseInt(e.target.dataset.prev));
    }
  });
  
  // Botón de confirmar compra
  document.getElementById('confirm-purchase').addEventListener('click', confirmPurchase);
  
  // Botón de imprimir ticket
  document.getElementById('print-ticket').addEventListener('click', printTicket);
  
  // Botón de nueva orden
  document.getElementById('new-order').addEventListener('click', startNewOrder);
}

// Manejar cambios en la cantidad de productos
function handleQuantityChange(button) {
  const productId = button.dataset.id;
  const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
  let value = parseInt(input.value);
  
  if (button.classList.contains('plus')) {
    value++;
  } else if (button.classList.contains('minus') && value > 1) {
    value--;
  }
  
  input.value = value;
}

// Agregar producto al carrito
function addToCart(productId) {
  const product = products.find(p => p.id == productId);
  const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
  const quantity = parseInt(quantityInput.value);
  
  // Verificar si el producto ya está en el carrito
  const existingItem = cart.find(item => item.id == productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  // Actualizar carrito en localStorage
  saveCart();
  
  // Actualizar interfaz
  updateCartUI();
  
  // Mostrar notificación
  showNotification(`${product.name} agregado al carrito`);
  
  // Restablecer cantidad a 1
  quantityInput.value = 1;
}

// Actualizar interfaz del carrito
function updateCartUI() {
  // Actualizar contador
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Actualizar items en el modal del carrito
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    document.getElementById('checkout-btn').disabled = true;
  } else {
    document.getElementById('checkout-btn').disabled = false;
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9Izk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj4ke2l0ZW0ubmFtZX08L3RleHQ+PC9zdmc+='">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn minus-cart" data-id="${item.id}">-</button>
          <span class="cart-quantity">${item.quantity}</span>
          <button class="quantity-btn plus-cart" data-id="${item.id}">+</button>
          <button class="btn-secondary remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
    });
    
    // Agregar event listeners a los botones del carrito
    document.querySelectorAll('.minus-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        updateCartItemQuantity(this.dataset.id, -1);
      });
    });
    
    document.querySelectorAll('.plus-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        updateCartItemQuantity(this.dataset.id, 1);
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        removeFromCart(this.dataset.id);
      });
    });
  }
  
  // Actualizar total
  const totalPrice = document.getElementById('total-price');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPrice.textContent = total.toFixed(2);
}

// Actualizar cantidad de un item en el carrito
function updateCartItemQuantity(productId, change) {
  const item = cart.find(item => item.id == productId);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id != productId);
  saveCart();
  updateCartUI();
  showNotification('Producto eliminado del carrito');
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('schoolStoreCart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = localStorage.getItem('schoolStoreCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Mostrar notificación
function showNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--success-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 1100;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Abrir modal del carrito
function openCartModal() {
  document.getElementById('cart-modal').style.display = 'block';
}

// Abrir modal de proceso de compra
function openCheckoutModal() {
  closeModal(); // Cerrar modal actual
  document.getElementById('checkout-modal').style.display = 'block';
  goToStep(1);
}

// Cerrar modal
function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// Navegar entre pasos del proceso de compra
function goToStep(stepNumber) {
  // Actualizar indicadores de pasos
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
  
  // Mostrar contenido del paso correspondiente
  document.querySelectorAll('.step-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  
  // Si estamos en el paso 3, actualizar el resumen del pedido
  if (stepNumber === 3) {
    updateOrderSummary();
  }
}

// Actualizar resumen del pedido
function updateOrderSummary() {
  const orderSummary = document.getElementById('order-summary');
  let summaryHTML = '<div class="order-details">';
  
  // Información personal
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  
  summaryHTML += `
    <h4>Información de envío:</h4>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Dirección:</strong> ${address}</p>
  `;
  
  // Productos
  summaryHTML += '<h4>Productos:</h4>';
  summaryHTML += '<div class="ticket-items">';
  
  cart.forEach(item => {
    summaryHTML += `
      <div class="ticket-item">
        <span>${item.name} x${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });
  
  // Total
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  
  summaryHTML += '</div>';
  summaryHTML += `
    <div class="ticket-totals">
      <div class="ticket-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="ticket-row">
        <span>IVA (16%):</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="ticket-row total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  summaryHTML += '</div>';
  orderSummary.innerHTML = summaryHTML;
}

// Confirmar compra
function confirmPurchase() {
  // Validar formularios
  if (!validateForms()) {
    showNotification('Por favor completa todos los campos correctamente');
    return;
  }

  // En un entorno real, aquí se enviarían los datos al servidor
  // Por ahora, simulamos el proceso
  
  // Generar número de pedido aleatorio
  const orderNumber = 'TS' + Date.now().toString().slice(-6);
  
  // Mostrar ticket
  showTicket(orderNumber);
  
  // Limpiar carrito
  cart = [];
  saveCart();
  updateCartUI();
  
  // Cerrar modal de proceso de compra
  closeModal();
}

// Validar formularios
function validateForms() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const cardName = document.getElementById('card-name').value;
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;

  if (!name || !email || !phone || !address || !cardName || !cardNumber || !expiryDate || !cvv) {
    return false;
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

// Mostrar ticket con diseño mejorado
function showTicket(orderNumber) {
  const ticketContent = document.getElementById('ticket-content');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let ticketHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <div class="ticket-logo">
          <i class="fas fa-graduation-cap"></i>
          <h3>Tienda Escolar</h3>
        </div>
        <p>Productos estudiantiles de calidad</p>
        <div class="ticket-divider"></div>
      </div>
      
      <div class="ticket-info">
        <div class="ticket-row">
          <span class="label">Nº de pedido:</span>
          <span class="value">${orderNumber}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Fecha:</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Hora:</span>
          <span class="value">${formattedTime}</span>
        </div>
      </div>

      <div class="ticket-divider"></div>
      
      <div class="ticket-items">
        <div class="ticket-section-title">PRODUCTOS</div>
  `;
  
  cart.forEach(item => {
    const subtotal = (item.price * item.quantity).toFixed(2);
    ticketHTML += `
      <div class="ticket-item">
        <div class="item-main">
          <span class="item-name">${item.name}</span>
          <span class="item-subtotal">$${subtotal}</span>
        </div>
        <div class="item-details">
          <span class="item-quantity">${item.quantity} x $${item.price.toFixed(2)}</span>
        </div>
      </div>
    `;
  });
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; // IVA 16%
  const total = subtotal + tax;
  
  ticketHTML += `
      </div>
      
      <div class="ticket-divider"></div>
      
      <div class="ticket-totals">
        <div class="ticket-row">
          <span class="label">Subtotal:</span>
          <span class="value">$${subtotal.toFixed(2)}</span>
        </div>
        <div class="ticket-row">
          <span class="label">IVA (16%):</span>
          <span class="value">$${tax.toFixed(2)}</span>
        </div>
        <div class="ticket-row total">
          <span class="label">TOTAL:</span>
          <span class="value">$${total.toFixed(2)}</span>
        </div>
      </div>

      <div class="ticket-divider"></div>
      
      <div class="ticket-payment">
        <div class="ticket-section-title">INFORMACIÓN DE PAGO</div>
        <div class="ticket-row">
          <span class="label">Método:</span>
          <span class="value">Tarjeta de crédito</span>
        </div>
        <div class="ticket-row">
          <span class="label">Estado:</span>
          <span class="value status-paid">PAGADO</span>
        </div>
      </div>

      <div class="ticket-divider"></div>
      
      <div class="ticket-customer">
        <div class="ticket-section-title">DATOS DEL CLIENTE</div>
        <div class="ticket-row">
          <span class="label">Nombre:</span>
          <span class="value">${document.getElementById('name').value}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Email:</span>
          <span class="value">${document.getElementById('email').value}</span>
        </div>
      </div>

      <div class="ticket-divider"></div>
      
      <div class="ticket-footer">
        <div class="thank-you">
          <i class="fas fa-heart"></i>
          <p>¡Gracias por tu compra!</p>
        </div>
        <p class="contact-info">
          <i class="fas fa-phone"></i> (55) 1234-5678<br>
          <i class="fas fa-envelope"></i> tiendaescolar@email.com
        </p>
        <p class="return-policy">
          * Productos con garantía de 30 días
        </p>
        <div class="barcode">
          <div class="barcode-lines"></div>
          <p>${orderNumber}</p>
        </div>
      </div>
    </div>
  `;
  
  ticketContent.innerHTML = ticketHTML;
  
  // Generar código de barras visual
  generateVisualBarcode(orderNumber);
  
  // Mostrar modal del ticket
  document.getElementById('ticket-modal').style.display = 'block';
}

// Generar código de barras visual (simulado)
function generateVisualBarcode(orderNumber) {
  const barcodeContainer = document.querySelector('.barcode-lines');
  if (!barcodeContainer) return;
  
  let barcodeHTML = '';
  // Crear un patrón visual simple para el código de barras
  for (let i = 0; i < 20; i++) {
    const height = 20 + Math.floor(Math.random() * 30);
    const width = 2 + Math.floor(Math.random() * 3);
    barcodeHTML += `<div class="barcode-line" style="height: ${height}px; width: ${width}px;"></div>`;
  }
  
  barcodeContainer.innerHTML = barcodeHTML;
}

// Imprimir ticket con estilo específico
function printTicket() {
  const ticketContent = document.querySelector('.ticket-container').cloneNode(true);
  
  // Crear ventana de impresión
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket de Compra - Tienda Escolar</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            margin: 0;
            padding: 15px;
            background: white;
            color: black;
            font-size: 12px;
            line-height: 1.3;
          }
          .ticket-container {
            max-width: 300px;
            margin: 0 auto;
          }
          .ticket-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .ticket-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 5px;
          }
          .ticket-logo i {
            font-size: 20px;
          }
          .ticket-logo h3 {
            margin: 0;
            font-size: 16px;
          }
          .ticket-divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .ticket-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .ticket-row.total {
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .ticket-section-title {
            font-weight: bold;
            text-align: center;
            margin: 8px 0;
            font-size: 11px;
          }
          .ticket-item {
            margin-bottom: 6px;
          }
          .item-main {
            display: flex;
            justify-content: space-between;
          }
          .item-details {
            font-size: 10px;
            color: #666;
          }
          .status-paid {
            color: green;
            font-weight: bold;
          }
          .thank-you {
            text-align: center;
            margin: 10px 0;
          }
          .contact-info {
            text-align: center;
            font-size: 10px;
            margin: 8px 0;
          }
          .return-policy {
            text-align: center;
            font-size: 9px;
            color: #666;
            margin: 5px 0;
          }
          .barcode {
            text-align: center;
            margin-top: 15px;
          }
          .barcode-lines {
            display: flex;
            justify-content: center;
            gap: 2px;
            margin-bottom: 5px;
          }
          .barcode-line {
            background: black;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .ticket-container { max-width: 100%; }
          }
        </style>
      </head>
      <body>
        ${ticketContent.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}

// Iniciar nueva orden después de imprimir el ticket
function startNewOrder() {
  closeModal();
  
  // Limpiar formularios
  document.getElementById('personal-info-form').reset();
  document.getElementById('payment-form').reset();
  
  // Restablecer pasos del checkout
  goToStep(1);
  
  showNotification('¡Listo para una nueva compra!');
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);