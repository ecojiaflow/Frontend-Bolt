import React, { useState, useEffect } from 'react';
import { Leaf, Search, X, Star, ShoppingCart, ChevronDown } from 'lucide-react';
import searchClient, { ALGOLIA_INDEX_NAME } from '../lib/algolia';
import { useTranslation } from 'react-i18next';

// Fonction pour nettoyer l'encodage des textes
const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Remplacer les caractères mal encodés
  return text
    .replace(/�/g, 'é')
    .replace(/Ã /g, 'à')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Ã®/g, 'î')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã€/g, 'À')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã¯/g, 'ï')
    .replace(/Ã§/g, 'ç')
    .trim();
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Chargement initial des produits
  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        setIsSearching(true);
        const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
        const results = await index.search('');
        setSearchResults(results.hits);
      } catch (error) {
        console.error('Erreur chargement initial:', error);
      } finally {
        setIsSearching(false);
      }
    };

    loadInitialProducts();
  }, []);

  // Navigation fluide vers les résultats
  const scrollToResults = () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Recherche avec délai
  useEffect(() => {
    const performSearch = async () => {
      if (query.length === 0) {
        // Recharger tous les produits
        try {
          setIsSearching(true);
          const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
          const results = await index.search('');
          setSearchResults(results.hits);
          setHasSearched(false);
        } catch (error) {
          console.error('Erreur rechargement:', error);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      if (query.length < 2) return;

      try {
        setIsSearching(true);
        const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
        const results = await index.search(query);
        setSearchResults(results.hits);
        setHasSearched(true);
      } catch (error) {
        console.error('Erreur recherche:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
  };

  // FONCTION CLÉE : Navigation avec Entrée
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
      // Navigation fluide vers les résultats
      setTimeout(() => {
        scrollToResults();
      }, 100);
    }
  };

  // Fonction pour nettoyer les tags
  const cleanTags = (tags: string[]) => {
    if (!tags) return [];
    return tags.filter(tag => {
      const lowerTag = tag.toLowerCase();
      // Filtrer les tags contenant "recherche" ou des caractères étranges
      return !lowerTag.includes('recherche') && 
             !lowerTag.includes('search') && 
             tag.length > 1 &&
             tag.length < 20; // Éviter les tags trop longs
    });
  };

  // Composant ProductCard avec nettoyage complet des textes
  const ProductCard = ({ product }: { product: any }) => {
    const filteredTags = cleanTags(product.tags);
    
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-eco-leaf/10 hover:border-eco-leaf/30 group">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-eco-text mb-2 group-hover:text-eco-leaf transition-colors">
            {cleanText(product.title) || t('common.unavailable')}
          </h3>
          <p className="text-eco-text/70 text-sm leading-relaxed">
            {product.description 
              ? cleanText(product.description).length > 120 
                ? cleanText(product.description).substring(0, 120) + '...'
                : cleanText(product.description)
              : t('common.noDescription')
            }
          </p>
        </div>
        
        {/* Tags nettoyés */}
        {filteredTags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {filteredTags.slice(0, 3).map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-eco-leaf/10 text-eco-leaf text-xs font-medium rounded-full border border-eco-leaf/20"
                >
                  {cleanText(tag)}
                </span>
              ))}
              {filteredTags.length > 3 && (
                <span className="px-3 py-1 bg-eco-text/10 text-eco-text/60 text-xs rounded-full">
                  +{filteredTags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Score écologique */}
        {product.eco_score && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-eco-text">
                {t('accessibility.ethicalScore')}: {Math.round(product.eco_score * 100)}%
              </span>
            </div>
          </div>
        )}
        
        {/* Zones disponibles */}
        {product.zones_dispo && product.zones_dispo.length > 0 && (
          <div className="mb-4">
            <span className="text-xs text-eco-text/60 bg-eco-leaf/5 px-2 py-1 rounded-full">
              📍 {product.zones_dispo.join(', ')}
            </span>
          </div>
        )}
        
        {/* Badge confiance IA */}
        {product.confidence_pct && (
          <div className="mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
              🤖 IA: {product.confidence_pct}%
            </span>
          </div>
        )}
        
        {/* Bouton avec style Ecolojia */}
        <button className="w-full bg-eco-leaf text-white py-3 px-4 rounded-xl font-medium hover:bg-eco-text transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
          <ShoppingCart className="h-4 w-4" />
          {t('common.seeProduct')}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Section Hero avec charte graphique Ecolojia */}
      <section className="bg-eco-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Leaf className="h-16 w-16 text-eco-leaf animate-pulse" />
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-text mb-6"
            dangerouslySetInnerHTML={{ 
              __html: t('homepage.hero.title', { 
                interpolation: { escapeValue: false } 
              }).replace('<highlight>', '<span class="text-eco-leaf">').replace('</highlight>', '</span>')
            }}
          />
          <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
            {t('homepage.hero.subtitle')}
          </p>
          
          {/* Barre de recherche avec navigation fluide */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={t('common.searchPlaceholder')}
                className="w-full py-4 px-12 pr-16 border-2 border-eco-text/10 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50 transition-all text-eco-text placeholder-eco-text/50 bg-white/95 backdrop-blur"
              />
              
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-text/50" />
              
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin"></div>
                </div>
              )}
              
              {query && !isSearching && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-eco-text/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-eco-text/50 hover:text-eco-text" />
                </button>
              )}
            </div>
            
            {/* Indicateur de recherche */}
            {query && query.length >= 2 && (
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 text-sm text-eco-leaf bg-eco-leaf/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-eco-leaf rounded-full animate-pulse"></div>
                  {t('common.search')}...
                </div>
              </div>
            )}
            
            {/* Hint navigation */}
            {query && !hasSearched && (
              <div className="mt-6">
                <div className="inline-flex items-center gap-2 text-xs text-eco-text/60 bg-white/80 px-3 py-1 rounded-full border border-eco-leaf/20 animate-bounce">
                  <ChevronDown className="h-3 w-3" />
                  {t('common.search')} - Entrée
                </div>
              </div>
            )}
          </form>

          {/* Indicateurs */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-eco-leaf text-sm flex items-center">
              <div className="w-2 h-2 bg-eco-leaf rounded-full mr-2 animate-pulse"></div>
              {t('common.search')} Algolia
            </div>
            
            <div className="text-eco-text/60 text-xs max-w-md mx-auto">
              💡 {t('common.searchPlaceholder')} + <kbd className="px-2 py-1 bg-white/20 rounded border text-eco-text">Entrée</kbd>
            </div>
          </div>

          {/* Bouton découverte */}
          {!hasSearched && (
            <div className="mt-12">
              <button
                onClick={scrollToResults}
                className="inline-flex items-center gap-2 text-eco-text/70 hover:text-eco-text transition-all group hover:scale-105"
              >
                <span>{t('common.products')}</span>
                <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Section Résultats avec animation */}
      <section 
        id="results-section" 
        className={`py-16 bg-white ${hasSearched ? 'animate-fade-in' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header avec navigation retour */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-eco-text">
                {query ? t('common.searchResults', { query }) : t('common.ecoProducts')}
              </h2>
              
              {hasSearched && (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-eco-leaf hover:text-eco-text transition-colors text-sm flex items-center gap-1"
                >
                  ↑ {t('common.search')}
                </button>
              )}
            </div>
            
            <p className="text-eco-text/70">
              {searchResults.length === 0 ? 
                t('common.noResults') :
                searchResults.length === 1 ? 
                  t('common.productsFound_one', { count: searchResults.length }) :
                  t('common.productsFound_other', { count: searchResults.length })
              }
            </p>
          </div>

          {/* Grille de produits */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {searchResults.map((product, index) => (
                <div 
                  key={product.objectID || index}
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-eco-text/60">
                {query ? t('common.noResults') : t('common.products')}...
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;