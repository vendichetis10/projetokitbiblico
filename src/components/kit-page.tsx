import { useEffect, useState } from 'react';
import { BookOpen, Check, Pencil, Leaf, Heart, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kit from '@/assets/kit.jpg.asset.json';
import cover from '@/assets/cover.jpg.asset.json';
import pa from '@/assets/pa.jpg.asset.json';
import pb from '@/assets/pb.jpg.asset.json';
import pc from '@/assets/pc.jpg.asset.json';
import bingo from '@/assets/bingo.jpg.asset.json';
import domino from '@/assets/domino.jpg.asset.json';
import camino from '@/assets/camino.jpg.asset.json';
import mimicas from '@/assets/mimicas.jpg.asset.json';
import aventuras from '@/assets/aventuras.jpg.asset.json';
import { TestimonialChats } from '@/components/illustrative-chats';
const checkout = 'https://pay.kiwify.com/n3l7mr7';
function Buy({children, yellow = false, small = false, className = ''}: {children: React.ReactNode; yellow?: boolean; small?: boolean; className?: string}) {
 return <Button asChild className={`cta ${yellow ? 'cta-yellow' : ''} ${small ? 'cta-small' : ''} ${className}`}><a href={checkout}>{children}</a></Button>;
}
function Checks({items, className = ''}: {items: string[]; className?: string}) { return <ul className={`check-list ${className}`}>{items.map(item => <li key={item}><Check aria-hidden="true"/>{item}</li>)}</ul>; }
const benefits = [
 [Pencil,'Primeras letras con significado','Relaciona letras con palabras y personajes bíblicos.'],
 [Leaf,'Diversión fuera de las pantallas','Propón un momento para colorear, recortar o jugar.'],
 [Heart,'Fe para compartir','Aprovecha cada actividad para conversar sobre la Biblia.'],
] as const;
const contents = [
 {name:'ALFABETO BÍBLICO', text:'Letras, trazos e ilustraciones para practicar y colorear con temas de la Biblia.', image:cover},
 {name:'BINGO BÍBLICO EN FAMILIA', text:'6 cartones y 12 tarjetas para sortear, observar y jugar juntos.', image:bingo},
 {name:'DOMINÓ DE PERSONAJES', text:'28 fichas para relacionar nombres e ilustraciones de personajes bíblicos.', image:domino},
 {name:'EL CAMINO DE LA FE', text:'Un tablero, 4 peones y 12 retos para participar por turnos.', image:camino},
 {name:'MÍMICAS BÍBLICAS', text:'24 tarjetas con acciones y pistas para representar y adivinar.', image:mimicas},
 {name:'10 AVENTURAS BÍBLICAS', text:'10 actividades para resolver y colorear, con respuestas, diploma y 4 láminas.', image:aventuras},
];
const samples = [
 {image:pa, label:'Letra A — Adán', caption:'Practica las letras.'},
 {image:pb, label:'Letra B — Biblia', caption:'Colorea y descubre.'},
 {image:pc, label:'Letra C — Cristo', caption:'Practica las letras.'},
 {image:camino, label:'El Camino de la Fe', caption:'Juega en familia.'},
 {image:bingo, label:'Bingo Bíblico en Familia', caption:'Juega en familia.'},
 {image:mimicas, label:'Mímicas Bíblicas', caption:'Juega en familia.'},
 {image:domino, label:'Dominó de Personajes', caption:'Colorea y descubre.'},
 {image:aventuras, label:'10 Aventuras Bíblicas', caption:'Colorea y descubre.'},
];
const steps = [
 ['Compra el kit','Realiza un único pago en el checkout.'],
 ['Descarga los PDFs','Tras la confirmación del pago, sigue las instrucciones de la plataforma para acceder.'],
 ['Preparen los colores','Elige una actividad, imprímela y disfruten juntos.'],
];
const faqs = [
 ['¿El kit es físico o digital?','Es digital. Recibes archivos PDF en español para descargar e imprimir. La impresión no está incluida.'],
 ['¿Para qué edades está recomendado?','Aproximadamente de 3 a 10 años, eligiendo las actividades según la etapa del niño. Los más pequeños pueden necesitar ayuda de un adulto.'],
 ['¿Cómo recibo los materiales?','Después de la confirmación del pago, sigue las instrucciones de la plataforma para acceder y descargar los archivos.'],
 ['¿Necesito una impresora?','Puedes imprimir en casa o en un servicio de impresión. Algunas actividades también requieren colores, tijeras u otros materiales básicos.'],
 ['¿Es un pago único?','Sí. El kit completo cuesta US$ 8.90, sin mensualidad.'],
 ['¿Puedo usarlo con grupos?','Consulta las condiciones de uso del producto para conocer los permisos de impresión y utilización con grupos o instituciones.'],
 ['¿Dónde consulto las condiciones de reembolso?','En la página de pago de Kiwify, antes de finalizar tu compra.'],
];
export function KitPage() {
 const [expanded,setExpanded] = useState<{url:string; label:string} | null>(null);
 useEffect(()=> { if(!expanded) return; const previous=document.body.style.overflow; document.body.style.overflow='hidden'; const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(null);}; window.addEventListener('keydown',key); return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);}; },[expanded]);
 return <div className="page">
 <header className="page-header"><div className="container header-inner"><div className="brand"><span className="brand-icon"><BookOpen size={21}/></span>Kit Bíblico Infantil</div><Buy small className="header-cta">¡Quiero mi kit!</Buy></div></header>
 <main>
 <section className="hero"><div className="container hero-grid"><div className="hero-copy"><h1>Menos pantallas.<br/><span>Más juegos, aprendizaje y fe</span> en familia.</h1><p className="hero-lead">Actividades bíblicas listas para imprimir: practica las primeras letras, colorea y disfruta juegos para compartir con los pequeños.</p><p className="highlight">Alfabeto Bíblico + 5 bonos<br/>Todo el kit por <span className="price-inline">US$&nbsp;8.90</span> · Pago único</p><div className="purchase"><Buy>¡QUIERO MI KIT COMPLETO!</Buy><p className="micro">PDFs en español para descargar e imprimir.<br/>No se envían productos físicos.</p></div></div><div className="hero-visual"><img className="product-image" src={kit.url} alt="Alfabeto Bíblico y los cinco bonos incluidos en el kit" width="1100" height="917" fetchPriority="high"/><span className="digital-label"><FileText size={15}/>Material digital imprimible.</span></div></div></section>
 <section className="section bg-sky"><div className="container"><div className="section-heading"><h2>Mira lo que podrán hacer.</h2><p>Trazar letras, colorear personajes y descubrir actividades sobre la Biblia.</p></div><div className="sample-grid">{samples.map(s=><div key={s.label}><Button variant="ghost" className="sample-button" aria-label={`Ampliar ${s.label}`} onClick={()=>setExpanded({url:s.image.url,label:s.label})}><span className="sample-frame"><img src={s.image.url} alt={s.label} loading="lazy"/></span></Button><p className="sample-caption">{s.caption}</p></div>)}</div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Aprender y compartir puede ser así de sencillo.</h2></div><div className="benefit-grid">{benefits.map(([Icon,title,text])=><article className="item-card" key={title}><span className="icon-tile"><Icon size={24}/></span><h3>{title}</h3><p>{text}</p></article>)}</div><TestimonialChats /></div></section>
 <section className="section bg-cream"><div className="container"><div className="section-heading"><h2>Un alfabeto y 5 bonos para seguir disfrutando.</h2></div><div className="bonus-grid">{contents.map(c=><article className="bonus-card" key={c.name}><div className="bonus-picture"><img src={c.image.url} alt={c.name} loading="lazy"/></div><div className="bonus-body"><h3>{c.name}</h3><p>{c.text}</p></div></article>)}<div className="bonus-end"><div className="purchase"><Buy yellow>¡QUIERO EL ALFABETO Y LOS 5 BONOS!</Buy></div></div></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Elige, imprime y comienza.</h2></div><div className="steps-grid">{steps.map(([title,text],i)=><article className="item-card" key={title}><span className="step-number">{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
 <section className="section offer"><div className="container"><div className="offer-panel"><h2>Todo el kit en una sola compra.</h2><img src={kit.url} className="offer-image" alt="Colección completa: Alfabeto Bíblico y cinco bonos" loading="lazy"/><Checks items={['Alfabeto Bíblico.','Bingo Bíblico en Familia.','Dominó de Personajes.','El Camino de la Fe.','Mímicas Bíblicas.','10 Aventuras Bíblicas.']}/><p className="price">US$ 8.90</p><p className="support">Pago único · 6 materiales digitales en español</p><div className="purchase"><Buy>¡QUIERO MI KIT POR US$ 8.90!</Buy></div><p className="micro">Compra procesada por Kiwify.<br/>Material digital para descargar e imprimir. Sin envío físico.</p></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>¿Tienes alguna duda?</h2></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><div className="center-cta"><Buy yellow>¡QUIERO EMPEZAR CON MI KIT!</Buy></div></div></section>
 </main><footer className="footer"><strong>Kit Bíblico Infantil — Alfabeto Bíblico + 5 bonos.</strong><p>PDFs en español para descargar e imprimir.</p></footer>
 <aside className="mobile-bar" aria-label="Comprar el kit"><div><p>Kit completo · US$ 8.90</p></div><Buy>¡LO QUIERO!</Buy></aside>
 {expanded && <div className="lightbox" role="dialog" aria-modal="true" aria-label={expanded.label} onClick={()=>setExpanded(null)}><Button autoFocus size="icon" variant="ghost" className="lightbox-close" aria-label="Cerrar imagen" onClick={()=>setExpanded(null)}><X/></Button><img src={expanded.url} alt={expanded.label} onClick={e=>e.stopPropagation()}/></div>}
 </div>;
}
