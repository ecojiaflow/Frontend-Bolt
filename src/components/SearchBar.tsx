import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full py-4 px-12 border-2 border-eco-text/10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50 transition-all text-eco-text placeholder-eco-text/50 bg-white/90 backdrop-blur"
            aria-label={t('accessibility.searchInput')}
          />
          <Search 
            className="absolute left-4 h-5 w-5 text-eco-text/50" 
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
    </div>
  );
};

export default SearchBar;