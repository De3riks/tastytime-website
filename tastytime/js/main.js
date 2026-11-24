(function(){
"use strict";
var MENU=[
 {id:1,cat:"Бургери та комбо",name:"Комбо: бургер, фрі та напій",desc:"Бургер із сиром, картопля фрі, Coca-Cola Zero 0,5 л.",price:329,img:"combo.jpg"},
 {id:2,cat:"Бургери та комбо",name:"Чізбургер",desc:"Булочка з кунжутом, котлета, сир, свіжі овочі.",price:219,img:"burger.jpg"},
 {id:3,cat:"Хот-доги",name:"Хот-дог гострий",desc:"Сосиска у булці, гірчиця, кетчуп, смажена цибуля.",price:149,img:"hotdog.jpg"},
 {id:4,cat:"Закуски",name:"Картопля фрі",desc:"Золотиста хрустка картопля. Соус на вибір.",price:89,img:"fries.jpg"},
 {id:5,cat:"Закуски",name:"Картопля дольками",desc:"Запечена картопля з сирним та гірчичним соусами.",price:99,img:"wedges.jpg"},
 {id:6,cat:"Закуски",name:"Сирні палички",desc:"Сир у хрусткій паніровці, подаємо гарячими.",price:129,img:"cheese-sticks.jpg"},
 {id:7,cat:"Закуски",name:"Сирні трикутники",desc:"Гаряча закуска в золотистій паніровці.",price:119,img:"cheese-triangles.jpg"},
 {id:8,cat:"Гарячі страви",name:"Ковбаски з грибами",desc:"Смажені ковбаски, печериці та картопля з зеленню.",price:259,img:"sausages.jpg"},
 {id:9,cat:"Боули",name:"Боул із соусом",desc:"Овочі, зелень, кунжут і насичений соус у боулі.",price:239,img:"bowl.jpg"},
 {id:10,cat:"Напої",name:"Schweppes Indian Tonic",desc:"Освіжальний тонік, 0,33 л.",price:55,img:"tonic.jpg"}
];
var $=function(s){return document.querySelector(s)};
var cart={};try{cart=JSON.parse(localStorage.getItem("tt_cart")||"{}")}catch(e){cart={}}
function save(){try{localStorage.setItem("tt_cart",JSON.stringify(cart))}catch(e){}}
function byId(id){return MENU.filter(function(m){return m.id===+id})[0]}
function fmt(n){return n+" ₴"}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

/* menu */
var cats=["Усі"].concat(MENU.map(function(m){return m.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
var active="Усі";
function renderTabs(){
 $("#tabs").innerHTML=cats.map(function(c){return '<button role="tab" class="'+(c===active?"on":"")+'" data-c="'+esc(c)+'" aria-selected="'+(c===active)+'">'+esc(c)+'</button>'}).join("");
}
function renderGrid(){
 $("#grid").innerHTML=MENU.filter(function(m){return active==="Усі"||m.cat===active}).map(function(m){
  return '<article class="card reveal"><div class="ph"><img src="images/'+m.img+'" alt="'+esc(m.name)+'" loading="lazy"></div><div class="bd"><h3>'+esc(m.name)+'</h3><p>'+esc(m.desc)+'</p><div class="row"><span class="price">'+fmt(m.price)+'</span><button class="add" data-id="'+m.id+'" aria-label="Додати в кошик: '+esc(m.name)+'">+</button></div></div></article>';
 }).join("");
 observe();
}
$("#tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;active=b.dataset.c;renderTabs();renderGrid()});
$("#grid").addEventListener("click",function(e){var b=e.target.closest(".add");if(!b)return;add(b.dataset.id)});

/* cart */
function count(){return Object.keys(cart).reduce(function(s,k){return s+cart[k]},0)}
function renderCart(){
 var ids=Object.keys(cart),total=0,html="";
 ids.forEach(function(id){var m=byId(id);if(!m)return;total+=m.price*cart[id];
  html+='<div class="ci"><img src="images/'+m.img+'" alt=""><div><b>'+esc(m.name)+'</b><small>'+fmt(m.price)+'</small><div class="qty"><button data-a="dec" data-id="'+id+'" aria-label="Менше">−</button><span>'+cart[id]+'</span><button data-a="inc" data-id="'+id+'" aria-label="Більше">+</button></div></div><b>'+fmt(m.price*cart[id])+'</b></div>';});
 $("#cartItems").innerHTML=html||'<p class="empty">Кошик порожній. Додайте страви з меню.</p>';
 $("#cartTotal").textContent=fmt(total);
 var c=$("#cartCount");c.textContent=count();c.classList.add("pop");setTimeout(function(){c.classList.remove("pop")},250);
 save();
}
function add(id){cart[id]=(cart[id]||0)+1;renderCart();toast("Додано: "+byId(id).name)}
$("#cartItems").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var id=b.dataset.id;
 if(b.dataset.a==="inc")cart[id]++;else{cart[id]--;if(cart[id]<=0)delete cart[id]}renderCart()});
function openCart(o){$("#drawer").classList.toggle("on",o);$("#overlay").classList.toggle("on",o);$("#drawer").setAttribute("aria-hidden",!o)}
$("#cartOpen").addEventListener("click",function(){openCart(true)});
$("#cartClose").addEventListener("click",function(){openCart(false)});
$("#overlay").addEventListener("click",function(){openCart(false)});
document.addEventListener("keydown",function(e){if(e.key==="Escape")openCart(false)});
$("#clearCart").addEventListener("click",function(){cart={};renderCart()});
$("#checkout").addEventListener("click",function(){
 if(!count()){toast("Кошик порожній");return}
 cart={};renderCart();openCart(false);toast("Демо: замовлення не надсилається. Для замовлення зателефонуйте за номером +380 50 258 75 76");
});

/* toast */
var tt;function toast(t){var el=$("#toast");el.textContent=t;el.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){el.classList.remove("on")},2800)}

/* mobile nav */
var bg=$("#burger"),nav=$("#nav");
bg.addEventListener("click",function(){var o=!nav.classList.contains("on");nav.classList.toggle("on",o);bg.setAttribute("aria-expanded",o)});
nav.addEventListener("click",function(e){if(e.target.tagName==="A"){nav.classList.remove("on");bg.setAttribute("aria-expanded","false")}});

/* scroll reveal */
var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}})},{threshold:.12}):null;
function observe(){document.querySelectorAll(".reveal:not(.show)").forEach(function(el){io?io.observe(el):el.classList.add("show")})}
document.querySelectorAll(".section .wrap > *, .about > *, .contacts > *").forEach(function(el){if(!el.classList.contains("grid"))el.classList.add("reveal")});

/* instagram */
var ig=(window.TASTY_CONFIG&&window.TASTY_CONFIG.INSTAGRAM_URL||"").trim();
if(/^https:\/\/(www\.)?instagram\.com\//.test(ig)){var b=$("#instaBtn");b.href=ig;b.target="_blank";b.rel="noopener";b.removeAttribute("aria-disabled");$("#instaNote").hidden=true}

renderTabs();renderGrid();renderCart();observe();
})();
