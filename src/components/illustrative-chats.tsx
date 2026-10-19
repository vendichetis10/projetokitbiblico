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
  return <div className="illustrative-chats">
    <div className="section-heading">
      <h2>Un plan para compartir en familia.</h2>
      <p>Conversaciones ilustrativas · Nombres y mensajes ficticios, no testimonios de clientes.</p>
    </div>
    <div className="chat-grid">
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
  </div>;
}