import React from 'react';

const YearTrack: React.FC<{ currentYear: number; totalYears: number }> = ({ 
  currentYear, 
  totalYears 
}) => {
  return (
    <div className="year-track bg-white rounded-lg p-3 shadow-md">
      <div className="text-center text-sm font-medium text-gray-700 mb-2">Year Progress</div>
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalYears }, (_, i) => i + 1).map(year => (
          <div
            key={year}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${year === currentYear 
                ? 'bg-blue-500 text-white' 
                : year < currentYear 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearTrack;
