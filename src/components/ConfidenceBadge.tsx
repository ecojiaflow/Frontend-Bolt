import React from 'react';

interface Props {
  pct: number;
  color: 'green' | 'yellow' | 'red';
}

const ConfidenceBadge: React.FC<Props> = ({ pct, color }) => {
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400', 
    red: 'bg-red-500'
  };

  return (
    <span className={`inline-block px-2 py-1 text-white text-xs rounded-full ${colors[color]}`}>
      {pct}% IA
    </span>
  );
};

export default ConfidenceBadge;