// Let the server-rendered page paint before importing and hydrating React.
// There is no artificial timer: hydration starts on the next painted frame.
function startClient() {
 requestAnimationFrame(() => {
  requestAnimationFrame(() => { void import('./hydrate-app').then(app => app.hydrate()); });
 });
}

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', startClient, { once: true });
} else {
 startClient();
}
