import { useRef, useState } from 'react';
import { CheckCheck, MessageCircle } from 'lucide-react';

const conversations = [
  {
    name: 'Lucía Martín', initials: 'LM',
    messages: [
      '¡Hola! Busco algo para compartir un ratito sin pantallas con mi peque 😊',
      'Puedes elegir una letra del alfabeto, imprimirla y preparar los colores.',
      '¡Ese plan me gusta! Colorear y conversar sobre la Biblia juntos 💛',
    ],
  },
  {
    name: 'Carmen López', initials: 'CL',
    messages: [
      '¿El bingo también viene en el kit?',
      'Sí, incluye el Bingo Bíblico en Familia y los otros cuatro bonos, además del alfabeto.',
      '¡Qué buena idea para una tarde en familia! 😊',
    ],
  },
  {
    name: 'Álvaro García', initials: 'AG',
    messages: [
      'Hola 👋 ¿Son archivos para imprimir en casa?',
      'Sí, son PDFs en español. También puedes llevarlos a un servicio de impresión.',
      'Perfecto, así podemos elegir una actividad para compartir con los niños 🙌',
    ],
  },
];

export function IllustrativeChats() {
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
      {conversations.map(chat => <article className="chat-card" key={chat.name} aria-label={`Conversación ficticia con ${chat.name}`}>
        <header className="chat-header">
          <span className="chat-avatar" aria-hidden="true">{chat.initials}</span>
          <div><h3>{chat.name}</h3><p>Personaje ficticio</p></div>
          <MessageCircle size={21} aria-hidden="true" />
        </header>
        <div className="chat-messages">
          <span className="chat-example">Ejemplo ilustrativo</span>
          {chat.messages.map((message, index) => <div className={`chat-bubble ${index === 1 ? 'chat-reply' : ''}`} key={message}>
            <p>{message}</p>
            {index === 1 && <CheckCheck className="chat-check" size={15} aria-hidden="true" />}
          </div>)}
        </div>
        <p className="chat-disclaimer">Conversación ficticia · No es una reseña real.</p>
      </article>)}
    </div>
    <div className="chat-dots" role="tablist" aria-label="Seleccionar testimonio">
      {conversations.map((chat, index) => <button key={chat.name} type="button" role="tab" aria-selected={active === index} aria-label={`Ver testimonio de ${chat.name}`} className={`chat-dot ${active === index ? 'active' : ''}`} onClick={() => goTo(index)} />)}
    </div>
  </div>;
}
