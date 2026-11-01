const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
document.documentElement.classList.toggle('rm',matchMedia('(prefers-reduced-motion: reduce)').matches);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
gsap.registerPlugin(ScrollTrigger);
window.scene3d={p:0,assemble:0};
if(!RM){window.lenis=new Lenis({lerp:.085});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
const scrollTo=t=>window.lenis?lenis.scrollTo(t,{offset:-40}):document.querySelector(t).scrollIntoView({behavior:RM?'auto':'smooth'});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h.length>1&&$(h)){e.preventDefault();scrollTo(h);}}));
// split words
$$('.split').forEach(el=>{el.innerHTML=el.innerHTML.split(/(<br>|<em>|<\/em>)/).map(p=>/^<\/?(br|em)>$/.test(p)?p:p.split(' ').map(w=>w?`<span class="w"><span>${w}</span></span>`:'').join(' ')).join('');});
// marquee
const names=['Jollof Rice','Egusi','Puff Puff','Goat Pepper Soup','Ofada & Ayamase','Moi-Moi','Beef Kebab','Ewa Aganyin','Banga Soup','Chin-Chin','Giz-Dodo','Asaro'];
$('.mq-track').innerHTML=[0,1].map(()=>`<div>${names.map(n=>`<span>${n}</span><i>✺</i>`).join('')}</div>`).join('');
// signatures
const SIG=[['jollof','Jollof Rice','The party classic, cooked down in tomato and pepper.'],['gps','Goat Pepper Soup','Its own spice level. Mild to extra hot.'],['egusi','Egusi Soup','Melon seed soup, built your way. Pair with poundo.'],['gfish','Grilled Fish','Tilapia or croaker, with a side of white rice.'],['kebab','Beef Kebab','Pick your spice. Charred and ready.'],['small','Small-Chops','Spring rolls, samosas, mini kebabs. For sharing.']];
const byId=Object.fromEntries(MENU.map(i=>[i.id,i]));
$('.track').innerHTML=SIG.map(([id,n,d],i)=>{const it=byId[id];return`<article class="card" data-id="${id}"><div class="card-media"><img src="img/${it.img}.webp" alt="${n} (AI-generated illustration)" loading="lazy"><span class="glare"></span><span class="num">0${i+1}</span></div>
<div class="card-body"><h3>${n}</h3><p>${d}</p><div class="card-row"><b>${priceLabel(it)}</b><button class="add magnetic" data-add="${id}"><span>Add to order</span></button></div></div></article>`;}).join('');
// menu
const CATS=['All',...new Set(MENU.map(i=>i.cat))];let cat='All',q='';
const tabs=$('.tabs'),list=$('.list'),pv=$('.preview'),pimg=pv.querySelector('img');
tabs.innerHTML=CATS.map(c=>`<button role="tab" data-c="${c}">${c}<sup>${c==='All'?MENU.length:MENU.filter(i=>i.cat===c).length}</sup></button>`).join('');
function renderMenu(anim){const qq=q.trim().toLowerCase();const items=MENU.filter(i=>(cat==='All'||i.cat===cat)&&(!qq||(i.n+' '+i.d+' '+i.cat).toLowerCase().includes(qq)));
 tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.dataset.c===cat));
 let last='';list.innerHTML=items.map(i=>{const h=(cat==='All'&&i.cat!==last)?`<li class="cat-h">${last=i.cat}</li>`:'';
  return h+`<li class="row" data-img="${i.img||''}"><div class="row-main"><h4>${i.n}${(i.t||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</h4>${i.d?`<p>${i.d}</p>`:''}</div><span class="pr">${priceLabel(i)}</span><button class="add" data-add="${i.id}" aria-label="Add ${i.n} to order"><span>${i.g?'Choose':'Add'}</span><i>+</i></button></li>`;}).join('');
 $('.empty').hidden=!!items.length;
 if(anim&&!RM)gsap.from(list.querySelectorAll('.row'),{y:18,opacity:0,stagger:.025,duration:.5,ease:'power3.out',clearProps:'all'});
 ScrollTrigger.refresh();}
