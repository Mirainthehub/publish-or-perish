import { SeededRNG } from './rng';
import { Deck, Card } from './deck';

export type GamePhase = 
  | 'Boot' 
  | 'DiceOrder' 
  | 'PersonalityDraft' 
  | 'CharacterDraft' 
  | 'YearLoop'
  | 'ResearchIdeas'
  | 'FundingRound'
  | 'CollaborationRound'
  | 'ProcessRound'
  | 'TradingRound'
  | 'PublishDecision'
  | 'YearEndScoring'
  | 'EndGame'
  | 'Tiebreak';

export type GameAction = 
  | 'ROLL_ALL'
  | 'SET_ORDER'
  | 'PICK_PERSONALITY'
  | 'PICK_CHARACTER'
  | 'DEAL_STARTERS'
  | 'NEXT_PHASE'
  | 'START_TRADE'
  | 'RESOLVE_TRADE'
  | 'PUBLISH'
  | 'YEAR_END'
  | 'ENDGAME';

export interface Player {
  id: string;
  name: string;
  diceRoll?: number;
  personality?: any;
  character?: any;
  tokens: {
    funding: number;
    collaboration: number;
    special: number;
  };
  projects: any[];
  score: number;
  publications: Record<string, number>;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  year: number;
  totalYears: number;
  decks: {
    personalities: Deck<any>;
    characters: Deck<any>;
    research: Deck<any>;
    funding: Deck<any>;
    collaboration: Deck<any>;
    setbacks: Deck<any>;
  };
  rng: SeededRNG;
  winner?: Player;
}

export class GameFSM {
  private state: GameState;
  
  constructor(initialState: GameState) {
    this.state = initialState;
  }
  
  getCurrentState(): GameState {
    return { ...this.state };
  }
  
  canExecute(action: GameAction): boolean {
    switch (this.state.phase) {
      case 'Boot':
        return action === 'ROLL_ALL';
      case 'DiceOrder':
        return action === 'SET_ORDER';
      case 'PersonalityDraft':
        return action === 'PICK_PERSONALITY';
      case 'CharacterDraft':
        return action === 'PICK_CHARACTER' || action === 'DEAL_STARTERS';
      case 'ResearchIdeas':
      case 'FundingRound':
      case 'CollaborationRound':
      case 'ProcessRound':
        return action === 'NEXT_PHASE';
      case 'TradingRound':
        return action === 'START_TRADE' || action === 'RESOLVE_TRADE';
      case 'PublishDecision':
        return action === 'PUBLISH';
      case 'YearEndScoring':
        return action === 'YEAR_END';
      case 'EndGame':
        return action === 'ENDGAME';
      default:
        return false;
    }
  }
  
  execute(action: GameAction, payload?: any): GameState {
    if (!this.canExecute(action)) {
      throw new Error(`Cannot execute ${action} in phase ${this.state.phase}`);
    }
    
    switch (action) {
      case 'ROLL_ALL':
        return this.rollAllPlayers();
      case 'SET_ORDER':
        return this.setPlayerOrder(payload);
      case 'PICK_PERSONALITY':
        return this.pickPersonality(payload);
      case 'PICK_CHARACTER':
        return this.pickCharacter(payload);
      case 'DEAL_STARTERS':
        return this.dealStarterCards();
      case 'NEXT_PHASE':
        return this.nextPhase();
      case 'START_TRADE':
        return this.startTrading();
      case 'RESOLVE_TRADE':
        return this.resolveTrade(payload);
      case 'PUBLISH':
        return this.publishDecision(payload);
      case 'YEAR_END':
        return this.yearEnd();
      case 'ENDGAME':
        return this.endGame();
      default:
        return this.state;
    }
  }
  
  private rollAllPlayers(): GameState {
    const players = this.state.players.map(player => ({
      ...player,
      diceRoll: this.state.rng.rollDice()
    }));
    
    return {
      ...this.state,
      players,
      phase: 'DiceOrder'
    };
  }
  
  private setPlayerOrder(order: string[]): GameState {
    const orderedPlayers = order.map(id => 
      this.state.players.find(p => p.id === id)!
    );
    
    return {
      ...this.state,
      players: orderedPlayers,
      phase: 'PersonalityDraft'
    };
  }
  
  private pickPersonality(payload: { playerId: string; personalityId: string }): GameState {
    const personality = this.state.decks.personalities.takeFromRow(payload.personalityId);
    if (!personality) return this.state;
    
    const players = this.state.players.map(player =>
      player.id === payload.playerId
        ? { ...player, personality }
        : player
    );
    
    // Check if all players have personalities
    const allHavePersonalities = players.every(p => p.personality);
    
    return {
      ...this.state,
      players,
      phase: allHavePersonalities ? 'CharacterDraft' : 'PersonalityDraft'
    };
  }
  
  private pickCharacter(payload: { playerId: string; characterId: string }): GameState {
    const character = this.state.decks.characters.takeFromRow(payload.characterId);
    if (!character) return this.state;
    
    const players = this.state.players.map(player =>
      player.id === payload.playerId
        ? { 
            ...player, 
            character,
            tokens: character.startingTokens || { funding: 1, collaboration: 1, special: 1 }
          }
        : player
    );
    
    return {
      ...this.state,
      players
    };
  }
  
  private dealStarterCards(): GameState {
    const players = this.state.players.map(player => ({
      ...player,
      projects: this.state.decks.research.drawMany(3)
    }));
    
    return {
      ...this.state,
      players,
      phase: 'YearLoop'
    };
  }
  
  private nextPhase(): GameState {
    const phaseOrder: GamePhase[] = [
      'ResearchIdeas', 'FundingRound', 'CollaborationRound', 
      'ProcessRound', 'TradingRound', 'PublishDecision', 'YearEndScoring'
    ];
    
    const currentIndex = phaseOrder.indexOf(this.state.phase);
    if (currentIndex === -1) return this.state;
    
    const nextPhase = phaseOrder[currentIndex + 1] || 'YearEndScoring';
    
    return {
      ...this.state,
      phase: nextPhase
    };
  }
  
  private startTrading(): GameState {
    return {
      ...this.state,
      phase: 'TradingRound'
    };
  }
  
  private resolveTrade(payload: any): GameState {
    // Trading logic would be implemented here
    return this.state;
  }
  
  private publishDecision(payload: { playerId: string; publish: boolean }): GameState {
    // Publishing logic would be implemented here
    return this.state;
  }
  
  private yearEnd(): GameState {
    const newYear = this.state.year + 1;
    
    if (newYear > this.state.totalYears) {
      return {
        ...this.state,
        phase: 'EndGame'
      };
    }
    
    return {
      ...this.state,
      year: newYear,
      phase: 'ResearchIdeas'
    };
  }
  
  private endGame(): GameState {
    const winner = this.state.players.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );
    
    return {
      ...this.state,
      phase: 'EndGame',
      winner
    };
  }
}
