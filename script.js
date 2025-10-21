// Variables globales
let cart = [];
let products = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Cargar productos desde la base de datos
  loadProducts();
  
  // Cargar carrito desde localStorage
  loadCart();
  
  // Configurar event listeners
  setupEventListeners();
});

// Cargar productos desde la base de datos
function loadProducts() {
  // En un entorno real, esto haría una petición AJAX a un archivo PHP
  // Por ahora, simulamos datos
  products = [
    {
      id: 1,
      name: "Taza Personalizada",
      description: "Taza de cerámica con logo escolar de alta calidad.",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Playera Estampada",
      description: "Playera de algodón 100% con diseño escolar exclusivo.",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
    },
    {
      id: 3,
      name: "Mochila Escolar",
      description: "Mochila resistente con compartimentos múltiples.",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 4,
      name: "Lapicera Personalizada",
      description: "Set de lapiceras con el nombre de la escuela.",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 5,
      name: "Cuaderno Decorado",
      description: "Cuaderno de 100 hojas con diseño estudiantil.",
      price: 60.00,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 6,
      name: "Gorra Escolar",
      description: "Gorra ajustable con el emblema de la escuela.",
      price: 150.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80"
    }
  ];
  
  // Renderizar productos en la página
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
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${product.id}">-</button>
            <input type="number" class="quantity-input" data-id="${product.id}" value="1" min="1">
            <button class="quantity-btn plus" data-id="${product.id}">+</button>
          </div>
          <button class="btn-primary add-to-cart" data-id="${product.id}">Agregar</button>
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
    cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
    document.getElementById('checkout-btn').disabled = true;
  } else {
    document.getElementById('checkout-btn').disabled = false;
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn minus-cart" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn plus-cart" data-id="${item.id}">+</button>
          <button class="btn-secondary remove-item" data-id="${item.id}">Eliminar</button>
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
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  summaryHTML += '</div>';
  summaryHTML += `
    <div class="ticket-total">
      <span>Total:</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
  
  summaryHTML += '</div>';
  orderSummary.innerHTML = summaryHTML;
}

// Confirmar compra
function confirmPurchase() {
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

// Mostrar ticket
function showTicket(orderNumber) {
  const ticketContent = document.getElementById('ticket-content');
  let ticketHTML = `
    <div class="ticket-header">
      <h3>Tienda Escolar</h3>
      <p>Productos estudiantiles</p>
      <p>Nº de pedido: ${orderNumber}</p>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="ticket-items">
  `;
  
  cart.forEach(item => {
    ticketHTML += `
      <div class="ticket-item">
        <span>${item.name} x${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  ticketHTML += `
    </div>
    <div class="ticket-total">
      <span>Total:</span>
      <span>$${total.toFixed(2)}</span>
    </div>
    <div class="ticket-footer">
      <p>¡Gracias por tu compra!</p>
      <p>Contacto: tiendaescolar@email.com</p>
    </div>
  `;
  
  ticketContent.innerHTML = ticketHTML;
  
  // Mostrar modal del ticket
  document.getElementById('ticket-modal').style.display = 'block';
}

// Imprimir ticket
function printTicket() {
  const ticketContent = document.getElementById('ticket-content').innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Ticket de Compra - Tienda Escolar</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; }
          .ticket-header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .ticket-items { margin-bottom: 15px; }
          .ticket-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .ticket-total { border-top: 1px dashed #000; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between; }
          .ticket-footer { text-align: center; margin-top: 15px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        ${ticketContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}

// Iniciar nueva orden
function startNewOrder() {
  closeModal();
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