import React from 'react';
import { Leaf } from 'lucide-react';

interface Props {
  score: number;
  className?: string;
}

const EcoScoreBadge: React.FC<Props> = ({ score, className = '' }) => {
  const getColor = () => {
    if (score >= 0.8) return 'bg-eco-leaf text-white';
    if (score >= 0.6) return 'bg-eco-glow text-white';
    if (score >= 0.4) return 'bg-yellow-400 text-white';
    if (score >= 0.2) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getColor()} ${className}`}
      title={`Score écologique : ${score.toFixed(2)}`}
    >
      <Leaf size={12} className="mr-1" />
      {score.toFixed(2)} / 1
    </span>
  );
};

export default EcoScoreBadge;
