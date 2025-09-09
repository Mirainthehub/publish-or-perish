import React from 'react';
import { useGameStore } from '../store/gameStore';

const HUD: React.FC = () => {
  const { 
    gameState, 
    lang, 
    setLang, 
    saveGame, 
    loadGame,
    isMuted,
    toggleMute,
    executeAction 
  } = useGameStore();

  if (!gameState) return null;

  const getPhaseDescription = (phase: string): string => {
    const descriptions = {
      'Boot': 'Game starting - prepare for dice roll',
      'DiceOrder': 'Roll dice to determine turn order',
      'PersonalityDraft': 'Draft your personality card',
      'CharacterDraft': 'Draft your character card',
      'ResearchIdeas': 'Receive research project cards',
      'FundingRound': 'Compete for funding resources',
      'CollaborationRound': 'Select collaboration opportunities',
      'ProcessRound': 'Draw process cards (mentors/setbacks)',
      'TradingRound': 'Trade resources and cards (3:00 timer)',
      'PublishDecision': 'Decide which projects to publish',
      'YearEndScoring': 'Calculate scores and publications',
      'EndGame': 'Game complete - view final results'
    };
    return descriptions[phase as keyof typeof descriptions] || phase;
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div 
      className="hud bg-white border-b shadow-sm sticky top-0 z-40"
      role="banner"
      aria-label="Game status"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          {/* Left: Game State */}
          <div className="flex items-center gap-4">
            <div className="font-semibold text-blue-600">
              Year {gameState.year}/{gameState.totalYears}
            </div>
            <div className="text-gray-600">|</div>
            <div className="font-medium">{gameState.phase}</div>
            <div className="text-gray-600">|</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Turn:</span>
              <span className="font-medium text-green-600">
                {currentPlayer?.name || 'None'}
              </span>
              <div 
                className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Center: Phase Tips */}
          <div 
            className="hidden md:block text-center max-w-md"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              💡 {getPhaseDescription(gameState.phase)}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${lang === 'en' ? 'Chinese' : 'English'}`}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {/* Save/Load */}
            <div className="flex items-center gap-1">
              <button
                onClick={saveGame}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                aria-label="Save game"
              >
                Save
              </button>
              <button
                onClick={loadGame}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-label="Load saved game"
              >
                Load
              </button>
            </div>

            {/* Settings */}
            <button
              className="p-1 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Open settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Mobile Phase Tips */}
        <div 
          className="md:hidden mt-2 text-xs text-gray-600 text-center"
          aria-live="polite"
        >
          💡 {getPhaseDescription(gameState.phase)}
        </div>
      </div>
    </div>
  );
};

export default HUD;
