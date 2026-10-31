(function(){
'use strict';
var TAU=Math.PI*2;
function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

/* ---------- copy ---------- */
var T={
 en:{s:{waiting:{h:'Still waiting.',p:'Stay tuned.'},
     hospital:{h:'We are at the hospital.',p:'Stay tuned.'},
     born:{h:'Our daughter is here.',p:'Thank you for your messages and kind wishes.'}},
  j:{waiting:'Waiting',hospital:'Hospital',born:'Born'},
  upd:'Updated',note:'A note from us',welcome:'Welcome,',
  b:{name:'Name',at:'Born',weight:'Weight',length:'Length'},
  due:{past:function(n){return n===1?'1 day past the due date':n+' days past the due date';},today:'Due date is today',until:function(n){return n===1?'1 day until the due date':n+' days until the due date';}},
  hint:function(n){return 'Her name will be '+n+'.';}},
 tr:{s:{waiting:{h:'Hâlâ bekliyoruz.',p:'Takipte kalın.'},
     hospital:{h:'Hastanedeyiz.',p:'Takipte kalın.'},
     born:{h:'Kızımız doğdu.',p:'İlginiz ve iyi dilekleriniz için teşekkür ederiz.'}},
  j:{waiting:'Bekleyiş',hospital:'Hastane',born:'Doğum'},
  upd:'Güncelleme',note:'Bizden bir not',welcome:'Hoş geldin,',
  b:{name:'İsim',at:'Doğum',weight:'Kilo',length:'Boy'},
  due:{past:function(n){return 'Tahmini tarihten '+n+' gün sonra';},today:'Tahmini doğum tarihi bugün',until:function(n){return 'Tahmini tarihe '+n+' gün var';}},
  hint:function(n){return 'Adı '+n+' olacak.';}},
 de:{s:{waiting:{h:'Wir warten noch.',p:'Bleibt dran.'},
     hospital:{h:'Wir sind im Krankenhaus.',p:'Bleibt dran.'},
     born:{h:'Unsere Tochter ist da.',p:'Danke für eure Nachrichten und guten Wünsche.'}},
  j:{waiting:'Warten',hospital:'Klinik',born:'Geboren'},
  upd:'Aktualisiert',note:'Eine Notiz von uns',welcome:'Willkommen,',
  b:{name:'Name',at:'Geboren',weight:'Gewicht',length:'Größe'},
  due:{past:function(n){return n===1?'1 Tag über dem Termin':n+' Tage über dem Termin';},today:'Heute ist der errechnete Termin',until:function(n){return n===1?'Noch 1 Tag bis zum Termin':'Noch '+n+' Tage bis zum Termin';}},
  hint:function(n){return 'Sie wird '+n+' heißen.';}}
};
var LOC={en:'en-GB',tr:'tr-TR',de:'de-DE'};
var ORDER=['waiting','hospital','born'];

var S=normalize(null);

var lang='en';
try{
  var sv=localStorage.getItem('ba-lang');
  if(sv&&T[sv]){lang=sv;}
  else{var nl=(navigator.language||'en').slice(0,2).toLowerCase();if(T[nl]){lang=nl;}}
}catch(e){}

/* ---------- page render ---------- */
var root=$('#root');
var view=S;
function berlinToday(){try{return new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'});}catch(e){return new Date().toISOString().slice(0,10);}}
function fmtUpdated(iso){
  try{return new Date(iso).toLocaleString(LOC[lang],{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});}catch(e){return '';}
}
function fmtBorn(at){
  if(!at){return '';}
  var d=new Date(at+':00Z');
  if(isNaN(d.getTime())){return at;}
  try{return d.toLocaleString(LOC[lang],{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'UTC'});}catch(e){return at;}
}
function relTime(iso){
  var diff=(new Date(iso).getTime()-Date.now())/1000;
  var abs=Math.abs(diff);
  try{
    var rtf=new Intl.RelativeTimeFormat(LOC[lang],{numeric:'auto'});
    if(abs<60){return rtf.format(0,'minute');}
    if(abs<3600){return rtf.format(Math.round(diff/60),'minute');}
    if(abs<86400){return rtf.format(Math.round(diff/3600),'hour');}
    return rtf.format(Math.round(diff/86400),'day');
  }catch(e){return '';}
}
function render(st){
  view=st;
  var t=T[lang];var sc=t.s[st.status]||t.s.waiting;
  document.documentElement.lang=lang;
  var words=sc.h.split(' ').map(function(w,i){return '<span class="w" style="--i:'+i+'">'+esc(w)+'</span>';}).join(' ');
  var b=st.born||{};
  var idx=ORDER.indexOf(st.status);
  var chips='';
  if(st.due&&st.status!=='born'){
    var n=Math.round((Date.parse(berlinToday())-Date.parse(st.due))/86400000);
    if(!isNaN(n)){
      chips+='<div class="chip">'+(n>0?'<b>'+esc(t.due.past(n))+'</b>':n===0?'<b>'+esc(t.due.today)+'</b>':'<b>'+esc(t.due.until(-n))+'</b>')+'</div>';
    }
  }
  var u=st.updated?fmtUpdated(st.updated):'';
  if(u){chips+='<div class="chip"><span>'+esc(t.upd)+'</span> '+esc(u)+' <span id="rel">· '+esc(relTime(st.updated))+'</span></div>';}
  var welcome=(st.status==='born'&&b.name)?'<p class="welcome">'+esc(t.welcome)+' <em>'+esc(b.name)+'</em></p>':'';
  var nm=(st.nameHint&&st.status!=='born')?'<p class="babyname"><i aria-hidden="true"></i><span>'+esc(st.nameHint)+'</span><i aria-hidden="true"></i></p>':'';
  var note=st.note?'<div class="note"><small>'+esc(t.note)+'</small><p>'+esc(st.note)+'</p></div>':'';
  var tiles='';
  if(st.status==='born'){
    var tl=[['at',fmtBorn(b.at)],['weight',b.weight],['length',b.length]].filter(function(x){return x[1];});
    if(tl.length){tiles='<div class="tiles">'+tl.map(function(x){return '<div class="tile"><small>'+esc(t.b[x[0]])+'</small><strong>'+esc(x[1])+'</strong></div>';}).join('')+'</div>';}
  }
  var journey=ORDER.map(function(k,i){
    var c=i<idx?'done':i===idx?'now':'todo';
    if(st.status==='born'&&i<idx){c='done';}
    return '<li class="'+c+'"'+(i===idx?' aria-current="step"':'')+'><i></i><span>'+esc(t.j[k])+'</span></li>';
  }).join('');
  root.innerHTML=
   '<main class="wrap">'+
    '<header class="top"><ol class="journey">'+journey+'</ol>'+
    '<nav class="lang" aria-label="Language">'+['tr','de','en'].map(function(l){return '<button type="button" data-l="'+l+'" aria-pressed="'+(l===lang)+'">'+l.toUpperCase()+'</button>';}).join('')+'</nav></header>'+
    '<div class="duo" aria-hidden="true">'+(window.duoSVG?window.duoSVG(st.status):'')+'</div>'+
    '<section class="hero"><h1>'+words+'</h1><p class="sub">'+esc(sc.p)+'</p>'+nm+welcome+'<div class="chips">'+chips+'</div>'+note+tiles+'</section>'+
   '</main>';
}
root.addEventListener('click',function(e){
  var du=e.target.closest?e.target.closest('.duo'):null;
  if(du){du.classList.remove('boop');void du.offsetWidth;du.classList.add('boop');setTimeout(function(){du.classList.remove('boop');},700);}
  var bt=e.target.closest?e.target.closest('[data-l]'):null;
  if(bt&&T[bt.getAttribute('data-l')]){
    lang=bt.getAttribute('data-l');
    try{localStorage.setItem('ba-lang',lang);}catch(err){}
    render(view);
  }
});
setInterval(function(){var el=$('#rel');if(el&&view.updated){el.textContent='· '+relTime(view.updated);}},60000);

/* ---------- the sky ---------- */
var cv=document.createElement('canvas');
cv.id='sky';cv.setAttribute('aria-hidden','true');
document.body.insertBefore(cv,root);
var ctx=cv.getContext('2d');
var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);

var SCENES={
 waiting:{top:[7,10,32],mid:[18,24,74],bot:[44,32,92],orb:[255,214,150],n1:[70,60,170],n2:[150,70,150],rock:.075,speed:.85,glow:1,dust:6,beat:0,ring:0,dawn:0,shoot:.12},
 hospital:{top:[8,10,36],mid:[22,36,96],bot:[70,50,120],orb:[255,196,210],n1:[60,100,190],n2:[200,80,140],rock:.1,speed:1.5,glow:1.3,dust:14,beat:1,ring:1,dawn:.1,shoot:.2},
 born:{top:[28,22,84],mid:[96,50,128],bot:[196,104,118],orb:[255,232,170],n1:[255,120,150],n2:[255,190,110],rock:.06,speed:.9,glow:1.8,dust:22,beat:0,ring:0,dawn:1,shoot:.35}
};
var NUM=['rock','speed','glow','dust','beat','ring','dawn','shoot'];
var COL=['top','mid','bot','orb','n1','n2'];
function clone(o){return JSON.parse(JSON.stringify(o));}
var cur=clone(SCENES.waiting);
var tgt=SCENES[S.status]||SCENES.waiting;
function setScene(name){tgt=SCENES[name]||SCENES.waiting;}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';}

var W=0,H=0,DPR=1,cx=0,cy=0,R=100,wide=false,moon=null,moonS=0;
function buildMoon(){
  moonS=Math.ceil(R*2.6);
  moon=document.createElement('canvas');
  moon.width=moon.height=Math.ceil(moonS*DPR);
  var g=moon.getContext('2d');
  g.scale(DPR,DPR);g.translate(moonS/2,moonS/2);
  var gr=g.createLinearGradient(0,-R,0,R);
  gr.addColorStop(0,'#fff8e2');gr.addColorStop(.55,'#f7e0a8');gr.addColorStop(1,'#e7b374');
  g.fillStyle=gr;g.beginPath();g.arc(0,0,R,0,TAU);g.fill();
  g.globalCompositeOperation='source-atop';
  var seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
  g.fillStyle='rgba(150,98,58,.15)';
  for(var i=0;i<9;i++){var a=Math.PI*(.15+rnd()*.7);var rr=R*(.62+rnd()*.28);g.beginPath();g.arc(Math.cos(a)*rr,Math.sin(a)*rr,R*(.05+rnd()*.09),0,TAU);g.fill();}
  var sh=g.createRadialGradient(0,R*.15,R*.3,0,R*.15,R*1.05);
  sh.addColorStop(0,'rgba(120,70,60,0)');sh.addColorStop(1,'rgba(120,70,60,.4)');
  g.fillStyle=sh;g.fillRect(-R,-R,R*2,R*2);
  g.globalCompositeOperation='destination-out';
  g.beginPath();g.arc(0,-R*.4,R*.88,0,TAU);g.fill();
  g.globalCompositeOperation='source-atop';
  g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=R*.06;
  g.beginPath();g.arc(0,-R*.4,R*.88,0,TAU);g.stroke();
}
var stars=[];
(function(){for(var i=0;i<230;i++){stars.push({nx:Math.random(),ny:Math.random(),r:.5+Math.random()*1.1,tw:.6+Math.random()*2.2,ph:Math.random()*TAU,d:.2+Math.random()*.8,big:Math.random()<.06,warm:Math.random()<.25});}})();
var conf=[];
(function(){var pal=[[255,226,160],[255,150,180],[255,255,255],[160,220,255],[255,190,110]];
  for(var i=0;i<46;i++){conf.push({nx:Math.random(),y:Math.random()*900,vy:14+Math.random()*30,sw:.4+Math.random()*.9,ph:Math.random()*TAU,rot:Math.random()*TAU,vr:(Math.random()-.5)*2,s:3+Math.random()*5,c:pal[i%pal.length],star:i%2===0});}})();
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth;H=window.innerHeight;
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
  wide=W>=900;
  R=wide?Math.min(H*.25,W*.16):Math.min(W*.27,H*.15);
  R=Math.max(R,64);
  cx=wide?W*.7:W*.5;cy=wide?H*.45:H*.26;
  buildMoon();
}
resize();
window.addEventListener('resize',resize);

var parts=[],rings=[],shoots=[];
var time=0,last=0,phase=0,beatPhase=0,lastBeat=0,kick=0,flash=0,nextBurst=0,dustAcc=0;
var px=0,py=0,tpx=0,tpy=0;
var orb={x:0,y:0,r:10};
var BURSTPAL=[[255,226,160],[255,150,180],[255,255,255],[160,220,255],[255,190,110]];
window.addEventListener('pointermove',function(e){tpx=e.clientX/W-.5;tpy=e.clientY/H-.5;},{passive:true});

function addP(o){o.age=0;parts.push(o);}
function burst(x,y,n,power){
  for(var i=0;i<n;i++){
    var a=Math.random()*TAU,sp=(80+Math.random()*380)*power*(wide?1:.78);
    addP({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1.3+Math.random()*1.7,s:1+Math.random()*1.8,a:.95,c:BURSTPAL[i%BURSTPAL.length],drag:1.5,grav:46,streak:true});
  }
  rings.push({x:x,y:y,age:0,life:1.7,r0:orb.r,r1:R*(power>.7?5:2.6),c:cur.orb,a:.8,w:3});
  if(power>.7){flash=1;}
}
function spark(x,y){
  for(var i=0;i<16;i++){
    var a=Math.random()*TAU,sp=30+Math.random()*130;
    addP({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-20,life:.8+Math.random()*.7,s:1+Math.random()*1.6,a:.9,c:[255,226,170],drag:2.2,grav:30,streak:false,fade:'lin'});
  }
  rings.push({x:x,y:y,age:0,life:.9,r0:4,r1:46,c:[255,226,170],a:.6,w:2});
}
window.addEventListener('pointerdown',function(e){
  var el=e.target;
  if(el&&el.closest&&el.closest('button,input,textarea,a,label')){return;}
  var x=e.clientX,y=e.clientY;
  spark(x,y);
  if(Math.hypot(x-orb.x,y-orb.y)<R*1.3){kick=Math.min(.24,kick+.11);burst(orb.x,orb.y,38,.5);}
});

function star4(x,y,r){
  ctx.beginPath();
  ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);
  ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fill();
}
function blob(x,y,r,c,a){
  var g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function mist(speed,alpha,yoff){
  var c=cur.bot,m=[c[0]+(255-c[0])*.35,c[1]+(255-c[1])*.35,c[2]+(255-c[2])*.35];
  for(var i=0;i<7;i++){
    var x=((i*W/5+time*speed)%(W*1.4))-W*.2,y=H-yoff+Math.sin(time*.2+i)*10,r=W*.34;
    ctx.save();ctx.translate(x,y);ctx.scale(1,.3);
    var g=ctx.createRadialGradient(0,0,0,0,0,r);
    g.addColorStop(0,rgba(m,alpha));g.addColorStop(1,rgba(m,0));
    ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
  }
}
function beatEnv(p){
  var a=(p-.05)/.07,b=(p-.3)/.08;
  return Math.exp(-a*a)+.6*Math.exp(-b*b);
}

function frame(ms){
  var now=ms/1000;
  var dt=Math.min(.05,Math.max(0,now-last))*(reduce?.3:1);
  last=now;time+=dt;
  var k=1-Math.exp(-dt*1.6),i,j,p;
  for(i=0;i<NUM.length;i++){cur[NUM[i]]+=(tgt[NUM[i]]-cur[NUM[i]])*k;}
  for(i=0;i<COL.length;i++){for(j=0;j<3;j++){cur[COL[i]][j]+=(tgt[COL[i]][j]-cur[COL[i]][j])*k;}}
  px+=(tpx-px)*.05;py+=(tpy-py)*.05;
  kick*=Math.exp(-dt*.8);
  phase+=dt*cur.speed;
  beatPhase+=dt*(84/60);
  var bp=beatPhase%1,env=beatEnv(bp)*cur.beat;
  var cyc=Math.floor(beatPhase);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;

  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,rgba(cur.top,1));g.addColorStop(.55,rgba(cur.mid,1));g.addColorStop(1,rgba(cur.bot,1));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(cur.dawn>.02){
    g=ctx.createRadialGradient(W*.5,H*1.05,0,W*.5,H*1.05,Math.max(W,H)*.9);
    g.addColorStop(0,'rgba(255,176,120,'+(.55*cur.dawn)+')');g.addColorStop(.4,'rgba(255,120,150,'+(.22*cur.dawn)+')');g.addColorStop(1,'rgba(255,120,150,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  blob(W*.22+Math.sin(time*.05)*W*.05,H*.3+Math.cos(time*.04)*H*.05,Math.max(W,H)*.5,cur.n1,.42);
  blob(W*.8+Math.cos(time*.045)*W*.05,H*.62+Math.sin(time*.05)*H*.04,Math.max(W,H)*.55,cur.n2,.3);

  /* stars */
  var dim=1-.6*cur.dawn;
  for(i=0;i<stars.length;i++){
    var s=stars[i];
    var x=((s.nx*W+time*s.d*3+px*s.d*26)%W+W)%W,y=s.ny*H+py*s.d*18;
    var a=(.35+.65*Math.abs(Math.sin(time*s.tw+s.ph)))*dim*(.5+.5*s.d);
    ctx.globalAlpha=a;ctx.fillStyle=s.warm?'#ffe9c4':'#ffffff';
    if(s.big){star4(x,y,s.r*3.4);}
    else if(s.r>1){ctx.beginPath();ctx.arc(x,y,s.r*.7,0,TAU);ctx.fill();}
    else{ctx.fillRect(x,y,s.r*1.2,s.r*1.2);}
  }
  ctx.globalAlpha=1;

  /* shooting stars */
  if(!reduce&&Math.random()<cur.shoot*dt){
    var sa=.35+Math.random()*.35,sp=700+Math.random()*500;
    shoots.push({x:Math.random()*W*.7,y:Math.random()*H*.35,vx:Math.cos(sa)*sp,vy:Math.sin(sa)*sp,age:0,life:.9});
  }
  for(i=shoots.length-1;i>=0;i--){
    var sh=shoots[i];sh.age+=dt;if(sh.age>sh.life){shoots.splice(i,1);continue;}
    sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;
    var f=sh.age/sh.life,al=Math.sin(Math.PI*f);
    var tx=sh.x-sh.vx*.11,ty=sh.y-sh.vy*.11;
    var lg=ctx.createLinearGradient(sh.x,sh.y,tx,ty);
    lg.addColorStop(0,'rgba(255,255,255,'+al+')');lg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=lg;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(sh.x,sh.y);ctx.lineTo(tx,ty);ctx.stroke();
  }

  /* cradle */
  var theta=(cur.rock+kick)*Math.sin(phase);
  var mx=cx+px*R*.1+R*theta,my=cy+Math.sin(time*.6)*R*.025+py*R*.06;
  blob(cx+px*R*.1,my,R*3.4,[255,205,150],.2*cur.glow*(1+.25*env));
  ctx.save();ctx.translate(mx,my);ctx.rotate(theta);
  ctx.drawImage(moon,-moonS/2,-moonS/2,moonS,moonS);
  var oy=R*.3+Math.sin(time*1.3)*R*.025;
  var ro=R*.19*(1+.04*Math.sin(time*2)+.3*env)*(1+.08*(cur.glow-1));
  ctx.globalCompositeOperation='lighter';
  blob(0,oy,ro*5,cur.orb,.45*cur.glow);
  blob(0,oy,ro*2.2,cur.orb,.75);
  var cg=ctx.createRadialGradient(0,oy,0,0,oy,ro);
  cg.addColorStop(0,'rgba(255,255,250,1)');cg.addColorStop(.6,'rgba(255,248,230,.95)');cg.addColorStop(1,rgba(cur.orb,0));
  ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,oy,ro,0,TAU);ctx.fill();
  var fl=ro*(5.5+2*Math.sin(time*1.7));
  ctx.save();ctx.translate(0,oy);ctx.rotate(time*.12);
  for(i=0;i<4;i++){
    var len=i%2?fl*.55:fl;
    var fg=ctx.createLinearGradient(-len,0,len,0);
    fg.addColorStop(0,'rgba(255,255,255,0)');fg.addColorStop(.5,'rgba(255,252,240,.85)');fg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.save();ctx.rotate(i*Math.PI/4);ctx.fillStyle=fg;ctx.fillRect(-len,-1,len*2,2);ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  orb.x=mx-Math.sin(theta)*oy;orb.y=my+Math.cos(theta)*oy;orb.r=ro;

  /* beat rings + dust + bursts */
  if(cyc!==lastBeat){lastBeat=cyc;if(cur.ring>.2){rings.push({x:orb.x,y:orb.y,age:0,life:1.8,r0:ro,r1:R*3.2,c:cur.orb,a:.55*cur.ring,w:3});}}
  dustAcc+=cur.dust*dt;
  while(dustAcc>=1){
    dustAcc-=1;
    var da=Math.random()*TAU,dr=Math.random()*ro*.9;
    var br=.75+Math.random()*.25;
    addP({x:orb.x+Math.cos(da)*dr,y:orb.y+Math.sin(da)*dr,vx:(Math.random()-.5)*16,vy:-(10+Math.random()*28),life:2.6+Math.random()*2.6,s:.8+Math.random()*1.5,a:.9,c:[cur.orb[0]*br,cur.orb[1]*br,cur.orb[2]*br],drag:.1,grav:0,streak:false,fade:'sin',sway:.25,ph:Math.random()*TAU});
  }
  if(!reduce&&tgt===SCENES.born&&cur.dawn>.55&&time>nextBurst){
    burst(orb.x,orb.y,wide?120:84,1);
    nextBurst=time+8+Math.random()*4;
  }
  if(parts.length>520){parts.splice(0,parts.length-520);}

  ctx.globalCompositeOperation='lighter';
  for(i=parts.length-1;i>=0;i--){
    p=parts[i];p.age+=dt;
    if(p.age>=p.life){parts.splice(i,1);continue;}
    var kd=Math.exp(-p.drag*dt);p.vx*=kd;p.vy*=kd;p.vy+=p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    var pf=p.age/p.life,pa=(p.fade==='sin'?Math.sin(Math.PI*pf):1-pf)*p.a;
    if(p.streak){
      ctx.strokeStyle=rgba(p.c,pa);ctx.lineWidth=p.s;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.045,p.y-p.vy*.045);ctx.stroke();
    }else{
      var qx=p.x+(p.sway?Math.sin(p.age*2+p.ph)*p.sway*p.age*6:0);
      ctx.fillStyle=rgba(p.c,pa*.18);ctx.beginPath();ctx.arc(qx,p.y,p.s*3,0,TAU);ctx.fill();
      ctx.fillStyle=rgba(p.c,pa);ctx.beginPath();ctx.arc(qx,p.y,p.s,0,TAU);ctx.fill();
    }
  }
  for(i=rings.length-1;i>=0;i--){
    var rg=rings[i];rg.age+=dt;var rf=rg.age/rg.life;
    if(rf>=1){rings.splice(i,1);continue;}
    var rad=rg.r0+(rg.r1-rg.r0)*(1-Math.pow(1-rf,3));
    ctx.strokeStyle=rgba(rg.c,(1-rf)*rg.a);ctx.lineWidth=rg.w*(1-rf)+1;
    ctx.beginPath();ctx.arc(rg.x,rg.y,rad,0,TAU);ctx.stroke();
  }
  if(flash>.01){blob(orb.x,orb.y,Math.max(W,H)*.7,[255,240,200],flash*.45);flash*=Math.exp(-dt*2.6);}

  /* confetti */
  ctx.globalCompositeOperation='source-over';
  if(cur.dawn>.3){
    var ca=Math.min(1,(cur.dawn-.3)*2);
    for(i=0;i<conf.length;i++){
      var c=conf[i];c.y+=c.vy*dt;c.rot+=c.vr*dt;
      if(c.y>H+20){c.y=-20;c.nx=Math.random();}
      var cxp=c.nx*W+Math.sin(time*c.sw+c.ph)*24;
      ctx.save();ctx.translate(cxp,c.y);ctx.rotate(c.rot);
      ctx.fillStyle=rgba(c.c,.78*ca);
      if(c.star){star4(0,0,c.s*1.4);}else{ctx.beginPath();ctx.arc(0,0,c.s*.45,0,TAU);ctx.fill();}
      ctx.restore();
    }
  }
  mist(9,.1,10);mist(16,.12,-6);
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
function normalize(o){
  var s=(o&&typeof o==='object')?o:{nameHint:'Maya'};
  if(ORDER.indexOf(s.status)<0){s.status='waiting';}
  s.note=s.note||'';s.due=s.due||'';s.updated=s.updated||'';s.nameHint=s.nameHint||'';
  s.born=(s.born&&typeof s.born==='object')?s.born:{};
  return s;
}
var lastKey='';
function apply(o){
  var n=normalize(o),key=JSON.stringify(n);
  if(key===lastKey){return;}
  lastKey=key;S=n;render(S);setScene(S.status);
}
var pv=/[?&]preview=(waiting|hospital|born)/.exec(location.search);
var fbSeen=false;
/* data.js calls this with the live Firestore document */
window.__applyStatus=function(o,live){
  if(pv){return;}
  if(live){fbSeen=true;try{localStorage.setItem('ba-last',JSON.stringify(o||null));}catch(e){}}
  apply(o);
};
if(pv){
  apply({status:pv[1],note:'Preview only. This is not the real status.',due:'',nameHint:'Maya',updated:new Date().toISOString(),
    born:{name:'Maya',at:'2026-11-01T03:12',weight:'3.4 kg',length:'51 cm'}});
}else{
  var cached=null;
  try{cached=JSON.parse(localStorage.getItem('ba-last')||'null');}catch(e){}
  if(cached){apply(cached);}
  setTimeout(function(){if(!fbSeen&&!cached){apply(null);}},6000);
}
requestAnimationFrame(frame);
})();
