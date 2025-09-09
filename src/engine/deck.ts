import { SeededRNG } from './rng';

export interface Card {
  id: string;
  type: string;
  name: string;
  [key: string]: any;
}

export class Deck<T extends Card> {
  private cards: T[];
  private discarded: T[];
  private revealed: T[];
  private rng: SeededRNG;
  
  constructor(cards: T[], rng: SeededRNG) {
    this.cards = [...cards];
    this.discarded = [];
    this.revealed = [];
    this.rng = rng;
  }
  
  shuffle(): void {
    this.cards = this.rng.shuffle([...this.cards, ...this.discarded]);
    this.discarded = [];
  }
  
  draw(): T | null {
    if (this.cards.length === 0) {
      if (this.discarded.length === 0) return null;
      this.shuffle();
    }
    return this.cards.pop() || null;
  }
  
  drawMany(n: number): T[] {
    const drawn: T[] = [];
    for (let i = 0; i < n; i++) {
      const card = this.draw();
      if (card) drawn.push(card);
    }
    return drawn;
  }
  
  revealRow(n: number): T[] {
    // Clear current revealed row
    this.discarded.push(...this.revealed);
    this.revealed = [];
    
    // Reveal new row
    for (let i = 0; i < n; i++) {
      const card = this.draw();
      if (card) this.revealed.push(card);
    }
    return [...this.revealed];
  }
  
  takeFromRow(id: string): T | null {
    const index = this.revealed.findIndex(card => card.id === id);
    if (index === -1) return null;
    
    const card = this.revealed[index];
    this.revealed.splice(index, 1);
    return card;
  }
  
  discard(card: T): void {
    this.discarded.push(card);
  }
  
  getRevealed(): T[] {
    return [...this.revealed];
  }
  
  size(): number {
    return this.cards.length;
  }
  
  discardSize(): number {
    return this.discarded.length;
  }
}
