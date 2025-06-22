import React from 'react';
import { useCacheStats } from '../hooks/useProductCache';
import { BarChart3, Trash2, RefreshCw } from 'lucide-react';

const CacheDebugPanel: React.FC = () => {
  const { stats, clearStats, clearCache } = useCacheStats();

  // N'afficher qu'en développement
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs z-50">
      <div className="flex items-center space-x-2 mb-3">
        <BarChart3 className="h-4 w-4 text-blue-500" />
        <span className="font-semibold">Cache Stats</span>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span>Hit Rate:</span>
          <span className="font-mono text-green-600">{stats.hitRate}</span>
        </div>
        <div className="flex justify-between">
          <span>Hits:</span>
          <span className="font-mono">{stats.hits}</span>
        </div>
        <div className="flex justify-between">
          <span>Misses:</span>
          <span className="font-mono">{stats.misses}</span>
        </div>
        <div className="flex justify-between">
          <span>Size:</span>
          <span className="font-mono">{stats.size}/20</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={clearStats}
          className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset</span>
        </button>
        <button
          onClick={clearCache}
          className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
        >
          <Trash2 className="h-3 w-3" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default CacheDebugPanel;