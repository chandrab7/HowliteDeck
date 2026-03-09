const TOTAL=13, slides=Array.from(document.querySelectorAll('.slide'));
let cur=0;

// dots
const dotsEl=document.getElementById('pdots');
slides.forEach((_,i)=>{
  const d=document.createElement('div');
  d.className='dot'+(i===0?' on':'');
  d.onclick=()=>goTo(i);
  dotsEl.appendChild(d);
});

// scale
const deck=document.getElementById('deck');
function scale(){
  const s=Math.min(window.innerWidth/1280,window.innerHeight/720);
  const ox=(window.innerWidth-1280*s)/2, oy=(window.innerHeight-720*s)/2;
  deck.style.transform=`scale(${s})`;
  deck.style.left=ox+'px'; deck.style.top=oy+'px';
}
scale(); window.addEventListener('resize',scale);

// anim
function clearAnims(idx){
  const sl=slides[idx];
  sl.querySelectorAll('.a-up,.a-left,.a-right,.a-pop,.a-fade').forEach(e=>e.classList.remove('on'));
  if(idx===3) resetFlow();
}
function triggerAnims(idx){
  const sl=slides[idx];
  sl.querySelectorAll('.a-up,.a-left,.a-right,.a-pop,.a-fade').forEach(e=>{
    setTimeout(()=>e.classList.add('on'), parseInt(e.dataset.delay||0));
  });
  if(idx===3) setTimeout(animateFlow, 300);
}

// Flow animation S6
function resetFlow(){
  // PAY node
  const fn1=document.getElementById('fn1'); if(fn1)fn1.classList.remove('on');
  // Fork connectors
  ['fk-h','fk-v','fk-top','fk-bot'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('on');});
  // Howlite path
  const hp=document.getElementById('howlite-path');if(hp)hp.classList.remove('on');
  [1,2,3].forEach(n=>{const el=document.getElementById('fn-h'+n);if(el)el.classList.remove('on');});
  [1,2].forEach(n=>{const el=document.getElementById('gs-h'+n);if(el)el.classList.remove('on');});
  // Legacy path
  const lp=document.getElementById('legacy-path');if(lp)lp.classList.remove('on');
  [1,2,3,4,5,6].forEach(n=>{const el=document.getElementById('fn-l'+n);if(el)el.classList.remove('on');});
  [1,2,3,4,5].forEach(n=>{const el=document.getElementById('gs-l'+n);if(el)el.classList.remove('on');});
  // Outcomes
  const oc=document.getElementById('s6oc');if(oc)oc.classList.remove('on');
}
function animateFlow(){
  const seq=[
    // PAY
    {id:'fn1',t:0},
    // Fork lines
    {id:'fk-h',t:400},{id:'fk-v',t:500},{id:'fk-top',t:600},{id:'fk-bot',t:600},
    // Howlite path
    {id:'howlite-path',t:750},
    {id:'fn-h1',t:950},{id:'gs-h1',t:1200},{id:'fn-h2',t:1400},{id:'gs-h2',t:1650},{id:'fn-h3',t:1850},
    // Legacy path
    {id:'legacy-path',t:2100},
    {id:'fn-l1',t:2300},{id:'gs-l1',t:2420},{id:'fn-l2',t:2520},{id:'gs-l2',t:2620},
    {id:'fn-l3',t:2720},{id:'gs-l3',t:2820},{id:'fn-l4',t:2920},{id:'gs-l4',t:3020},
    {id:'fn-l5',t:3120},{id:'gs-l5',t:3220},{id:'fn-l6',t:3320},
    // Outcomes comparison
    {id:'s6oc',t:3700},
  ];
  seq.forEach(({id,t})=>{
    setTimeout(()=>{const el=document.getElementById(id);if(el)el.classList.add('on');},t);
  });
}

// Navigation
function goTo(idx){
  if(idx===cur) return;
  const prev=cur; cur=idx;
  clearAnims(prev);
  slides[prev].classList.add('was-active');
  slides[prev].classList.remove('active');
  setTimeout(()=>slides[prev].classList.remove('was-active'),520);
  slides[cur].classList.add('active');
  setTimeout(()=>triggerAnims(cur),60);
  document.getElementById('sctr').textContent=(cur+1)+' / '+TOTAL;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
}
function next(){if(cur<TOTAL-1)goTo(cur+1);}
function prev(){if(cur>0)goTo(cur-1);}

document.getElementById('nb').onclick=next;
document.getElementById('pb').onclick=prev;

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '||e.key==='ArrowDown'){e.preventDefault();next();}
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();prev();}
  if(e.key==='f'||e.key==='F')toggleFS();
  if(e.key==='Home')goTo(0);
  if(e.key==='End')goTo(TOTAL-1);
});

let tx=0;
deck.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
deck.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-tx;
  if(Math.abs(dx)>50){dx<0?next():prev();}
});

function toggleFS(){
  if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});
  else document.exitFullscreen?.();
}

// Init
slides[0].classList.add('active');
setTimeout(()=>triggerAnims(0),120);
