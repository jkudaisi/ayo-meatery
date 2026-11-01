import * as THREE from 'three';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S=window.scene3d||(window.scene3d={p:0});
const canvas=document.getElementById('gl');
let r;try{r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});}catch(e){canvas.remove();dispatchEvent(new Event('scene-ready'));throw e;}
r.setPixelRatio(Math.min(devicePixelRatio,1.75));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x120d0a,9,22);
const cam=new THREE.PerspectiveCamera(34,1,.05,60);
const root=new THREE.Group();scene.add(root);
// ---------- pot ----------
const prof=[[.05,-1.15],[.9,-1.15],[1.35,-1.0],[1.62,-.6],[1.72,-.1],[1.66,.35],[1.48,.62],[1.4,.72],[1.52,.8],[1.56,.88],[1.48,.92],[1.32,.86],[1.3,.6],[1.5,.2],[1.55,-.2],[1.45,-.7],[1.1,-.98],[.05,-1.0]].map(([x,y])=>new THREE.Vector2(x,y));
const potGeo=new THREE.LatheGeometry(new THREE.SplineCurve(prof).getPoints(120),160);
{const p=potGeo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x);const k=1+.006*Math.sin(a*23+y*9)+.004*Math.sin(y*40);p.setXYZ(i,x*k,y,z*k);}potGeo.computeVertexNormals();}
const potMat=new THREE.MeshPhysicalMaterial({color:0x24110a,roughness:.62,metalness:.1,clearcoat:.35,clearcoatRoughness:.5,sheen:.6,sheenColor:new THREE.Color(0xff7a3a),side:THREE.DoubleSide});
const pot=new THREE.Mesh(potGeo,potMat);root.add(pot);
for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.TorusGeometry(.26,.07,16,40,Math.PI),potMat);h.position.set(s*1.66,.38,0);h.rotation.set(0,0,s*-Math.PI/2);root.add(h);}
// ---------- stew surface ----------
const stewU={uT:{value:0},uHeat:{value:1}};
const stew=new THREE.Mesh(new THREE.CircleGeometry(1.33,180,),new THREE.ShaderMaterial({uniforms:stewU,
 vertexShader:`uniform float uT;varying vec2 vUv;varying float vH;varying vec3 vW;
 float h(vec2 p){return sin(p.x*3.1+uT*1.3)*.025+sin(p.y*4.3-uT*1.1)*.02+sin((p.x+p.y)*7.+uT*2.3)*.012+sin(length(p)*11.-uT*3.)*.01;}
 void main(){vUv=uv;vec3 p=position;float e=smoothstep(1.33,1.1,length(p.xy));p.z+=h(p.xy)*e;vH=p.z;vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform float uT;varying vec2 vUv;varying float vH;varying vec3 vW;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 void main(){vec2 p=(vUv-.5)*2.;float r=length(p);
  vec3 N=normalize(cross(dFdx(vW),dFdy(vW)));vec3 V=normalize(cameraPosition-vW);vec3 L=normalize(vec3(-.4,1.,.5));
  float grain=n(p*38.+vec2(uT*.05,0.))*.6+n(p*90.)*.4;float flow=n(p*5.+vec2(uT*.15,-uT*.1));
  vec3 base=mix(vec3(.32,.03,.01),vec3(.78,.16,.02),flow);base=mix(base,vec3(.95,.45,.12),smoothstep(.75,.97,grain)*.45);
  float oil=smoothstep(.55,.75,n(p*7.-uT*.08));base=mix(base,vec3(.95,.3,.02),oil*.3);
  float spec=pow(max(dot(reflect(-L,N),V),0.),60.)*1.4;float fres=pow(1.-max(dot(N,V),0.),3.);
  vec3 c=base*(.45+.75*max(dot(N,L),0.))+vec3(1.,.8,.55)*spec+vec3(1.,.4,.1)*fres*.3;c*=mix(.35,1.,smoothstep(1.,.75,r));
  gl_FragColor=vec4(c,1.);
 }`}));
