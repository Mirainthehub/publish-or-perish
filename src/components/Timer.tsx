import React from 'react';
import { useGameStore } from '../store/gameStore';

const Timer: React.FC = () => {
  const { timer } = useGameStore();

  const minutes = Math.floor(timer.seconds / 60);
  const seconds = timer.seconds % 60;

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-academic-blue">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-gray-600">
        Trading Time {timer.isRunning ? '(Running)' : '(Paused)'}
      </div>
    </div>
  );
};

export default Timer;
