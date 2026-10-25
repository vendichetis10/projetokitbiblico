// Finish the SSR hero's image before React hydration competes for the main
// thread. Native anchors and the server-rendered content work immediately.
let started = false;
function hydrate() {
 if (started) return;
 started = true;
 void import('./hydrate-app').then(app => app.hydrate());
}
async function startClient() {
 if (document.hidden) { hydrate(); return; }
 const selector = matchMedia('(max-width: 767px)').matches
  ? '.mobile-hero-mockup img' : '.hero-visual img';
 const hero = document.querySelector<HTMLImageElement>(selector);
 try { await hero?.decode(); } catch { /* Keep the app usable if media fails. */ }
 requestAnimationFrame(() => { requestAnimationFrame(hydrate); });
}

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', startClient, { once: true });
} else {
 startClient();
}
