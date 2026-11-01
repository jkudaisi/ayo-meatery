const RM=matchMedia('(prefers-reduced-motion: reduce)').matches, FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
gsap.registerPlugin(ScrollTrigger);
let lenis; if(!RM){lenis=new Lenis({lerp:.09});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis?lenis.scrollTo(t,{offset:-60}):t.scrollIntoView();}}));
// split text
document.querySelectorAll('.split').forEach(el=>{el.innerHTML=el.innerHTML.split(/(<br>)/).map(p=>p==='<br>'?p:p.split(' ').filter(Boolean).map(w=>`<span class="w"><span>${w}</span></span>`).join(' ')).join('');});
// menu
const tabs=document.querySelector('.tabs'),list=document.querySelector('.list'),pv=document.querySelector('.preview'),pimg=pv.querySelector('img');
function render(cat){list.innerHTML=MENU[cat].map(([n,d,p,img])=>`<li data-img="${img||''}"><h4>${n}</h4><span class="pr">${p}</span>${d?`<p>${d}</p>`:''}</li>`).join('');
 tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.textContent===cat));
 if(!RM)gsap.from(list.children,{y:24,opacity:0,stagger:.04,duration:.6,ease:'power3.out'});bindPreview();}
Object.keys(MENU).forEach((c,i)=>{const b=document.createElement('button');b.textContent=c;b.setAttribute('role','tab');b.onclick=()=>render(c);tabs.append(b);});
// cursor + preview
const cur=document.querySelector('.cursor');let mx=innerWidth/2,my=innerHeight/2;
function bindPreview(){list.querySelectorAll('li').forEach(li=>{li.onmouseenter=()=>{const s=li.dataset.img;cur.classList.add('big');if(s){pimg.src='img/'+s+'.webp';pv.classList.add('on');}};li.onmouseleave=()=>{cur.classList.remove('big');pv.classList.remove('on');};});}
render('Appetizers');
if(FINE){addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
 const cx=gsap.quickTo(cur,'x',{duration:.15}),cy=gsap.quickTo(cur,'y',{duration:.15}),px=gsap.quickTo(pv,'x',{duration:.6,ease:'power3'}),py=gsap.quickTo(pv,'y',{duration:.6,ease:'power3'});
 gsap.ticker.add(()=>{cx(mx);cy(my);px(mx+24);py(my-90);});
 document.querySelectorAll('a,button,.card').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('big'));el.addEventListener('mouseleave',()=>cur.classList.remove('big'));});}
if(!RM){
 gsap.from('.hero .split .w>span',{yPercent:110,duration:1.2,stagger:.08,ease:'power4.out',delay:.2});
 gsap.from('.hero .r',{y:20,opacity:0,duration:1,stagger:.12,delay:.7});
 document.querySelectorAll('section:not(.hero) .split').forEach(h=>gsap.from(h.querySelectorAll('.w>span'),{yPercent:110,duration:1,stagger:.06,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 85%'}}));
 document.querySelectorAll('section:not(.hero) .r').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:1,scrollTrigger:{trigger:el,start:'top 90%'}}));
 gsap.to('.spread .mask',{clipPath:'inset(0% 0% round 18px)',ease:'none',scrollTrigger:{trigger:'.spread',start:'top bottom',end:'center center',scrub:true}});
 gsap.to('.spread img',{scale:1,ease:'none',scrollTrigger:{trigger:'.spread',start:'top bottom',end:'bottom top',scrub:true}});
 gsap.from('.story-img',{clipPath:'inset(100% 0 0 0)',duration:1.4,ease:'power3.inOut',scrollTrigger:{trigger:'.story',start:'top 70%'}});
 ScrollTrigger.matchMedia({'(min-width:761px)':()=>{const tr=document.querySelector('.track');
  gsap.to(tr,{x:()=>-(tr.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'.sig',start:'top top',end:()=>'+='+(tr.scrollWidth-innerWidth),pin:true,scrub:1,invalidateOnRefresh:true}});}});
}
