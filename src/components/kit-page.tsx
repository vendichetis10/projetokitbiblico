import { useEffect, useState } from 'react';
import { BookOpen, Check, Pencil, Leaf, Heart, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kit from '@/assets/kit-biblico-5-bonos.png.asset.json';
import pa from '@/assets/alfabeto-a.jpg.asset.json';
import pb from '@/assets/alfabeto-b.jpg.asset.json';
import prayerSample from '@/assets/orar-sample.jpg.asset.json';
import loveSample from '@/assets/amor-sample.jpg.asset.json';
import bingo from '@/assets/bingo.jpg.asset.json';
import domino from '@/assets/domino.jpg.asset.json';
import camino from '@/assets/camino.jpg.asset.json';
import mimicas from '@/assets/mimicas.jpg.asset.json';
import aventuras from '@/assets/aventuras.jpg.asset.json';
import { books, deliverables } from '@/lib/kit-deliverables';

const checkout = 'https://pay.kiwify.com/n3l7mr7';
function Buy({children, yellow = false, small = false, className = ''}: {children: React.ReactNode; yellow?: boolean; small?: boolean; className?: string}) {
 return <Button asChild className={`cta ${yellow ? 'cta-yellow' : ''} ${small ? 'cta-small' : ''} ${className}`}><a href={checkout}>{children}</a></Button>;
}
function Checks({items, className = ''}: {items: string[]; className?: string}) { return <ul className={`check-list ${className}`}>{items.map(item => <li key={item}><Check aria-hidden="true"/>{item}</li>)}</ul>; }
const benefits = [
 [Pencil,'Primeras letras con significado','Relaciona letras con palabras y personajes bíblicos.'],
 [Leaf,'Diversión fuera de las pantallas','Propón un momento para colorear, resolver actividades o jugar.'],
 [Heart,'Fe para compartir','Aprovecha cada actividad para conversar sobre la Biblia.'],
] as const;
const samples = [
 {image:pa, label:'Letra A — Adán', caption:'Practica las letras.'},
 {image:pb, label:'Letra B — Biblia', caption:'Colorea y descubre.'},
 {image:prayerSample, label:'Mi oración para Dios — Aprendiendo a Orar', caption:'Escribe y colorea tu oración.'},
 {image:loveSample, label:'Actitudes correctas — El Amor de Dios', caption:'Reflexiona sobre la amistad.'},
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
 ['¿El kit es físico o digital?','Es digital. Incluye 3 libros y 5 bonos en PDF para descargar e imprimir. La impresión no está incluida. El libro El Amor de Dios contiene algunos textos en portugués.'],
 ['¿Para qué edades está recomendado?','Alfabeto Bíblico indica de 3 a 10 años en su portada; Aprendiendo a Orar, de 4 a 10 años. Elige las actividades según la etapa del niño y acompáñalo en la lectura y la escritura.'],
 ['¿Cómo recibo los materiales?','Después de la confirmación del pago, sigue las instrucciones de la plataforma para acceder y descargar los archivos.'],
 ['¿Necesito una impresora?','Puedes imprimir en casa o en un servicio de impresión. Algunas actividades también requieren colores, tijeras u otros materiales básicos.'],
 ['¿Es un pago único?','Sí. El kit completo cuesta US$ 8.90, sin mensualidad.'],
 ['¿En qué idioma están los materiales?','Los libros están principalmente en español. El Amor de Dios incluye algunos versículos, instrucciones y respuestas en portugués. Las muestras muestran el contenido tal como aparece en los PDFs.'],
 ['¿Puedo usarlo con grupos?','Consulta las condiciones de uso del producto para conocer los permisos de impresión y utilización con grupos o instituciones.'],
 ['¿Dónde consulto las condiciones de reembolso?','En la página de pago de Kiwify, antes de finalizar tu compra.'],
];
export function KitPage() {
 const [expanded,setExpanded] = useState<{url:string; label:string} | null>(null);
 useEffect(()=> { if(!expanded) return; const previous=document.body.style.overflow; document.body.style.overflow='hidden'; const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(null);}; window.addEventListener('keydown',key); return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);}; },[expanded]);
 return <div className="page">
 <header className="page-header"><div className="container header-inner"><div className="brand"><span className="brand-icon"><BookOpen size={21}/></span>Kit Bíblico Infantil</div><Buy small className="header-cta">¡Quiero mi kit!</Buy></div></header>
 <main>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy"><h1>¡Menos pantallas!<br/><span>Más momentos especiales con Dios</span> en familia.</h1><p className="hero-lead">Convierte una tarde cualquiera en una aventura de fe, aprendizaje y diversión. Con 3 libros ilustrados y 5 juegos bíblicos para imprimir, compartir y disfrutar juntos.</p><p className="highlight">3 LIBROS PRINCIPALES + 5 BONOS INCLUIDOS<br/>Toda la colección por <span className="price-inline">US<p className="highlight">3 LIBROS PRINCIPALES + 5 BONOS INCLUIDOS<br/>Toda la colección por <span className="price-inline">US3 libros bíblicos + 5 bonos<br/>Todo el kit por <span className="price-inline">US$&nbsp;8.90</span> · Pago úniconbsp;8.90</span> · Pago único</p>nbsp;8.90</span> · Pago único</p><div className="purchase"><Buy>¡QUIERO MI KIT COMPLETO!</Buy><p className="micro">PDFs para descargar e imprimir.<br/>El Amor de Dios incluye algunos textos en portugués. Sin envío físico.</p></div></div><div className="hero-visual"><img className="product-image" src={kit.url} alt="Kit Bíblico Infantil: tres libros y cinco bonos" width="1024" height="768" fetchPriority="high"/><span className="digital-label"><FileText size={15}/>Material digital imprimible.</span></div></div></section>
 <section className="section stack-section" id="libros"><div className="container"><div className="section-heading"><span className="eyebrow">TU COLECCIÓN BÍBLICA INFANTIL</span><h2>Tres libros, tres formas de sembrar la fe.</h2><p>Cada libro tiene su propio propósito educativo. Juntos forman una colección para aprender, orar y practicar el amor de Dios.</p></div><div className="stack-grid">{books.map((book,index)=><article className="stack-book" key={book.name}><div className="stack-cover"><img src={book.image.url} alt={`Portada de ${book.name}`} loading="lazy"/><span className="stack-number">LIBRO {index+1}</span></div><div className="stack-info"><h3>{book.name}</h3><p className="stack-pages">{book.pages} páginas · PDF imprimible</p><p>{book.text}</p><div className="stack-value"><span>Valor individual sugerido*</span><strong>{['US$ 9.90','US$ 7.90','US$ 7.90'][index]}</strong></div></div></article>)}</div><div className="stack-total"><div><span>Valor de referencia de los tres libros</span><strong>US$ 25.70</strong></div><span className="stack-plus">+</span><div><span>5 juegos bíblicos adicionales</span><strong>INCLUIDOS</strong></div></div><div className="stack-discount"><div className="premium-spark" aria-hidden="true">✦</div><span className="premium-offer-label">TU KIT BÍBLICO COMPLETO</span><h3>¡8 materiales para aprender, jugar y crecer en la fe!</h3><div className="premium-kit-summary"><span><Check size={17} aria-hidden="true"/> 3 libros ilustrados</span><span><Check size={17} aria-hidden="true"/> 5 bonos bíblicos</span><span><Check size={17} aria-hidden="true"/> PDFs imprimibles</span></div><div className="premium-price-area"><span className="premium-reference">Valor individual sugerido de los libros: <b>US$ 25.70</b></span><span className="premium-today">Llévate la colección completa por solo</span><div className="premium-price"><span>US$</span><strong>8.90</strong></div><span className="premium-once">PAGO ÚNICO · SIN SUSCRIPCIONES</span></div><div className="premium-purchase"><Buy yellow className="premium-buy">¡QUIERO MIS 3 LIBROS + 5 BONOS! →</Buy></div><div className="premium-trust"><span><Check size={15} aria-hidden="true"/> Acceso digital</span><span><Check size={15} aria-hidden="true"/> Listo para imprimir</span><span><Check size={15} aria-hidden="true"/> Compra vía Kiwify</span></div><small>*Los valores individuales son sugeridos, no precios anteriores verificados ni descuentos históricos. Material digital en PDF; no se envían productos físicos.</small></div></div></section>
 <section className="section bg-sky"><div className="container"><div className="section-heading"><h2>Mira lo que podrán hacer.</h2><p>Páginas reales de los libros y ejemplos de los cinco bonos incluidos.</p></div><div className="sample-grid">{samples.map(s=><div key={s.label}><Button variant="ghost" className="sample-button" aria-label={`Ampliar ${s.label}`} onClick={()=>setExpanded({url:s.image.url,label:s.label})}><span className="sample-frame"><img src={s.image.url} alt={s.label} loading="lazy"/></span></Button><p className="sample-caption">{s.caption}</p></div>)}</div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Aprender y compartir puede ser así de sencillo.</h2></div><div className="benefit-grid">{benefits.map(([Icon,title,text])=><article className="item-card" key={title}><span className="icon-tile"><Icon size={24}/></span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="trust-explainer"><div className="trust-icon"><BookOpen size={29}/></div><div><h3>Una colección para usar de verdad, no solo para mirar</h3><p>Descubre las páginas reales antes de comprar. Imprime una actividad, prepara algunos colores y conviertan un momento cotidiano en una oportunidad para aprender y conversar sobre la fe.</p></div></div></div></section>
 <section className="section bg-cream"><div className="container"><div className="section-heading"><h2>Y además, 5 bonos para seguir jugando y aprendiendo.</h2><p>Estos cinco juegos imprimibles están incluidos con tu colección, sin costo adicional.</p></div><div className="bonus-grid">{deliverables.slice(3).map(c=><article className="bonus-card" key={c.name}><div className="bonus-picture"><img src={c.image.url} alt={c.name} loading="lazy"/></div><div className="bonus-body"><h3>{c.name}</h3>{'pages' in c && <p className="book-pages">{c.pages} páginas · PDF imprimible</p>}<p>{c.text}</p></div></article>)}<div className="bonus-end"><div className="purchase"><Buy yellow>¡QUIERO LOS 3 LIBROS Y LOS 5 BONOS!</Buy></div></div></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Elige, imprime y comienza.</h2></div><div className="steps-grid">{steps.map(([title,text],i)=><article className="item-card" key={title}><span className="step-number">{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
 <section className="section offer"><div className="container"><div className="offer-panel"><span className="eyebrow">OFERTA DEL KIT COMPLETO</span><h2>Todo lo que necesitas para aprender y compartir, en una sola compra.</h2><p>3 libros para aprender letras, orar y descubrir el amor de Dios. Además, 5 juegos bíblicos incluidos.</p><img src={kit.url} className="offer-image" alt="Kit Bíblico Infantil con tres libros y cinco bonos" loading="lazy"/><Checks items={deliverables.map(item=>item.name)}/><p className="stack-reference">Valor individual sugerido de los tres libros: US$ 25.70*</p><p className="price">US$ 8.90</p><p className="support">Pago único · 8 materiales digitales: 3 libros + 5 bonos</p><div className="purchase"><Buy>¡QUIERO MI KIT POR US$ 8.90!</Buy></div><p className="micro">Compra procesada por Kiwify.<br/>Material digital para descargar e imprimir. Sin envío físico.<br/>*Valores individuales sugeridos, no descuentos históricos verificados.</p></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>¿Tienes alguna duda?</h2></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><div className="center-cta"><Buy yellow>¡QUIERO EMPEZAR CON MI KIT!</Buy></div></div></section>
 </main><footer className="footer"><strong>Kit Bíblico Infantil — 3 libros bíblicos + 5 bonos.</strong><p>PDFs para descargar e imprimir. El Amor de Dios incluye algunos textos en portugués.</p></footer>
 <aside className="mobile-bar" aria-label="Comprar el kit"><div><p>Kit completo · US$ 8.90</p></div><Buy>¡LO QUIERO!</Buy></aside>
 {expanded && <div className="lightbox" role="dialog" aria-modal="true" aria-label={expanded.label} onClick={()=>setExpanded(null)}><Button autoFocus size="icon" variant="ghost" className="lightbox-close" aria-label="Cerrar imagen" onClick={()=>setExpanded(null)}><X/></Button><img src={expanded.url} alt={expanded.label} onClick={e=>e.stopPropagation()}/></div>}
 </div>;
}