stew.rotation.x=-Math.PI/2;stew.position.y=.66;root.add(stew);
// bubbles
const bub=[];const bGeo=new THREE.SphereGeometry(1,16,12),bMat=new THREE.MeshPhysicalMaterial({color:0xff6a22,roughness:.15,transmission:0,clearcoat:1,emissive:0x3a0800});
for(let i=0;i<9;i++){const m=new THREE.Mesh(bGeo,bMat);m.userData={a:Math.random()*6.28,r:Math.random()*1.05,t:Math.random()*3,s:.03+Math.random()*.05};root.add(m);bub.push(m);}
// ---------- steam ----------
function softTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
const SN=RM?60:140,sPos=new Float32Array(SN*3),sLife=new Float32Array(SN),sSeed=new Float32Array(SN);
for(let i=0;i<SN;i++){sLife[i]=Math.random();sSeed[i]=Math.random();}
const sGeo=new THREE.BufferGeometry();sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));sGeo.setAttribute('life',new THREE.BufferAttribute(sLife,1));sGeo.setAttribute('seed',new THREE.BufferAttribute(sSeed,1));
const steam=new THREE.Points(sGeo,new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{map:{value:softTex()},uPx:{value:1}},
 vertexShader:`attribute float life;attribute float seed;varying float vA;uniform float uPx;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
 gl_PointSize=(90.+life*420.)*(.6+seed*.6)*uPx/-mv.z;vA=smoothstep(0.,.15,life)*(1.-smoothstep(.45,1.,life))*.16;}`,
 fragmentShader:`uniform sampler2D map;varying float vA;void main(){float a=texture2D(map,gl_PointCoord).a;gl_FragColor=vec4(vec3(1.,.93,.85),a*vA);}`}));
root.add(steam);
// embers
const EN=180,ePos=new Float32Array(EN*3),eV=[];for(let i=0;i<EN;i++){eV.push(.4+Math.random()*1.2);ePos[i*3]=(Math.random()-.5)*2.4;ePos[i*3+1]=.7+Math.random()*5;ePos[i*3+2]=(Math.random()-.5)*2.4;}
const eGeo=new THREE.BufferGeometry();eGeo.setAttribute('position',new THREE.BufferAttribute(ePos,3));
const embers=new THREE.Points(eGeo,new THREE.PointsMaterial({color:0xff8a3a,size:.035,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));root.add(embers);
// ---------- ingredients ----------
const ing=[];
function pepper(col){const g=new THREE.SphereGeometry(.22,32,24);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x);const lobe=1+.13*Math.cos(a*4);const sq=y<0?.75:1;p.setXYZ(i,x*lobe*1.12,y*sq*.85-(y<-.1?Math.abs(Math.sin(a*2))*.04:0),z*lobe*1.12);}g.computeVertexNormals();
 const m=new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({color:col,roughness:.25,clearcoat:1,clearcoatRoughness:.15,sheen:.3}));
 const st=new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,.14,8),new THREE.MeshStandardMaterial({color:0x3f6b1e,roughness:.6}));st.position.y=.2;st.rotation.z=.3;m.add(st);return m;}
