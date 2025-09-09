import { describe, it, expect } from 'vitest';
import { seededShuffle, rollDice } from '../src/engine/shuffle';
import { initializeGame, nextPhase } from '../src/engine/stateMachine';

describe('Shuffle Engine', () => {
  it('should produce deterministic shuffles', () => {
    const array = [1, 2, 3, 4, 5];
    const seed = 'test-seed';
    
    const result1 = seededShuffle(array, seed);
    const result2 = seededShuffle(array, seed);
    
    expect(result1).toEqual(result2);
  });

  it('should roll dice deterministically', () => {
    const seed = 'test-seed';
    const round = 1;
    
    const roll1 = rollDice(seed, round);
    const roll2 = rollDice(seed, round);
    
    expect(roll1).toBe(roll2);
    expect(roll1).toBeGreaterThanOrEqual(1);
    expect(roll1).toBeLessThanOrEqual(6);
  });
});

describe('State Machine', () => {
  it('should initialize game correctly', () => {
    const playerNames = ['Alice', 'Bob'];
    const seed = 'test-seed';
    
    const gameState = initializeGame(2, playerNames, seed);
    
    expect(gameState.players).toHaveLength(2);
    expect(gameState.players[0].name).toBe('Alice');
    expect(gameState.players[1].name).toBe('Bob');
    expect(gameState.phase).toBe('Setup');
    expect(gameState.year).toBe(1);
  });

  it('should advance phases correctly', () => {
    const initialState = initializeGame(2, ['Alice', 'Bob'], 'test');
    
    const nextState = nextPhase(initialState);
    expect(nextState.phase).toBe('ResearchIdeas');
  });
});
