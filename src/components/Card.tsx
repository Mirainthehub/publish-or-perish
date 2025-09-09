import React from 'react';
import { Card as CardType } from '../engine/types';
import { useGameStore } from '../store/gameStore';

interface CardProps {
  card: CardType;
  isHidden?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isHidden = false, onClick, className = '' }) => {
  const { lang } = useGameStore();

  if (isHidden) {
    return (
      <div className={`card bg-gray-400 text-white text-center cursor-pointer ${className}`} onClick={onClick}>
        <div className="text-xs">Hidden</div>
        <div className="text-lg">?</div>
      </div>
    );
  }

  const getCardColor = (type: string) => {
    switch (type) {
      case 'Basic': return 'bg-blue-100 border-blue-300';
      case 'Applied': return 'bg-green-100 border-green-300';
      case 'Breakthrough': return 'bg-purple-100 border-purple-300';
      case 'Interdisciplinary': return 'bg-yellow-100 border-yellow-300';
      case 'Small': return 'bg-blue-100 border-blue-300';
      case 'Large': return 'bg-green-100 border-green-300';
      case 'Industry': return 'bg-purple-100 border-purple-300';
      case 'Crowdfunding': return 'bg-orange-100 border-orange-300';
      case 'Local': return 'bg-green-100 border-green-300';
      case 'International': return 'bg-blue-100 border-blue-300';
      case 'Institutional': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div 
      className={`card cursor-pointer hover:shadow-lg transition-shadow ${getCardColor(card.type)} ${className}`}
      onClick={onClick}
    >
      <div className="text-xs font-medium text-gray-600 mb-1">{card.type}</div>
      <div className="text-sm font-semibold">{card.displayName[lang]}</div>
      {card.value && (
        <div className="text-xs text-gray-600 mt-1">Value: {card.value}</div>
      )}
      {card.points && (
        <div className="text-xs text-gray-600 mt-1">Points: {card.points}</div>
      )}
    </div>
  );
};

export default Card;
