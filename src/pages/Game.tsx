import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import PlayerBoard from '../components/PlayerBoard';
import PlayBoard from '../components/PlayBoard';
import PhaseControls from '../components/PhaseControls';
import ScoreModal from '../components/ScoreModal';
import YearTrack from '../components/YearTrack';
import SaveLoad from '../components/SaveLoad';
import DraftRow from '../components/DraftRow';
import Dice from '../components/Dice';

const Game: React.FC = () => {
  const { 
    gameState, 
    showScoreModal, 
    initGame,
    executeAction,
    toggleScoreModal
  } = useGameStore();

  // Initialize game on first load if no game state
  useEffect(() => {
    if (!gameState) {
      const playerNames = ['Player 1', 'Player 2', 'Player 3'];
      initGame(3, playerNames);
    }
  }, [gameState, initGame]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Publish or Perish</h1>
          <div className="text-gray-600">Loading game...</div>
        </div>
      </div>
    );
  }

  const handleDiceRoll = () => {
    executeAction('ROLL_ALL');
  };

  const handlePersonalitySelect = (cardId: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    executeAction('PICK_PERSONALITY', { 
      playerId: currentPlayer.id, 
      personalityId: cardId 
    });
  };

  const handleCharacterSelect = (cardId: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    executeAction('PICK_CHARACTER', { 
      playerId: currentPlayer.id, 
      characterId: cardId 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Publish or Perish</h1>
            <div className="flex items-center gap-4">
              <YearTrack currentYear={gameState.year} totalYears={gameState.totalYears} />
              <button
                onClick={toggleScoreModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                Scores
              </button>
              <SaveLoad />
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto px-4 py-6">
        {/* Dice Rolling Modal */}
        {gameState.phase === 'DiceOrder' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-center">Roll for Turn Order</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {gameState.players.map((player) => (
                  <div key={player.id} className="text-center">
                    <div className="font-medium mb-2">{player.name}</div>
                    <Dice 
                      value={player.diceRoll} 
                      onRoll={handleDiceRoll}
                      disabled={!!player.diceRoll}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => executeAction('SET_ORDER', gameState.players.map(p => p.id))}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={!gameState.players.every(p => p.diceRoll)}
                >
                  Set Turn Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Draft Modals */}
        {gameState.phase === 'PersonalityDraft' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-center">Draft Personalities</h2>
              <DraftRow
                cards={gameState.decks.personalities.getRevealed()}
                onSelect={handlePersonalitySelect}
                title="Available Personalities"
              />
            </div>
          </div>
        )}

        {gameState.phase === 'CharacterDraft' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-center">Draft Characters</h2>
              <DraftRow
                cards={gameState.decks.characters.getRevealed()}
                onSelect={handleCharacterSelect}
                title="Available Characters"
              />
            </div>
          </div>
        )}

        {/* Play Board - Top Section */}
        <div className="mb-6">
          <PlayBoard
            fundingCards={gameState.decks.funding.getRevealed()}
            collaborationCards={gameState.decks.collaboration.getRevealed()}
            setbacksCount={gameState.decks.setbacks.size()}
          />
        </div>

        {/* Player Boards - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {gameState.players.map((player) => (
            <PlayerBoard
              key={player.id}
              player={player}
              isCurrentPlayer={gameState.currentPlayerIndex === gameState.players.indexOf(player)}
            />
          ))}
        </div>

        {/* Phase Controls - Bottom */}
        <div className="mb-6">
          <PhaseControls />
        </div>
      </main>

      {/* Modals */}
      {showScoreModal && <ScoreModal />}
    </div>
  );
};

export default Game;