tabs.onclick=e=>{const b=e.target.closest('button');if(b){cat=b.dataset.c;renderMenu(true);}};
$('#q').addEventListener('input',e=>{q=e.target.value;if(q)cat='All';renderMenu(false);});
renderMenu(false);
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)Order.openOptions(b.dataset.add,b);});
// open now (browser local time)
(()=>{const d=new Date(),m=d.getHours()*60+d.getMinutes(),open=d.getDay()!==0&&m>=720&&m<1200;$('#openNow').innerHTML=open?'<i class="dot on"></i>Open now · until 8pm':'<i class="dot"></i>Closed now · opens 12pm '+(d.getDay()===6&&m>=1200||d.getDay()===0?'Monday':(m<720?'today':'tomorrow'));})();
// cursor, preview, magnetic
const cur=$('.cursor');let mx=innerWidth/2,my=innerHeight/2;
if(FINE){addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
 const cx=gsap.quickTo(cur,'x',{duration:.18,ease:'power3'}),cy=gsap.quickTo(cur,'y',{duration:.18,ease:'power3'}),px=gsap.quickTo(pv,'x',{duration:.7,ease:'power3'}),py=gsap.quickTo(pv,'y',{duration:.7,ease:'power3'});
 gsap.ticker.add(()=>{cx(mx);cy(my);px(mx+28);py(my-110);});
 document.addEventListener('pointerover',e=>{const t=e.target;const row=t.closest('.row');
  cur.classList.toggle('big',!!t.closest('a,button,label,.card'));cur.classList.toggle('view',!!t.closest('.card-media'));
  if(row&&row.dataset.img){pimg.src='img/'+row.dataset.img+'.webp';pv.classList.add('on');gsap.to(pv,{rotate:(Math.random()-.5)*8,duration:.5});}else pv.classList.remove('on');});
 if(!RM)$$('.magnetic').forEach(m=>{m.addEventListener('pointermove',e=>{const r=m.getBoundingClientRect();gsap.to(m,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.4});});m.addEventListener('pointerleave',()=>gsap.to(m,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'}));});
 // tilt cards + hover distortion
 if(!RM)$$('.card').forEach(c=>{const md=c.querySelector('.card-media'),g=c.querySelector('.glare');
  md.addEventListener('pointermove',e=>{const r=md.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(md,{rotateY:x*14,rotateX:-y*14,duration:.5});g.style.background=`radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%,#ffd9a855,transparent 55%)`;});
  md.addEventListener('pointerenter',()=>{gsap.to(window.__disp,{v:28,duration:.35,overwrite:true,onUpdate:setDisp});gsap.to(window.__disp,{v:0,duration:1.1,delay:.35,ease:'power3.out',onUpdate:setDisp});md.querySelector('img').style.filter='url(#ripple)';});
  md.addEventListener('pointerleave',()=>{gsap.to(md,{rotateY:0,rotateX:0,duration:.8,ease:'power3.out'});g.style.background='';});});}
window.__disp={v:0};function setDisp(){const d=document.getElementById('dispMap');d&&d.setAttribute('scale',window.__disp.v.toFixed(1));}
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute"><filter id="ripple"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="3"/><feDisplacementMap id="dispMap" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
// preloader
function loaded(){const imgs=[...document.images].filter(i=>!i.loading||i.loading!=='lazy');let done=0;const tot=imgs.length+2,o={v:0};const n=$('#ldn');
 const tick=()=>{done++;gsap.to(o,{v:Math.min(100,done/tot*100),duration:.5,onUpdate:()=>n.textContent=Math.round(o.v)});};
 return Promise.all([...imgs.map(i=>i.complete?(tick(),1):new Promise(r=>{i.onload=i.onerror=()=>{tick();r();};})),document.fonts.ready.then(tick),new Promise(r=>{window.addEventListener('scene-ready',()=>{tick();r();},{once:true});setTimeout(r,4000);})]).then(()=>new Promise(r=>gsap.to(o,{v:100,duration:.4,onUpdate:()=>n.textContent=Math.round(o.v),onComplete:r})));}
const intro=()=>{document.body.classList.remove('loading');if(RM){$('.loader').remove();return;}
 const tl=gsap.timeline();tl.to('.loader',{clipPath:'inset(0 0 100% 0)',duration:1,ease:'power4.inOut'}).add(()=>$('.loader').remove())
 .from('.hero h1 .w>span',{yPercent:115,rotate:4,duration:1.3,stagger:.07,ease:'power4.out'},'-=.45').from('.hero .r',{y:24,opacity:0,duration:1,stagger:.1},'-=1')
 .from('.nav>*',{y:-20,opacity:0,stagger:.08,duration:.8},'-=1');};
Promise.race([loaded(),new Promise(r=>setTimeout(r,6000))]).then(intro);
if(!RM){
 // 3D scroll story: hero -> joy (camera dives, ingredients assemble)
 ScrollTrigger.create({trigger:'.hero',start:'top top',endTrigger:'.joy',end:'bottom top',scrub:true,onUpdate:s=>scene3d.p=s.progress});
 gsap.to('.hero-txt',{yPercent:-30,opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 30%',scrub:true}});
 gsap.timeline({scrollTrigger:{trigger:'.joy',start:'top top',end:'+=120%',pin:true,scrub:true}})
  .fromTo('.joy-word',{scale:.55,letterSpacing:'-.02em',opacity:.2},{scale:1,letterSpacing:'.04em',opacity:1,ease:'none'})
  .from('.joy-def,.joy .eyebrow',{y:40,opacity:0,ease:'none'},'<.3').to('.joy-word',{yPercent:-10,opacity:0,ease:'none'});
 gsap.to('#gl',{opacity:0,ease:'none',scrollTrigger:{trigger:'.joy',start:'bottom 80%',end:'bottom top',scrub:true}});
 // marquee velocity
 let mxp=0,vel=0;const mq=$('.mq-track');ScrollTrigger.create({trigger:'.marquee',onUpdate:s=>vel=s.getVelocity()/300});
 gsap.ticker.add((t,dt)=>{mxp-=(.04+Math.abs(vel)*.02)*dt*(vel<0?-1:1);vel*=.92;const w=mq.scrollWidth/2;mxp=((mxp%w)-w)%w;mq.style.transform=`translate3d(${mxp}px,0,0) skewX(${gsap.utils.clamp(-8,8,-vel*2)}deg)`;});
 $$('section:not(.hero) .split').forEach(h=>gsap.from(h.querySelectorAll('.w>span'),{yPercent:115,rotate:3,duration:1.1,stagger:.06,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
 $$('section:not(.hero) .r').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
 gsap.fromTo('.spread .mask',{clipPath:'inset(18% 22% round 24px)'},{clipPath:'inset(0% 0% round 24px)',ease:'none',scrollTrigger:{trigger:'.spread',start:'top bottom',end:'center center',scrub:true}});
 gsap.fromTo('.spread img',{scale:1.35},{scale:1,ease:'none',scrollTrigger:{trigger:'.spread',start:'top bottom',end:'bottom top',scrub:true}});
 gsap.from('.story-img',{clipPath:'inset(100% 0 0 0 round 20px)',duration:1.6,ease:'power4.inOut',scrollTrigger:{trigger:'.story',start:'top 70%'}});
 gsap.to('.story-img video',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.story',scrub:true}});
 ScrollTrigger.matchMedia({
  '(min-width:861px)':()=>{const tr=$('.track'),len=()=>tr.scrollWidth-innerWidth+innerWidth*.06;
   const tw=gsap.to(tr,{x:()=>-len(),ease:'none',scrollTrigger:{trigger:'.sig',start:'top top',end:()=>'+='+len(),pin:true,scrub:1,invalidateOnRefresh:true,
    onUpdate:s=>{$('.sig-bar i').style.transform=`scaleX(${s.progress})`;$('#sigIdx').textContent='0'+Math.min(6,1+Math.floor(s.progress*6));}}});
   $$('.card').forEach(c=>gsap.fromTo(c.querySelector('img'),{xPercent:-8},{xPercent:8,ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left right',end:'right left',scrub:true}}));},
  '(max-width:860px)':()=>{$$('.card').forEach(c=>gsap.from(c,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 90%'}}));}});
}
addEventListener('load',()=>ScrollTrigger.refresh());

// v5: solid header on scroll + tabs offset under header
(()=>{const nav=document.querySelector('.nav');const set=()=>{document.documentElement.style.setProperty('--navh',nav.offsetHeight+'px');};
 const onS=()=>nav.classList.toggle('scrolled',(window.scrollY||0)>40);addEventListener('scroll',onS,{passive:true});if(window.lenis)lenis.on('scroll',onS);
 addEventListener('resize',set);set();onS();document.fonts&&document.fonts.ready.then(set);})();
