import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameFSM, GameAction } from '../engine/fsm';
import { createRNG } from '../engine/rng';
import { Deck } from '../engine/deck';

interface GameStore {
  // Game State
  gameState: GameState | null;
  fsm: GameFSM | null;
  
  // UI State
  lang: 'en' | 'zh';
  showScoreModal: boolean;
  showDiceModal: boolean;
  showDraftModal: boolean;
  
  // UX Features
  showOnboarding: boolean;
  isFirstTime: boolean;
  isDemoMode: boolean;
  isMuted: boolean;
  autoSaveEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  soundVolume: number;
  showEventLog: boolean;
  eventHistory: Array<{
    id: string;
    timestamp: number;
    action: string;
    description: string;
    canUndo: boolean;
  }>;
  
  // Actions
  setLang: (lang: 'en' | 'zh') => void;
  initGame: (playerCount: number, playerNames: string[], seed?: string) => void;
  executeAction: (action: GameAction, payload?: any) => void;
  toggleScoreModal: () => void;
  toggleDiceModal: () => void;
  toggleDraftModal: () => void;
  saveGame: () => void;
  loadGame: () => void;
  
  // UX Actions
  setShowOnboarding: (show: boolean) => void;
  startDemoMode: () => void;
  toggleMute: () => void;
  setSoundVolume: (volume: number) => void;
  toggleAutoSave: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleEventLog: () => void;
  addEvent: (action: string, description: string, canUndo?: boolean) => void;
  undoLastAction: () => void;
  resetOnboarding: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: null,
      fsm: null,
      lang: 'en',
      showScoreModal: false,
      showDiceModal: false,
      showDraftModal: false,
      
      // UX Features Initial State
      showOnboarding: false,
      isFirstTime: true,
      isDemoMode: false,
      isMuted: false,
      autoSaveEnabled: true,
      reducedMotion: false,
      highContrast: false,
      soundVolume: 0.7,
      showEventLog: false,
      eventHistory: [],
      
      // Actions
      setLang: (lang) => set({ lang }),
      
      initGame: (playerCount, playerNames, seed = Date.now().toString()) => {
        const rng = createRNG(seed);
        
        // Ensure we have the right number of players
        const names = playerNames.slice(0, playerCount);
        while (names.length < playerCount) {
          names.push(`Player ${names.length + 1}`);
        }
        
        // Create initial players
        const players = names.map((name, index) => ({
          id: `player-${index}`,
          name,
          tokens: { funding: 0, collaboration: 0, special: 0 },
          projects: [],
          score: 0,
          publications: {}
        }));
        
        // Initialize decks with placeholder data
        const gameState: GameState = {
          phase: 'Boot',
          players,
          currentPlayerIndex: 0,
          year: 1,
          totalYears: 3,
          decks: {
            personalities: new Deck([], rng),
            characters: new Deck([], rng),
            research: new Deck([], rng),
            funding: new Deck([], rng),
            collaboration: new Deck([], rng),
            setbacks: new Deck([], rng)
          },
          rng
        };
        
        const fsm = new GameFSM(gameState);
        
        set({ 
          gameState, 
          fsm, 
          isFirstTime: false,
          showOnboarding: get().isFirstTime 
        });
      },
      
      executeAction: (action, payload) => {
        const { fsm, autoSaveEnabled } = get();
        if (!fsm) return;
        
        try {
          const newGameState = fsm.execute(action, payload);
          
          // Add to event history
          get().addEvent(
            action,
            `Executed ${action}${payload ? ` with ${JSON.stringify(payload)}` : ''}`,
            true
          );
          
          set({ gameState: newGameState });
          
          // Auto-save if enabled
          if (autoSaveEnabled) {
            setTimeout(() => get().saveGame(), 1000);
          }
        } catch (error) {
          console.error('Failed to execute action:', error);
        }
      },
      
      toggleScoreModal: () => {
        set(state => ({ showScoreModal: !state.showScoreModal }));
      },
      
      toggleDiceModal: () => {
        set(state => ({ showDiceModal: !state.showDiceModal }));
      },
      
      toggleDraftModal: () => {
        set(state => ({ showDraftModal: !state.showDraftModal }));
      },
      
      saveGame: () => {
        const { gameState } = get();
        if (gameState) {
          localStorage.setItem('publish-or-perish-save', JSON.stringify(gameState));
          get().addEvent('save', 'Game saved', false);
        }
      },
      
      loadGame: () => {
        const saved = localStorage.getItem('publish-or-perish-save');
        if (saved) {
          try {
            const gameState = JSON.parse(saved);
            const fsm = new GameFSM(gameState);
            set({ gameState, fsm });
            get().addEvent('load', 'Game loaded', false);
          } catch (error) {
            console.error('Failed to load game:', error);
          }
        }
      },
      
      // UX Actions
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      
      startDemoMode: () => {
        set({ isDemoMode: true, showOnboarding: false });
        // Initialize demo with predefined data
        get().initGame(3, ['Demo Player', 'AI Alice', 'AI Bob'], 'demo-seed');
      },
      
      toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
      
      setSoundVolume: (volume) => set({ soundVolume: Math.max(0, Math.min(1, volume)) }),
      
      toggleAutoSave: () => set(state => ({ autoSaveEnabled: !state.autoSaveEnabled })),
      
      toggleReducedMotion: () => set(state => ({ reducedMotion: !state.reducedMotion })),
      
      toggleHighContrast: () => set(state => ({ highContrast: !state.highContrast })),
      
      toggleEventLog: () => set(state => ({ showEventLog: !state.showEventLog })),
      
      addEvent: (action, description, canUndo = false) => {
        const event = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          action,
          description,
          canUndo
        };
        
        set(state => ({
          eventHistory: [...state.eventHistory.slice(-49), event] // Keep last 50 events
        }));
      },
      
      undoLastAction: () => {
        const { eventHistory, fsm } = get();
        const lastUndoableEvent = eventHistory
          .slice()
          .reverse()
          .find(event => event.canUndo);
        
        if (lastUndoableEvent && fsm) {
          // Implementation would depend on FSM undo capability
          console.log('Undo not yet implemented for:', lastUndoableEvent);
          get().addEvent('undo', `Undid: ${lastUndoableEvent.description}`, false);
        }
      },
      
      resetOnboarding: () => set({ isFirstTime: true, showOnboarding: true })
    }),
    {
      name: 'publish-or-perish-store',
      partialize: (state) => ({
        lang: state.lang,
        isMuted: state.isMuted,
        autoSaveEnabled: state.autoSaveEnabled,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        soundVolume: state.soundVolume,
        isFirstTime: state.isFirstTime
      })
    }
  )
);
