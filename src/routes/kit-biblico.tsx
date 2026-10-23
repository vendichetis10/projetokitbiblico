import { createFileRoute } from '@tanstack/react-router';
import { KitPage } from '@/components/kit-page';
export const Route = createFileRoute('/kit-biblico')({
 head:()=>({meta:[
 {title:'Kit Bíblico Infantil — 3 libros + 5 bonos | US$ 7.90'},
 {name:'description',content:'Comparte la fe en familia con el Alfabeto Bíblico, Aprendiendo a Orar, El Amor de Dios y 5 bonos. PDFs para descargar e imprimir, por un pago único de US$ 7.90.'},
 {property:'og:title',content:'Kit Bíblico Infantil — 3 libros + 5 bonos'},
 {property:'og:description',content:'Letras, dibujos y juegos bíblicos para compartir en familia. 8 materiales digitales: 3 libros y 5 bonos por US$ 7.90.'},
 {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}
 ]}), component:KitPage
});
