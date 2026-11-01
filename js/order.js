(()=>{
const KEY='ayo-order-v1',PHONE='+15616129876',$=s=>document.querySelector(s);
const byId=Object.fromEntries(MENU.map(i=>[i.id,i]));
let st={items:[],day:null,time:'',name:'',phone:'',notes:''};
try{Object.assign(st,JSON.parse(localStorage.getItem(KEY))||{});}catch(e){}
const save=()=>localStorage.setItem(KEY,JSON.stringify(st));
const unitOf=(it,sel)=>{let base=it.p||0,add=0;(it.g||[]).forEach((g,gi)=>{const o=g.o[sel[gi]];if(g.base)base=o[1];else add+=o[1];});return base+add;};
const labelsOf=(it,sel)=>(it.g||[]).map((g,gi)=>g.o[sel[gi]][0]).filter(l=>!/^No (protein|stew|rice)$/.test(l));
const count=()=>st.items.reduce((a,b)=>a+b.qty,0),sub=()=>st.items.reduce((a,b)=>a+b.qty*b.unit,0);
function add(id,sel,qty){const it=byId[id];sel=sel||(it.g||[]).map(()=>0);const key=id+':'+sel.join('.');
 const ex=st.items.find(x=>x.key===key);if(ex)ex.qty+=qty;else st.items.push({key,id,name:it.n,opts:labelsOf(it,sel),unit:unitOf(it,sel),qty});
 save();render();toast(`Added ${qty>1?qty+' × ':''}${it.n}`);bump();}
// ---------- option dialog ----------
const dlg=$('#opt'),form=$('#optForm');let cur=null,q=1;
function openOptions(id,srcEl){const it=byId[id];if(!it.g){add(id,null,1);fly(srcEl);return;}cur=it;q=1;
 dlg.querySelector('h3').textContent=it.n;dlg.querySelector('.opt-d').textContent=it.d||'';
 const im=dlg.querySelector('.opt-img');im.hidden=!it.img;if(it.img)im.querySelector('img').src='img/'+it.img+'.webp';
 dlg.querySelector('.groups').innerHTML=it.g.map((g,gi)=>`<fieldset><legend>${g.n}</legend>${g.o.map((o,oi)=>`<label class="chip"><input type="radio" name="g${gi}" value="${oi}" ${oi===0?'checked':''}><span>${o[0]}${o[1]?` <em>${g.base?money(o[1]):'+'+money(o[1])}</em>`:''}</span></label>`).join('')}</fieldset>`).join('');
 upd();dlg.showModal();dlg._src=srcEl;}
const selNow=()=>cur.g.map((g,gi)=>+form.querySelector(`input[name=g${gi}]:checked`).value);
function upd(){dlg.querySelector('output').textContent=q;$('#optAdd span').textContent=money(unitOf(cur,selNow())*q);}
form.addEventListener('change',upd);
dlg.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{q=Math.max(1,Math.min(20,q+ +b.dataset.q));upd();});
dlg.querySelector('[data-cancel]').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
form.addEventListener('submit',e=>{e.preventDefault();add(cur.id,selNow(),q);dlg.close();fly(dlg._src);});
// ---------- drawer ----------
const dr=$('#drawer'),scrim=$('#scrim');let step=1;
function open(s){dr.classList.add('open');dr.setAttribute('aria-hidden','false');scrim.hidden=false;requestAnimationFrame(()=>scrim.classList.add('on'));document.documentElement.classList.add('locked');window.lenis&&lenis.stop();go(s||1);}
function close(){dr.classList.remove('open');dr.setAttribute('aria-hidden','true');scrim.classList.remove('on');setTimeout(()=>scrim.hidden=true,400);document.documentElement.classList.remove('locked');window.lenis&&lenis.start();}
$('#cartBtn').onclick=()=>open();scrim.onclick=close;
document.querySelectorAll('[data-open-cart]').forEach(b=>b.onclick=()=>open());
dr.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{close();const g=b.dataset.goto;if(g)setTimeout(()=>window.lenis?lenis.scrollTo(g,{offset:-40}):document.querySelector(g).scrollIntoView(),350);}));
addEventListener('keydown',e=>{if(e.key==='Escape'&&dr.classList.contains('open')&&!dlg.open)close();});
function go(s){if(s>1&&!st.items.length)s=1;s=Math.min(s,2);step=s;[1,2].forEach(i=>dr.querySelector('.s'+i).hidden=i!==s);
 dr.querySelectorAll('.dr-steps span').forEach(x=>x.classList.toggle('on',+x.dataset.s<=s));
 $('#back').hidden=s===1;const n=$('#next');n.textContent=s===1?'Choose pick-up time':'Place order';n.disabled=s===1&&!st.items.length;
 if(s===2)buildDays();dr.querySelector('.dr-body').scrollTop=0;}
