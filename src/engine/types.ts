export type Phase =
  | 'Setup'
  | 'ResearchIdeas'
  | 'Funding'
  | 'Collaboration'
  | 'Trading'
  | 'Process'
  | 'YearEnd'
  | 'NextYear'
  | 'EndGame';

export type CardType = 'Research' | 'Funding' | 'Collaboration' | 'Setback' | 'Special';

export interface Card {
  id: string;
  type: string;
  displayName: { en: string; zh: string };
  value?: number;
  points?: number;
}

export interface Character {
  id: string;
  name: { en: string; zh: string };
  field: string;
  startFunding: number;
  startCollab: number;
  startSpecial: number;
  passives: Array<{ en: string; zh: string }>;
}

export interface Personality {
  id: string;
  name: { en: string; zh: string };
  initialPoints: number;
  ability: {
    timing: string;
    effect: { en: string; zh: string };
  };
  challenge: {
    timing: string;
    effect: { en: string; zh: string };
  };
  uses: Record<string, number | boolean>;
}

export interface Project {
  id: string;
  researchCard: Card;
  fundingCards: Card[];
  collabCards: Card[];
  progress: number;
  isPublished: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  character: Character;
  personality: Personality;
  resources: {
    funding: number;
    collab: number;
    special: number;
  };
  projects: Project[];
  score: number;
  totalScore: number;
  published: Card[];
  hand: Card[];
  usedAbilities: Record<string, number>;
}

export interface GameState {
  phase: Phase;
  year: number;
  round: number;
  players: Player[];
  currentPlayerIndex: number;
  turnOrder: 'clockwise' | 'counterclockwise';
  seed: string;
  lang: 'en' | 'zh';
  dice: {
    value: number;
    isRolling: boolean;
  };
  decks: {
    research: Card[];
    funding: Card[];
    collaboration: Card[];
    setbacks: Card[];
    special: Card[];
  };
  publicPools: {
    funding: Card[];
    collaboration: Card[];
  };
  timer: {
    seconds: number;
    isRunning: boolean;
  };
  isDemo: boolean;
  showScoreModal: boolean;
}

export interface TradeOffer {
  from: string;
  to: string;
  offering: {
    cards: Card[];
    resources: { funding: number; collab: number; special: number };
  };
  requesting: {
    cards: Card[];
    resources: { funding: number; collab: number; special: number };
  };
}
