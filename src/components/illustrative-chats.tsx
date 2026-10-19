import { useRef, useState } from 'react';
import anaCarmen from '@/assets/testimonio-ana-carmen.avif.asset.json';
import luciaFernandez from '@/assets/testimonio-lucia-fernandez.avif.asset.json';
import martaRodriguez from '@/assets/testimonio-marta-rodriguez.avif.asset.json';

const testimonials = [
  {
    name: 'Ana Carmen',
    image: anaCarmen,
    alt: 'Captura de WhatsApp de Ana Carmen: descargó el Alfabeto Bíblico, imprimió las actividades y coloreó con su hijo mientras hablaban de historias de la Biblia.',
  },
  {
    name: 'Lucía Fernández',
    image: luciaFernandez,
    alt: 'Captura de WhatsApp de Lucía Fernández: abrió el PDF, imprimió hojas para hacer con su hija y aprovechó para repasar las letras y los personajes de la Biblia.',
  },
  {
    name: 'Marta Rodríguez',
    image: martaRodriguez,
    alt: 'Captura de WhatsApp de Marta Rodríguez: jugó con su familia al bingo bíblico y al dominó de personajes, y las letras y juegos fueron variados y divertidos.',
  },
];

export function TestimonialChats() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.children).forEach((card, index) => {
      const element = card as HTMLElement;
      const distance = Math.abs(element.offsetLeft + element.offsetWidth / 2 - center);
      if (distance < bestDistance) { bestDistance = distance; best = index; }
    });
    setActive(best);
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  return <div className="illustrative-chats">
    <div className="section-heading">
      <h2>Un plan para compartir en familia.</h2>
      <p>testimonios de clientes.</p>
    </div>
    <div className="chat-grid" ref={trackRef} onScroll={handleScroll}>
      {testimonials.map(testimonial => <article className="chat-card testimonial-card" key={testimonial.name} aria-label={`Testimonio de ${testimonial.name}`}>
        <img src={testimonial.image.url} alt={testimonial.alt} loading="lazy" width="330" height="560"/>
      </article>)}
    </div>
    <div className="chat-dots" role="tablist" aria-label="Seleccionar testimonio">
      {testimonials.map((testimonial, index) => <button key={testimonial.name} type="button" role="tab" aria-selected={active === index} aria-label={`Ver testimonio de ${testimonial.name}`} className={`chat-dot ${active === index ? 'active' : ''}`} onClick={() => goTo(index)} />)}
    </div>
  </div>;
}