$('#back').onclick=()=>go(step-1);
$('#next').onclick=()=>{if(step===1)return go(2);const e=validate();$('#err').textContent=e;if(!e)checkout();};
// ---------- cart list ----------
function render(){const ul=dr.querySelector('.cart');
 ul.innerHTML=st.items.map((x,i)=>`<li><div><b>${x.name}</b>${x.opts.length?`<small>${x.opts.join(' · ')}</small>`:''}<span class="u">${money(x.unit)} each</span></div>
 <div class="qty sm"><button data-i="${i}" data-d="-1" aria-label="Less">−</button><output>${x.qty}</output><button data-i="${i}" data-d="1" aria-label="More">+</button></div><b class="lt">${money(x.unit*x.qty)}</b></li>`).join('');
 dr.querySelector('.cart-empty').hidden=!!st.items.length;$('#sub').textContent=money(sub());
 const c=count();$('#cartCount').textContent=c;$('#cartBtn').classList.toggle('has',c>0);if(step===1)$('#next').disabled=!c;}
dr.querySelector('.cart').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(!b)return;const x=st.items[+b.dataset.i];x.qty+= +b.dataset.d;if(x.qty<=0)st.items.splice(+b.dataset.i,1);save();render();});
// ---------- pickup time (Mon–Sat 12pm–8pm, closed Sun) ----------
const OPEN=12*60,CLOSE=20*60,STEP=15,LEAD=30;
function slotsFor(d){const now=new Date();if(d.getDay()===0)return[];let start=OPEN+STEP;
 if(d.toDateString()===now.toDateString()){const m=now.getHours()*60+now.getMinutes()+LEAD;start=Math.max(start,Math.ceil(m/STEP)*STEP);}
 const out=[];for(let m=start;m<=CLOSE-STEP;m+=STEP)out.push(m);return out;}
const fmtT=m=>{const h=Math.floor(m/60),mm=m%60;return`${(h+11)%12+1}:${String(mm).padStart(2,'0')} ${h<12?'AM':'PM'}`;};
const fmtD=d=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
function days(){const out=[],d=new Date();d.setHours(0,0,0,0);for(let i=0;out.length<6&&i<10;i++){const x=new Date(d);x.setDate(d.getDate()+i);if(slotsFor(x).length)out.push(x);}return out;}
function buildDays(){const ds=days(),box=$('#days');if(!ds.some(d=>d.toDateString()===st.day))st.day=ds[0].toDateString();
 box.innerHTML=ds.map(d=>{const t=new Date().toDateString()===d.toDateString();return`<label class="chip"><input type="radio" name="day" value="${d.toDateString()}" ${d.toDateString()===st.day?'checked':''}><span>${t?'Today':fmtD(d)}</span></label>`;}).join('')+`<p class="closed">Closed Sundays</p>`;
 box.onchange=e=>{st.day=e.target.value;save();buildTimes();};buildTimes();
 ['name','phone','notes'].forEach(k=>{const el=$('#'+k);el.value=st[k]||'';el.oninput=()=>{st[k]=el.value;save();};});}
