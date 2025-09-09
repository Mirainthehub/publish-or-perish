import seedrandom from 'seedrandom';

export function seededShuffle<T>(array: T[], seed: string): T[] {
  const rng = seedrandom(seed);
  const arr = [...array];
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

export function seededRandom(seed: string): () => number {
  return seedrandom(seed);
}

export function rollDice(seed: string, round: number): number {
  const rng = seedrandom(seed + round);
  return Math.floor(rng() * 6) + 1;
}
