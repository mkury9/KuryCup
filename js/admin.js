/* KuryCup admin logic */
(function(){
  const CREDS = { user:'admin', pass:'kury2026' };

  function isLoggedIn(){ return sessionStorage.getItem('kc_admin') === '1'; }
  function login(u,p){ if(u===CREDS.user && p===CREDS.pass){ sessionStorage.setItem('kc_admin','1'); return true;} return false; }
  function logout(){ sessionStorage.removeItem('kc_admin'); location.reload(); }

  // expose
  window.KCAdmin = { isLoggedIn, login, logout };

  // helpers
  function uid(prefix){ return prefix + Date.now().toString(36); }
  function esc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // render login
  function renderLogin(){
    const root = document.getElementById('adminRoot');
    root.innerHTML = `
      <div style="max-width:420px;margin:80px auto">
        <div class="detail-card">
          <h2 style="font-family:'Montserrat',sans-serif;font-size:26px;font-weight:800;margin-bottom:6px">Přihlášení do administrace</h2>
          <p style="color:var(--muted);margin-bottom:18px;font-size:14px">Demo přístup: admin / kury2026</p>
          <form id="loginForm" class="form">
            <div class="field"><label>Uživatelské jméno</label><input name="user" required></div>
            <div class="field"><label>Heslo</label><input name="pass" type="password" required></div>
            <button class="btn btn-primary" type="submit">Přihlásit se</button>
            <div id="loginErr" style="color:var(--accent);font-size:13px;display:none">Nesprávné přihlašovací údaje.</div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('loginForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      if(login(fd.get('user'), fd.get('pass'))){ renderDashboard(); }
      else { document.getElementById('loginErr').style.display='block'; }
    });
  }

  // tabs
  const TABS = [
    {id:'tournaments',label:'Turnaje'},
    {id:'posts',label:'Příspěvky'},
    {id:'products',label:'Merch'},
    {id:'registrations',label:'Přihlášky'},
    {id:'orders',label:'Objednávky'},
    {id:'notifications',label:'Notifikace'},
    {id:'settings',label:'Nastavení'},
  ];

  let activeTab = 'tournaments';

  function renderDashboard(){
    const root = document.getElementById('adminRoot');
    root.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px">
        <h2 style="font-family:'Montserrat',sans-serif;font-size:26px;font-weight:800">Administrace</h2>
        <button class="btn btn-outline btn-sm" id="logoutBtn">Odhlásit se</button>
      </div>
      <div class="tabs" id="adminTabs"></div>
      <div id="adminContent"></div>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
    const tabsEl = document.getElementById('adminTabs');
    tabsEl.innerHTML = TABS.map(t=>`<button class="tab ${t.id===activeTab?'active':''}" data-tab="${t.id}">${t.label}</button>`).join('');
    tabsEl.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{
      tabsEl.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); activeTab=b.dataset.tab; renderTab();
    }));
    renderTab();
  }

  function renderTab(){
    const c = document.getElementById('adminContent');
    switch(activeTab){
      case 'tournaments': renderTournaments(c); break;
      case 'posts': renderPosts(c); break;
      case 'products': renderProducts(c); break;
      case 'registrations': renderRegistrations(c); break;
      case 'orders': renderOrders(c); break;
      case 'notifications': renderNotifications(c); break;
      case 'settings': renderSettings(c); break;
    }
  }

  // ---------- Tournaments ----------
  function renderTournaments(c){
    c.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700">Turnaje (${window.KC.tournaments.length})</h3>
        <button class="btn btn-primary btn-sm" id="addTourn">+ Nový turnaj</button>
      </div>
      <div id="tournFormWrap"></div>
      <div id="tournList"></div>
    `;
    document.getElementById('addTourn').addEventListener('click',()=>showTournForm());
    renderTournList();
  }
  function renderTournList(){
    const el = document.getElementById('tournList');
    el.innerHTML = window.KC.tournaments.map(t=>`
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div>
            <strong>${esc(t.title)}</strong> <span class="badge ${t.status==='upcoming'?'badge-upcoming':'badge-past'}">${t.status}</span>
            <div style="color:var(--muted);font-size:13px;margin-top:4px">${t.dateLabel} · ${esc(t.place)} · ${t.teams} týmů · ${t.price} Kč</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" onclick="KCAdmin.editTourn('${t.id}')">Upravit</button>
            <button class="btn btn-danger btn-sm" onclick="KCAdmin.delTourn('${t.id}')">Smazat</button>
          </div>
        </div>
      </div>
    `).join('') || '<div class="empty">Žádné turnaje</div>';
  }
  function showTournForm(t){
    const wrap = document.getElementById('tournFormWrap');
    const isEdit = !!t;
    wrap.innerHTML = `
      <div class="detail-card" style="margin-bottom:16px">
        <h4 style="font-family:'Montserrat',sans-serif;margin-bottom:12px">${isEdit?'Upravit turnaj':'Nový turnaj'}</h4>
        <form class="form" id="tournForm">
          <input type="hidden" name="id" value="${t?t.id:''}">
          <div class="form-row">
            <div class="field"><label>Název *</label><input name="title" required value="${esc(t?t.title:'')}"></div>
            <div class="field"><label>Status</label><select name="status"><option value="upcoming" ${t&&t.status==='upcoming'?'selected':''}>upcoming</option><option value="past" ${t&&t.status==='past'?'selected':''}>past</option></select></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Datum (label)</label><input name="dateLabel" value="${esc(t?t.dateLabel:'')}"></div>
            <div class="field"><label>Místo</label><input name="place" value="${esc(t?t.place:'')}"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Počet týmů</label><input type="number" name="teams" value="${t?t.teams:8}"></div>
            <div class="field"><label>Startovné (Kč)</label><input type="number" name="price" value="${t?t.price:7000}"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Ceny</label><input name="prize" value="${esc(t?t.prize:'')}"></div>
            <div class="field"><label>Vítěz (u proběhlých)</label><input name="winner" value="${esc(t&&t.winner?t.winner:'')}"></div>
          </div>
          <div class="field"><label>Popis</label><textarea name="desc">${esc(t?t.desc:'')}</textarea></div>
          <div class="field"><label>URL obrázku</label><input name="img" value="${esc(t?t.img:'')}"></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" type="submit">${isEdit?'Uložit':'Vytvořit'}</button>
            <button class="btn btn-outline" type="button" id="cancelTourn">Zrušit</button>
          </div>
        </form>
      </div>
    `;
    document.getElementById('cancelTourn').addEventListener('click',()=>{ wrap.innerHTML=''; });
    document.getElementById('tournForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const obj = {
        id: fd.get('id') || uid('t'),
        title: fd.get('title'),
        status: fd.get('status'),
        dateLabel: fd.get('dateLabel'),
        place: fd.get('place'),
        teams: parseInt(fd.get('teams'))||0,
        price: parseInt(fd.get('price'))||0,
        prize: fd.get('prize'),
        winner: fd.get('winner')||undefined,
        desc: fd.get('desc'),
        img: fd.get('img'),
      };
      if(isEdit){
        const idx = window.KC.tournaments.findIndex(x=>x.id===obj.id);
        if(idx>-1) window.KC.tournaments[idx]=obj;
      } else {
        window.KC.tournaments.unshift(obj);
      }
      window.KC.saveTournaments();
      wrap.innerHTML='';
      renderTournList();
      toast('Turnaj uložen');
    });
  }
  window.KCAdmin.editTourn = function(id){ const t = window.KC.tournaments.find(x=>x.id===id); showTournForm(t); };
  window.KCAdmin.delTourn = function(id){ if(!confirm('Smazat turnaj?')) return; window.KC.tournaments = window.KC.tournaments.filter(x=>x.id!==id); window.KC.saveTournaments(); renderTournList(); toast('Turnaj smazán'); };

  // ---------- Posts ----------
  function renderPosts(c){
    c.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700">Příspěvky (${window.KC.posts.length})</h3>
        <button class="btn btn-primary btn-sm" id="addPost">+ Nový příspěvek</button>
      </div>
      <div id="postFormWrap"></div>
      <div id="postList"></div>
    `;
    document.getElementById('addPost').addEventListener('click',()=>showPostForm());
    renderPostList();
  }
  function renderPostList(){
    const el = document.getElementById('postList');
    el.innerHTML = window.KC.posts.map(p=>`
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div><strong>${esc(p.title)}</strong><div style="color:var(--muted);font-size:13px;margin-top:4px">${p.dateLabel} · ${p.category}</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" onclick="KCAdmin.editPost('${p.id}')">Upravit</button>
            <button class="btn btn-danger btn-sm" onclick="KCAdmin.delPost('${p.id}')">Smazat</button>
          </div>
        </div>
      </div>
    `).join('') || '<div class="empty">Žádné příspěvky</div>';
  }
  function showPostForm(p){
    const wrap = document.getElementById('postFormWrap');
    const isEdit = !!p;
    wrap.innerHTML = `
      <div class="detail-card" style="margin-bottom:16px">
        <h4 style="font-family:'Montserrat',sans-serif;margin-bottom:12px">${isEdit?'Upravit příspěvek':'Nový příspěvek'}</h4>
        <form class="form" id="postForm">
          <input type="hidden" name="id" value="${p?p.id:''}">
          <div class="form-row">
            <div class="field"><label>Název *</label><input name="title" required value="${esc(p?p.title:'')}"></div>
            <div class="field"><label>Datum (label)</label><input name="dateLabel" value="${esc(p?p.dateLabel:'')}"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Kategorie</label><input name="category" value="${esc(p?p.category:'')}"></div>
            <div class="field"><label>Autor</label><input name="author" value="${esc(p?p.author:'KuryCup tým')}"></div>
          </div>
          <div class="field"><label>Perex</label><textarea name="excerpt">${esc(p?p.excerpt:'')}</textarea></div>
          <div class="field"><label>Obsah (HTML)</label><textarea name="body" style="min-height:160px">${esc(p?p.body:'')}</textarea></div>
          <div class="field"><label>URL obrázku</label><input name="img" value="${esc(p?p.img:'')}"></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" type="submit">${isEdit?'Uložit':'Vytvořit'}</button>
            <button class="btn btn-outline" type="button" id="cancelPost">Zrušit</button>
          </div>
        </form>
      </div>
    `;
    document.getElementById('cancelPost').addEventListener('click',()=>{ wrap.innerHTML=''; });
    document.getElementById('postForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const obj = {
        id: fd.get('id') || uid('p'),
        title: fd.get('title'),
        date: new Date().toISOString().slice(0,10),
        dateLabel: fd.get('dateLabel'),
        category: fd.get('category'),
        author: fd.get('author'),
        excerpt: fd.get('excerpt'),
        body: fd.get('body'),
        img: fd.get('img'),
      };
      if(isEdit){
        const idx = window.KC.posts.findIndex(x=>x.id===obj.id);
        if(idx>-1) window.KC.posts[idx]=obj;
      } else window.KC.posts.unshift(obj);
      window.KC.savePosts();
      wrap.innerHTML='';
      renderPostList();
      toast('Příspěvek uložen');
    });
  }
  window.KCAdmin.editPost = function(id){ const p = window.KC.posts.find(x=>x.id===id); showPostForm(p); };
  window.KCAdmin.delPost = function(id){ if(!confirm('Smazat příspěvek?')) return; window.KC.posts = window.KC.posts.filter(x=>x.id!==id); window.KC.savePosts(); renderPostList(); toast('Smazáno'); };

  // ---------- Products ----------
  function renderProducts(c){
    c.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700">Produkty (${window.KC.products.length})</h3>
        <button class="btn btn-primary btn-sm" id="addProd">+ Nový produkt</button>
      </div>
      <div id="prodFormWrap"></div>
      <div id="prodList"></div>
    `;
    document.getElementById('addProd').addEventListener('click',()=>showProdForm());
    renderProdList();
  }
  function renderProdList(){
    const el = document.getElementById('prodList');
    el.innerHTML = window.KC.products.map(p=>`
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div><strong>${esc(p.name)}</strong> <span style="color:var(--muted);font-size:12px">${p.cat}</span><div style="color:var(--primary);font-size:14px;margin-top:4px">${p.price} Kč</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" onclick="KCAdmin.editProd('${p.id}')">Upravit</button>
            <button class="btn btn-danger btn-sm" onclick="KCAdmin.delProd('${p.id}')">Smazat</button>
          </div>
        </div>
      </div>
    `).join('') || '<div class="empty">Žádné produkty</div>';
  }
  function showProdForm(p){
    const wrap = document.getElementById('prodFormWrap');
    const isEdit = !!p;
    wrap.innerHTML = `
      <div class="detail-card" style="margin-bottom:16px">
        <h4 style="font-family:'Montserrat',sans-serif;margin-bottom:12px">${isEdit?'Upravit produkt':'Nový produkt'}</h4>
        <form class="form" id="prodForm">
          <input type="hidden" name="id" value="${p?p.id:''}">
          <div class="form-row">
            <div class="field"><label>Název *</label><input name="name" required value="${esc(p?p.name:'')}"></div>
            <div class="field"><label>Kategorie</label><input name="cat" value="${esc(p?p.cat:'Oblečení')}"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Cena (Kč)</label><input type="number" name="price" value="${p?p.price:0}"></div>
            <div class="field"><label>Původní cena</label><input type="number" name="oldPrice" value="${p&&p.oldPrice?p.oldPrice:''}"></div>
          </div>
          <div class="field"><label>Popis</label><textarea name="desc">${esc(p?p.desc:'')}</textarea></div>
          <div class="field"><label>URL obrázku</label><input name="img" value="${esc(p?p.img:'')}"></div>
          <div class="field"><label>Badge (new/empty)</label><input name="badge" value="${esc(p&&p.badge?p.badge:'')}"></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" type="submit">${isEdit?'Uložit':'Vytvořit'}</button>
            <button class="btn btn-outline" type="button" id="cancelProd">Zrušit</button>
          </div>
        </form>
      </div>
    `;
    document.getElementById('cancelProd').addEventListener('click',()=>{ wrap.innerHTML=''; });
    document.getElementById('prodForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const obj = {
        id: fd.get('id') || uid('m'),
        name: fd.get('name'),
        cat: fd.get('cat'),
        price: parseInt(fd.get('price'))||0,
        oldPrice: fd.get('oldPrice')?parseInt(fd.get('oldPrice')):undefined,
        desc: fd.get('desc'),
        img: fd.get('img'),
        badge: fd.get('badge')||undefined,
      };
      if(isEdit){
        const idx = window.KC.products.findIndex(x=>x.id===obj.id);
        if(idx>-1) window.KC.products[idx]=obj;
      } else window.KC.products.unshift(obj);
      window.KC.saveProducts();
      wrap.innerHTML='';
      renderProdList();
      toast('Produkt uložen');
    });
  }
  window.KCAdmin.editProd = function(id){ const p = window.KC.products.find(x=>x.id===id); showProdForm(p); };
  window.KCAdmin.delProd = function(id){ if(!confirm('Smazat produkt?')) return; window.KC.products = window.KC.products.filter(x=>x.id!==id); window.KC.saveProducts(); renderProdList(); toast('Smazáno'); };

  // ---------- Registrations ----------
  function renderRegistrations(c){
    const regs = window.KC.registrations;
    c.innerHTML = `
      <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;margin-bottom:14px">Přihlášky týmů (${regs.length})</h3>
      <div id="regList"></div>
    `;
    const el = document.getElementById('regList');
    if(!regs.length){ el.innerHTML='<div class="empty">Žádné přihlášky</div>'; return; }
    el.innerHTML = regs.map(r=>{
      const t = window.KC.tournaments.find(x=>x.id===r.tournamentId);
      return `
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div>
            <strong>${esc(r.team)}</strong> <span style="color:var(--muted);font-size:12px">(${esc(r.level||'')})</span>
            <div style="color:var(--muted);font-size:13px;margin-top:4px">Turnaj: ${esc(t?t.title:r.tournamentId)}</div>
            <div style="color:var(--muted);font-size:13px">Kapitán: ${esc(r.captain)} · ${esc(r.email)} · ${esc(r.phone)} · ${r.players} hráčů</div>
            ${r.note?`<div style="color:var(--muted);font-size:13px;margin-top:4px">Pozn.: ${esc(r.note)}</div>`:''}
            <div style="color:var(--muted);font-size:12px;margin-top:4px">${r.date}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a class="btn btn-outline btn-sm" href="mailto:${esc(r.email)}?subject=Přihláška ${encodeURIComponent(t?t.title:'')}&body=${encodeURIComponent('Dobrý den, '+r.captain+',\n\nvaše přihláška týmu '+r.team+' byla přijata.')}" target="_blank">E-mail</a>
            <a class="btn btn-outline btn-sm" href="sms:${esc(r.phone)}?body=${encodeURIComponent('KuryCup: přihláška týmu '+r.team+' přijata.')}" target="_blank">SMS</a>
            <button class="btn btn-danger btn-sm" onclick="KCAdmin.delReg('${r.id}')">Smazat</button>
          </div>
        </div>
      </div>
    `}).join('');
  }
  window.KCAdmin.delReg = function(id){ if(!confirm('Smazat přihlášku?')) return; window.KC.registrations = window.KC.registrations.filter(x=>x.id!==id); window.KC.saveRegs(); renderTab(); toast('Smazáno'); };

  // ---------- Orders ----------
  function renderOrders(c){
    const orders = window.KC.orders;
    c.innerHTML = `
      <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;margin-bottom:14px">Objednávky (${orders.length})</h3>
      <div id="orderList"></div>
    `;
    const el = document.getElementById('orderList');
    if(!orders.length){ el.innerHTML='<div class="empty">Žádné objednávky</div>'; return; }
    el.innerHTML = orders.map(o=>`
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div>
            <strong>Objednávka #${esc(o.id)}</strong>
            <div style="color:var(--muted);font-size:13px;margin-top:4px">${o.date} · ${o.items.length} položek · ${o.total} Kč</div>
            <div style="color:var(--muted);font-size:13px">Zákazník: ${esc(o.customer||'—')} · ${esc(o.email||'')}</div>
            <ul style="color:var(--muted);font-size:12px;margin-top:6px;padding-left:18px">${o.items.map(i=>`<li>${esc(i.name)} × ${i.qty} = ${i.price*i.qty} Kč</li>`).join('')}</ul>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a class="btn btn-outline btn-sm" href="mailto:${esc(o.email||'')}?subject=Objednávka ${encodeURIComponent(o.id)}&body=${encodeURIComponent('Děkujeme za objednávku. Celkem: '+o.total+' Kč')}" target="_blank">E-mail</a>
            <button class="btn btn-danger btn-sm" onclick="KCAdmin.delOrder('${o.id}')">Smazat</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  window.KCAdmin.delOrder = function(id){ if(!confirm('Smazat objednávku?')) return; window.KC.orders = window.KC.orders.filter(x=>x.id!==id); window.KC.saveOrders(); renderTab(); toast('Smazáno'); };

  // ---------- Notifications ----------
  function renderNotifications(c){
    const notes = window.KC.notifications;
    c.innerHTML = `
      <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;margin-bottom:14px">Notifikace (${notes.length})</h3>
      <div id="noteList"></div>
    `;
    const el = document.getElementById('noteList');
    if(!notes.length){ el.innerHTML='<div class="empty">Žádné notifikace</div>'; return; }
    el.innerHTML = notes.map(n=>`
      <div class="detail-card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap">
          <div>
            <strong>${esc(n.type.toUpperCase())}</strong> → ${esc(n.recipient)}
            <div style="color:var(--muted);font-size:13px;margin-top:4px">${esc(n.subject)}</div>
            <div style="color:var(--muted);font-size:12px;margin-top:4px">${n.body}</div>
            <div style="color:var(--muted);font-size:11px;margin-top:4px">${n.date} · ${n.status}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${n.type==='email'?`<a class="btn btn-outline btn-sm" href="mailto:${esc(n.recipient)}?subject=${encodeURIComponent(n.subject)}&body=${encodeURIComponent(n.body)}" target="_blank">Odeslat znovu</a>`:''}
            ${n.type==='sms'?`<a class="btn btn-outline btn-sm" href="sms:${esc(n.recipient)}?body=${encodeURIComponent(n.body)}" target="_blank">Odeslat znovu</a>`:''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // ---------- Settings ----------
  function renderSettings(c){
    const s = window.KC.settings || { email:'info@kury-cup.cz', phone:'+420777123456', notifyEmail:true, notifySms:false };
    window.KC.settings = s;
    c.innerHTML = `
      <h3 style="font-family:'Montserrat',sans-serif;font-size:20px;font-weight:700;margin-bottom:14px">Nastavení notifikací</h3>
      <div class="detail-card" style="max-width:560px">
        <form class="form" id="settingsForm">
          <div class="field"><label>E-mail administrátora</label><input name="email" value="${esc(s.email)}"></div>
          <div class="field"><label>Telefon administrátora</label><input name="phone" value="${esc(s.phone)}"></div>
          <div class="field"><label><input type="checkbox" name="notifyEmail" ${s.notifyEmail?'checked':''}> Posílat e-mailové notifikace</label></div>
          <div class="field"><label><input type="checkbox" name="notifySms" ${s.notifySms?'checked':''}> Posílat SMS notifikace</label></div>
          <button class="btn btn-primary" type="submit">Uložit</button>
        </form>
        <p style="color:var(--muted);font-size:12px;margin-top:12px">Pozn.: Reálné odesílání SMS/e-mailu vyžaduje backend (SMTP/SMS bránu). V demo režimu se notifikace zaznamenávají do logu a lze je odeslat přes tlačítko "Odeslat znovu" (mailto/sms link).</p>
      </div>
    `;
    document.getElementById('settingsForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      window.KC.settings = {
        email: fd.get('email'),
        phone: fd.get('phone'),
        notifyEmail: fd.get('notifyEmail')==='on',
        notifySms: fd.get('notifySms')==='on',
      };
      window.KC.saveSettings();
      toast('Nastavení uloženo');
    });
  }

  // load settings
  try { const s = JSON.parse(localStorage.getItem('kc_settings')||'null'); if(s) window.KC.settings = s; } catch(e){}

  // init
  document.addEventListener('DOMContentLoaded',()=>{
    if(isLoggedIn()) renderDashboard(); else renderLogin();
  });
  // also run now if DOM ready
  if(document.readyState !== 'loading'){ if(isLoggedIn()) renderDashboard(); else renderLogin(); }
})();
