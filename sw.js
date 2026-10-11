const C='k07-combined-v1';
const LIB=['cdnjs.cloudflare.com','cdn.jsdelivr.net','www.gstatic.com'];
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
const put=(r,n)=>{ if(n&&(n.ok||n.type==='opaque')){ const cp=n.clone(); caches.open(C).then(c=>c.put(r,cp)); } return n; };
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  // the app itself: always try the network first (so updates show), fall back to the saved copy when offline
  if(u.origin===location.origin){ e.respondWith(fetch(r,{cache:'no-cache'}).then(n=>put(r,n)).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html')))); return; }
  // chart / Excel / Firebase script libraries only: cache-first. Firestore, login and every other request is left alone.
  if(LIB.includes(u.hostname)&&r.destination==='script'){ e.respondWith(caches.match(r).then(x=>x||fetch(r).then(n=>put(r,n)))); }
});
