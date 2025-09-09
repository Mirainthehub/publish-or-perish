import { GameState, Player, Character, Personality, Card } from './types';
import { seededShuffle, rollDice } from './shuffle';
import charactersData from '../data/characters.json';
import personalitiesData from '../data/personalities.json';
import researchCards from '../data/cards.research.json';
import fundingCards from '../data/cards.funding.json';
import collabCards from '../data/cards.collab.json';
import setbackCards from '../data/cards.setbacks.json';
import specialCards from '../data/cards.special.json';

export const initializeGame = (
  playerCount: number, 
  playerNames: string[], 
  seed: string = 'default'
): GameState => {
  // Initialize basic game state
  const gameState: GameState = {
    phase: 'Setup',
    year: 1,
    round: 1,
    currentPlayerIndex: 0,
    players: [],
    decks: {
      research: seededShuffle([...researchCards], `${seed}-research`),
      funding: seededShuffle([...fundingCards], `${seed}-funding`),
      collaboration: seededShuffle([...collabCards], `${seed}-collab`),
      setbacks: seededShuffle([...setbackCards], `${seed}-setbacks`),
      special: seededShuffle([...specialCards], `${seed}-special`)
    },
    publicPools: {
      research: [],
      funding: [],
      collaboration: []
    },
    seed,
    lastDiceRoll: 0
  };

  // Create players
  const shuffledCharacters = seededShuffle(charactersData as Character[], `${seed}-chars`);
  const shuffledPersonalities = seededShuffle(personalitiesData as Personality[], `${seed}-pers`);
  
  for (let i = 0; i < playerCount; i++) {
    const player: Player = {
      id: `player-${i}`,
      name: playerNames[i] || `Player ${i + 1}`,
      character: shuffledCharacters[i],
      personality: shuffledPersonalities[i],
      resources: {
        funding: shuffledCharacters[i].startingResources.funding,
        collaboration: shuffledCharacters[i].startingResources.collaboration,
        progress: shuffledCharacters[i].startingResources.progress,
        special: shuffledCharacters[i].startingResources.special
      },
      hand: {
        research: [],
        funding: [],
        collaboration: [],
        setbacks: [],
        special: []
      },
      completed: {
        research: [],
        funding: [],
        collaboration: []
      },
      score: 0,
      publications: {
        low: 0,
        moderate: 0,
        high: 0,
        breakthrough: 0
      }
    };
    gameState.players.push(player);
  }

  return gameState;
};

export const nextPhase = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  
  switch (newState.phase) {
    case 'Setup':
      newState.phase = 'ResearchIdeas';
      // Deal 3 research cards to each player
      newState.players.forEach(player => {
        for (let i = 0; i < 3; i++) {
          const card = newState.decks.research.pop();
          if (card) player.hand.research.push(card);
        }
      });
      break;
      
    case 'ResearchIdeas':
      newState.phase = 'Funding';
      // Add funding cards to public pool
      for (let i = 0; i < Math.min(5, newState.decks.funding.length); i++) {
        const card = newState.decks.funding.pop();
        if (card) newState.publicPools.funding.push(card);
      }
      break;
      
    case 'Funding':
      newState.phase = 'Collaboration';
      // Add collaboration cards to public pool
      for (let i = 0; i < Math.min(4, newState.decks.collaboration.length); i++) {
        const card = newState.decks.collaboration.pop();
        if (card) newState.publicPools.collaboration.push(card);
      }
      break;
      
    case 'Collaboration':
      newState.phase = 'Trading';
      // Start 3-minute timer (180 seconds)
      break;
      
    case 'Trading':
      newState.phase = 'Process';
      break;
      
    case 'Process':
      newState.phase = 'YearEnd';
      // Calculate scores
      newState.players.forEach(player => {
        calculatePlayerScore(player);
      });
      break;
      
    case 'YearEnd':
      if (newState.year < 3) {
        newState.year++;
        newState.phase = 'ResearchIdeas';
        newState.round = 1;
      } else {
        newState.phase = 'GameEnd';
      }
      break;
      
    default:
      break;
  }
  
  newState.round++;
  return newState;
};

const calculatePlayerScore = (player: Player): void => {
  let totalScore = 0;
  
  // Score from completed projects
  player.completed.research.forEach(card => {
    totalScore += card.points || 0;
  });
  
  player.completed.funding.forEach(card => {
    totalScore += card.points || 0;
  });
  
  player.completed.collaboration.forEach(card => {
    totalScore += card.points || 0;
  });
  
  // Bonus from publications
  totalScore += player.publications.low * 1;
  totalScore += player.publications.moderate * 2;
  totalScore += player.publications.high * 3;
  totalScore += player.publications.breakthrough * 5;
  
  player.score = totalScore;
};

export const rollDiceForPlayer = (gameState: GameState): GameState => {
  const newState = { ...gameState };
  const roll = rollDice(newState.seed, newState.round);
  newState.lastDiceRoll = roll;
  return newState;
};
