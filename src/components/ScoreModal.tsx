import React from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../i18n';

const ScoreModal: React.FC = () => {
  const { lang, players, showScoring } = useGameStore();

  const handleClose = () => {
    showScoring(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">{t(lang, 'yearEnd')}</h2>
        
        <div className="space-y-3">
          {players.map(player => (
            <div key={player.id} className="flex justify-between items-center">
              <span>{player.name}</span>
              <span className="font-bold">{player.score} pts</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn" onClick={handleClose}>
            {t(lang, 'confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
