import type { CardData } from '../utils/cardData';
import { API_URL } from '../config';

export async function fetchCards(): Promise<CardData[]> {
  const response = await fetch(`${API_URL}/cards`);
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Error al obtener cartas');
  return data.cards;
}