function buildTimes(){const sel=$('#time'),sl=slotsFor(new Date(st.day));sel.innerHTML='<option value="">Choose a time</option>'+sl.map(m=>`<option value="${m}" ${String(m)===String(st.time)?'selected':''}>${fmtT(m)}</option>`).join('');
 if(!sl.includes(+st.time))st.time='';sel.onchange=()=>{st.time=sel.value;save();};}
function validate(){const d=new Date(st.day);if(!st.day||d.getDay()===0)return'Choose a pick-up day. Ayomee’s Kitchen is closed Sundays.';
 if(!st.time||!slotsFor(d).includes(+st.time))return'Choose a pick-up time between 12:15 PM and 7:45 PM.';
 if(!(st.name||'').trim())return'Add your name so the kitchen knows whose order it is.';
 const p=(st.phone||'').replace(/\D/g,'');if(!(p.length===10||(p.length===11&&p[0]==='1')))return'Add a 10-digit phone number.';return'';}
let ticket=null;
const shortOpts=o=>o.map(x=>x.replace(' serve','').replace('Assorted meat (tripe, cow skin, beef)','Assorted meat').replace('White rice (single serve)','White rice single').replace('White rice (double serve)','White rice double'));
function summary(){const L=[`Pickup order ${ticket?'#'+ticket+' ':''}for Ayomee's Kitchen`,`Name: ${st.name.trim()}`,`Phone: ${st.phone.trim()}`,`Pickup: ${fmtD(new Date(st.day))}, ${fmtT(+st.time)}`,''];
 st.items.forEach(x=>{const o=shortOpts(x.opts);L.push(`${x.qty}x ${x.name}${o.length?' ('+o.join(', ')+')':''} ${money(x.unit*x.qty)}`);});
 L.push(`Total (est.): ${money(sub())}`);if((st.notes||'').trim())L.push(`Notes: ${st.notes.trim().slice(0,200)}`);return L.join('\n');}
