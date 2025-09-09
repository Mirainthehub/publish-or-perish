import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface Card {
  id: string;
  name: string;
  type: string;
  description?: string;
  tokens?: {
    funding?: number;
    collaboration?: number;
    special?: number;
  };
}

interface DraftRowProps {
  cards: Card[];
  onSelect: (cardId: string) => void;
  disabled?: boolean;
  title: string;
  currentPlayerIndex?: number;
  pickOrder?: number[];
  showPickOrder?: boolean;
  maxSelections?: number;
  selectedCards?: string[];
  timeLimit?: number;
  onTimeUp?: () => void;
}

const DraftRow: React.FC<DraftRowProps> = ({ 
  cards, 
  onSelect, 
  disabled = false, 
  title,
  currentPlayerIndex = 0,
  pickOrder = [],
  showPickOrder = false,
  maxSelections = 1,
  selectedCards = [],
  timeLimit,
  onTimeUp
}) => {
  const { lang, reducedMotion, highContrast, gameState } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Timer logic
  useEffect(() => {
    if (timeLimit && timeLeft > 0 && !disabled) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, timeLimit, disabled, onTimeUp]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || cards.length === 0) return;

      const currentIndex = selectedCard ? cards.findIndex(c => c.id === selectedCard) : -1;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % cards.length;
          setSelectedCard(cards[nextIndex].id);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = currentIndex <= 0 ? cards.length - 1 : currentIndex - 1;
          setSelectedCard(cards[prevIndex].id);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectedCard) {
            handleSelect(selectedCard);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedCard(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard, cards, disabled]);

  const handleSelect = (cardId: string) => {
    if (disabled || selectedCards.length >= maxSelections) return;
    onSelect(cardId);
    setSelectedCard(null);
  };

  const isCardSelected = (cardId: string) => selectedCards.includes(cardId);
  const isCardFocused = (cardId: string) => selectedCard === cardId;
  const isActivePlayer = gameState?.currentPlayerIndex === currentPlayerIndex;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'select_card': { en: 'Select a card', zh: '选择卡片' },
      'time_left': { en: 'Time left', zh: '剩余时间' },
      'pick_order': { en: 'Pick Order', zh: '选择顺序' },
      'selected': { en: 'Selected', zh: '已选择' },
      'funding': { en: 'Funding', zh: '资金' },
      'collaboration': { en: 'Collaboration', zh: '合作' },
      'special': { en: 'Special', zh: '特殊' }
    };
    return texts[key]?.[lang] || fallback;
  };

  return (
    <div 
      className={`draft-row bg-white rounded-lg p-4 shadow-md border-2 transition-all ${
        isActivePlayer && !disabled 
          ? 'border-blue-400 ring-2 ring-blue-200' 
          : 'border-gray-200'
      } ${highContrast ? 'border-4' : ''}`}
      data-tutorial="draft-row"
      role="region"
      aria-labelledby={`draft-title-${title.replace(/\s+/g, '-')}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 
            id={`draft-title-${title.replace(/\s+/g, '-')}`}
            className="text-lg font-semibold text-gray-700"
          >
            {title}
          </h3>
          
          {/* Pick Order Ribbon */}
          {showPickOrder && pickOrder.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getText('pick_order', 'Pick Order')}:</span>
              <div className="flex gap-1">
                {pickOrder.map((playerIndex, order) => (
                  <div
                    key={playerIndex}
                    className={`
                      w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                      ${playerIndex === currentPlayerIndex 
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300' 
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}
                    title={`Player ${playerIndex + 1} picks ${order + 1}${order === 0 ? 'st' : order === 1 ? 'nd' : order === 2 ? 'rd' : 'th'}`}
                  >
                    {order + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        {timeLimit && timeLeft > 0 && !disabled && (
          <div 
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              timeLeft <= 10 
                ? 'bg-red-100 text-red-700' 
                : timeLeft <= 30 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-green-100 text-green-700'
            }`}
            role="timer"
            aria-live="polite"
          >
            <span>⏰</span>
            <span>{getText('time_left', 'Time left')}: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Selection Info */}
      {maxSelections > 1 && (
        <div className="mb-3 text-sm text-gray-600">
          {getText('selected', 'Selected')}: {selectedCards.length}/{maxSelections}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cards.map((card) => {
          const selected = isCardSelected(card.id);
          const focused = isCardFocused(card.id);
          
          return (
            <button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              disabled={disabled || (selectedCards.length >= maxSelections && !selected)}
              className={`
                group relative p-4 border-2 rounded-lg text-left transition-all
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${disabled 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                  : selected
                  ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-lg'
                  : focused
                  ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }
                ${!reducedMotion ? 'transform hover:scale-105' : ''}
                ${highContrast ? 'border-4' : ''}
              `}
              aria-pressed={selected}
              aria-describedby={`card-desc-${card.id}`}
              tabIndex={disabled ? -1 : 0}
            >
              {/* Selection indicator */}
              {selected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}

              {/* Focus indicator */}
              {focused && !reducedMotion && (
                <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-lg animate-pulse" />
              )}

              {/* Card content */}
              <div className="relative z-10">
                <div className="font-semibold text-sm mb-1">{card.name}</div>
                <div className="text-xs text-gray-500 mb-2">{card.type}</div>
                
                {card.description && (
                  <div 
                    id={`card-desc-${card.id}`}
                    className="text-xs text-gray-600 mb-2 line-clamp-2"
                  >
                    {card.description}
                  </div>
                )}

                {/* Token display */}
                {card.tokens && (
                  <div className="flex gap-2 mt-2">
                    {card.tokens.funding && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full" title={getText('funding', 'Funding')} />
                        <span>{card.tokens.funding}</span>
                      </div>
                    )}
                    {card.tokens.collaboration && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="w-3 h-3 bg-blue-400 rounded-full" title={getText('collaboration', 'Collaboration')} />
                        <span>{card.tokens.collaboration}</span>
                      </div>
                    )}
                    {card.tokens.special && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="w-3 h-3 bg-purple-400 rounded-full" title={getText('special', 'Special')} />
                        <span>{card.tokens.special}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Keyboard hint */}
              {focused && (
                <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                  Press Enter
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      {!disabled && cards.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          Use arrow keys to navigate, Enter/Space to select, Esc to clear focus
        </div>
      )}
    </div>
  );
};

export default DraftRow;
