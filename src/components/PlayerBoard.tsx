import React, { useState } from 'react';
import { Player } from '../engine/fsm';
import { useGameStore } from '../store/gameStore';

interface PlayerBoardProps {
  player: Player;
  isCurrentPlayer?: boolean;
  showGhostSlots?: boolean;
  compactMode?: boolean;
  showProgress?: boolean;
}

interface TokenChipProps {
  type: 'funding' | 'collaboration' | 'special';
  amount: number;
  maxAmount?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TokenChip: React.FC<TokenChipProps> = ({ 
  type, 
  amount, 
  maxAmount = 10, 
  showProgress = false,
  size = 'md' 
}) => {
  const { lang, highContrast } = useGameStore();
  
  const getTokenConfig = () => {
    switch (type) {
      case 'funding':
        return {
          color: 'yellow',
          icon: '💰',
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800',
          borderClass: 'border-yellow-300',
          progressClass: 'bg-yellow-500',
          label: { en: 'Funding', zh: '资金' }
        };
      case 'collaboration':
        return {
          color: 'blue',
          icon: '🤝',
          bgClass: 'bg-blue-100',
          textClass: 'text-blue-800',
          borderClass: 'border-blue-300',
          progressClass: 'bg-blue-500',
          label: { en: 'Collaboration', zh: '合作' }
        };
      case 'special':
        return {
          color: 'purple',
          icon: '⭐',
          bgClass: 'bg-purple-100',
          textClass: 'text-purple-800',
          borderClass: 'border-purple-300',
          progressClass: 'bg-purple-500',
          label: { en: 'Special', zh: '特殊' }
        };
    }
  };

  const config = getTokenConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const progressPercentage = Math.min((amount / maxAmount) * 100, 100);

  return (
    <div 
      className={`
        relative flex flex-col items-center rounded-lg border-2 transition-all
        ${config.bgClass} ${config.borderClass} ${sizeClasses[size]}
        ${highContrast ? 'border-4' : ''}
      `}
      role="status"
      aria-label={`${config.label[lang]}: ${amount}${maxAmount ? ` of ${maxAmount}` : ''}`}
    >
      {/* Token Icon & Amount */}
      <div className="flex items-center gap-1">
        <span role="img" aria-hidden="true">{config.icon}</span>
        <span className={`font-bold ${config.textClass}`}>
          {amount}
        </span>
        {maxAmount && size === 'lg' && (
          <span className="text-xs text-gray-500">/{maxAmount}</span>
        )}
      </div>
      
      {/* Label */}
      <div className="text-xs text-gray-600 mt-1">
        {config.label[lang]}
      </div>

      {/* Progress Bar */}
      {showProgress && maxAmount && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            className={`${config.progressClass} h-1.5 rounded-full transition-all duration-300`}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={amount}
            aria-valuemin={0}
            aria-valuemax={maxAmount}
          />
        </div>
      )}
    </div>
  );
};

interface ProjectSlotProps {
  project?: any;
  slotIndex: number;
  isGhost?: boolean;
  onDrop?: (projectId: string, slotIndex: number) => void;
  showProgress?: boolean;
}

const ProjectSlot: React.FC<ProjectSlotProps> = ({ 
  project, 
  slotIndex, 
  isGhost = false, 
  onDrop,
  showProgress = false 
}) => {
  const { lang, highContrast } = useGameStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const projectId = e.dataTransfer.getData('text/plain');
    onDrop?.(projectId, slotIndex);
  };

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'project_slot': { en: 'Project Slot', zh: '项目槽' },
      'empty_slot': { en: 'Empty Slot', zh: '空槽' },
      'ghost_slot': { en: 'Future Slot', zh: '未来槽' },
      'progress': { en: 'Progress', zh: '进度' }
    };
    return texts[key]?.[lang] || fallback;
  };

  return (
    <div 
      className={`
        relative project-slot border-2 rounded-lg p-3 h-24 transition-all
        ${isGhost 
          ? 'border-dashed border-gray-200 bg-gray-50 opacity-60' 
          : project 
          ? 'border-solid border-green-300 bg-green-50' 
          : isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-dashed border-gray-300 bg-gray-50'
        }
        ${highContrast ? 'border-4' : ''}
        ${!isGhost && !project ? 'hover:border-gray-400 hover:bg-gray-100' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label={`${getText('project_slot', 'Project Slot')} ${slotIndex + 1}`}
      tabIndex={0}
    >
      {project ? (
        <div className="h-full flex flex-col">
          <div className="font-medium text-sm text-green-800 mb-1 line-clamp-2">
            {project.name}
          </div>
          
          {/* Project Progress */}
          {showProgress && project.progress !== undefined && (
            <div className="mt-auto">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{getText('progress', 'Progress')}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                  role="progressbar"
                  aria-valuenow={project.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}
          
          {/* Project Type/Cost */}
          {project.cost && (
            <div className="mt-1 flex gap-1">
              {Object.entries(project.cost).map(([type, amount]: [string, any]) => (
                <div key={type} className="flex items-center gap-1 text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    type === 'funding' ? 'bg-yellow-400' : 
                    type === 'collaboration' ? 'bg-blue-400' : 'bg-purple-400'
                  }`} />
                  <span>{amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : isGhost ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-xs text-gray-400 text-center">
            <div>🔮</div>
            <div>{getText('ghost_slot', 'Future Slot')}</div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-xs text-gray-400 text-center">
            <div>📋</div>
            <div>{getText('empty_slot', 'Empty Slot')}</div>
          </div>
        </div>
      )}

      {/* Drop indicator */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-200 bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium">Drop here</div>
        </div>
      )}
    </div>
  );
};

