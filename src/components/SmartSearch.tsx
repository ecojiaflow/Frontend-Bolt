import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { CATEGORIES, CategoryType } from '../types/categories';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  type: 'category' | 'product' | 'tag' | 'recent';
  value: string;
  label: string;
  icon?: string;
  category?: string;
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  placeholder = "Rechercher des produits éco-responsables...",
  autoFocus = false 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Suggestions statiques intelligentes par catégorie
  const staticSuggestions: SearchSuggestion[] = [
    // Catégories
    { type: 'category', value: 'alimentaire', label: 'Alimentaire', icon: '🍎' },
    { type: 'category', value: 'cosmetique', label: 'Cosmétiques', icon: '💄' },
    { type: 'category', value: 'mode', label: 'Mode', icon: '👕' },
    { type: 'category', value: 'maison', label: 'Maison', icon: '🏠' },
    
    // Produits populaires
    { type: 'product', value: 'shampoing bio', label: 'Shampoing bio', category: 'cosmetique' },
    { type: 'product', value: 'jean éthique', label: 'Jean éthique', category: 'mode' },
    { type: 'product', value: 'miel local', label: 'Miel local', category: 'alimentaire' },
    { type: 'product', value: 'lessive écologique', label: 'Lessive écologique', category: 'maison' },
    
    // Tags populaires
    { type: 'tag', value: 'bio', label: 'Produits bio' },
    { type: 'tag', value: 'vegan', label: 'Produits vegan' },
    { type: 'tag', value: 'local', label: 'Produits locaux' },
    { type: 'tag', value: 'équitable', label: 'Commerce équitable' },
    { type: 'tag', value: 'recyclé', label: 'Matériaux recyclés' },
    { type: 'tag', value: 'naturel', label: 'Produits naturels' }
  ];

  useEffect(() => {
    // Charger les recherches récentes
    const saved = localStorage.getItem('ecolojia_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur chargement recherches récentes:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      // Afficher recherches récentes et suggestions populaires
      const recentSuggestions: SearchSuggestion[] = recentSearches.map(search => ({
        type: 'recent',
        value: search,
        label: search
      }));
      
      setSuggestions([
        ...recentSuggestions.slice(0, 3),
        ...staticSuggestions.slice(0, 8)
      ]);
    } else {
      // Filtrer suggestions selon la requête
      const filtered = staticSuggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.value.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filtered.slice(0, 6));
    }
    
    setSelectedIndex(-1);
  }, [query, recentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Délai pour permettre les clics sur suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    executeSearch(suggestion.value, suggestion.type);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          executeSearch(suggestion.value, suggestion.type);
        } else if (query.trim()) {
          executeSearch(query, 'product');
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const executeSearch = (searchValue: string, type: SearchSuggestion['type']) => {
    setQuery(searchValue);
    setShowSuggestions(false);
    
    // Sauvegarder dans recherches récentes
    if (type !== 'recent') {
      const newRecent = [searchValue, ...recentSearches.filter(s => s !== searchValue)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('ecolojia_recent_searches', JSON.stringify(newRecent));
    }
    
    // Navigation selon le type
    if (type === 'category') {
      navigate(`/category/${searchValue}`);
    } else {
      // Recherche de produit
      if (onSearch) {
        onSearch(searchValue);
      } else {
        // Navigation vers page d'accueil avec recherche
        navigate(`/?q=${encodeURIComponent(searchValue)}`);
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'category':
        return suggestion.icon || '📂';
      case 'product':
        const categoryConfig = suggestion.category ? CATEGORIES[suggestion.category as CategoryType] : null;
        return categoryConfig?.icon || '🔍';
      case 'tag':
        return '🏷️';
      case 'recent':
        return <Clock className="h-4 w-4" />;
      default:
        return '🔍';
    }
  };

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category': return 'Catégorie';
      case 'product': return 'Produit';
      case 'tag': return 'Tag';
      case 'recent': return 'Récent';
      default: return '';
    }
  };

  return (
    <div className="relative w-full">
      {/* Input de recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* Header suggestions */}
          {query.trim() === '' && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Recherches récentes</span>
              </div>
            </div>
          )}
          
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group ${
                index === selectedIndex ? 'bg-green-50 border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getSuggestionIcon(suggestion)}</span>
                <div>
                  <div className="font-medium text-gray-900">{suggestion.label}</div>
                  {suggestion.category && (
                    <div className="text-sm text-gray-500">
                      dans {CATEGORIES[suggestion.category as CategoryType]?.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {getSuggestionTypeLabel(suggestion.type)}
              </div>
            </button>
          ))}
          
          {/* Suggestions populaires footer */}
          {query.trim() === '' && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>Suggestions populaires</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;