import { useEffect, useRef, useState } from 'react';
import demo from '@/assets/alfabeto-biblico-loop-4s.mp4.asset.json';

export function BookPreview() {
 const ref = useRef<HTMLVideoElement>(null);
 const [nearby, setNearby] = useState(false);

 useEffect(() => {
  const video = ref.current;
  if (!video) return;
  if (!('IntersectionObserver' in window)) { setNearby(true); return; }
  const observer = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting)) {
    setNearby(true);
    observer.disconnect();
   }
  }, { rootMargin: '250px 0px' });
  observer.observe(video);
  return () => observer.disconnect();
 }, []);

 return <video ref={ref} className="inline-demo-video" src={nearby ? demo.url : undefined}
  poster={nearby ? '/assets/alfabeto-a-w320.webp' : undefined} autoPlay muted loop playsInline controls
  preload={nearby ? 'auto' : 'none'} width="320" height="718"
  aria-label="Vista previa automática del Alfabeto Bíblico, sin sonido">
  Tu navegador no admite video. <a href={demo.url}>Ver la muestra del Alfabeto Bíblico</a>
 </video>;
}
