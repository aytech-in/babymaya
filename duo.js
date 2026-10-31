/* Fondant-style couple illustrations, one per status. Returns an SVG string. */
(function(){
'use strict';
var SK='url(#d-skin)',SKD='#e9b496';

function defs(){return ''+
'<defs>'+
'<radialGradient id="d-skin" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#ffe6d2"/><stop offset=".6" stop-color="#f6cfb4"/><stop offset="1" stop-color="#e9b496"/></radialGradient>'+
'<radialGradient id="d-hairw" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="#7a5247"/><stop offset=".55" stop-color="#4f3029"/><stop offset="1" stop-color="#37201c"/></radialGradient>'+
'<radialGradient id="d-hairh" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="#5d4036"/><stop offset=".6" stop-color="#3b2822"/><stop offset="1" stop-color="#1a1217"/></radialGradient>'+
'<linearGradient id="d-pink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa3bd"/><stop offset="1" stop-color="#ec6f97"/></linearGradient>'+
'<radialGradient id="d-belly" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#ffc2d3"/><stop offset=".7" stop-color="#f98aaa"/><stop offset="1" stop-color="#e96993"/></radialGradient>'+
'<linearGradient id="d-navy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3b46"/><stop offset="1" stop-color="#14141a"/></linearGradient>'+
'<linearGradient id="d-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4f6"/><stop offset=".6" stop-color="#f9d4e0"/><stop offset="1" stop-color="#c9b5e6"/></linearGradient>'+
'<linearGradient id="d-blanket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbd4"/><stop offset="1" stop-color="#f7e188"/></linearGradient>'+
'<linearGradient id="d-bag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fe0d2"/><stop offset="1" stop-color="#43b5a6"/></linearGradient>'+
'<linearGradient id="d-mg" x1="0" y1="0" x2="0" y2="1"><stop offset=".0" stop-color="#fff"/><stop offset=".58" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="d-fade" maskUnits="userSpaceOnUse" x="-40" y="200" width="480" height="100"><rect x="-40" y="200" width="480" height="100" fill="url(#d-mg)"/></mask></defs>';}

function eyes(kind,cx,cy,gap){
  var l=cx-gap,r=cx+gap,s='';
  if(kind==='closed'){
    s+='<g stroke="#3a2420" stroke-width="2.6" stroke-linecap="round" fill="none">'+
      '<path d="M'+(l-7)+' '+cy+'Q'+l+' '+(cy+7)+' '+(l+7)+' '+cy+'"/><path d="M'+(r-7)+' '+cy+'Q'+r+' '+(cy+7)+' '+(r+7)+' '+cy+'"/>'+
      '<path d="M'+(l-7)+' '+cy+'l-3 -2M'+(r+7)+' '+cy+'l3 -2" stroke-width="2"/></g>';
  }else if(kind==='joy'){
    s+='<g stroke="#3a2420" stroke-width="2.8" stroke-linecap="round" fill="none">'+
      '<path d="M'+(l-7)+' '+(cy+3)+'Q'+l+' '+(cy-6)+' '+(l+7)+' '+(cy+3)+'"/><path d="M'+(r-7)+' '+(cy+3)+'Q'+r+' '+(cy-6)+' '+(r+7)+' '+(cy+3)+'"/></g>';
  }else{
    s+='<g class="d-blink" style="transform-origin:'+cx+'px '+cy+'px">'+
      '<ellipse cx="'+l+'" cy="'+cy+'" rx="4.2" ry="5.4" fill="#2b1b19"/><ellipse cx="'+r+'" cy="'+cy+'" rx="4.2" ry="5.4" fill="#2b1b19"/>'+
      '<circle cx="'+(l+1.3)+'" cy="'+(cy-1.8)+'" r="1.4" fill="#fff"/><circle cx="'+(r+1.3)+'" cy="'+(cy-1.8)+'" r="1.4" fill="#fff"/></g>';
  }
  return s;
}
function cheeks(cx,cy,gap){return '<g fill="#ff8fa6" opacity=".5"><ellipse cx="'+(cx-gap-3)+'" cy="'+cy+'" rx="7" ry="4.6"/><ellipse cx="'+(cx+gap+3)+'" cy="'+cy+'" rx="7" ry="4.6"/></g>';}
function hand(x,y,rot){return '<g transform="rotate('+(rot||0)+' '+x+' '+y+')"><circle cx="'+x+'" cy="'+y+'" r="9" fill="'+SK+'"/>'+
  '<path d="M'+(x-4)+' '+(y-6)+'v6M'+x+' '+(y-7)+'v7M'+(x+4)+' '+(y-6)+'v6" stroke="'+SKD+'" stroke-width="1.3" stroke-linecap="round"/></g>';}

/* ---------- wife ---------- */
function wife(st){
  var belly=st!=='born',e=({waiting:'closed',hospital:'open',born:'joy'})[st],s='';
  s+='<g class="d-breathe" style="transform-origin:140px 250px">';
  // back hair (bob)
  s+='<path d="M96 112C94 64 116 50 140 50S186 64 184 112L186 128Q184 134 178 138Q172 147 162 140Q154 147 146 140Q138 147 130 140Q122 147 114 140Q104 147 98 138Q94 132 95 128Z" fill="url(#d-hairw)"/>';
  // neck + shoulders
  s+='<ellipse cx="140" cy="148" rx="11" ry="12" fill="'+SKD+'"/>';
  s+='<path d="M96 176Q94 156 116 152L164 152Q186 156 184 176Z" fill="'+SK+'"/>';
  // dress
  s+='<path d="M94 178Q140 158 186 178L198 252H82Z" fill="url(#d-pink)"/>';
  s+='<path d="M94 178Q140 158 186 178" fill="none" stroke="#ffd0de" stroke-width="3" stroke-linecap="round" opacity=".8"/>';
  s+='<path d="M112 200l-10 52M130 196l-6 56M150 196l6 56M168 200l10 52" stroke="#e5628c" stroke-width="2" opacity=".35" stroke-linecap="round"/>';
  if(belly){
    s+='<g class="d-kick" style="transform-origin:140px 214px"><circle cx="140" cy="214" r="40" fill="url(#d-belly)"/>'+
       '<path d="M112 196Q122 186 136 186" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".5"/></g>';
    // arms on belly
    s+='<path d="M107 170Q86 200 116 222" stroke="'+SK+'" stroke-width="14" stroke-linecap="round" fill="none"/>';
    s+='<path d="M173 170Q194 200 164 222" stroke="'+SK+'" stroke-width="14" stroke-linecap="round" fill="none"/>';
    s+=hand(118,222,-20)+hand(162,222,20);
  }else{
    // baby in just a diaper: head, arms and legs visible
    s+='<g class="d-baby" style="transform-origin:140px 230px">'+
      '<path d="M130 238Q120 247 111 246M150 238Q160 247 169 246" stroke="'+SK+'" stroke-width="9" stroke-linecap="round" fill="none"/>'+
      '<circle cx="109" cy="246" r="5.5" fill="'+SK+'"/><circle cx="171" cy="246" r="5.5" fill="'+SK+'"/>'+
      '<path d="M127 207Q114 205 108 193" stroke="'+SK+'" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="107" cy="190" r="5.5" fill="'+SK+'"/>'+
      '<ellipse cx="140" cy="216" rx="17" ry="18" fill="'+SK+'"/><circle cx="140" cy="219" r="1.4" fill="'+SKD+'"/>'+
      '<path d="M120 227Q140 238 160 227L163 241Q140 254 117 241Z" fill="#fffaf3" stroke="#eadfd2" stroke-width="1.4" stroke-linejoin="round"/>'+
      '<rect x="116" y="228" width="8" height="5" rx="2" fill="#a9d6f5"/><rect x="156" y="228" width="8" height="5" rx="2" fill="#a9d6f5"/>'+
      '<path d="M128 243Q140 249 152 243" stroke="#eadfd2" stroke-width="1.4" fill="none" stroke-linecap="round"/>'+
      '<g class="d-wave" style="transform-origin:153px 207px"><path d="M153 207Q166 202 174 190" stroke="'+SK+'" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="175" cy="187" r="5.5" fill="'+SK+'"/></g>'+
      '<g transform="translate(24,-12) rotate(-4 116 204)">'+
      '<circle cx="91" cy="205" r="5.5" fill="'+SKD+'"/><circle cx="141" cy="205" r="5.5" fill="'+SKD+'"/>'+
      '<circle cx="116" cy="202" r="26" fill="'+SK+'"/>'+
      '<path d="M99 186Q108 179 120 181" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".45"/>'+
      '<path d="M112 177Q117 170 122 176" stroke="#5a4036" stroke-width="2.4" stroke-linecap="round" fill="none"/>'+
      '<path d="M102 197Q107 194 112 196M120 196Q125 194 130 197" stroke="#8a6a5e" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".6"/>'+
      '<g class="d-blink" style="transform-origin:116px 205px"><ellipse cx="107" cy="205" rx="4.6" ry="5.6" fill="#2b1b19"/><ellipse cx="125" cy="205" rx="4.6" ry="5.6" fill="#2b1b19"/>'+
      '<circle cx="108.6" cy="202.8" r="1.7" fill="#fff"/><circle cx="126.6" cy="202.8" r="1.7" fill="#fff"/><circle cx="106" cy="207.4" r=".8" fill="#fff" opacity=".7"/><circle cx="124" cy="207.4" r=".8" fill="#fff" opacity=".7"/></g>'+
      '<ellipse cx="101" cy="214" rx="5.5" ry="4" fill="#ff8fa6" opacity=".55"/><ellipse cx="131" cy="214" rx="5.5" ry="4" fill="#ff8fa6" opacity=".55"/>'+
      '<path d="M114 211q2 2.4 4 0" stroke="#e0a58a" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
      '<path d="M111 217Q116 221 121 217" stroke="#d9506a" stroke-width="2" fill="none" stroke-linecap="round"/>'+
      '</g></g>';
    s+='<path d="M106 170Q80 208 124 230" stroke="'+SK+'" stroke-width="14" stroke-linecap="round" fill="none"/>';
    s+='<path d="M174 170Q200 206 162 230" stroke="'+SK+'" stroke-width="14" stroke-linecap="round" fill="none"/>';
    s+=hand(124,228,-30)+hand(162,228,30);
  }
  // head
  s+='<g class="d-tilt" style="transform-origin:140px 150px">';
  s+='<circle cx="140" cy="106" r="37" fill="'+SK+'"/>';
  s+=cheeks(140,122,19);
  s+=eyes(e,140,111,15);
  s+='<path d="M137 117q3 3 6 0" stroke="'+SKD+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
  s+=(st==='born'?'<path d="M128 124Q140 138 152 124Z" fill="#d9506a"/><path d="M132 128Q140 133 148 128" stroke="#ff9db4" stroke-width="2" fill="none"/>':
     '<path d="M130 124Q140 133 150 124" stroke="#d9506a" stroke-width="2.8" fill="none" stroke-linecap="round"/>');
  // front hair: bangs + side locks
  // crown + thick blunt fringe (kaküller)
  s+='<path d="M101 108C98 66 120 55 140 55S182 66 179 108L178 99Q160 105 140 102Q120 105 102 99Z" fill="url(#d-hairw)"/>';
  s+='<path d="M122 64Q118 84 120 98M140 60L140 100M158 64Q162 84 160 98" stroke="#2c1914" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".22"/>';
  // short bob sides, curling in at the jaw
  s+='<path d="M123 103Q130 99 136 102M144 102Q150 99 157 103" stroke="#5a3b33" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".7"/>';
  s+='<path d="M100 98Q89 120 96 138Q103 148 114 142Q120 147 125 138Q112 124 115 98Z" fill="url(#d-hairw)"/><path d="M180 98Q191 120 184 138Q177 148 166 142Q160 147 155 138Q168 124 165 98Z" fill="url(#d-hairw)"/>';
  s+='<path d="M112 66Q124 59 136 60" stroke="#a37567" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".55"/>';
  s+='</g></g>';
  return s;
}

/* ---------- husband ---------- */
function husband(st){
  var e=({waiting:'open',hospital:'open',born:'joy'})[st],s='';
  s+='<g class="d-breathe d-b2" style="transform-origin:268px 250px">';
  // neck + torso
  s+='<ellipse cx="268" cy="144" rx="13" ry="15" fill="'+SKD+'"/>';
  s+='<path d="M204 178Q204 150 238 146L298 146Q332 150 332 178L318 258H218Z" fill="url(#d-navy)"/>';
  s+='<path d="M236 184Q252 198 268 196Q284 198 300 184" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".10"/><path d="M268 198V236" stroke="#fff" stroke-width="1.6" opacity=".07"/>';
  s+='<path d="M250 146Q268 170 286 146Z" fill="'+SKD+'"/>';
  s+='<path d="M248 146Q268 172 288 146" stroke="#26262e" stroke-width="5" fill="none" stroke-linecap="round"/>';
  s+='<path d="M222 200Q268 214 314 200" stroke="#fff" stroke-width="1.6" fill="none" opacity=".08"/>';
  // arm around her shoulder
  s+='<path d="M212 176Q196 176 182 160" stroke="url(#d-skin)" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M212 176Q196 176 182 160" pathLength="100" stroke="#17171c" stroke-width="24" stroke-dasharray="26 100" stroke-linecap="round" fill="none"/>';
  s+=hand(178,158,-30);
  // other arm
  if(st==='hospital'){
    s+='<path d="M324 178Q344 200 336 214" stroke="url(#d-skin)" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M324 178Q344 200 336 214" pathLength="100" stroke="#17171c" stroke-width="24" stroke-dasharray="26 100" stroke-linecap="round" fill="none"/>';
    s+=hand(336,220,0);
  }else if(st==='born'){
    s+='<g class="d-wave" style="transform-origin:322px 176px"><path d="M322 178Q346 160 344 128" stroke="url(#d-skin)" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M322 178Q346 160 344 128" pathLength="100" stroke="#17171c" stroke-width="24" stroke-dasharray="26 100" stroke-linecap="round" fill="none"/>'+hand(344,118,10)+'</g>';
  }else{
    s+='<path d="M324 178Q342 196 330 212" stroke="url(#d-skin)" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M324 178Q342 196 330 212" pathLength="100" stroke="#17171c" stroke-width="24" stroke-dasharray="26 100" stroke-linecap="round" fill="none"/>';
    s+='<circle cx="332" cy="206" r="8" fill="#c9a96a"/><circle cx="332" cy="206" r="5.4" fill="#fff6dc"/><path d="M332 206v-3M332 206h2.4" stroke="#333" stroke-width="1" stroke-linecap="round"/>'+hand(330,220,0);
  }
  // head
  s+='<g class="d-tilt d-t2" style="transform-origin:268px 150px">';
  s+='<circle cx="229" cy="102" r="7.5" fill="'+SK+'"/><circle cx="307" cy="102" r="7.5" fill="'+SK+'"/>';
  s+='<path d="M231 90C231 60 250 58 268 58C286 58 305 60 305 90L303 110Q298 137 268 142Q238 137 233 110Z" fill="'+SK+'"/>';
  // clean-shaven
  s+=eyes(e,268,101,15);
  // glasses
  s+='<g fill="rgba(255,255,255,.1)" stroke="#2a2830" stroke-width="3"><rect x="239" y="89" width="27" height="23" rx="9"/><rect x="270" y="89" width="27" height="23" rx="9"/></g>';
  s+='<path d="M266 97L270 97M239 96L231 95M297 96L305 95" stroke="#2a2830" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  s+='<path d="M244 94q4 -2 7 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".75"/>';
  // brows
  s+='<path d="M241 84Q250 80 261 83M275 83Q286 80 295 84" stroke="#1f1412" stroke-width="4.2" stroke-linecap="round" fill="none"/>';
  // nose + mouth
  s+='<path d="M265 108q3 4 6 0" stroke="'+SKD+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
  s+=(st==='born'?'<path d="M254 124Q268 140 282 124Z" fill="#c9455f"/><path d="M259 131Q268 136 277 131" stroke="#ff9db4" stroke-width="2" fill="none"/>':
     '<path d="M254 122Q268 138 282 122Q268 126 254 122Z" fill="#fff" stroke="#7a3340" stroke-width="2.2" stroke-linejoin="round"/>');
  // hair
  s+='<path d="M229 102C221 78 227 62 242 56C244 44 258 36 270 40C278 32 292 33 298 41C307 44 310 54 308 64C310 76 310 90 308 102L305 92Q303 80 295 76Q286 68 274 72Q262 66 252 74Q242 78 239 92L233 100Z" fill="url(#d-hairh)"/>';
  s+='<path d="M244 76Q252 58 268 62Q276 56 288 62Q277 66 271 77Q262 70 253 81Z" fill="url(#d-hairh)"/><path d="M250 48Q262 40 276 46M284 42Q294 40 301 48" stroke="#8d7a86" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>';
  s+='<path d="M244 56Q236 50 238 42" stroke="#241a1e" stroke-width="2.4" stroke-linecap="round" fill="none"/>';
  s+='</g></g>';
  return s;
}

function fore(st){
  if(st!=='hospital'){return '';}
  return '<g class="d-bag" style="transform-origin:336px 214px"><path d="M322 226C322 206 350 206 350 226" fill="none" stroke="#2f8f82" stroke-width="4" stroke-linecap="round"/>'+
    '<rect x="314" y="222" width="44" height="32" rx="9" fill="url(#d-bag)"/><rect x="334" y="229" width="4" height="14" rx="2" fill="#fff"/><rect x="329" y="234" width="14" height="4" rx="2" fill="#fff"/></g>'+hand(336,220,0);
}
function clouds(){
  var c=[[10,282,34],[66,288,30],[124,282,36],[186,290,30],[244,283,36],[306,289,30],[362,282,36],[404,288,30]],s='<g mask="url(#d-fade)">';
  c.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="url(#d-cloud)"/>';});
  s+='<g fill="#fff" opacity=".6"><ellipse cx="60" cy="270" rx="14" ry="4.5"/><ellipse cx="250" cy="268" rx="16" ry="4.5"/><ellipse cx="350" cy="271" rx="12" ry="4"/></g></g>';
  return s;
}

function extras(st){
  var s='',i;
  if(st==='waiting'){
    s+='<g class="d-dots" fill="#f6e8c6"><circle cx="318" cy="52" r="4"/><circle cx="332" cy="46" r="4.6"/><circle cx="348" cy="40" r="5.2"/></g>';
    s+='<g class="d-z" fill="none" stroke="#aab3ea" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M52 62h14l-14 14h14"/><path d="M76 40h10l-10 10h10" opacity=".7"/></g>';
    s+='<g fill="#ffd9a8"><path class="d-tw" d="M30 120l2-6 2 6 6 2-6 2-2 6-2-6-6-2z"/><path class="d-tw d-tw2" d="M372 150l2-5 2 5 5 2-5 2-2 5-2-5-5-2z"/></g>';
  }
  if(st==='hospital'){
    s+='<g class="d-heart" style="transform-origin:200px 50px"><path d="M200 66C170 44 182 24 200 38C218 24 230 44 200 66Z" fill="#ff7a9c"/><path d="M190 40q4-5 9-1" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/></g>';
    s+='<path class="d-ecg" transform="translate(0,-34)" d="M12 52H150L160 52L168 34L178 74L188 46L194 52H206L212 52L220 34L230 74L240 46L246 52H388" fill="none" stroke="#ffb487" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
}
  if(st==='born'){
    for(i=0;i<16;i++){
      var x=14+i*24+(i%3)*5,col=['#ffb487','#ff8aa9','#f6e8c6','#aab3ea','#9be7b0'][i%5],d=2.8+(i%5)*.5,dl=(i*.37)%3;
      s+='<rect class="d-conf" x="'+x+'" y="-10" width="'+(i%2?7:5)+'" height="'+(i%2?5:9)+'" rx="1.6" fill="'+col+'" style="animation-duration:'+d+'s;animation-delay:'+dl+'s"/>';
    }
    s+='<g class="d-floath"><path d="M198 58C176 42 184 26 198 36C212 26 220 42 198 58Z" fill="#ff7a9c"/></g>';
    s+='<g class="d-floath d-fh2"><path d="M232 74C220 66 224 56 232 62C240 56 244 66 232 74Z" fill="#ffb487"/></g>';
  }
  return s;
}

window.duoSVG=function(st){
  if(st!=='hospital'&&st!=='born'){st='waiting';}
  return '<svg class="duo-svg d-'+st+'" viewBox="0 0 400 300" role="img" aria-hidden="true" focusable="false">'+defs()+
    '<g class="d-pop">'+extras(st)+'<g class="d-pair">'+wife(st)+husband(st)+fore(st)+'</g>'+clouds()+'</g></svg>';
};
})();
