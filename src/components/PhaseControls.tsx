import React from 'react';
import { useGameStore } from '../store/gameStore';
import { GamePhase } from '../engine/fsm';

const PhaseControls: React.FC = () => {
  const { gameState, executeAction } = useGameStore();

  if (!gameState) return null;

  const getPhaseTitle = (phase: GamePhase): string => {
    const titles: Record<GamePhase, string> = {
      'Boot': 'Game Setup',
      'DiceOrder': 'Roll for Turn Order',
      'PersonalityDraft': 'Draft Personalities',
      'CharacterDraft': 'Draft Characters',
      'YearLoop': 'Year in Progress',
      'ResearchIdeas': 'Research Ideas Phase',
      'FundingRound': 'Funding Round',
      'CollaborationRound': 'Collaboration Round',
      'ProcessRound': 'Process Round',
      'TradingRound': 'Trading Round',
      'PublishDecision': 'Publication Decision',
      'YearEndScoring': 'Year End Scoring',
      'EndGame': 'Game Complete',
      'Tiebreak': 'Tiebreaker'
    };
    return titles[phase] || phase;
  };

  const getAvailableActions = (): Array<{action: string, label: string}> => {
    switch (gameState.phase) {
      case 'Boot':
        return [{ action: 'ROLL_ALL', label: 'Roll All Dice' }];
      case 'DiceOrder':
        return [{ action: 'SET_ORDER', label: 'Set Turn Order' }];
      case 'PersonalityDraft':
        return [{ action: 'PICK_PERSONALITY', label: 'Pick Personality' }];
      case 'CharacterDraft':
        return [
          { action: 'PICK_CHARACTER', label: 'Pick Character' },
          { action: 'DEAL_STARTERS', label: 'Deal Starting Cards' }
        ];
      case 'ResearchIdeas':
      case 'FundingRound':
      case 'CollaborationRound':
      case 'ProcessRound':
        return [{ action: 'NEXT_PHASE', label: 'Next Phase' }];
      case 'TradingRound':
        return [
          { action: 'START_TRADE', label: 'Start Trading' },
          { action: 'RESOLVE_TRADE', label: 'Resolve Trade' }
        ];
      case 'PublishDecision':
        return [{ action: 'PUBLISH', label: 'Publish Papers' }];
      case 'YearEndScoring':
        return [{ action: 'YEAR_END', label: 'End Year' }];
      case 'EndGame':
        return [{ action: 'ENDGAME', label: 'View Final Results' }];
      default:
        return [];
    }
  };

  const handleAction = (actionName: string) => {
    executeAction(actionName as any);
  };

  return (
    <div className="phase-controls bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {getPhaseTitle(gameState.phase)}
          </h3>
          <div className="text-sm text-gray-600">
            Year {gameState.year} of {gameState.totalYears}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Current Player: {gameState.players[gameState.currentPlayerIndex]?.name || 'None'}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {getAvailableActions().map(({ action, label }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {gameState.phase === 'EndGame' && gameState.winner && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <div className="font-semibold text-yellow-800">
            🏆 Winner: {gameState.winner.name}
          </div>
          <div className="text-sm text-yellow-700">
            Final Score: {gameState.winner.score}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseControls;
