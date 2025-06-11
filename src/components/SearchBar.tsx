import React, { useState, useEffect } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchSuggestions } from '../api/realApi';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Suggestions IA en temps réel
  useEffect(() => {
    if (query.length > 2) {
      setLoadingSuggestions(true);
      const timer = setTimeout(async () => {
        try {
          const aiSuggestions = await fetchSuggestions(query);
          setSuggestions(aiSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Erreur suggestions:', error);
          setSuggestions([]);
        }
        setLoadingSuggestions(false);
      }, 500); // Délai pour éviter trop d'appels

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full py-4 px-12 border-2 border-eco-text/10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50 transition-all text-eco-text placeholder-eco-text/50 bg-white/90 backdrop-blur"
            aria-label={t('accessibility.searchInput')}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
          />
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-text/50" 
            aria-hidden="true"
          />
        </div>
        
        <button
          type="submit"
          className="bg-eco-leaf hover:bg-eco-text text-white px-6 py-4 rounded-full font-medium transition-colors shadow-lg shadow-eco-leaf/20 hover:shadow-eco-text/20 flex items-center"
          aria-label={t('accessibility.searchButton')}
        >
          <Search size={20} className="mr-2" />
          {t('common.search')}
        </button>
      </form>

      {/* Suggestions IA */}
      {showSuggestions && (query.length > 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur border border-eco-text/10 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-eco-text/10 bg-eco-leaf/5">
            <div className="flex items-center text-sm text-eco-text/70">
              <Lightbulb className="w-4 h-4 mr-2 text-eco-leaf" />
              {loadingSuggestions ? 'IA en cours d\'analyse...' : 'Suggestions intelligentes'}
            </div>
          </div>
          
          {loadingSuggestions ? (
            <div className="p-4">
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-eco-text/10 rounded-md"></div>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-eco-leaf/10 transition-colors border-b border-eco-text/5 last:border-b-0"
                >
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-3 text-eco-text/40" />
                    <span className="text-eco-text">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-eco-text/50 text-sm">
              Aucune suggestion trouvée
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer les suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;