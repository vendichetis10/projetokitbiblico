import { createFileRoute } from '@tanstack/react-router';
import { KitPage } from '@/components/kit-page';
export const Route = createFileRoute('/kit-biblico')({
 head:()=>({meta:[
 {title:'Kit Bíblico Infantil — Alfabeto Bíblico + 5 bonos | US$ 8.90'},
 {name:'description',content:'Comparte la fe en familia con el Alfabeto Bíblico y 5 bonos. PDFs en español para descargar e imprimir, por un pago único de US$ 8.90.'},
 {property:'og:title',content:'Kit Bíblico Infantil — Alfabeto Bíblico + 5 bonos'},
 {property:'og:description',content:'Letras, dibujos y juegos bíblicos para compartir en familia. 6 materiales digitales en español por US$ 8.90.'},
 {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}
 ]}), component:KitPage
});
