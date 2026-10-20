import { createFileRoute, redirect } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
 beforeLoad:()=>{throw redirect({to:'/kit-biblico'});},
 head:()=>({meta:[{title:'Kit Bíblico Infantil — Actividades bíblicas en familia'},{name:'description',content:'Tres libros bíblicos y cinco bonos en PDF para compartir en familia.'},{property:'og:title',content:'Kit Bíblico Infantil'},{property:'og:description',content:'Actividades bíblicas para descargar e imprimir.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]})
});
