import * as THREE from 'three';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const c=document.getElementById('gl'),r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});
r.setPixelRatio(Math.min(devicePixelRatio,2));
const s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.set(0,1.2,9);
// clay pot via lathe
const pts=[];for(let i=0;i<=40;i++){const t=i/40,y=t*2.6-1.3;const rad=.55+1.15*Math.sin(Math.PI*Math.min(1,t*1.05))*(1-.25*t)+(t>.92?.18*(t-.92)/.08:0);pts.push(new THREE.Vector2(Math.max(.05,rad),y));}
const geo=new THREE.LatheGeometry(pts,96);const pos=geo.attributes.position;
for(let i=0;i<pos.count;i++){const y=pos.getY(i);const a=Math.atan2(pos.getZ(i),pos.getX(i));const k=1+.012*Math.sin(y*24)+.01*Math.sin(a*7+y*3);pos.setX(i,pos.getX(i)*k);pos.setZ(i,pos.getZ(i)*k);}geo.computeVertexNormals();
const pot=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x6b3520,roughness:.85,metalness:.05,side:THREE.DoubleSide}));
const g=new THREE.Group();g.add(pot);s.add(g);
s.add(new THREE.AmbientLight(0xffe0c0,.25));const key=new THREE.PointLight(0xff8a3d,60,30);key.position.set(-3,2,4);s.add(key);
const rim=new THREE.DirectionalLight(0xffd7a8,1.2);rim.position.set(4,3,-3);s.add(rim);
const glow=new THREE.PointLight(0xff5a1a,25,6);glow.position.set(0,1.6,0);g.add(glow);
// embers
const N=420,ep=new Float32Array(N*3),sp=new Float32Array(N);for(let i=0;i<N;i++){ep[i*3]=(Math.random()-.5)*2.2;ep[i*3+1]=Math.random()*6;ep[i*3+2]=(Math.random()-.5)*2.2;sp[i]=.3+Math.random()*.9;}
const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.BufferAttribute(ep,3));
const em=new THREE.Points(eg,new THREE.PointsMaterial({color:0xff7a2e,size:.05,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));em.position.y=1.2;g.add(em);
function size(){const w=c.clientWidth,h=c.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();const m=w<760;g.position.set(m?0:2.6,m?-1.8:-.2,0);g.scale.setScalar(m?.6:.8);}
addEventListener('resize',size);size();
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
const clock=new THREE.Clock();let vis=true;new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(c);
(function loop(){requestAnimationFrame(loop);if(!vis)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 if(!RM){pot.rotation.y+=dt*.25;for(let i=0;i<N;i++){let y=ep[i*3+1]+dt*sp[i];ep[i*3]+=Math.sin(t+i)*dt*.08;if(y>6)y=0;ep[i*3+1]=y;}eg.attributes.position.needsUpdate=true;
 g.rotation.x+=((my*.15)-g.rotation.x)*.05;g.rotation.z+=((-mx*.1)-g.rotation.z)*.05;glow.intensity=22+Math.sin(t*7)*3+Math.sin(t*13)*2;}
 r.render(s,cam);})();
