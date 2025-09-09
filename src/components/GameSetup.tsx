import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../i18n';

const GameSetup: React.FC = () => {
  const { lang, initGame } = useGameStore();
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const names = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
    setPlayerNames(names);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    initGame(playerCount, playerNames);
  };

  return (
    <div className="modal">
      <div className="modal-content max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{t(lang, 'setup')}</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Number of Players (2-6)
          </label>
          <div className="flex space-x-2">
            {[2, 3, 4, 5, 6].map(count => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`px-4 py-2 rounded ${
                  playerCount === count 
                    ? 'bg-academic-blue text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Player Names</label>
          <div className="space-y-2">
            {playerNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-academic-blue"
                placeholder={`Player ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleStartGame}
            className="btn px-8 py-3 text-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
