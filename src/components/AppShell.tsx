import React from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../i18n';
import Dice from './Dice';

const AppShell: React.FC = () => {
  const { 
    lang, 
    year, 
    phase, 
    seed, 
    turnOrder,
    setSeed, 
    setLang, 
    saveGame, 
    loadGame,
    toggleDemo 
  } = useGameStore();

  return (
    <header className="bg-academic-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Game info */}
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">
              {t(lang, 'gameName')}
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <span>{t(lang, 'year')}: {year}</span>
              <span>{t(lang, 'phase')}: {t(lang, phase.toLowerCase() as any)}</span>
              <span>
                {turnOrder === 'clockwise' ? '↻' : '↺'}
              </span>
            </div>
          </div>

          {/* Center: Dice */}
          <div className="flex items-center">
            <Dice />
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder={t(lang, 'seed')}
              className="px-2 py-1 text-gray-900 rounded text-sm w-20"
            />
            
            <button 
              onClick={saveGame}
              className="btn-secondary text-xs px-3 py-1"
            >
              {t(lang, 'save')}
            </button>
            
            <button 
              onClick={loadGame}
              className="btn-secondary text-xs px-3 py-1"
            >
              {t(lang, 'load')}
            </button>
            
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
              className="px-2 py-1 text-gray-900 rounded text-sm"
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
            </select>
            
            <button 
              onClick={toggleDemo}
              className="btn-secondary text-xs px-3 py-1"
            >
              {t(lang, 'demo')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppShell;
