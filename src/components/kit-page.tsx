import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Pencil, Leaf, Heart, X, FileText, Clock3, Printer, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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


type Market = { country:string; label:string; currency:string; locale:string; language:'es'|'pt'|'en' };
const MARKETS: Market[] = [
 {country:'MX',label:'México',currency:'MXN',locale:'es-MX',language:'es'},
 {country:'CO',label:'Colombia',currency:'COP',locale:'es-CO',language:'es'},
 {country:'CL',label:'Chile',currency:'CLP',locale:'es-CL',language:'es'},
 {country:'PE',label:'Perú',currency:'PEN',locale:'es-PE',language:'es'},
 {country:'AR',label:'Argentina',currency:'ARS',locale:'es-AR',language:'es'},
 {country:'EC',label:'Ecuador',currency:'USD',locale:'es-EC',language:'es'},
 {country:'BO',label:'Bolivia',currency:'BOB',locale:'es-BO',language:'es'},
 {country:'UY',label:'Uruguay',currency:'UYU',locale:'es-UY',language:'es'},
 {country:'PY',label:'Paraguay',currency:'PYG',locale:'es-PY',language:'es'},
 {country:'GT',label:'Guatemala',currency:'GTQ',locale:'es-GT',language:'es'},
 {country:'CR',label:'Costa Rica',currency:'CRC',locale:'es-CR',language:'es'},
 {country:'DO',label:'República Dominicana',currency:'DOP',locale:'es-DO',language:'es'},
 {country:'BR',label:'Brasil',currency:'BRL',locale:'pt-BR',language:'pt'},
 {country:'US',label:'Estados Unidos',currency:'USD',locale:'en-US',language:'en'},
 {country:'ES',label:'España',currency:'EUR',locale:'es-ES',language:'es'},
];
const DEFAULT_MARKET = MARKETS[0];
type LocaleText = { headlineStart:string; headlineEmphasis:string; headlineEnd:string; intro:string; mainBooks:string; bonusGames:string; digitalDownload:string; priceTop:string; location:string; select:string; estimate:string; checkout:string; original:string; buy:string; short:string; only:string; currencyDisclaimer:string };
const LOCALES: Record<Market['language'],LocaleText> = {
 es:{headlineStart:'¡Menos pantallas!',headlineEmphasis:'Más momentos especiales con Dios',headlineEnd:'en familia.',intro:'Convierte una tarde cualquiera en una aventura de fe, aprendizaje y diversión. Con 3 libros ilustrados y 5 juegos bíblicos para imprimir, compartir y disfrutar juntos.',mainBooks:'3 libros ilustrados',bonusGames:'5 juegos incluidos',digitalDownload:'Descarga digital',priceTop:'HOY, LA COLECCIÓN COMPLETA POR',location:'Tu país',select:'Selecciona tu país',estimate:'Precio estimado en tu moneda',checkout:'Ver precio final y pagar',original:'Precio base',buy:'¡QUIERO MI KIT COMPLETO!',short:'Pago único · PDF digital',only:'Todo el kit por solo',currencyDisclaimer:'Conversión de referencia. El importe y la moneda finales los confirma Kiwify antes del pago.'},
 pt:{headlineStart:'Menos telas!',headlineEmphasis:'Mais momentos especiais com Deus',headlineEnd:'em família.',intro:'Transforme uma tarde comum em momentos de fé, aprendizado e diversão. São 3 livros ilustrados e 5 jogos bíblicos para imprimir e aproveitar em família. Os PDFs estão principalmente em espanhol.',mainBooks:'3 livros ilustrados',bonusGames:'5 jogos incluídos',digitalDownload:'Download digital',priceTop:'KIT COMPLETO POR APENAS',location:'Seu país',select:'Selecione seu país',estimate:'Preço estimado na sua moeda',checkout:'Ver preço final e pagar',original:'Preço base',buy:'QUERO MEU KIT COMPLETO!',short:'Pagamento único · PDF digital',only:'Kit completo por apenas',currencyDisclaimer:'Conversão apenas informativa. A Kiwify confirma o valor e a moeda finais antes do pagamento. Os PDFs estão principalmente em espanhol.'},
 en:{headlineStart:'Less screen time!',headlineEmphasis:'More special moments with God',headlineEnd:'as a family.',intro:'Turn an ordinary afternoon into faith-filled fun and learning. Get 3 illustrated books and 5 printable Bible games to enjoy together. PDFs are primarily in Spanish.',mainBooks:'3 illustrated books',bonusGames:'5 bonus games',digitalDownload:'Digital download',priceTop:'THE COMPLETE KIT FOR',location:'Your country',select:'Select your country',estimate:'Estimated price in your currency',checkout:'See final checkout price',original:'Base price',buy:'GET MY COMPLETE KIT!',short:'One-time payment · Digital PDFs',only:'Complete kit for',currencyDisclaimer:'Estimated conversion only. Kiwify confirms the final amount and currency before payment. PDFs are primarily in Spanish.'},
};
function formatMoney(value:number, market:Market) {
 // Show unambiguous ISO currency codes in every market, with no fractional
 // units for high-denomination currencies (including ARS).
 const zeroDecimals=['ARS','CLP','COP','PYG','CRC','UYU'];
 const digits=zeroDecimals.includes(market.currency)?0:2;
 try {
  const amount=new Intl.NumberFormat(market.locale,{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
  return market.currency+' '+amount;
 }catch{return market.currency+' '+value.toFixed(digits);}
}
function useLocalPricing() {
 const [market,setMarket] = useState<Market>(DEFAULT_MARKET);
 const [rate,setRate] = useState<number|null>(null);
 useEffect(()=>{
  let active=true;
  // Manual selection is only retained for this tab session; old persistent choices
  // must not override a visitor's actual country on subsequent visits.
  const manual=window.sessionStorage.getItem('kit-market-manual');
  const selected=MARKETS.find(m=>m.country===manual);
  if(selected){setMarket(selected);return()=>{active=false};}
  window.localStorage.removeItem('kit-market');
  const browserLang=navigator.language?.toLowerCase()||'';
  const inferred=MARKETS.find(m=>browserLang.endsWith('-'+m.country.toLowerCase()));
  if(inferred)setMarket(inferred);
  const detect=async()=>{
   // Independent public geo services; avoid dependence on a single provider.
   for(const url of ['https://ipwho.is/','https://ipapi.co/json/']){
    try{
     const response=await fetch(url,{signal:AbortSignal.timeout(4500),cache:'no-store'});
     if(!response.ok)continue;
     const data=await response.json();
     const country=String(data?.country_code||data?.country||'').toUpperCase();
     const found=MARKETS.find(m=>m.country===country);
     if(active&&found&&!window.sessionStorage.getItem('kit-market-manual')){setMarket(found);return;}
    }catch{/* retry with next provider */}
   }
  };
  void detect();
  return()=>{active=false};
 },[]);
 useEffect(()=>{
  let active=true;setRate(null);
  if(market.currency==='USD'){setRate(1);return;}
  fetch('https://open.er-api.com/v6/latest/USD',{signal:AbortSignal.timeout(6000)})
   .then(r=>r.ok?r.json():null).then(data=>{const n=Number(data?.rates?.[market.currency]);if(active&&data?.result==='success'&&Number.isFinite(n)&&n>0)setRate(n);}).catch(()=>{});
  return()=>{active=false};
 },[market.currency]);
 const choose=(code:string)=>{const next=MARKETS.find(m=>m.country===code);if(next){setMarket(next);window.sessionStorage.setItem('kit-market-manual',code);}};
 const locale=LOCALES[market.language];
 const price=(usd:number)=>market.currency==='USD'?'USD '+usd.toFixed(2):rate?formatMoney(usd*rate,market):'USD '+usd.toFixed(2);
 const converted=market.currency==='USD'||rate!==null;
 return {market,choose,locale,price,converted};
}
function MarketSwitcher({market,choose,locale}:{market:Market;choose:(code:string)=>void;locale:LocaleText}) {
 return <div className="market-switcher"><label htmlFor="kit-market">{locale.location}</label><select id="kit-market" value={market.country} onChange={e=>choose(e.target.value)} aria-label={locale.select}>{MARKETS.map(m=><option value={m.country} key={m.country}>{m.label} · {m.currency}</option>)}</select></div>;
}
function LocalPrice({usd,price}:{usd:number;price:(usd:number)=>string}){return <>{price(usd)}</>;}

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
 ['¿Es un pago único?','Sí. El precio base es US$ 7.90, sin mensualidad. La moneda y el importe final se muestran en Kiwify antes de pagar.'],
 ['¿En qué idioma están los materiales?','Los libros están principalmente en español. El Amor de Dios incluye algunos versículos, instrucciones y respuestas en portugués. Las muestras muestran el contenido tal como aparece en los PDFs.'],
 ['¿Puedo usarlo con grupos?','Consulta las condiciones de uso del producto para conocer los permisos de impresión y utilización con grupos o instituciones.'],
 ['¿Dónde consulto las condiciones de reembolso?','En la página de pago de Kiwify, antes de finalizar tu compra.'],
];
export function KitPage() {
 const {market,choose,locale,price,converted}=useLocalPricing();
 const [expanded,setExpanded] = useState<{url:string; label:string} | null>(null);
 const sampleTrack = useRef<HTMLDivElement>(null);
 const [sampleIndex,setSampleIndex] = useState(0);
 const moveSample = (direction: number) => { const el=sampleTrack.current; if(!el)return; const step=el.querySelector<HTMLElement>('.sample-slide'); if(!step)return; el.scrollBy({left:direction*(step.getBoundingClientRect().width+16),behavior:'smooth'}); };
 const syncSample = () => { const el=sampleTrack.current; const first=el?.querySelector<HTMLElement>('.sample-slide'); if(!el||!first)return;setSampleIndex(Math.max(0,Math.min(samples.length-1,Math.round(el.scrollLeft/(first.getBoundingClientRect().width+16))))); };
 useEffect(()=> { if(!expanded) return; const previous=document.body.style.overflow; document.body.style.overflow='hidden'; const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(null);}; window.addEventListener('keydown',key); return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);}; },[expanded]);
 return <div className="page">
 <header className="page-header"><div className="container header-inner"><div className="brand"><span className="brand-icon"><BookOpen size={21}/></span>Kit Bíblico Infantil</div><MarketSwitcher market={market} choose={choose} locale={locale}/><Buy small className="header-cta">¡Quiero mi kit!</Buy></div></header>
 <main>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={17} aria-hidden="true"/> ACTIVIDADES BÍBLICAS PARA NIÑOS DE 3 A 10 AÑOS</span><h1>{locale.headlineStart}<br/><span>{locale.headlineEmphasis}</span> {locale.headlineEnd}</h1><div className="mobile-hero-mockup"><img src={kit.url} alt="Colección Kit Bíblico Infantil: 3 libros y 5 bonos" width="1024" height="768" fetchPriority="high"/></div><p className="hero-lead">{locale.intro}</p><div className="hero-proof"><span><BookOpen size={17}/> {locale.mainBooks}</span><span><Check size={17}/> {locale.bonusGames}</span><span><Printer size={17}/> {locale.digitalDownload}</span></div><div className="hero-price"><span>{locale.priceTop}</span><strong><LocalPrice usd={7.90} price={price}/></strong><small>{locale.short}</small></div><div className="purchase"><Buy yellow>{locale.buy} →</Buy><p className="micro currency-disclaimer">{locale.currencyDisclaimer}</p><p className="micro">Acceso digital después de la confirmación del pago. PDFs para descargar e imprimir.<br/>El Amor de Dios incluye algunos textos en portugués. Sin envío físico.</p></div></div><div className="hero-visual"><img className="product-image" src={kit.url} alt="Kit Bíblico Infantil: tres libros y cinco bonos" width="1024" height="768" fetchPriority="high"/><span className="digital-label"><FileText size={15}/>8 materiales digitales para descargar e imprimir</span></div></div></section>
 <section className="quick-benefits"><div className="container quick-benefits-grid"><div><Clock3/><strong>Una tarde diferente</strong><span>Una actividad para compartir sin pantallas</span></div><div><Pencil/><strong>Aprender jugando</strong><span>Letras, creatividad y valores bíblicos</span></div><div><ShieldCheck/><strong>Compra clara</strong><span>Pago único y archivos digitales imprimibles</span></div></div></section>
 <section className="section stack-section" id="libros"><div className="container"><div className="section-heading"><span className="eyebrow">TU COLECCIÓN BÍBLICA INFANTIL</span><h2>Tres libros, tres formas de sembrar la fe.</h2><p>Cada libro tiene su propio propósito educativo. Juntos forman una colección para aprender, orar y practicar el amor de Dios.</p></div><div className="stack-grid">{books.map((book,index)=><article className="stack-book" key={book.name}><div className="stack-cover"><img src={book.image.url} alt={`Portada de ${book.name}`} loading="lazy"/><span className="stack-number">LIBRO {index+1}</span></div><div className="stack-info"><h3>{book.name}</h3><p className="stack-pages">{book.pages} páginas · PDF imprimible</p><p>{book.text}</p><div className="stack-value"><span>Valor individual sugerido*</span><strong><LocalPrice usd={[5.90,4.90,4.90][index]} price={price}/></strong></div></div></article>)}</div><div className="stack-total"><div><span>Valor de referencia de los tres libros</span><strong><LocalPrice usd={15.70} price={price}/></strong></div><span className="stack-plus">+</span><div><span>5 juegos bíblicos adicionales</span><strong>INCLUIDOS</strong></div></div><div className="stack-discount"><div className="premium-spark" aria-hidden="true">✦</div><span className="premium-offer-label">TU KIT BÍBLICO COMPLETO</span><h3>¡8 materiales para aprender, jugar y crecer en la fe!</h3><div className="premium-kit-summary"><span><Check size={17} aria-hidden="true"/> 3 libros ilustrados</span><span><Check size={17} aria-hidden="true"/> 5 bonos bíblicos</span><span><Check size={17} aria-hidden="true"/> PDFs imprimibles</span></div><div className="premium-price-area"><span className="premium-reference">Valor individual sugerido de los libros: <b><LocalPrice usd={15.70} price={price}/></b></span><span className="premium-today">Llévate la colección completa por solo</span><div className="premium-price localized-price"><strong><LocalPrice usd={7.90} price={price}/></strong></div><span className="premium-once">PAGO ÚNICO · SIN SUSCRIPCIONES</span></div><div className="premium-purchase"><Buy yellow className="premium-buy">¡QUIERO MIS 3 LIBROS + 5 BONOS! →</Buy></div><p className="currency-disclaimer">{locale.currencyDisclaimer}</p><div className="premium-trust"><span><Check size={15} aria-hidden="true"/> Acceso digital</span><span><Check size={15} aria-hidden="true"/> Listo para imprimir</span><span><Check size={15} aria-hidden="true"/> Compra vía Kiwify</span></div><small>*Los valores individuales son sugeridos, no precios anteriores verificados ni descuentos históricos. Material digital en PDF; no se envían productos físicos.</small></div></div></section>
 <section className="section bg-sky"><div className="container"><div className="section-heading"><h2>Mira lo que podrán hacer.</h2><p>Amplía cada imagen para ver ejemplos concretos antes de decidir. El contenido se entrega en PDF imprimible.</p></div><div className="sample-carousel-controls"><span className="sample-counter">{sampleIndex+1} / {samples.length} · Desliza para explorar</span><div className="sample-arrows"><button type="button" onClick={()=>moveSample(-1)} disabled={sampleIndex===0} aria-label="Imagen anterior"><ChevronLeft size={22}/></button><button type="button" onClick={()=>moveSample(1)} disabled={sampleIndex===samples.length-1} aria-label="Imagen siguiente"><ChevronRight size={22}/></button></div></div><div className="sample-grid sample-carousel" ref={sampleTrack} onScroll={syncSample} role="region" aria-label="Galería de páginas de muestra">{samples.map((s,i)=><div className="sample-slide" key={s.label}><Button variant="ghost" className="sample-button" aria-label={`Ampliar ${s.label}`} onClick={()=>setExpanded({url:s.image.url,label:s.label})}><span className="sample-frame"><img src={s.image.url} alt={s.label} loading="lazy"/></span></Button><p className="sample-slide-title">{s.label}</p><p className="sample-caption">{s.caption}</p></div>)}</div><div className="sample-hint">Toca una página para verla en grande</div></div></section>
 <section className="section testimonials-section" aria-labelledby="testimonials-heading"><div className="container"><div className="section-heading"><span className="eyebrow">EXPERIENCIAS COMPARTIDAS</span><h2 id="testimonials-heading">Familias que ya lo están disfrutando</h2><p>Así cuentan algunas familias cómo están usando las actividades bíblicas en casa.</p></div><div className="testimonials-track" role="region" aria-label="Experiencias de familias">
 <article className="testimonial-card"><div className="testimonial-top"><span className="testimonial-initial">AC</span><div><strong>Ana Carmen</strong><small>Experiencia compartida por mensaje</small></div><Heart size={19} aria-hidden="true"/></div><blockquote>“Hoy hicimos las primeras letras y mi peque se quedó coloreando los personajes. Me gustó poder contarle una historia de la Biblia mientras hacíamos algo juntos.”</blockquote><p className="testimonial-context">Actividades de letras y momentos de fe en familia.</p></article>
 <article className="testimonial-card"><div className="testimonial-top"><span className="testimonial-initial">LF</span><div><strong>Lucía Fernández</strong><small>Experiencia compartida por mensaje</small></div><Heart size={19} aria-hidden="true"/></div><blockquote>“Imprimí unas hojas para hacerlas con mi hija esta tarde. Le gustó elegir los colores y repasar las letras. Yo aproveché para hablarle de los personajes de la Biblia.”</blockquote><p className="testimonial-context">Aprendizaje en casa con material para imprimir.</p></article>
 <article className="testimonial-card"><div className="testimonial-top"><span className="testimonial-initial">MR</span><div><strong>Marta Rodríguez</strong><small>Experiencia compartida por mensaje</small></div><Heart size={19} aria-hidden="true"/></div><blockquote>“Lo imprimí y jugamos después de merendar. Hasta su papá se unió. Entre las letras para practicar y los juegos, tenemos varias ideas para hacer juntos en casa.”</blockquote><p className="testimonial-context">Actividades para compartir después de la merienda.</p></article>
 </div><div className="testimonials-bottom"><p>Las experiencias son personales y los resultados pueden variar según la edad y el acompañamiento de cada niño.</p><h3>Tú también puedes compartir momentos así en casa.</h3><Buy yellow>¡QUIERO MI KIT BÍBLICO! →</Buy></div></div></section>
 <section className="section routine-section"><div className="container"><div className="section-heading"><span className="eyebrow">IDEAS PARA USAR TU KIT</span><h2>¿Qué pueden hacer juntos esta semana?</h2><p>Sin complicaciones: elige una propuesta que se adapte a su edad y tiempo disponible.</p></div><div className="routine-grid"><article><span>01</span><h3>Una tarde en casa</h3><p>Imprime una letra del Alfabeto Bíblico, prepara colores y descubran su historia.</p></article><article><span>02</span><h3>Un momento de oración</h3><p>Elijan una actividad de Aprendiendo a Orar para conversar y agradecer juntos.</p></article><article><span>03</span><h3>Un juego de fin de semana</h3><p>Disfruten del bingo, las mímicas o el dominó bíblico con la familia.</p></article></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Aprender y compartir puede ser así de sencillo.</h2></div><div className="benefit-grid">{benefits.map(([Icon,title,text])=><article className="item-card" key={title}><span className="icon-tile"><Icon size={24}/></span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="trust-explainer"><div className="trust-icon"><BookOpen size={29}/></div><div><h3>Una colección para usar de verdad, no solo para mirar</h3><p>Descubre las páginas reales antes de comprar. Imprime una actividad, prepara algunos colores y conviertan un momento cotidiano en una oportunidad para aprender y conversar sobre la fe.</p></div></div></div></section>
 <section className="section bg-cream"><div className="container"><div className="section-heading"><h2>Y además, 5 bonos para seguir jugando y aprendiendo.</h2><p>Estos cinco juegos imprimibles están incluidos con tu colección, sin costo adicional.</p></div><div className="bonus-grid">{deliverables.slice(3).map(c=><article className="bonus-card" key={c.name}><div className="bonus-picture"><img src={c.image.url} alt={c.name} loading="lazy"/></div><div className="bonus-body"><h3>{c.name}</h3>{'pages' in c && <p className="book-pages">{c.pages} páginas · PDF imprimible</p>}<p>{c.text}</p></div></article>)}<div className="bonus-end"><div className="purchase"><Buy yellow>¡QUIERO LOS 3 LIBROS Y LOS 5 BONOS!</Buy></div></div></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Elige, imprime y comienza.</h2></div><div className="steps-grid">{steps.map(([title,text],i)=><article className="item-card" key={title}><span className="step-number">{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="steps-assurance"><div className="steps-assurance-icon"><Heart size={25} aria-hidden="true"/></div><div><strong>Un kit, muchas tardes para compartir</strong><p>Recibirás 3 libros ilustrados y 5 juegos bíblicos digitales. Elige una actividad según su edad, imprímela cuando quieras y disfruten aprendiendo juntos.</p></div><div className="steps-assurance-tags"><span><Check size={15}/> 8 materiales</span><span><Check size={15}/> Pago único</span><span><Check size={15}/> Para imprimir</span></div></div></div></section>
 <section className="section offer final-offer" id="oferta"><div className="container"><div className="offer-panel final-offer-panel"><div className="final-offer-top"><span className="final-offer-badge">✦ TU PRÓXIMO MOMENTO EN FAMILIA EMPIEZA AQUÍ</span><h2>Que la próxima tarde juntos<br/><span>sea una aventura de fe.</span></h2><p>Elige una actividad hoy. Comparte un recuerdo que dure mucho más.</p></div><div className="final-offer-grid"><div className="final-offer-content"><div className="final-offer-visual"><img src={kit.url} className="offer-image" alt="Kit Bíblico Infantil con tres libros y cinco bonos" loading="lazy"/><span className="final-bonus-tag">3 LIBROS + 5 BONOS INCLUIDOS</span></div><Checks className="final-inventory" items={deliverables.map(item=>item.name)}/></div><div className="final-offer-checkout"><span className="final-start-label">APROVECHA EL KIT Y EMPIEZA HOY</span><h3>Todo listo para imprimir.<br/>Todo para compartir.</h3><p className="final-reference">Valor individual sugerido de los 3 libros: <strong><LocalPrice usd={15.70} price={price}/>*</strong></p><div className="final-price-box"><span>La colección completa por solo</span><div className="final-price localized-price"><strong><LocalPrice usd={7.90} price={price}/></strong></div><span className="final-payment">UN SOLO PAGO · SIN MENSUALIDADES</span></div><div className="final-reason"><span aria-hidden="true">☀</span><p><strong>No dejes otro momento para después.</strong>Prepara los colores y elige la primera actividad para compartir con tu pequeño.</p></div><Buy yellow className="final-buy">¡SÍ, QUIERO EMPEZAR CON MI KIT! →</Buy><p className="currency-disclaimer">{locale.currencyDisclaimer}</p><div className="final-trust"><span><Check size={14}/> 8 materiales digitales</span><span><Check size={14}/> Compra vía Kiwify</span><span><Check size={14}/> Descarga tras confirmar el pago</span></div><p className="final-fine">PDFs para descargar e imprimir. No se envían productos físicos. El Amor de Dios incluye algunos textos en portugués.</p></div></div><p className="final-value-note">*Valores individuales sugeridos; no son precios anteriores ni descuentos históricos verificados.</p></div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">COMPRA CON INFORMACIÓN CLARA</span><h2>¿Tienes alguna duda?</h2></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div><div className="center-cta"><Buy yellow>¡QUIERO EMPEZAR CON MI KIT!</Buy></div></div></section>
 </main><footer className="footer"><strong>Kit Bíblico Infantil — 3 libros bíblicos + 5 bonos.</strong><p>PDFs para descargar e imprimir. El Amor de Dios incluye algunos textos en portugués.</p></footer>
 <aside className="mobile-bar" aria-label="Comprar el kit"><div><p>Kit completo · <LocalPrice usd={7.90} price={price}/></p></div><Buy>¡LO QUIERO!</Buy></aside>
 {expanded && <div className="lightbox" role="dialog" aria-modal="true" aria-label={expanded.label} onClick={()=>setExpanded(null)}><Button autoFocus size="icon" variant="ghost" className="lightbox-close" aria-label="Cerrar imagen" onClick={()=>setExpanded(null)}><X/></Button><img src={expanded.url} alt={expanded.label} onClick={e=>e.stopPropagation()}/></div>}
 </div>;
}
