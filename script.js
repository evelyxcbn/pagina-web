// Productos de ejemplo (puedes agregar más y cambiar imagenes en /images)
cart[id] += delta;
if(cart[id] <= 0) delete cart[id];
updateCartUI();
}


// Eventos
document.addEventListener('click', e=>{
if(e.target.dataset.add){
const id = e.target.dataset.add;
cart[id] = (cart[id]||0)+1;
updateCartUI();
cartPanel.classList.remove('hidden');
}
});


document.getElementById('openCart').addEventListener('click', ()=>{ cartPanel.classList.toggle('hidden'); });
document.getElementById('closeCart').addEventListener('click', ()=>{ cartPanel.classList.add('hidden'); });


// Checkout
document.getElementById('checkoutBtn').addEventListener('click', async ()=>{
if(Object.keys(cart).length===0){ alert('Tu carrito está vacío'); return; }
const items = Object.keys(cart).map(id=>({id:parseInt(id),qty:cart[id]}));
// Mostrar procedimiento de compra (pasos)
if(!confirm('Vas a pagar. Procedimiento:\n1) Enviar pedido.\n2) Guardar en la base de datos.\n3) Mostrar ticket.\nContinuar?')) return;


try{
const resp = await fetch('purchase.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});
const data = await resp.json();
if(data.success){
showTicket(data.order);
cart = {};
updateCartUI();
cartPanel.classList.add('hidden');
}else{
alert('Error: '+(data.message||'No se pudo procesar'));
}
}catch(err){
alert('Error de conexión: '+err.message);
}
});


// Mostrar ticket
const ticketModal = document.getElementById('ticketModal');
const ticketContent = document.getElementById('ticketContent');
function showTicket(order){
let html = `<p><strong>No. Pedido:</strong> ${order.id}</p>`;
html += `<p><strong>Fecha:</strong> ${order.created_at}</p>`;
html += '<table style="width:100%;border-collapse:collapse">';
html += '<thead><tr><th>Producto</th><th>Qty</th><th>Subtotal</th></tr></thead><tbody>';
let total=0;
order.items.forEach(it=>{ html += `<tr><td>${it.name}</td><td>${it.qty}</td><td>$${(it.price*it.qty).toFixed(2)}</td></tr>`; total += it.price*it.qty; });
html += `</tbody></table><p style="text-align:right"><strong>Total:</strong> $${total.toFixed(2)}</p>`;
ticketContent.innerHTML = html;
ticketModal.classList.remove('hidden');
}


document.getElementById('closeTicket').addEventListener('click', ()=>{ ticketModal.classList.add('hidden'); });
document.getElementById('printTicket').addEventListener('click', ()=>{ window.print(); });


// Inicializar
renderProducts(); updateCartUI();