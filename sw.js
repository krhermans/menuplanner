// Mijn Menuplanner – werkt offline na het eerste bezoek
const CACHE='menuplanner-v1';
const SHELL=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
const EXTERN=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(SHELL);try{await c.add('data.json')}catch(_){}
  for(const u of EXTERN){try{await c.add(new Request(u,{mode:'no-cors'}))}catch(_){}}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  // eigen pagina: eerst netwerk (zo krijg je updates), anders uit de cache
  if(url.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));return}
  // lettertypes en PDF-bibliotheek: uit de cache, anders netwerk en bewaren
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n}).catch(()=>r)));
});
