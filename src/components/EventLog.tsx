import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface EventLogProps {
  maxHeight?: string;
  showUndoButtons?: boolean;
  compactMode?: boolean;
}

const EventLog: React.FC<EventLogProps> = ({ 
  maxHeight = 'max-h-64',
  showUndoButtons = true,
  compactMode = false
}) => {
  const { 
    eventHistory, 
    showEventLog, 
    toggleEventLog, 
    undoLastAction,
    lang,
    highContrast,
    reducedMotion 
  } = useGameStore();
  
  const [filter, setFilter] = useState<'all' | 'undoable' | 'recent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'event_log': { en: 'Event Log', zh: '事件日志' },
      'undo': { en: 'Undo', zh: '撤销' },
      'clear_log': { en: 'Clear Log', zh: '清除日志' },
      'no_events': { en: 'No events yet', zh: '还没有事件' },
      'filter_all': { en: 'All', zh: '全部' },
      'filter_undoable': { en: 'Undoable', zh: '可撤销' },
      'filter_recent': { en: 'Recent', zh: '最近' },
      'search': { en: 'Search events...', zh: '搜索事件...' },
      'auto_scroll': { en: 'Auto-scroll', zh: '自动滚动' },
      'time_ago': { en: 'ago', zh: '前' },
      'just_now': { en: 'just now', zh: '刚刚' },
      'seconds': { en: 'seconds', zh: '秒' },
      'minutes': { en: 'minutes', zh: '分钟' },
      'hours': { en: 'hours', zh: '小时' }
    };
    return texts[key]?.[lang] || fallback;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 5) return getText('just_now', 'just now');
    if (diff < 60) return `${diff} ${getText('seconds', 'seconds')} ${getText('time_ago', 'ago')}`;
    if (diff < 3600) return `${Math.floor(diff / 60)} ${getText('minutes', 'minutes')} ${getText('time_ago', 'ago')}`;
    return `${Math.floor(diff / 3600)} ${getText('hours', 'hours')} ${getText('time_ago', 'ago')}`;
  };

  const getEventIcon = (action: string) => {
    const iconMap: Record<string, string> = {
      'roll_dice': '🎲',
      'draft_personality': '🎭',
      'draft_character': '👤',
      'start_research': '🔬',
      'publish': '📖',
      'trade_sent': '📤',
      'trade_accepted': '✅',
      'trade_rejected': '❌',
      'save': '💾',
      'load': '📂',
      'undo': '↩️',
      'end_turn': '⏭️',
      'year_end': '📅',
      'game_start': '🚀',
      'game_end': '🏁'
    };
    return iconMap[action] || '📝';
  };

  const getEventColor = (action: string, canUndo: boolean) => {
    if (canUndo) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }
    
    const colorMap: Record<string, string> = {
      'trade_accepted': 'bg-green-50 border-green-200 text-green-800',
      'trade_rejected': 'bg-red-50 border-red-200 text-red-800',
      'save': 'bg-purple-50 border-purple-200 text-purple-800',
      'load': 'bg-purple-50 border-purple-200 text-purple-800',
      'game_start': 'bg-green-50 border-green-200 text-green-800',
      'game_end': 'bg-red-50 border-red-200 text-red-800'
    };
    return colorMap[action] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const filteredEvents = eventHistory
    .filter(event => {
      // Filter by type
      if (filter === 'undoable' && !event.canUndo) return false;
      if (filter === 'recent' && Date.now() - event.timestamp > 300000) return false; // Last 5 minutes
      
      // Search filter
      if (searchTerm && !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .reverse(); // Show newest first

  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    if (autoScroll && showEventLog) {
      const logContainer = document.getElementById('event-log-container');
      if (logContainer) {
        setTimeout(() => {
          logContainer.scrollTop = logContainer.scrollHeight;
        }, 100);
      }
    }
  }, [eventHistory.length, autoScroll, showEventLog]);

  if (!showEventLog && !compactMode) {
    return (
      <button
        onClick={toggleEventLog}
        className={`
          fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg
          hover:bg-blue-600 transition-all z-10
          ${!reducedMotion ? 'hover:scale-110' : ''}
        `}
        aria-label={getText('event_log', 'Event Log')}
      >
        📋
      </button>
    );
  }

  return (
    <div 
      className={`
        ${compactMode 
          ? 'bg-white rounded-lg shadow border-2' 
          : 'fixed bottom-20 left-4 bg-white rounded-lg shadow-xl border-2 w-80'
        }
        ${highContrast ? 'border-4 border-black' : 'border-gray-200'}
      `}
      role="region"
      aria-labelledby="event-log-title"
    >
      {/* Header */}
      <div className="p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 
            id="event-log-title"
            className="font-semibold text-gray-800 text-sm"
          >
            {getText('event_log', 'Event Log')} ({filteredEvents.length})
          </h3>
          
          {!compactMode && (
            <button
              onClick={toggleEventLog}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close event log"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mt-2 space-y-2">
          <input
            type="text"
            placeholder={getText('search', 'Search events...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          
          <div className="flex gap-1">
            {(['all', 'undoable', 'recent'] as const).map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`
                  px-2 py-1 text-xs rounded transition-colors
                  ${filter === filterType 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
              >
                {getText(`filter_${filterType}`, filterType)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event List */}
      <div 
        id="event-log-container"
        className={`${maxHeight} overflow-y-auto p-2 space-y-1`}
      >
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            {getText('no_events', 'No events yet')}
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`
                event-item p-2 rounded border text-xs transition-all
                ${getEventColor(event.action, event.canUndo)}
                ${!reducedMotion && index === 0 ? 'animate-pulse' : ''}
                ${highContrast ? 'border-2' : ''}
              `}
              role="log"
              aria-label={`Event: ${event.description}`}
            >
              <div className="flex items-start gap-2">
                <span 
                  className="text-base flex-shrink-0" 
                  role="img" 
                  aria-hidden="true"
                >
                  {getEventIcon(event.action)}
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium break-words">
                    {event.description}
                  </div>
                  <div className="text-gray-500 mt-1 flex items-center justify-between">
                    <span>{formatTimeAgo(event.timestamp)}</span>
                    
                    {event.canUndo && showUndoButtons && (
                      <button
                        onClick={() => undoLastAction()}
                        className="ml-2 px-2 py-1 bg-white border rounded hover:bg-gray-50 text-xs font-medium transition-colors"
                        aria-label={`${getText('undo', 'Undo')} ${event.description}`}
                      >
                        {getText('undo', 'Undo')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      {!compactMode && (
        <div className="p-2 border-t bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-1 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              {getText('auto_scroll', 'Auto-scroll')}
            </label>
            
            {eventHistory.length > 0 && (
              <button
                onClick={() => {
                  // Clear event history - would need to add this to store
                  console.log('Clear log functionality not implemented');
                }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                {getText('clear_log', 'Clear Log')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventLog;