function plantain(){const g=new THREE.CylinderGeometry(.24,.24,.07,40,1);const m=new THREE.Mesh(g,[new THREE.MeshStandardMaterial({color:0x7a3a10,roughness:.5}),new THREE.MeshPhysicalMaterial({color:0xe39a2c,roughness:.45,clearcoat:.6}),new THREE.MeshPhysicalMaterial({color:0xd98a22,roughness:.45,clearcoat:.6})]);m.scale.z=.75;return m;}
const cols=[0xd2240f,0xf06a12,0xf2b51d,0xc4190b,0xe8550e];
for(let i=0;i<11;i++){const m=i%2?plantain():pepper(cols[i%cols.length]);const a=i/11*Math.PI*2;const rad=2.3+Math.random()*1.2;
 m.userData={home:new THREE.Vector3(Math.cos(a)*rad,.4+Math.random()*2.4-.6,Math.sin(a)*rad*.7),rot:new THREE.Vector3(Math.random()*3,Math.random()*3,Math.random()*3),sp:.3+Math.random()*.5,ph:Math.random()*6,a};
 m.position.copy(m.userData.home);root.add(m);ing.push(m);}
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xffd2a8,0x140806,.55));
const key=new THREE.SpotLight(0xffb070,180,30,.5,.6,1.5);key.position.set(-4,6,5);scene.add(key);
const rim=new THREE.DirectionalLight(0xff6a28,3.2);rim.position.set(3,2.5,-5);scene.add(rim);
const rim2=new THREE.DirectionalLight(0xffc89a,1.4);rim2.position.set(-5,1,-3);scene.add(rim2);
const glow=new THREE.PointLight(0xff5a14,14,4.5,1.6);glow.position.set(0,1.3,0);root.add(glow);
// ---------- layout / loop ----------
let mob=false;const look=new THREE.Vector3();
function size(){const w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();mob=w<860;steam.material.uniforms.uPx.value=h*r.getPixelRatio()/900*1.4;}
addEventListener('resize',size);size();
let mx=0,my=0,smx=0,smy=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
const clock=new THREE.Clock();const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;const tmp=new THREE.Vector3();
let ready=false;
function frame(){const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime,p=S.p||0;
 const vis=p<.995;canvas.style.visibility=vis?'visible':'hidden';if(!vis&&ready)return;
 smx+=(mx-smx)*.05;smy+=(my-smy)*.05;
 const dive=ease(Math.min(1,p*1.25));
 root.position.x=THREE.MathUtils.lerp(mob?0:2.35,0,dive);root.position.y=mob?-1.75*(1-dive)-.2*dive:-.35*(1-dive);
 const sc=mob?.72:1;root.scale.setScalar(THREE.MathUtils.lerp(sc,1,dive));
 cam.position.set(THREE.MathUtils.lerp(smx*1.6,0,dive),THREE.MathUtils.lerp(2.3-smy*1.1,3.9,dive),THREE.MathUtils.lerp(8.4,1.7,dive));
 look.set(THREE.MathUtils.lerp(smx*.3,root.position.x,dive),THREE.MathUtils.lerp(.4,root.position.y+.6,dive),0);cam.lookAt(look);
 if(!RM)root.rotation.y=t*.12;
 stewU.uT.value=t;glow.intensity=12+Math.sin(t*6)*1.6+Math.sin(t*15.3)*.9;
 bub.forEach(b=>{const u=b.userData;u.t+=dt;const c=(u.t%2.4)/2.4;b.position.set(Math.cos(u.a)*u.r,.66+c*.03,Math.sin(u.a)*u.r);const s=c<.85?c/.85*u.s:0;b.scale.setScalar(s);if(u.t%2.4<dt){u.a=Math.random()*6.28;u.r=Math.random()*1.05;}});
 for(let i=0;i<SN;i++){sLife[i]+=dt*(.12+sSeed[i]*.1);if(sLife[i]>1){sLife[i]=0;sSeed[i]=Math.random();}const l=sLife[i],a=sSeed[i]*40.;
  sPos[i*3]=Math.cos(a)*(.2+sSeed[i]*.8)*(1-l*.5)+Math.sin(t*.6+a)*l*.6;sPos[i*3+1]=.75+l*3.6;sPos[i*3+2]=Math.sin(a)*(.2+sSeed[i]*.8)*(1-l*.5)+Math.cos(t*.5+a)*l*.4;}
 sGeo.attributes.position.needsUpdate=sGeo.attributes.life.needsUpdate=true;
 for(let i=0;i<EN;i++){let y=ePos[i*3+1]+dt*eV[i]*.6;if(y>6)y=.7;ePos[i*3+1]=y;ePos[i*3]+=Math.sin(t*1.3+i)*dt*.15;}eGeo.attributes.position.needsUpdate=true;
 const asm=ease(Math.min(1,Math.max(0,(p-.05)/.6)));
 ing.forEach((m,i)=>{const u=m.userData;tmp.copy(u.home);tmp.y+=Math.sin(t*u.sp+u.ph)*.18;
  const tgt=new THREE.Vector3(Math.cos(u.a+t*.3)*.5,.72,Math.sin(u.a+t*.3)*.5);m.position.lerpVectors(tmp,tgt,asm);
  m.rotation.set(u.rot.x+t*u.sp*.6,u.rot.y+t*u.sp*.4,u.rot.z);m.scale.setScalar(1-asm*.55);});
 r.render(scene,cam);if(!ready){ready=true;dispatchEvent(new Event('scene-ready'));}}
if(RM){frame();addEventListener('resize',frame);}else r.setAnimationLoop(frame);
