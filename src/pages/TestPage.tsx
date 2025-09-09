import React from 'react';
import { useGameStore } from '../store/gameStore';
import HUD from '../components/HUD';
import PlayerBoard from '../components/PlayerBoard';
import DraftRow from '../components/DraftRow';
import TradePanel from '../components/TradePanel';
import EventLog from '../components/EventLog';
import Onboarding from '../components/Onboarding';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import AutoSave from '../components/AutoSave';

const TestPage: React.FC = () => {
  const { gameState, initGame, lang } = useGameStore();

  const handleStartTestGame = () => {
    initGame(3, ['Player 1', 'Player 2', 'Player 3'], 'test-seed-123');
  };

  const testCards = [
    {
      id: 'card-1',
      name: 'Research Project A',
      type: 'Basic Research',
      description: 'A fundamental research project in your field',
      tokens: { funding: 2, collaboration: 1, special: 0 }
    },
    {
      id: 'card-2',
      name: 'Interdisciplinary Study',
      type: 'Applied Research',
      description: 'Collaboration across multiple disciplines',
      tokens: { funding: 3, collaboration: 2, special: 1 }
    },
    {
      id: 'card-3',
      name: 'Breakthrough Innovation',
      type: 'Breakthrough',
      description: 'High-risk, high-reward research opportunity',
      tokens: { funding: 5, collaboration: 1, special: 2 }
    }
  ];

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'test_page_title': { en: '🧪 UX Testing Page', zh: '🧪 UX测试页面' },
      'start_test_game': { en: 'Start Test Game', zh: '开始测试游戏' },
      'test_components': { en: 'Test Components', zh: '测试组件' },
      'instructions': { en: 'Instructions', zh: '说明' },
      'keyboard_shortcuts': { en: 'Keyboard Shortcuts', zh: '键盘快捷键' },
      'select_card': { en: 'Select a card', zh: '选择一张卡片' },
      'component_tests': { en: 'Component Tests', zh: '组件测试' }
    };
    return texts[key]?.[lang] || fallback;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Global UX Components */}
      <HUD />
      <AutoSave />
      <EventLog />
      <TradePanel />
      <Onboarding />
      <KeyboardShortcuts />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {getText('test_page_title', '🧪 UX Testing Page')}
          </h1>
          
          {!gameState ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                {lang === 'zh' 
                  ? '点击下面的按钮开始测试游戏的UX功能。'
                  : 'Click the button below to start testing the game UX features.'
                }
              </p>
              <button
                onClick={handleStartTestGame}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                {getText('start_test_game', 'Start Test Game')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-green-600 font-medium">
                ✅ {lang === 'zh' ? '游戏已启动！' : 'Game initialized!'} 
                Phase: {gameState.phase}, Year: {gameState.year}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'zh' 
                  ? '现在你可以测试各种UX组件和功能。'
                  : 'You can now test various UX components and features.'
                }
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {getText('instructions', 'Instructions')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">
                {getText('keyboard_shortcuts', 'Keyboard Shortcuts')}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><kbd className="bg-gray-100 px-1 rounded">?</kbd> - Show help</li>
                <li><kbd className="bg-gray-100 px-1 rounded">r</kbd> - Roll dice</li>
                <li><kbd className="bg-gray-100 px-1 rounded">Space</kbd> - Confirm action</li>
                <li><kbd className="bg-gray-100 px-1 rounded">l</kbd> - Toggle event log</li>
                <li><kbd className="bg-gray-100 px-1 rounded">m</kbd> - Toggle mute</li>
                <li><kbd className="bg-gray-100 px-1 rounded">h</kbd> - Toggle high contrast</li>
                <li><kbd className="bg-gray-100 px-1 rounded">x</kbd> - Toggle reduced motion</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                {getText('test_components', 'Test Components')}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🎯 HUD - Top game status bar</li>
                <li>🔄 Trade Panel - Bottom right button</li>
                <li>📋 Event Log - Bottom left button</li>
                <li>💾 Auto-save - Top right indicator</li>
                <li>🎓 Onboarding - First-time user flow</li>
                <li>⌨️ Keyboard shortcuts - Press ? for help</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Component Tests */}
        {gameState && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {getText('component_tests', 'Component Tests')}
              </h2>
              
              {/* Player Board Test */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Enhanced Player Board</h3>
                <PlayerBoard 
                  player={gameState.players[0]} 
                  isCurrentPlayer={true}
                  showGhostSlots={true}
                  showProgress={true}
                />
              </div>

              {/* Draft Row Test */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Enhanced Draft Row</h3>
                <DraftRow
                  title={getText('select_card', 'Select a card')}
                  cards={testCards}
                  onSelect={(cardId) => console.log('Selected card:', cardId)}
                  currentPlayerIndex={0}
                  pickOrder={[0, 1, 2]}
                  showPickOrder={true}
                  timeLimit={60}
                  onTimeUp={() => console.log('Time up!')}
                />
              </div>
            </div>

            {/* Additional Player Boards */}
            <div className="grid md:grid-cols-2 gap-4">
              {gameState.players.slice(1).map((player) => (
                <PlayerBoard 
                  key={player.id}
                  player={player} 
                  isCurrentPlayer={false}
                  compactMode={true}
                />
              ))}
            </div>
          </>
        )}

        {/* Testing Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            🔍 {lang === 'zh' ? '测试重点' : 'Testing Focus Areas'}
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• {lang === 'zh' ? '键盘导航和快捷键' : 'Keyboard navigation and shortcuts'}</li>
            <li>• {lang === 'zh' ? '响应式设计和移动端适配' : 'Responsive design and mobile adaptation'}</li>
            <li>• {lang === 'zh' ? '无障碍功能（屏幕阅读器、高对比度）' : 'Accessibility features (screen readers, high contrast)'}</li>
            <li>• {lang === 'zh' ? '交互反馈和动画效果' : 'Interactive feedback and animations'}</li>
            <li>• {lang === 'zh' ? '多语言支持' : 'Multi-language support'}</li>
            <li>• {lang === 'zh' ? '自动保存和状态管理' : 'Auto-save and state management'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