// encodeURIComponent, then un-escape RFC 3986 query-safe chars to keep the QR small
const smsUri=t=>`sms:${PHONE}?&body=${encodeURIComponent(t).replace(/%2C/g,',').replace(/%3A/g,':').replace(/%24/g,'$').replace(/%2F/g,'/').replace(/%40/g,'@')}`;
// ---------- QR checkout modal ----------
const co=$('#checkout');let showQR=false;
const touch=()=>matchMedia('(hover:none),(pointer:coarse),(max-width:760px)').matches;
function nextTicket(){let n=+localStorage.getItem('ayo-ticket')||(100+Math.floor(Math.random()*800));n=n>=999?101:n+1;localStorage.setItem('ayo-ticket',n);return n;}
function renderQR(uri){let q;for(const ec of['M','L']){try{q=qrcode(0,ec);q.addData(uri,'Byte');q.make();if(ec==='M'&&q.getModuleCount()>69)throw 0;break;}catch(e){q=null;}}
 const box=$('#qr');if(!q){box.innerHTML='<p class="qr-err">Order is too long for a QR code. Use Copy the order or call.</p>';return;}
 const n=q.getModuleCount(),qz=4,tot=n+qz*2;let d='';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c+qz} ${r+qz}h1v1h-1z`;
 box.innerHTML=`<svg viewBox="0 0 ${tot} ${tot}" shape-rendering="crispEdges" width="100%" height="100%"><rect width="${tot}" height="${tot}" fill="#fff"/><path d="${d}" fill="#120d0a"/></svg>`;box.dataset.modules=n;const k=Math.max(3,Math.min(5,Math.ceil(236/tot))),px=tot*k;box.style.width=box.style.height=px+'px';box.parentElement.style.width=box.parentElement.style.height=(px+16)+'px';}
function setMode(){const t=touch();co.classList.toggle('is-touch',t&&!showQR);$('#qrToggle').hidden=!t;$('#qrToggle').textContent=showQR?'Hide QR code':'Show QR code instead';}
function checkout(){if(!ticket)ticket=nextTicket();const text=summary(),uri=smsUri(text);
 $('#tkNo').textContent='#'+ticket;$('#tkName').textContent=st.name.trim();
 $('#tkLines').innerHTML=st.items.map(x=>`<li><span class="q">${x.qty}</span><span class="n">${x.name}${x.opts.length?`<small>${shortOpts(x.opts).join(' · ')}</small>`:''}</span><span class="p">${money(x.unit*x.qty)}</span></li>`).join('');
 $('#tkTotal').textContent=money(sub());const when=`${fmtD(new Date(st.day))} at ${fmtT(+st.time)}`;$('#tkReady').textContent=`Ready ${when}. Pick up at the kitchen.`;
 $('#tkNotes').textContent=(st.notes||'').trim()?'Note: '+st.notes.trim():'';
 renderQR(uri);$('#smsBtn').href=uri;co.dataset.uri=uri;showQR=false;setMode();
 co.querySelector('.co-send').hidden=false;co.querySelector('.co-done').hidden=true;co.classList.remove('done');
 close();setTimeout(()=>{co.showModal();co.scrollTop=0;animIn();},RM()?0:250);}
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function animIn(){if(RM()||!window.gsap)return;const tl=gsap.timeline();
 tl.from(co,{opacity:0,y:30,scale:.97,duration:.5,ease:'power3.out'})
   .fromTo('#ticket',{clipPath:'inset(0 0 100% 0)',y:-40,rotate:0},{clipPath:'inset(0 0 -10% 0)',y:0,rotate:-2.5,duration:1.1,ease:'power2.out'},'-=.2')
   .from('#tkLines li',{opacity:0,x:-10,stagger:.07,duration:.35},'-=.7')
   .from('.co-send>*',{opacity:0,y:16,stagger:.06,duration:.5},'-=1.1')
   .from('.qr-box',{scale:.85,opacity:0,duration:.6,ease:'back.out(1.6)'},'-=.6');}
$('#qrToggle').onclick=()=>{showQR=!showQR;setMode();};
co.querySelectorAll('[data-co-close]').forEach(b=>b.onclick=()=>co.close());
co.addEventListener('click',e=>{if(e.target===co)co.close();});
$('#sentIt').onclick=()=>{$('#doneNo').textContent='#'+ticket;$('#doneWhen').textContent=`${fmtD(new Date(st.day))}, ${fmtT(+st.time)}`;
 co.querySelector('.co-send').hidden=true;co.querySelector('.co-done').hidden=false;co.classList.add('done');
 if(!RM()&&window.gsap){gsap.fromTo('.tk-stamp',{scale:2.4,opacity:0,rotate:-30},{scale:1,opacity:1,rotate:-14,duration:.5,ease:'back.out(2)'});gsap.from('.co-done>*',{opacity:0,y:16,stagger:.08,duration:.5});}
 st.items=[];st.notes='';ticket=null;save();render();go(1);};
$('#coCopy').onclick=async()=>{const t=summary();try{await navigator.clipboard.writeText(t);toast('Order copied');}catch(e){prompt('Copy your order:',t);}};
// ---------- feedback ----------
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200);}
function bump(){const b=$('#cartBtn');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');}
function fly(el){if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap)return;const a=el.getBoundingClientRect(),b=$('#cartBtn').getBoundingClientRect();
 const d=document.createElement('i');d.className='flydot';document.body.append(d);gsap.fromTo(d,{x:a.left+a.width/2,y:a.top+a.height/2,scale:1},{x:b.left+b.width-16,y:b.top+b.height/2,scale:.4,duration:.7,ease:'power2.in',onComplete:()=>d.remove()});}
render();
window.Order={openOptions,open,close,add,summary,checkout,smsUri,_st:st};
})();
