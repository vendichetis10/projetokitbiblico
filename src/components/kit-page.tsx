import { useEffect, useState } from 'react';
import { BookOpen, Check, X, FileText, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kit from '@/assets/kit-biblico-5-bonos.png.asset.json';
import pa from '@/assets/alfabeto-a.jpg.asset.json';
import childActivity from '@/assets/adan-actividad-en-casa.webp.asset.json';
import alphabetDemo from '@/assets/alfabeto-biblico-loop-4s.mp4.asset.json';
import prayerSample from '@/assets/orar-sample.jpg.asset.json';
import loveSample from '@/assets/amor-sample.jpg.asset.json';
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
 es:{headlineStart:'¡Menos pantallas!',headlineEmphasis:'Letras, colores y fe',headlineEnd:'en familia.',intro:'Actividades bíblicas para practicar letras, colorear y jugar juntos. 3 libros y 5 juegos en PDF, en español.',mainBooks:'3 libros ilustrados',bonusGames:'5 juegos incluidos',digitalDownload:'Descarga digital',priceTop:'HOY, LA COLECCIÓN COMPLETA POR',location:'Tu país',select:'Selecciona tu país',estimate:'Precio estimado en tu moneda',checkout:'Ver precio final y pagar',original:'Precio base',buy:'¡QUIERO MI KIT COMPLETO!',short:'Pago único · PDF digital',only:'Todo el kit por solo',currencyDisclaimer:'Conversión de referencia. El importe y la moneda finales los confirma Kiwify antes del pago.'},
 pt:{headlineStart:'Menos telas!',headlineEmphasis:'Letras, cores e fé',headlineEnd:'em família.',intro:'Atividades bíblicas para praticar letras, colorir e brincar juntos. 3 livros e 5 jogos em PDF, em espanhol.',mainBooks:'3 livros ilustrados',bonusGames:'5 jogos incluídos',digitalDownload:'Download digital',priceTop:'KIT COMPLETO POR APENAS',location:'Seu país',select:'Selecione seu país',estimate:'Preço estimado na sua moeda',checkout:'Ver preço final e pagar',original:'Preço base',buy:'QUERO MEU KIT COMPLETO!',short:'Pagamento único · PDF digital',only:'Kit completo por apenas',currencyDisclaimer:'Conversão apenas informativa. A Kiwify confirma o valor e a moeda finais antes do pagamento. Os PDFs estão principalmente em espanhol.'},
 en:{headlineStart:'Less screen time!',headlineEmphasis:'Letters, colors and faith',headlineEnd:'as a family.',intro:'Bible activities to practice letters, color and play together. 3 books and 5 printable games. PDFs in Spanish.',mainBooks:'3 illustrated books',bonusGames:'5 bonus games',digitalDownload:'Digital download',priceTop:'THE COMPLETE KIT FOR',location:'Your country',select:'Select your country',estimate:'Estimated price in your currency',checkout:'See final checkout price',original:'Base price',buy:'GET MY COMPLETE KIT!',short:'One-time payment · Digital PDFs',only:'Complete kit for',currencyDisclaimer:'Estimated conversion only. Kiwify confirms the final amount and currency before payment. PDFs are primarily in Spanish.'},
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
const activitySamples = [
 {image:childActivity, label:'Practicar letras y colorear', detail:'Letra A — Adán · Alfabeto Bíblico'},
 {image:prayerSample, label:'Descubrir la oración', detail:'Mi oración para Dios · Aprendiendo a Orar'},
 {image:loveSample, label:'Aprender sobre el amor de Dios', detail:'Actitudes correctas · El Amor de Dios'},
];
const bookExamples = [pa, prayerSample, loveSample];
const bookSummaries = [
 '26 letras de la A a la Z: personajes bíblicos, trazado y dibujos para colorear.',
 'Padre Nuestro, pedidos y agradecimientos, actividades de oración y pasatiempos.',
 'Amor, perdón, gratitud y amistad: colorear, completar y elegir actitudes.',
];
const steps = [
 ['Compra el kit','Realiza un único pago e introduce el correo electrónico donde quieres recibir el acceso.'],
 ['Revisa tu correo y descarga','Cuando se confirme el pago, busca el correo de Kiwify y abre el enlace de acceso al producto para descargar tus PDFs.'],
 ['Imprime lo que quieras usar','En casa o en una imprenta, a color o en blanco y negro. Elige solo las hojas de ese día.'],
];
const faqs = [
 ['¿El kit es físico o digital?','Es digital. Incluye 3 libros y 5 bonos en PDF para descargar e imprimir. La impresión no está incluida. '],
 ['¿Para qué edades está recomendado?','Alfabeto Bíblico indica de 3 a 10 años en su portada; Aprendiendo a Orar, de 4 a 10 años. Elige las actividades según la etapa del niño y acompáñalo en la lectura y la escritura.'],
 ['¿Cómo recibo los materiales?','Cuando se confirme el pago, revisa el correo electrónico que usaste en la compra. Busca el mensaje de Kiwify y abre el enlace de acceso al producto para descargar los PDFs. Si no lo encuentras, revisa Spam o Promociones. Puedes consultar el contacto de soporte del vendedor en el correo de confirmación de la compra.'],
 ['¿Necesito una impresora?','Puedes imprimir en casa o en un servicio de impresión. Algunas actividades también requieren colores, tijeras u otros materiales básicos.'],
 ['¿Gasta mucha tinta?','No, las actividades están diseñadas para funcionar perfectamente tanto a color como en blanco y negro, e imprimes solo las hojas que quieras hacer ese día.'],
 ['¿Es un pago único?','Sí. El precio base es US$ 7.90, sin mensualidad. La moneda y el importe final se muestran en Kiwify antes de pagar.'],
 ['¿En qué idioma están los materiales?','Los 3 libros y los 5 bonos están preparados en español para familias de Latinoamérica. Puedes ver ejemplos de las actividades antes de comprar.'],
 ['¿Puedo usarlo con grupos?','Consulta las condiciones de uso del producto para conocer los permisos de impresión y utilización con grupos o instituciones.'],
 ['¿Cómo funciona la garantía de 7 días?','Tienes una garantía incondicional de 7 días. Si el material no cumple tus expectativas, te devolvemos el 100% de tu dinero sin preguntas. Solicita el reembolso siguiendo las instrucciones de tu compra en Kiwify.'],
];
export function KitPage() {
 const {market,choose,locale,price}=useLocalPricing();
 const [activeActivity,setActiveActivity] = useState(0);
 const [expanded,setExpanded] = useState<{url:string; label:string} | null>(null);
 useEffect(()=> { if(!expanded) return; const previous=document.body.style.overflow; document.body.style.overflow='hidden'; const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(null);}; window.addEventListener('keydown',key); return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);}; },[expanded]);
 return <div className="page conversion-page">
 <header className="page-header"><div className="container header-inner"><div className="brand"><span className="brand-icon"><BookOpen size={21}/></span>Kit Bíblico Infantil</div><div hidden><MarketSwitcher market={market} choose={choose} locale={locale}/></div></div></header>
 <main>
 <section className="hero" aria-labelledby="kit-heading"><div className="container hero-grid"><div className="hero-copy">
 <span className="hero-kicker"><Sparkles size={15} aria-hidden="true"/> ACTIVIDADES BÍBLICAS · 3 A 10 AÑOS</span>
 <h1 id="kit-heading">{locale.headlineStart}<br/><span>{locale.headlineEmphasis}</span> {locale.headlineEnd}</h1>
 <p className="hero-lead">{locale.intro}</p>
 <div className="mobile-hero-mockup"><p className="format-label"><FileText size={15} aria-hidden="true"/> PDF digital para descargar e imprimir</p><img src={kit.url} alt="Kit digital: tres libros y cinco juegos para imprimir" width="1448" height="1086" fetchPriority="high"/></div>
 <div className="hero-proof"><span>3 libros ilustrados</span><span>5 juegos incluidos</span><span>En español</span></div>
 <div className="hero-discovery"><Button asChild className="cta cta-yellow"><a href="#oferta">{market.language==='pt'?'CONHECER O KIT COMPLETO':market.language==='en'?'EXPLORE THE COMPLETE KIT':'CONOCE EL KIT COMPLETO'} <span aria-hidden="true">↓</span></a></Button><p className="hero-discovery-note">PDFs en español · Descarga e imprime a tu ritmo</p><div className="purchase-assurance"><span><ShieldCheck size={16} aria-hidden="true"/> Garantía de 7 días · 100% de devolución</span></div></div>
 </div><div className="hero-visual"><p className="format-label"><FileText size={17} aria-hidden="true"/> PDF digital para descargar e imprimir</p><img className="product-image" src={kit.url} alt="Colección digital de tres libros y cinco juegos bíblicos" width="1448" height="1086" fetchPriority="high"/><span className="digital-label">8 materiales digitales · No se envían libros físicos</span></div></div></section>

 <section className="section activity-section" id="actividades" aria-labelledby="activity-heading"><div className="container"><div className="section-heading"><span className="eyebrow">ASÍ SON LOS MATERIALES POR DENTRO</span><h2 id="activity-heading">Elige una hoja. Preparen los colores. Empiecen juntos.</h2><p>Explora las actividades y mira el Alfabeto Bíblico en movimiento. Toca las imágenes para ampliarlas.</p></div><div className="activity-grid" id="activity-samples">{activitySamples.map((sample,index)=><article className="activity-card" data-active={index===activeActivity} key={sample.label}><button type="button" className="activity-preview" aria-label={`Ampliar ${sample.detail}`} onClick={()=>setExpanded({url:sample.image.url,label:sample.detail})}><img src={sample.image.url} alt={sample.detail} loading="lazy"/><span>Ampliar actividad</span></button><div><span className="activity-number">0{index+1}</span><h3>{sample.label}</h3><p>{sample.detail}</p></div></article>)}</div><nav className="activity-navigation" aria-label="Elegir una actividad de muestra"><button type="button" aria-controls="activity-samples" disabled={activeActivity===0} onClick={()=>setActiveActivity(index=>Math.max(0,index-1))}>← Anterior</button><span role="status" aria-live="polite" aria-atomic="true">{activeActivity+1} de {activitySamples.length}</span><button type="button" aria-controls="activity-samples" disabled={activeActivity===activitySamples.length-1} onClick={()=>setActiveActivity(index=>Math.min(activitySamples.length-1,index+1))}>Siguiente →</button></nav><div className="inline-book-demo" aria-labelledby="inline-demo-heading"><div className="inline-demo-copy"><span className="eyebrow">UNA MIRADA AL INTERIOR</span><h3 id="inline-demo-heading">Mira el Alfabeto Bíblico por dentro.</h3><p>Páginas para descubrir personajes bíblicos, practicar letras y colorear.</p><span className="inline-demo-note">Vista previa de 4 segundos · Sin sonido</span></div><video className="inline-demo-video" src={alphabetDemo.url} poster={pa.url} autoPlay muted loop playsInline controls preload="auto" width="480" height="1076" aria-label="Vista previa automática del Alfabeto Bíblico, sin sonido">Tu navegador no admite video. <a href={alphabetDemo.url}>Ver la muestra del Alfabeto Bíblico</a></video></div></div></section>

 <section className="section stack-section" id="libros" aria-labelledby="books-heading"><div className="container"><div className="section-heading"><span className="eyebrow">LOS 3 LIBROS DEL KIT</span><h2 id="books-heading">Tres libros para aprender, orar y compartir en familia.</h2><p>69 páginas entre los tres libros, además de los cinco juegos y actividades adicionales.</p></div><div className="stack-grid">{books.map((book,index)=><article className="stack-book" key={book.name}><div className="stack-cover"><img src={book.image.url} alt={`Portada de ${book.name}`} loading="lazy"/></div><div className="stack-info"><span className="stack-pages">{book.pages} páginas · PDF imprimible</span><h3>{book.name}</h3><p>{bookSummaries[index]}</p><div className="book-value"><span>Valor individual sugerido*</span><strong><LocalPrice usd={book.suggestedValue} price={price}/></strong><small>Incluido en tu kit</small></div><button type="button" className="text-preview" onClick={()=>setExpanded({url:bookExamples[index].url,label:`Actividad de ${book.name}`})}>Ver una actividad <span aria-hidden="true">↗</span></button></div></article>)}</div><p className="book-value-note">*Valores individuales sugeridos como referencia; no son precios anteriores ni descuentos históricos verificados.</p></div></section>

 <section className="section compact-bonuses bg-cream" id="bonos" aria-labelledby="bonuses-heading"><div className="container"><div className="section-heading"><span className="eyebrow">INCLUIDOS CON TU COLECCIÓN</span><h2 id="bonuses-heading">5 bonos para seguir jugando.</h2><p>Cartones, fichas, retos y actividades para compartir. Toca las portadas para ampliarlas.</p></div><div className="bonus-grid">{deliverables.slice(3).map(bonus=><article className="bonus-card" key={bonus.name}><button type="button" className="bonus-preview" aria-label={`Ampliar portada de ${bonus.name}`} onClick={()=>setExpanded({url:bonus.image.url,label:`Portada de ${bonus.name}`})}><img src={bonus.image.url} alt={`Portada de ${bonus.name}`} loading="lazy"/><span>Ampliar portada</span></button><div className="bonus-body"><h3>{bonus.name}</h3><p>{bonus.text}</p></div></article>)}</div></div></section>

 <section className="section receiving-section" id="como-recibes" aria-labelledby="receiving-heading"><div className="container"><div className="section-heading"><h2 id="receiving-heading">Compra una vez. Descarga. Imprime a tu ritmo.</h2><p>Material digital en español. La impresión y los materiales de papelería no están incluidos.</p></div><div className="steps-grid">{steps.map(([title,text],index)=><article className="item-card" key={title}><span className="step-number">{index+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="print-note"><Printer size={18} aria-hidden="true"/> No necesitas imprimir todo: prepara solo la actividad que van a usar.</p></div></section>

 <section className="section guarantee-section" aria-labelledby="guarantee-heading"><div className="container"><div className="guarantee-panel"><div className="guarantee-seal" aria-label="Garantía de 7 días"><ShieldCheck size={38} aria-hidden="true"/><strong>7 DÍAS</strong><span>DE GARANTÍA</span></div><div className="guarantee-copy"><span className="eyebrow">COMPRA CON TRANQUILIDAD</span><h2 id="guarantee-heading">Garantía incondicional de 7 días.</h2><p>Si el material no cumple tus expectativas, te devolvemos el <strong>100% de tu dinero sin preguntas</strong>.</p><p className="guarantee-help">Solicita el reembolso siguiendo las instrucciones de tu compra en Kiwify.</p></div></div></div></section>

 <section className="section offer final-offer" id="oferta" aria-labelledby="offer-heading"><div className="container"><div className="offer-panel final-offer-panel"><div className="final-offer-top"><span className="final-offer-badge"><Sparkles size={15} aria-hidden="true"/> OFERTA DEL KIT COMPLETO</span><h2 id="offer-heading">3 libros + 5 juegos.<br/><span>Una nueva actividad para compartir.</span></h2></div><div className="final-offer-grid"><div className="final-offer-content"><div className="final-offer-visual"><img src={kit.url} className="offer-image" alt="Kit digital con tres libros y cinco bonos para imprimir" width="1448" height="1086" loading="lazy"/></div><Checks className="final-inventory" items={deliverables.map(item=>item.name)}/></div><div className="final-offer-checkout"><p className="format-label">PDF digital para descargar e imprimir</p><div className="final-reference"><span>Valor individual sugerido de los 3 libros:</span><strong><LocalPrice usd={15.70} price={price}/><sup>*</sup></strong></div><div className="final-price-box"><span className="offer-condition">Pero solo en esta oferta</span><span className="offer-complete-label">La colección completa por solo</span><div className="final-price localized-price"><strong><LocalPrice usd={7.90} price={price}/></strong></div><span className="final-payment">UN SOLO PAGO · SIN MENSUALIDADES</span></div><Buy yellow className="final-buy">¡QUIERO MI KIT DIGITAL COMPLETO! →</Buy><div className="purchase-assurance"><span><ShieldCheck size={16} aria-hidden="true"/> Garantía de 7 días · 100% de devolución</span><span><FileText size={16} aria-hidden="true"/> Descarga tras confirmar el pago</span></div><p className="final-fine">PDFs en español. Imprime en casa o en una imprenta.<br/>No se envían productos físicos.</p><p className="currency-disclaimer">{LOCALES.es.currencyDisclaimer}</p></div></div><p className="final-value-note">*Valores individuales sugeridos; no son precios anteriores ni descuentos históricos verificados.</p></div></div></section>

 <section className="section faq-section" aria-labelledby="faq-heading"><div className="container"><div className="section-heading"><h2 id="faq-heading">¿Tienes alguna duda?</h2></div><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><div className="center-cta"><Buy yellow>¡QUIERO EMPEZAR CON MI KIT!</Buy></div></div></section>
 </main><footer className="footer"><strong>Kit Bíblico Infantil — 3 libros + 5 juegos.</strong><p>PDFs en español para descargar e imprimir.</p></footer>

 {expanded && <div className="lightbox" role="dialog" aria-modal="true" aria-label={expanded.label} onClick={()=>setExpanded(null)}><Button autoFocus size="icon" variant="ghost" className="lightbox-close" aria-label="Cerrar imagen" onClick={()=>setExpanded(null)}><X/></Button><img src={expanded.url} alt={expanded.label} onClick={event=>event.stopPropagation()}/></div>}
 </div>;
}
