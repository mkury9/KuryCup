/* KuryCup shared JS */
(function(){
  // active nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === path || (path==='' && href==='index.html')) a.classList.add('active');
  });

  // hamburger
  const ham = document.querySelector('.hamburger');
  const mm = document.querySelector('.mobile-menu');
  if(ham && mm){
    ham.addEventListener('click',()=>{ham.classList.toggle('open');mm.classList.toggle('open')});
    mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mm.classList.remove('open')}));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // toast
  window.toast = function(msg){
    let t = document.querySelector('.toast');
    if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t);}
    t.textContent = msg; t.classList.add('show');
    clearTimeout(window._toastTimer); window._toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
  };

  // cart drawer
  const cartBtn = document.querySelector('[data-cart-open]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  function openCart(){ cartDrawer&&cartDrawer.classList.add('open'); cartOverlay&&cartOverlay.classList.add('open'); renderCart(); }
  function closeCart(){ cartDrawer&&cartDrawer.classList.remove('open'); cartOverlay&&cartOverlay.classList.remove('open'); }
  cartBtn && cartBtn.addEventListener('click', openCart);
  cartOverlay && cartOverlay.addEventListener('click', closeCart);
  document.querySelectorAll('[data-cart-close]').forEach(b=>b.addEventListener('click',closeCart));
  window.openCart = openCart; window.closeCart = closeCart;

  function cartCount(){ return (window.KC.cart||[]).reduce((s,i)=>s+i.qty,0); }
  function updateCartBadge(){
    document.querySelectorAll('[data-cart-count]').forEach(el=>{ el.textContent = cartCount(); el.style.display = cartCount()?'inline-flex':'none'; });
  }
  window.updateCartBadge = updateCartBadge;

  window.addToCart = function(product, qty=1){
    const c = window.KC.cart;
    const ex = c.find(i=>i.id===product.id);
    if(ex) ex.qty += qty; else c.push({id:product.id,name:product.name,price:product.price,img:product.img,qty});
    window.KC.saveCart(); updateCartBadge(); renderCart(); toast('Přidáno do košíku');
  };
  window.removeFromCart = function(id){
    window.KC.cart = window.KC.cart.filter(i=>i.id!==id); window.KC.saveCart(); updateCartBadge(); renderCart();
  };
  window.changeQty = function(id,delta){
    const item = window.KC.cart.find(i=>i.id===id);
    if(!item) return;
    item.qty += delta;
    if(item.qty<=0) window.removeFromCart(id); else { window.KC.saveCart(); renderCart(); }
    updateCartBadge();
  };

  function renderCart(){
    const itemsEl = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.cart-total span:last-child');
    if(!itemsEl) return;
    const c = window.KC.cart;
    if(!c.length){ itemsEl.innerHTML = '<div class="empty">Košík je prázdný</div>'; if(totalEl) totalEl.textContent='0 Kč'; return; }
    itemsEl.innerHTML = c.map(i=>`
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div class="cart-item-info">
          <h4>${i.name}</h4>
          <div style="display:flex;align-items:center;gap:8px;margin:6px 0">
            <button class="btn btn-sm btn-outline" onclick="changeQty('${i.id}',-1)">−</button>
            <span>${i.qty}</span>
            <button class="btn btn-sm btn-outline" onclick="changeQty('${i.id}',1)">+</button>
          </div>
          <div class="price">${(i.price*i.qty).toLocaleString('cs-CZ')} Kč</div>
        </div>
        <button onclick="removeFromCart('${i.id}')" style="color:var(--muted);font-size:18px;padding:4px">×</button>
      </div>
    `).join('');
    const total = c.reduce((s,i)=>s+i.price*i.qty,0);
    if(totalEl) totalEl.textContent = total.toLocaleString('cs-CZ')+' Kč';
  }

  // lightbox
  window.openLightbox = function(src){
    let lb = document.querySelector('.lightbox');
    if(!lb){
      lb = document.createElement('div'); lb.className='lightbox';
      lb.innerHTML = '<span class="close">&times;</span><img alt="">';
      document.body.appendChild(lb);
      lb.querySelector('.close').addEventListener('click',()=>lb.classList.remove('open'));
      lb.addEventListener('click',e=>{ if(e.target===lb) lb.classList.remove('open');});
    }
    lb.querySelector('img').src = src;
    lb.classList.add('open');
  };

  document.addEventListener('DOMContentLoaded',()=>{ updateCartBadge(); renderCart(); });
  // run now too
  updateCartBadge();
})();

// checkout
window.checkout = function(){
  if(!window.KC || !window.KC.cart || !window.KC.cart.length){ toast('Košík je prázdný'); return; }
  const name = prompt('Jméno a příjmení:');
  if(!name) return;
  const email = prompt('E-mail:');
  if(!email) return;
  const phone = prompt('Telefon (pro SMS, volitelné):') || '';
  const total = window.KC.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const order = { id:'O'+Date.now(), date:new Date().toLocaleString('cs-CZ'), items: window.KC.cart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty})), total: total, customer:name, email:email, phone:phone };
  window.KC.orders.push(order);
  window.KC.saveOrders();
  const settings = window.KC.settings || {};
  if(settings.notifyEmail !== false){
    window.KC.notify('email', settings.email || 'info@kury-cup.cz', 'Nová objednávka #' + order.id, 'Zákazník: ' + name + ' (' + email + '). Celkem: ' + total + ' Kč. Položky: ' + order.items.map(i=>i.name + ' x' + i.qty).join(', '));
  }
  window.KC.notify('email', email, 'Potvrzení objednávky #' + order.id, 'Děkujeme za objednávku. Celkem: ' + total + ' Kč.');
  if(settings.notifySms && phone){
    window.KC.notify('sms', phone, 'KuryCup objednávka', 'Objednávka #' + order.id + ' přijata. Celkem ' + total + ' Kč.');
  }
  window.KC.cart = [];
  window.KC.saveCart();
  if(typeof updateCartBadge === 'function') updateCartBadge();
  if(typeof renderCart === 'function') renderCart();
  if(typeof closeCart === 'function') closeCart();
  toast('Objednávka odeslána. Notifikace zaznamenány.');
  if(confirm('Otevřít e-mailového klienta pro odeslání potvrzení zákazníkovi?')){
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Potvrzení objednávky #' + order.id) + '&body=' + encodeURIComponent('Děkujeme za objednávku. Celkem: ' + total + ' Kč.');
  }
};
