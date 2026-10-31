const CACHE='hawraz-offline-v16';
const FILES=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(const file of FILES){try{const response=await fetch(file,{cache:'reload'});if(response.ok)await cache.put(file,response);}catch(error){console.warn('HAWRAZ cache skipped:',file,error);}}await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('hawraz-offline-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const key=new URL(request.url);key.search='';
    const cached=await cache.match(key.pathname==='/'?'./':key.pathname);
    try{
      const fresh=await fetch(request);
      if(fresh&&fresh.ok&&request.destination!=='document')cache.put(key.pathname, fresh.clone()).catch(()=>{});
      if(fresh&&fresh.ok)return fresh;
    }catch(error){}
    if(cached)return cached;
    // Only navigations may fall back to the app shell. Never send HTML as JS/CSS.
    if(request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
    return Response.error();
  })());
});
