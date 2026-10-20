import { describe, expect, it } from 'vitest';
import { books, bonuses, deliverables } from '@/lib/kit-deliverables';

describe('Kit deliverables', () => {
  it('includes all three attached books', () => {
    expect(books.map(book => book.name)).toEqual(['ALFABETO BÍBLICO', 'APRENDIENDO A ORAR', 'EL AMOR DE DIOS']);
  });
  it('keeps the five bonuses confirmed by the owner', () => {
    expect(bonuses.map(bonus => bonus.name)).toEqual(['BINGO BÍBLICO EN FAMILIA', 'DOMINÓ DE PERSONAJES', 'EL CAMINO DE LA FE', 'MÍMICAS BÍBLICAS', '10 AVENTURAS BÍBLICAS']);
    expect(deliverables).toHaveLength(8);
  });
  it('uses the actual PDF page counts including covers', () => {
    expect(books.map(book => book.pages)).toEqual([30, 21, 18]);
  });
});