import React from 'react';

interface DiceProps {
  value?: number;
  onRoll?: () => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, onRoll, disabled = false }) => {
  const getDiceFace = (num?: number) => {
    if (!num) return '?';
    return num.toString();
  };

  return (
    <button
      onClick={onRoll}
      disabled={disabled}
      className={`
        w-16 h-16 bg-white border-2 border-gray-400 rounded-lg
        flex items-center justify-center text-2xl font-bold
        transition-all duration-200 transform
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:scale-105 cursor-pointer'}
        ${value ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}
        shadow-lg
      `}
    >
      {getDiceFace(value)}
    </button>
  );
};

export default Dice;
