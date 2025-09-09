import React from 'react';
import { useGameStore } from '../store/gameStore';

const SaveLoad: React.FC = () => {
  const { saveGame, loadGame } = useGameStore();

  return (
    <div className="save-load flex gap-2">
      <button
        onClick={saveGame}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Save
      </button>
      <button
        onClick={loadGame}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Load
      </button>
    </div>
  );
};

export default SaveLoad;
