import React from 'react';

interface PlayBoardProps {
  fundingCards: any[];
  collaborationCards: any[];
  setbacksCount: number;
}

const PlayBoard: React.FC<PlayBoardProps> = ({ 
  fundingCards, 
  collaborationCards, 
  setbacksCount 
}) => {
  return (
    <div className="play-board bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Resource Pool</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Funding Pool */}
        <div className="resource-pool">
          <h3 className="text-lg font-semibold mb-3 text-green-700">Funding Pool</h3>
          <div className="grid grid-cols-1 gap-2 min-h-32">
            {fundingCards.map((card, index) => (
              <div 
                key={card.id || index}
                className="bg-green-50 border border-green-300 rounded p-2 text-center cursor-pointer hover:bg-green-100"
              >
                <div className="font-medium text-sm">{card.name}</div>
                <div className="text-xs text-gray-600">Value: {card.value}</div>
              </div>
            ))}
            {fundingCards.length === 0 && (
              <div className="text-gray-400 text-center py-4">No funding available</div>
            )}
          </div>
        </div>

        {/* Collaboration Pool */}
        <div className="resource-pool">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Collaboration Pool</h3>
          <div className="grid grid-cols-1 gap-2 min-h-32">
            {collaborationCards.map((card, index) => (
              <div 
                key={card.id || index}
                className="bg-blue-50 border border-blue-300 rounded p-2 text-center cursor-pointer hover:bg-blue-100"
              >
                <div className="font-medium text-sm">{card.name}</div>
                <div className="text-xs text-gray-600">Value: {card.value}</div>
              </div>
            ))}
            {collaborationCards.length === 0 && (
              <div className="text-gray-400 text-center py-4">No collaborations available</div>
            )}
          </div>
        </div>

        {/* Setbacks Pile */}
        <div className="resource-pool">
          <h3 className="text-lg font-semibold mb-3 text-red-700">Setbacks</h3>
          <div className="min-h-32 flex items-center justify-center">
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{setbacksCount}</div>
              <div className="text-sm text-gray-600">Cards Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayBoard;
