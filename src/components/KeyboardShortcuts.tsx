import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
  enabled?: boolean;
  category: 'game' | 'navigation' | 'accessibility';
}

const KeyboardShortcuts: React.FC = () => {
  const { 
    gameState,
    executeAction,
    toggleEventLog,
    toggleMute,
    lang,
    highContrast,
    toggleHighContrast,
    toggleReducedMotion
  } = useGameStore();

  const [showHelp, setShowHelp] = useState(false);

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'keyboard_shortcuts': { en: 'Keyboard Shortcuts', zh: '键盘快捷键' },
      'game_actions': { en: 'Game Actions', zh: '游戏操作' },
      'navigation': { en: 'Navigation', zh: '导航' },
      'accessibility': { en: 'Accessibility', zh: '辅助功能' },
      'roll_dice': { en: 'Roll Dice', zh: '掷骰子' },
      'confirm_action': { en: 'Confirm Action', zh: '确认操作' },
      'publish_project': { en: 'Publish Project', zh: '发表项目' },
      'end_turn': { en: 'End Turn', zh: '结束回合' },
      'toggle_event_log': { en: 'Toggle Event Log', zh: '切换事件日志' },
      'toggle_help': { en: 'Toggle Help', zh: '切换帮助' },
      'focus_next': { en: 'Focus Next Element', zh: '聚焦下一个元素' },
      'focus_previous': { en: 'Focus Previous Element', zh: '聚焦上一个元素' },
      'toggle_mute': { en: 'Toggle Mute', zh: '切换静音' },
      'toggle_high_contrast': { en: 'Toggle High Contrast', zh: '切换高对比度' },
      'toggle_reduced_motion': { en: 'Toggle Reduced Motion', zh: '切换减少动画' },
      'close': { en: 'Close', zh: '关闭' },
      'press_key': { en: 'Press', zh: '按' },
      'to_action': { en: 'to', zh: '来' }
    };
    return texts[key]?.[lang] || fallback;
  };

  const shortcuts: ShortcutAction[] = [
    // Game Actions
    {
      key: 'r',
      description: getText('roll_dice', 'Roll Dice'),
      action: () => {
        if (gameState?.phase === 'DiceOrder') {
          executeAction('ROLL_ALL');
        }
      },
      enabled: gameState?.phase === 'DiceOrder',
      category: 'game'
    },
    {
      key: ' ', // Space
      description: getText('confirm_action', 'Confirm Action'),
      action: () => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.tagName === 'BUTTON') {
          activeElement.click();
        }
      },
      category: 'game'
    },
    {
      key: 'p',
      description: getText('publish_project', 'Publish Project'),
      action: () => {
        if (gameState?.phase === 'YearLoop') {
          // Would trigger publish action
          console.log('Publish action triggered');
        }
      },
      enabled: gameState?.phase === 'YearLoop',
      category: 'game'
    },
    {
      key: 'Enter',
      description: getText('end_turn', 'End Turn'),
      action: () => {
        executeAction('NEXT_PHASE');
      },
      category: 'game'
    },

    // Navigation
    {
      key: 'Tab',
      description: getText('focus_next', 'Focus Next Element'),
      action: () => {}, // Handled by browser
      category: 'navigation'
    },
    {
      key: 'Shift+Tab',
      description: getText('focus_previous', 'Focus Previous Element'),
      action: () => {}, // Handled by browser
      category: 'navigation'
    },
    {
      key: 'l',
      description: getText('toggle_event_log', 'Toggle Event Log'),
      action: toggleEventLog,
      category: 'navigation'
    },
    {
      key: '?',
      description: getText('toggle_help', 'Toggle Help'),
      action: () => setShowHelp(!showHelp),
      category: 'navigation'
    },

    // Accessibility
    {
      key: 'm',
      description: getText('toggle_mute', 'Toggle Mute'),
      action: toggleMute,
      category: 'accessibility'
    },
    {
      key: 'h',
      description: getText('toggle_high_contrast', 'Toggle High Contrast'),
      action: toggleHighContrast,
      category: 'accessibility'
    },
    {
      key: 'x',
      description: getText('toggle_reduced_motion', 'Toggle Reduced Motion'),
      action: toggleReducedMotion,
      category: 'accessibility'
    },
    {
      key: 'Escape',
      description: getText('close', 'Close'),
      action: () => {
        setShowHelp(false);
        // Also close any open modals
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur();
      },
      category: 'navigation'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return;
      }

      // Handle special key combinations
      let keyCombo = '';
      if (e.shiftKey) keyCombo += 'Shift+';
      if (e.ctrlKey) keyCombo += 'Ctrl+';
      if (e.altKey) keyCombo += 'Alt+';
      if (e.metaKey) keyCombo += 'Meta+';
      
      const key = e.key === ' ' ? ' ' : e.key;
      keyCombo += key;

      const shortcut = shortcuts.find(s => 
        s.key === keyCombo || s.key === key
      );

      if (shortcut && (shortcut.enabled !== false)) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, showHelp]);

  // Show help overlay
  if (showHelp) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div 
          className={`
            bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto
            ${highContrast ? 'border-4 border-black' : ''}
          `}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 id="shortcuts-title" className="text-lg font-semibold">
              {getText('keyboard_shortcuts', 'Keyboard Shortcuts')}
            </h2>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
              aria-label={getText('close', 'Close')}
            >
              ✕
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="p-4 space-y-4">
            {(['game', 'navigation', 'accessibility'] as const).map(category => {
              const categoryShortcuts = shortcuts.filter(s => s.category === category);
              
              return (
                <div key={category}>
                  <h3 className="font-medium text-gray-700 mb-2">
                    {getText(category === 'game' ? 'game_actions' : category, category)}
                  </h3>
                  
                  <div className="grid gap-2">
                    {categoryShortcuts.map(shortcut => (
                      <div 
                        key={shortcut.key}
                        className={`
                          flex items-center justify-between p-2 rounded border
                          ${shortcut.enabled === false 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-gray-50 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-500">
                            {getText('press_key', 'Press')}
                          </span>
                          <kbd 
                            className={`
                              px-2 py-1 bg-white border rounded font-mono
                              ${shortcut.enabled === false ? 'opacity-50' : ''}
                            `}
                          >
                            {shortcut.key}
                          </kbd>
                          <span className="text-gray-500">
                            {getText('to_action', 'to')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Always render the invisible keyboard event handler
  return (
    <div 
      className="sr-only" 
      aria-live="polite"
      role="status"
    >
      Keyboard shortcuts active. Press ? for help.
    </div>
  );
};

export default KeyboardShortcuts;