const PlayerBoard: React.FC<PlayerBoardProps> = ({ 
  player, 
  isCurrentPlayer = false,
  showGhostSlots = true,
  compactMode = false,
  showProgress = true
}) => {
  const { lang, highContrast, reducedMotion } = useGameStore();
  
  const handleProjectDrop = (projectId: string, slotIndex: number) => {
    console.log(`Drop project ${projectId} to slot ${slotIndex}`);
    // Implementation would depend on game logic
  };

  const getText = (key: string, fallback: string) => {
    const texts: Record<string, Record<string, string>> = {
      'score': { en: 'Score', zh: '分数' },
      'character': { en: 'Character', zh: '角色' },
      'personality': { en: 'Personality', zh: '性格' },
      'none': { en: 'None', zh: '无' },
      'projects': { en: 'Projects', zh: '项目' },
      'publications': { en: 'Publications', zh: '发表' }
    };
    return texts[key]?.[lang] || fallback;
  };

  const maxProjectSlots = 3;
  const ghostSlots = showGhostSlots ? Math.max(0, maxProjectSlots - player.projects.length) : 0;

  return (
    <div 
      className={`
        player-board bg-white rounded-lg shadow-md border-2 transition-all
        ${isCurrentPlayer 
          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200'
        }
        ${!reducedMotion && isCurrentPlayer ? 'transform scale-105' : ''}
        ${compactMode ? 'p-3' : 'p-4'}
        ${highContrast ? 'border-4' : ''}
      `}
      role="region"
      aria-labelledby={`player-${player.id}-name`}
      aria-describedby={`player-${player.id}-stats`}
    >
      {/* Player Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 
            id={`player-${player.id}-name`}
            className={`font-bold text-gray-800 ${
              compactMode ? 'text-base' : 'text-lg'
            }`}
          >
            {player.name}
          </h3>
          {isCurrentPlayer && (
            <div 
              className={`
                flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs
                ${!reducedMotion ? 'animate-pulse' : ''}
              `}
              role="status"
              aria-label="Current player"
            >
              <span>👤</span>
              <span>Active</span>
            </div>
          )}
        </div>
        
        <div 
          className="text-sm text-gray-600 font-medium"
          id={`player-${player.id}-stats`}
        >
          {getText('score', 'Score')}: <span className="font-bold text-blue-600">{player.score}</span>
        </div>
      </div>

      {/* Character & Personality */}
      {!compactMode && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-xs text-gray-500">{getText('character', 'Character')}</div>
            <div className="font-medium text-sm">{player.character?.name || getText('none', 'None')}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border">
            <div className="text-xs text-gray-500">{getText('personality', 'Personality')}</div>
            <div className="font-medium text-sm">{player.personality?.name || getText('none', 'None')}</div>
          </div>
        </div>
      )}

      {/* Tokens */}
      <div className={`grid gap-2 mb-4 ${compactMode ? 'grid-cols-3' : 'grid-cols-3'}`}>
        <TokenChip 
          type="funding" 
          amount={player.tokens.funding} 
          showProgress={showProgress}
          size={compactMode ? 'sm' : 'md'}
        />
        <TokenChip 
          type="collaboration" 
          amount={player.tokens.collaboration} 
          showProgress={showProgress}
          size={compactMode ? 'sm' : 'md'}
        />
        <TokenChip 
          type="special" 
          amount={player.tokens.special} 
          showProgress={showProgress}
          size={compactMode ? 'sm' : 'md'}
        />
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            {getText('projects', 'Projects')}
          </h4>
          <div className="text-xs text-gray-500">
            {player.projects.length}/{maxProjectSlots}
          </div>
        </div>
        
        <div className={`grid gap-2 ${compactMode ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {/* Actual Projects */}
          {player.projects.map((project, index) => (
            <ProjectSlot
              key={`project-${index}`}
              project={project}
              slotIndex={index}
              onDrop={handleProjectDrop}
              showProgress={showProgress}
            />
          ))}
          
          {/* Empty Slots */}
          {Array.from({ length: maxProjectSlots - player.projects.length }, (_, index) => (
            <ProjectSlot
              key={`empty-${index}`}
              slotIndex={player.projects.length + index}
              onDrop={handleProjectDrop}
              showProgress={showProgress}
            />
          ))}
          
          {/* Ghost Slots */}
          {showGhostSlots && Array.from({ length: ghostSlots }, (_, index) => (
            <ProjectSlot
              key={`ghost-${index}`}
              slotIndex={maxProjectSlots + index}
              isGhost={true}
            />
          ))}
        </div>
      </div>

      {/* Publications Summary */}
      {!compactMode && Object.keys(player.publications || {}).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">{getText('publications', 'Publications')}</div>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(player.publications || {}).map(([type, count]: [string, any]) => (
              <span 
                key={type}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerBoard;
