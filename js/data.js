/* KuryCup shared data with localStorage persistence */
window.KC = window.KC || {};

const DEFAULT_TOURNAMENTS = [
  { id:'kc-winter-2026', title:'KuryCup Winter Classic 2026', status:'upcoming', date:'2026-02-14', dateLabel:'14. 2. 2026', endDate:'2026-02-15', place:'Zimní stadion, Liberec', teams:12, price:8500, prize:'80 000 Kč', desc:'Tradiční zimní turnaj KuryCupu s účastí 12 týmů, dvěma zimními dny plnými hokeje, doprovodným programem a afterparty. Formát 4+1, skupiny a play-off.', img:'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=900&q=80', featured:true },
  { id:'kc-spring-2026', title:'KuryCup Spring Cup 2026', status:'upcoming', date:'2026-04-25', dateLabel:'25. 4. 2026', endDate:'2026-04-26', place:'HOKEJ PARK, Praha', teams:16, price:9200, prize:'120 000 Kč', desc:'Jarní edice s rekordním počtem 16 týmů, novým formátem 3+1 a bohatým doprovodným programem pro fanoušky.', img:'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', featured:true },
  { id:'kc-summer-2025', title:'KuryCup Summer Select 2025', status:'past', date:'2025-07-12', dateLabel:'12. 7. 2025', endDate:'2025-07-13', place:'Letní stadion, Brno', teams:10, price:7800, prize:'60 000 Kč', desc:'Letní hokejová událost pod širým nebem. Vítězem se stal tým Black Ice.', img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80', winner:'Black Ice' },
  { id:'kc-autumn-2025', title:'KuryCup Autumn Open 2025', status:'past', date:'2025-10-04', dateLabel:'4. 10. 2025', endDate:'2025-10-05', place:'Zimní stadion, Ostrava', teams:14, price:8000, prize:'70 000 Kč', desc:'Podzimní turnaj s účastí 14 týmů. Vítěz: Ice Breakers.', img:'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=900&q=80', winner:'Ice Breakers' },
  { id:'kc-classic-2025', title:'KuryCup Classic 2025', status:'past', date:'2025-03-22', dateLabel:'22. 3. 2025', endDate:'2025-03-23', place:'Zimní stadion, Liberec', teams:8, price:7000, prize:'40 000 Kč', desc:'Menší, ale intenzivní turnaj formátu 3+1. Vítěz: Northern Lights.', img:'https://images.unsplash.com/photo-1519583577477-7f0b4c00f4f0?auto=format&fit=crop&w=900&q=80', winner:'Northern Lights' },
  { id:'kc-newyear-2026', title:'KuryCup New Year Cup 2026', status:'past', date:'2026-01-10', dateLabel:'10. 1. 2026', endDate:'2026-01-11', place:'HOKEJ PARK, Praha', teams:12, price:8300, prize:'75 000 Kč', desc:'Novoroční turnaj. Vítěz: Polar Bears.', img:'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=900&q=80', winner:'Polar Bears' },
];

const DEFAULT_POSTS = [
  { id:'p1', title:'Ohlédnutí za KuryCup New Year Cup 2026', date:'2026-01-13', dateLabel:'13. 1. 2026', category:'Turnaje', author:'KuryCup tým', excerpt:'Dvanáct týmů, dvě vyprodané haly a nezapomenutelné finále.', img:'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=900&q=80', body:'<p>Novoroční turnaj překonal všechna očekávání.</p>' },
  { id:'p2', title:'Registrace na Spring Cup 2026 otevřeny', date:'2026-01-20', dateLabel:'20. 1. 2026', category:'Oznámení', author:'KuryCup tým', excerpt:'Přihlášky na největší jarní turnaj jsou spuštěny.', img:'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', body:'<p>Registrace otevřeny. Kapacita 16 týmů.</p>' },
  { id:'p3', title:'Nová kolekce merchandisingu je tady', date:'2026-01-25', dateLabel:'25. 1. 2026', category:'Merch', author:'KuryCup tým', excerpt:'Dresy, mikiny, čepice a doplňky v novém designu.', img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', body:'<p>Nová kolekce KuryCup merchandisingu.</p>' },
  { id:'p4', title:'Jak se připravit na turnaj: tipy pro týmy', date:'2026-02-01', dateLabel:'1. 2. 2026', category:'Tipy', author:'KuryCup tým', excerpt:'Praktické rady pro kapitány týmů.', img:'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=900&q=80', body:'<p>Tipy pro týmy před turnajem.</p>' },
  { id:'p5', title:'Plány na rok 2026 a nové lokality', date:'2026-02-05', dateLabel:'5. 2. 2026', category:'Plány', author:'KuryCup tým', excerpt:'Rozšiřujeme se do nových měst.', img:'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=900&q=80', body:'<p>Plány na rok 2026.</p>' },
];

const DEFAULT_PRODUCTS = [
  { id:'m1', name:'Dres KuryCup 2026', cat:'Oblečení', price:1290, oldPrice:1490, desc:'Oficiální dres KuryCupu v novém designu 2026.', img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80', badge:'new' },
  { id:'m2', name:'Mikina Hokejový select', cat:'Oblečení', price:1590, desc:'Teplá mikina s kapucí a logem Hokejového selectu.', img:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80' },
  { id:'m3', name:'Čepice KuryCup', cat:'Doplňky', price:490, desc:'Pletená čepice s bambulí a vyšívaným logem.', img:'https://images.unsplash.com/photo-1576871337622-98d48d152872?auto=format&fit=crop&w=700&q=80' },
  { id:'m4', name:'Hokejový puk KuryCup', cat:'Doplňky', price:190, desc:'Oficiální puk s logem turnaje.', img:'https://images.unsplash.com/photo-1519583577477-7f0b4c00f4f0?auto=format&fit=crop&w=700&q=80' },
  { id:'m5', name:'Láhev na vodu', cat:'Doplňky', price:390, desc:'Sportovní láhev 750 ml s logem KuryCupu.', img:'https://images.unsplash.com/photo-1602143407151-7111142aa84d?auto=format&fit=crop&w=700&q=80' },
  { id:'m6', name:'Triko Hokejový select', cat:'Oblečení', price:690, desc:'Bavlněné triko s potiskem Hokejového selectu.', img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80' },
  { id:'m7', name:'Šála KuryCup', cat:'Doplňky', price:590, desc:'Pletená šála v klubových barvách.', img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80' },
  { id:'m8', name:'Taška na výstroj', cat:'Výbava', price:1890, desc:'Prostorná taška na hokejovou výstroj.', img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80' },
];

function kcLoad(key, def){ try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e){ return def; } }
function kcSave(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }

KC.tournaments = kcLoad('kc_tournaments', DEFAULT_TOURNAMENTS);
KC.posts = kcLoad('kc_posts', DEFAULT_POSTS);
KC.products = kcLoad('kc_products', DEFAULT_PRODUCTS);
KC.gallery = kcLoad('kc_gallery', [
  'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1519583577477-7f0b4c00f4f0?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1574629810375-4b45a28aa886?auto=format&fit=crop&w=700&q=80',
]);
KC.registrations = kcLoad('kc_regs', []);
KC.orders = kcLoad('kc_orders', []);
KC.notifications = kcLoad('kc_notifications', []);
KC.settings = kcLoad('kc_settings', { email:'info@kury-cup.cz', phone:'+420777123456', notifyEmail:true, notifySms:false });

KC.saveTournaments = function(){ kcSave('kc_tournaments', KC.tournaments); };
KC.savePosts = function(){ kcSave('kc_posts', KC.posts); };
KC.saveProducts = function(){ kcSave('kc_products', KC.products); };
KC.saveGallery = function(){ kcSave('kc_gallery', KC.gallery); };
KC.saveRegs = function(){ kcSave('kc_regs', KC.registrations); };
KC.saveOrders = function(){ kcSave('kc_orders', KC.orders); };
KC.saveNotifications = function(){ kcSave('kc_notifications', KC.notifications); };
KC.saveSettings = function(){ kcSave('kc_settings', KC.settings); };

KC.cart = (function(){ try{return JSON.parse(localStorage.getItem('kc_cart')||'[]')}catch(e){return[]} })();
KC.saveCart = function(){ localStorage.setItem('kc_cart',JSON.stringify(KC.cart)); };

// helper to add notification
KC.notify = function(type, recipient, subject, body){
  const n = { id:'n'+Date.now(), type, recipient, subject, body, date:new Date().toLocaleString('cs-CZ'), status:'queued' };
  KC.notifications.unshift(n);
  KC.saveNotifications();
  return n;
};
