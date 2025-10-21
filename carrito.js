// Configuración del checkout
document.addEventListener('DOMContentLoaded', function() {
  const checkoutForm = document.getElementById('checkout-form');
  const ticketModal = document.getElementById('ticket-modal');
  
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', procesarCompra);
  }
  
  // Configurar métodos de pago
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const cardData = document.getElementById('card-data');
      if (this.value === 'tarjeta') {
        cardData.style.display = 'block';
      } else {
        cardData.style.display = 'none';
      }
    });
  });
  
  // Botones del ticket
  document.getElementById('print-ticket')?.addEventListener('click', imprimirTicket);
  document.getElementById('new-order')?.addEventListener('click', nuevaCompra);
});

// Procesar compra
async function procesarCompra(e) {
  e.preventDefault();
  
  // Validar formulario
  if (!validarCheckout()) {
    return;
  }
  
  // Mostrar loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  submitBtn.disabled = true;
  
  try {
    const formData = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      ciudad: document.getElementById('ciudad').value,
      cp: document.getElementById('cp').value,
      metodo_pago: document.querySelector('input[name="payment"]:checked').value
    };
    
    const response = await fetch(`${API_BASE}carrito.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'finalizar_compra',
        productos: carrito,
        datos_cliente: formData
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Mostrar ticket
      generarTicket(data.venta);
      checkoutModal.classList.remove('active');
      ticketModal.classList.add('active');
      
      // Limpiar carrito
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error al procesar la compra: ' + error.message, 'warning');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Validar formulario de checkout
function validarCheckout() {
  const requiredFields = ['nombre', 'email', 'telefono', 'direccion', 'ciudad', 'cp'];
  
  for (const field of requiredFields) {
    const input = document.getElementById(field);
    if (!input.value.trim()) {
      mostrarNotificacion(`El campo ${field} es requerido`, 'warning');
      input.focus();
      return false;
    }
  }
  
  // Validar email
  const email = document.getElementById('email').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarNotificacion('Ingresa un email válido', 'warning');
    return false;
  }
  
  // Validar datos de tarjeta si es el método seleccionado
  const metodoPago = document.querySelector('input[name="payment"]:checked').value;
  if (metodoPago === 'tarjeta') {
    const cardFields = ['card-number', 'card-name', 'card-expiry', 'card-cvv'];
    for (const field of cardFields) {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        mostrarNotificacion('Completa todos los datos de la tarjeta', 'warning');
        return false;
      }
    }
  }
  
  return true;
}

// Generar ticket
function generarTicket(venta) {
  const ticketDate = document.getElementById('ticket-date');
  const ticketItems = document.getElementById('ticket-items');
  const ticketTotal = document.getElementById('ticket-total');
  const transactionId = document.getElementById('transaction-id');
  
  // Fecha actual
  const ahora = new Date();
  ticketDate.textContent = ahora.toLocaleString('es-ES');
  
  // Items
  ticketItems.innerHTML = '';
  let total = 0;
  
  venta.productos.forEach(item => {
    const itemTotal = item.precio * item.cantidad;
    total += itemTotal;
    
    const ticketItem = document.createElement('div');
    ticketItem.className = 'ticket-item';
    ticketItem.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    ticketItems.appendChild(ticketItem);
  });
  
  ticketTotal.textContent = `$${total.toFixed(2)}`;
  transactionId.textContent = `#${venta.id}`;
}

// Imprimir ticket
function imprimirTicket() {
  const ticketElement = document.getElementById('ticket');
  const ventanaImpresion = window.open('', '_blank');
  ventanaImpresion.document.write(`
    <html>
      <head>
        <title>Ticket de Compra - TiendaEscolar</title>
        <style>
          body { font-family: 'Courier New', monospace; margin: 20px; }
          .ticket { border: 1px dashed #000; padding: 20px; max-width: 300px; }
          .ticket-header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .ticket-item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
          .ticket-total { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
          .total-line { display: flex; justify-content: space-between; font-weight: bold; }
          .ticket-footer { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; font-size: 11px; }
        </style>
      </head>
      <body>
        ${ticketElement.outerHTML}
      </body>
    </html>
  `);
  ventanaImpresion.document.close();
  ventanaImpresion.print();
}

// Nueva compra
function nuevaCompra() {
  ticketModal.classList.remove('active');
  // Opcional: redirigir a página principal o recargar productos
  cargarProductos();
}