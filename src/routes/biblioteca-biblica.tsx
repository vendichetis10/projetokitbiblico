import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Heart, Search, X, ArrowLeft, Download, Printer, Sparkles, Grid2X2, CheckCircle2, Clock3, ShieldCheck, Menu } from 'lucide-react';
import { books, bonuses } from '@/lib/kit-deliverables';
import kit from '@/assets/kit-biblico-5-bonos.webp.asset.json';
import './biblioteca-biblica.css';

type Material = { id: string; name: string; text: string; image: { url: string }; type: 'libro' | 'juego'; pages?: number };
const materials: Material[] = [
 ...books.map((b,i)=>({id:'libro-'+i,name:b.name,text:b.text,image:b.image,type:'libro' as const,pages:b.pages})),
 ...bonuses.map((b,i)=>({id:'juego-'+i,name:b.name,text:b.text,image:b.image,type:'juego' as const})),
];
type Filter = 'todos' | 'libro' | 'juego' | 'favoritos';
const categories: {id:Filter;label:string}[] = [
 {id:'todos',label:'Explorar todo'},{id:'libro',label:'Mis libros'},{id:'juego',label:'Juegos bíblicos'},{id:'favoritos',label:'Favoritos'}
];
function Biblioteca() {
 const [filter,setFilter]=useState<Filter>('todos');
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<Material|null>(null);
 const [favorites,setFavorites]=useState<string[]>([]);
 const [done,setDone]=useState<string[]>([]);
 const [ready,setReady]=useState(false);
 const [mobileMenu,setMobileMenu]=useState(false);
 useEffect(()=>{
  try {
   const saved=JSON.parse(localStorage.getItem('biblia-kids-favorites')||'[]');
   const completed=JSON.parse(localStorage.getItem('biblia-kids-completed')||'[]');
   if(Array.isArray(saved))setFavorites(saved.filter((v):v is string=>typeof v==='string'));
   if(Array.isArray(completed))setDone(completed.filter((v):v is string=>typeof v==='string'));
  }catch{ /* recover gracefully from invalid local storage */ }
  setReady(true);
 },[]);
 const updateFavorites=(id:string)=>{
  const next=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];
  setFavorites(next);try{localStorage.setItem('biblia-kids-favorites',JSON.stringify(next));}catch{}
 };
 const updateDone=(id:string)=>{
  const next=done.includes(id)?done.filter(v=>v!==id):[...done,id];
  setDone(next);try{localStorage.setItem('biblia-kids-completed',JSON.stringify(next));}catch{}
 };
 const shown=useMemo(()=>materials.filter(m=>(filter==='todos'||filter==='favoritos'&&favorites.includes(m.id)||m.type===filter)&&(!query.trim()||(m.name+' '+m.text).toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es').trim()))),[filter,query,favorites]);
 const open=(m:Material)=>setSelected(m);
 return <div className="bb-app">
  <aside className={'bb-sidebar '+(mobileMenu?'bb-sidebar-open':'')}>
   <div className="bb-logo"><span>✦</span><div>Biblioteca<small>BÍBLICA KIDS</small></div></div>
   <div className="bb-sidecap">MI ESPACIO</div>
   <nav aria-label="Categorías de la biblioteca">{categories.map(c=><button type="button" key={c.id} className={'bb-nav '+(filter===c.id?'bb-active':'')} onClick={()=>{setFilter(c.id);setMobileMenu(false)}}>{c.id==='todos'?<Grid2X2 size={19}/>:c.id==='libro'?<BookOpen size={19}/>:c.id==='juego'?<Sparkles size={19}/>:<Heart size={19}/>}<span>{c.label}</span></button>)}</nav>
   <div className="bb-sidefoot"><ShieldCheck size={18}/><span>Vista previa del catálogo<br/><small>La entrega privada se configura por separado.</small></span></div>
  </aside>
  {mobileMenu&&<button type="button" aria-label="Cerrar menú" className="bb-overlay" onClick={()=>setMobileMenu(false)}/>}
  <main className="bb-main">
   <header className="bb-topbar"><button type="button" className="bb-menu-btn" aria-label="Abrir menú" onClick={()=>setMobileMenu(true)}><Menu/></button><div className="bb-topbrand">Biblioteca Bíblica Kids</div><div className="bb-search"><Search size={18}/><input type="search" placeholder="Buscar libros y actividades..." value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar materiales"/></div><div className="bb-avatar" aria-label="Vista de demostración">✦</div></header>
   <div className="bb-content">
    <div className="bb-preview-label"><span className="bb-dot"/> DEMOSTRACIÓN DEL APP · CATÁLOGO PÚBLICO</div>
    <section className="bb-hero" aria-label="Bienvenido a la biblioteca"><div className="bb-hero-text"><span className="bb-eyebrow">🌟 TU AVENTURA DE FE EMPIEZA AQUÍ</span><h1>¡Aprender la Biblia<br/><em>nunca fue tan divertido!</em></h1><p>Descubre libros ilustrados, aventuras y juegos para compartir momentos especiales en familia.</p><button type="button" className="bb-primary" onClick={()=>{setFilter('todos');document.getElementById('bb-catalogo')?.scrollIntoView({behavior:'smooth'})}}>Explorar mi biblioteca <span>→</span></button></div><img className="bb-hero-art" src={kit.url} alt="Colección de libros y juegos del Kit Bíblico Infantil"/></section>
    <div className="bb-stats"><div><BookOpen/><strong>3 libros</strong><span>Ilustrados</span></div><div><Sparkles/><strong>5 juegos</strong><span>Para compartir</span></div><div><Heart/><strong>{ready?favorites.length:0} favoritos</strong><span>Guardados en este dispositivo</span></div><div><CheckCircle2/><strong>{ready?done.length:0} de 8</strong><span>Marcados como realizados</span></div></div>
    <section id="bb-catalogo" className="bb-catalogue"><div className="bb-section-heading"><div><span className="bb-kicker">TODA UNA BIBLIOTECA PARA TI</span><h2>{filter==='todos'?'Explora tus materiales':filter==='libro'?'Mis 3 libros':filter==='juego'?'Mis 5 juegos bíblicos':'Mis favoritos'}</h2><p>Elige una portada para descubrir cada actividad.</p></div><div className="bb-pills">{categories.map(c=><button type="button" key={c.id} className={filter===c.id?'chosen':''} onClick={()=>setFilter(c.id)}>{c.label}</button>)}</div></div>
    <div className="bb-grid">{shown.map(m=><article className="bb-tile" key={m.id}><button type="button" className="bb-cover" onClick={()=>open(m)} aria-label={'Ver detalles de '+m.name}><img src={m.image.url} alt={'Portada de '+m.name} loading="lazy"/><span className="bb-cover-hover">Ver detalles →</span></button><div className="bb-tile-meta"><span className={'bb-type '+(m.type==='libro'?'bb-book':'')}>{m.type==='libro'?'LIBRO DIGITAL':'JUEGO IMPRIMIBLE'}</span><button type="button" className={'bb-heart '+(favorites.includes(m.id)?'liked':'')} onClick={()=>updateFavorites(m.id)} aria-label={favorites.includes(m.id)?'Quitar de favoritos':'Guardar en favoritos'} aria-pressed={favorites.includes(m.id)}><Heart size={19} fill={favorites.includes(m.id)?'currentColor':'none'}/></button></div><h3>{m.name}</h3><p>{m.text}</p><button type="button" className="bb-open" onClick={()=>open(m)}>Ver actividad <span>→</span></button></article>)}</div>
    {shown.length===0&&<div className="bb-empty"><Search size={30}/><h3>No encontramos materiales</h3><p>Prueba otra búsqueda o elige otra categoría.</p><button type="button" onClick={()=>{setFilter('todos');setQuery('')}}>Ver todo</button></div>}
    </section>
    <footer className="bb-footer"><span>Biblioteca Bíblica Kids · 3 libros + 5 bonos</span><span>Versión demostrativa. La compra y entrega de archivos se gestionan de forma independiente.</span></footer>
   </div>
  </main>
  {selected&&<div className="bb-modal-wrap" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><div className="bb-dialog" role="dialog" aria-modal="true" aria-labelledby="bb-dialog-title"><button className="bb-close" type="button" aria-label="Cerrar" onClick={()=>setSelected(null)}><X/></button><div className="bb-dialog-cover"><img src={selected.image.url} alt={'Portada de '+selected.name}/></div><div className="bb-dialog-body"><span className="bb-kicker">{selected.type==='libro'?'LIBRO DIGITAL':'JUEGO BÍBLICO'}</span><h2 id="bb-dialog-title">{selected.name}</h2><p>{selected.text}</p><div className="bb-detailfacts"><span><BookOpen size={16}/> {selected.pages?selected.pages+' páginas':'Actividad imprimible'}</span><span><Printer size={16}/> Formato digital</span><span><Clock3 size={16}/> A tu ritmo</span></div><button type="button" className={'bb-finish '+(done.includes(selected.id)?'finished':'')} onClick={()=>updateDone(selected.id)}><CheckCircle2 size={20}/>{done.includes(selected.id)?'Actividad marcada como realizada':'Marcar como realizada'}</button><div className="bb-download-note"><Download size={20}/><div><strong>Lectura y descarga de PDF</strong><p>Disponible cuando se conecten los archivos originales y el acceso seguro de compradores. Esta demostración no incluye descargas públicas.</p></div></div><button type="button" className="bb-back" onClick={()=>setSelected(null)}><ArrowLeft size={16}/> Volver a la biblioteca</button></div></div></div>}
 </div>;
}
export const Route=createFileRoute('/biblioteca-biblica')({head:()=>({meta:[{title:'Biblioteca Bíblica Kids — Vista previa del app'},{name:'description',content:'Demostración visual de la biblioteca de 3 libros y 5 juegos bíblicos infantiles.'},{name:'robots',content:'noindex,nofollow'}]}),component:Biblioteca});
