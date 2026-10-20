import alphabet from '@/assets/alfabeto-cover.jpg.asset.json';
import prayer from '@/assets/orar-cover.jpg.asset.json';
import love from '@/assets/amor-cover.jpg.asset.json';
import bingo from '@/assets/bingo.jpg.asset.json';
import domino from '@/assets/domino.jpg.asset.json';
import camino from '@/assets/camino.jpg.asset.json';
import mimicas from '@/assets/mimicas.jpg.asset.json';
import aventuras from '@/assets/aventuras.jpg.asset.json';

export const books = [
  { name: 'ALFABETO BÍBLICO', pages: 30, image: alphabet, text: '26 letras de la A a la Z con personajes y palabras de la Biblia, dibujos para colorear, reconocimiento de letras y ejercicios de trazado.' },
  { name: 'APRENDIENDO A ORAR', pages: 21, image: prayer, text: 'El Padre Nuestro, tipos de oración, pedidos y agradecimientos, dibujos para colorear, sopas de letras, crucigramas y actividades de reflexión.' },
  { name: 'EL AMOR DE DIOS', pages: 18, image: love, text: 'Actividades sobre amor, perdón, gratitud y amistad: elegir actitudes, colorear, completar frases, relacionar ideas y resolver pasatiempos.' },
] as const;

export const bonuses = [
  { name: 'BINGO BÍBLICO EN FAMILIA', image: bingo, text: 'Cartones y tarjetas para observar y jugar juntos.' },
  { name: 'DOMINÓ DE PERSONAJES', image: domino, text: 'Fichas para relacionar nombres e ilustraciones de personajes bíblicos.' },
  { name: 'EL CAMINO DE LA FE', image: camino, text: 'Un juego de tablero con retos para participar por turnos.' },
  { name: 'MÍMICAS BÍBLICAS', image: mimicas, text: 'Tarjetas con acciones y pistas para representar y adivinar.' },
  { name: '10 AVENTURAS BÍBLICAS', image: aventuras, text: 'Actividades bíblicas para resolver y colorear.' },
] as const;

export const deliverables = [...books, ...bonuses];