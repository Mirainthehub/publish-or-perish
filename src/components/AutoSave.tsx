import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface AutoSaveProps {
  interval?: number; // milliseconds
  showIndicator?: boolean;
}

const AutoSave: React.FC<AutoSaveProps> = ({ 
  interval = 30000, // 30 seconds default
  showIndicator = true 
}) => {
  const { 
    gameState, 
    autoSaveEnabled, 
    addEvent,
    lang,
    reducedMotion 
  } = useGameStore();
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'auto_saving': { en: 'Auto-saving...', zh: '自动保存中...' },
      'saved': { en: 'Saved', zh: '已保存' },
      'save_error': { en: 'Save failed', zh: '保存失败' },
      'last_saved': { en: 'Last saved', zh: '上次保存' },
      'never': { en: 'Never', zh: '从未' },
      'just_now': { en: 'just now', zh: '刚刚' },
      'minutes_ago': { en: 'minutes ago', zh: '分钟前' },
      'hours_ago': { en: 'hours ago', zh: '小时前' }
    };
    return texts[key]?.[lang] || fallback;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMs < 60000) return getText('just_now', 'just now');
    if (diffMins < 60) return `${diffMins} ${getText('minutes_ago', 'minutes ago')}`;
    return `${diffHours} ${getText('hours_ago', 'hours ago')}`;
  };

  const performAutoSave = async () => {
    if (!autoSaveEnabled || !gameState || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Create a more detailed save state
      const saveData = {
        gameState,
        timestamp: Date.now(),
        version: '1.0.0',
        metadata: {
          phase: gameState.phase,
          year: gameState.year,
          currentPlayer: gameState.players[gameState.currentPlayerIndex]?.name,
          totalPlayers: gameState.players.length
        }
      };

      // Save to localStorage with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          localStorage.setItem('publish-or-perish-autosave', JSON.stringify(saveData));
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retry
        }
      }

      setLastSaved(new Date());
      addEvent('autosave', 'Game auto-saved', false);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
      addEvent('autosave_error', 'Auto-save failed', false);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save interval
  useEffect(() => {
    if (!autoSaveEnabled || !gameState) return;

    const intervalId = setInterval(performAutoSave, interval);
    return () => clearInterval(intervalId);
  }, [autoSaveEnabled, gameState, interval, isSaving]);

  // Save on game state changes (debounced)
  useEffect(() => {
    if (!autoSaveEnabled || !gameState) return;

    const timeoutId = setTimeout(() => {
      performAutoSave();
    }, 2000); // Wait 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [gameState, autoSaveEnabled]);

  // Load auto-save on mount
  useEffect(() => {
    const loadAutoSave = () => {
      try {
        const saved = localStorage.getItem('publish-or-perish-autosave');
        if (saved) {
          const saveData = JSON.parse(saved);
          if (saveData.timestamp) {
            setLastSaved(new Date(saveData.timestamp));
          }
        }
      } catch (error) {
        console.error('Failed to load auto-save info:', error);
      }
    };

    loadAutoSave();
  }, []);

  // Don't render anything if indicator is disabled
  if (!showIndicator) return null;

  return (
    <div 
      className={`
        fixed top-4 right-20 z-10 flex items-center gap-2 px-3 py-1 
        bg-white border rounded-lg shadow-sm text-xs transition-all
        ${isSaving ? 'border-blue-300 bg-blue-50' : ''}
        ${saveError ? 'border-red-300 bg-red-50' : ''}
        ${!autoSaveEnabled ? 'opacity-50' : ''}
      `}
      role="status"
      aria-live="polite"
      aria-label="Auto-save status"
    >
      {/* Status Icon */}
      <div className="flex items-center">
        {isSaving ? (
          <div 
            className={`
              w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full
              ${!reducedMotion ? 'animate-spin' : ''}
            `}
            aria-hidden="true"
          />
        ) : saveError ? (
          <span className="text-red-500" role="img" aria-label="Error">⚠️</span>
        ) : (
          <span className="text-green-500" role="img" aria-label="Saved">✓</span>
        )}
      </div>

      {/* Status Text */}
      <div className="text-gray-600">
        {isSaving ? (
          getText('auto_saving', 'Auto-saving...')
        ) : saveError ? (
          <span className="text-red-600">{getText('save_error', 'Save failed')}</span>
        ) : (
          <span className="text-green-600">{getText('saved', 'Saved')}</span>
        )}
      </div>

      {/* Last Saved Time */}
      {lastSaved && !isSaving && (
        <div className="text-gray-400 border-l pl-2 ml-2">
          {getText('last_saved', 'Last saved')}: {formatTimeAgo(lastSaved)}
        </div>
      )}

      {/* Auto-save Disabled Indicator */}
      {!autoSaveEnabled && (
        <div className="text-gray-400 border-l pl-2 ml-2">
          Auto-save disabled
        </div>
      )}
    </div>
  );
};

// Hook for manual save operations
export const useManualSave = () => {
  const { saveGame, addEvent } = useGameStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setIsSaving(true);
    setError(null);

    try {
      saveGame();
      addEvent('manual_save', 'Game manually saved', false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      addEvent('save_error', `Manual save failed: ${errorMessage}`, false);
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error };
};

// Component for manual save button
export const SaveButton: React.FC<{ variant?: 'icon' | 'text' | 'full' }> = ({ 
  variant = 'full' 
}) => {
  const { lang } = useGameStore();
  const { save, isSaving, error } = useManualSave();

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'save_game': { en: 'Save Game', zh: '保存游戏' },
      'saving': { en: 'Saving...', zh: '保存中...' },
      'save_failed': { en: 'Save Failed', zh: '保存失败' }
    };
    return texts[key]?.[lang] || fallback;
  };

  return (
    <button
      onClick={save}
      disabled={isSaving}
      className={`
        flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg
        hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors text-sm font-medium
        ${error ? 'bg-red-500 hover:bg-red-600' : ''}
      `}
      aria-label={
        isSaving 
          ? getText('saving', 'Saving...') 
          : error 
          ? getText('save_failed', 'Save Failed')
          : getText('save_game', 'Save Game')
      }
    >
      {/* Icon */}
      <span role="img" aria-hidden="true">
        {isSaving ? '⏳' : error ? '⚠️' : '💾'}
      </span>

      {/* Text */}
      {variant !== 'icon' && (
        <span>
          {isSaving 
            ? getText('saving', 'Saving...') 
            : error 
            ? getText('save_failed', 'Save Failed')
            : getText('save_game', 'Save Game')
          }
        </span>
      )}
    </button>
  );
};

export default AutoSave;
