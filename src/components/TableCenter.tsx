import React from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../i18n';
import Timer from './Timer';

const TableCenter: React.FC = () => {
  const { lang, publicPools, timer, phase } = useGameStore();

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-center">
        {t(lang, 'phase')}: {t(lang, phase.toLowerCase() as any)}
      </h2>

      {phase === 'Trading' && (
        <div className="mb-4">
          <Timer />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">{t(lang, 'funding')} Pool</h3>
          <div className="grid grid-cols-3 gap-2">
            {publicPools.funding.slice(0, 6).map((card, index) => (
              <div key={card.id} className="p-2 bg-blue-50 rounded text-xs text-center">
                {card.displayName[lang]}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t(lang, 'collaboration')} Pool</h3>
          <div className="grid grid-cols-3 gap-2">
            {publicPools.collaboration.slice(0, 6).map((card, index) => (
              <div key={card.id} className="p-2 bg-green-50 rounded text-xs text-center">
                {card.displayName[lang]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCenter;
