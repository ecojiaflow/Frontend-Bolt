<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
=======
// /src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
import { Leaf, Search, X, ChevronDown, Filter, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import des composants existants
import ProductHit from '../components/ProductHit';
<<<<<<< HEAD
import NoResultsFound from '../components/NoResultsFound';

// Import de la configuration Algolia
import searchClient, { ALGOLIA_INDEX_NAME } from '../lib/algolia';
=======
import { fetchRealProducts } from '../api/realApi';
import { Product } from '../types';
import { SEOHead } from '../components/SEOHead';
import { useSEO } from '../hooks/useSEO';

// Composant NoResultsFound
const NoResultsFound: React.FC<{ query: string; onEnrichRequest: (query: string) => void }> = ({ query, onEnrichRequest }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-eco-text mb-2">
        Aucun produit trouvé pour "{query}"
      </h3>
      <p className="text-eco-text/70 mb-4">
        Essayez d'autres termes de recherche ou explorez nos catégories
      </p>
      <button
        onClick={() => onEnrichRequest(query)}
        className="px-6 py-2 bg-eco-leaf text-white rounded-lg hover:bg-eco-leaf/90 transition-colors"
      >
        Suggérer ce produit à notre équipe
      </button>
    </div>
  );
};
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
<<<<<<< HEAD
  
  // États de recherche
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [originalResults, setOriginalResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
=======
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États de recherche
  const [allResults, setAllResults] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [originalResults, setOriginalResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'));
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
  const [searchStats, setSearchStats] = useState({ nbHits: 0, processingTimeMS: 0 });
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hitsPerPage] = useState(12);
  
  // États d'affichage
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // États des filtres
  const [filters, setFilters] = useState({
    ecoScore: '',
    zone: '',
    confidence: ''
  });

<<<<<<< HEAD
  // Chargement initial des produits
  useEffect(() => {
    loadInitialProducts();
  }, []);

  const loadInitialProducts = async () => {
    try {
      setIsSearching(true);
      const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
      const results = await index.search('', {
        hitsPerPage,
        page: 0,
        attributesToRetrieve: [
          'objectID', 'title', 'description', 'slug', 'images',
          'eco_score', 'ai_confidence', 'confidence_color', 'confidence_pct',
          'tags', 'zones_dispo', 'resume_fr', 'verified_status'
        ]
      });
      
      setSearchResults(results.hits);
      setOriginalResults(results.hits);
      setTotalPages(results.nbPages);
      setSearchStats({ 
        nbHits: results.nbHits, 
        processingTimeMS: results.processingTimeMS 
      });
    } catch (error) {
      console.error('Erreur chargement initial:', error);
=======
  const currentQuery = searchParams.get('q') || '';

  // SEO dynamique
  useSEO({
    title: currentQuery 
      ? `"${currentQuery}" - Produits éco-responsables | Ecolojia`
      : 'Ecolojia - Trouvez des produits éco-responsables et durables',
    description: currentQuery
      ? `Découvrez ${searchStats.nbHits} produits éco-responsables pour "${currentQuery}". Scores écologiques vérifiés par IA.`
      : 'Découvrez des milliers de produits éthiques avec des scores écologiques vérifiés par IA. Shampoing bio, vêtements éthiques, alimentation durable.',
    keywords: currentQuery
      ? `${currentQuery}, produits écologiques, bio, éthique, développement durable`
      : 'produits écologiques, bio, éthique, développement durable, score écologique, IA'
  });

  // Fonction pour paginer les résultats côté client
  const paginateResults = (results: Product[], page: number) => {
    const startIndex = page * hitsPerPage;
    const endIndex = startIndex + hitsPerPage;
    return results.slice(startIndex, endIndex);
  };

  // Chargement initial des produits
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      performSearch(query, 0);
    } else {
      loadInitialProducts();
    }
  }, []);

  // Écouter les changements d'URL pour les recherches
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query.length >= 2) {
      setHasSearched(true);
      performSearch(query, 0);
    } else if (!query) {
      setHasSearched(false);
      loadInitialProducts();
    }
  }, [searchParams]);

  const loadInitialProducts = async () => {
    try {
      setIsSearching(true);
      const startTime = Date.now();
      const results = await fetchRealProducts('');
      const processingTime = Date.now() - startTime;
      
      setAllResults(results);
      setSearchResults(paginateResults(results, 0));
      setOriginalResults(results);
      setTotalPages(Math.ceil(results.length / hitsPerPage));
      setCurrentPage(0);
      setSearchStats({ 
        nbHits: results.length, 
        processingTimeMS: processingTime 
      });
    } catch (error) {
      console.error('Erreur chargement initial:', error);
      setAllResults([]);
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      setSearchResults([]);
      setOriginalResults([]);
    } finally {
      setIsSearching(false);
    }
  };

<<<<<<< HEAD
  // Fonction de recherche optimisée avec debounce
  const performSearch = useCallback(async (searchQuery: string, page: number = 0) => {
    if (searchQuery.length === 0) {
      loadInitialProducts();
      setHasSearched(false);
      setCurrentPage(0);
=======
  // Fonction de recherche
  const performSearch = async (searchQuery: string, page: number = 0) => {
    if (searchQuery.length === 0) {
      loadInitialProducts();
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      return;
    }

    if (searchQuery.length < 2) return;

    try {
      setIsSearching(true);
<<<<<<< HEAD
      const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
      
      const results = await index.search(searchQuery, {
        hitsPerPage,
        page,
        attributesToRetrieve: [
          'objectID', 'title', 'description', 'slug', 'images',
          'eco_score', 'ai_confidence', 'confidence_color', 'confidence_pct',
          'tags', 'zones_dispo', 'resume_fr', 'verified_status'
        ],
        attributesToHighlight: ['title', 'description'],
        highlightPreTag: '<mark class="bg-eco-leaf/20 text-eco-text">',
        highlightPostTag: '</mark>'
      });
      
      setSearchResults(results.hits);
      setOriginalResults(results.hits);
      setTotalPages(results.nbPages);
      setCurrentPage(page);
      setSearchStats({ 
        nbHits: results.nbHits, 
        processingTimeMS: results.processingTimeMS 
      });
      setHasSearched(true);
      
    } catch (error) {
      console.error('Erreur recherche:', error);
=======
      const startTime = Date.now();
      const results = await fetchRealProducts(searchQuery);
      const processingTime = Date.now() - startTime;
      
      setAllResults(results);
      setSearchResults(paginateResults(results, page));
      setOriginalResults(results);
      setTotalPages(Math.ceil(results.length / hitsPerPage));
      setCurrentPage(page);
      setSearchStats({ 
        nbHits: results.length, 
        processingTimeMS: processingTime 
      });
      
    } catch (error) {
      console.error('Erreur recherche:', error);
      setAllResults([]);
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      setSearchResults([]);
      setOriginalResults([]);
      setSearchStats({ nbHits: 0, processingTimeMS: 0 });
    } finally {
      setIsSearching(false);
    }
<<<<<<< HEAD
  }, [hitsPerPage]);

  // Debounce pour la recherche automatique
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query, 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);
=======
  };
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)

  // Navigation fluide vers les résultats
  const scrollToResults = () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Gestion des événements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
<<<<<<< HEAD
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    setCurrentPage(0);
=======
    const newQuery = e.target.value;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchParams({});
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
    setFilters({ ecoScore: '', zone: '', confidence: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    if (query.trim()) {
      setHasSearched(true);
=======
    const currentQuery = searchParams.get('q') || '';
    if (currentQuery.trim()) {
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      setTimeout(scrollToResults, 100);
    }
  };

<<<<<<< HEAD
  // Pagination
  const handlePageChange = (newPage: number) => {
    performSearch(query, newPage);
    scrollToResults();
  };

  // Navigation vers page produit
  const handleProductClick = (hit: any) => {
    const productSlug = hit.slug || hit.objectID;
    navigate(`/product/${productSlug}`);
=======
  // Pagination corrigée pour API backend
  const handlePageChange = (newPage: number) => {
    console.log('Changement page:', newPage);
    
    // Reset des filtres pour la pagination
    setFilters({ ecoScore: '', zone: '', confidence: '' });
    
    // Utiliser allResults pour la pagination
    const paginatedResults = paginateResults(allResults, newPage);
    setSearchResults(paginatedResults);
    setCurrentPage(newPage);
    
    setTimeout(scrollToResults, 100);
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
  };

  // Fonction pour enrichir la base de données
  const handleEnrichRequest = async (searchQuery: string) => {
    try {
<<<<<<< HEAD
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/suggest`, {
=======
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suggest`, {
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery })
      });
      
      if (response.ok) {
        setTimeout(() => {
          performSearch(searchQuery, 0);
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur enrichissement:', error);
    }
  };

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    let filteredResults = [...originalResults];
    
    if (filters.ecoScore) {
<<<<<<< HEAD
      filteredResults = filteredResults.filter(hit => 
        hit.eco_score && hit.eco_score >= parseFloat(filters.ecoScore)
=======
      filteredResults = filteredResults.filter(product => 
        product.ethicalScore && product.ethicalScore >= parseFloat(filters.ecoScore)
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      );
    }
    
    if (filters.zone) {
<<<<<<< HEAD
      filteredResults = filteredResults.filter(hit => 
        hit.zones_dispo && hit.zones_dispo.includes(filters.zone)
=======
      filteredResults = filteredResults.filter(product => 
        product.zonesDisponibles && product.zonesDisponibles.includes(filters.zone)
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      );
    }
    
    if (filters.confidence) {
<<<<<<< HEAD
      filteredResults = filteredResults.filter(hit => 
        hit.ai_confidence && hit.ai_confidence >= parseFloat(filters.confidence)
=======
      filteredResults = filteredResults.filter(product => 
        product.confidencePct && product.confidencePct >= parseFloat(filters.confidence)
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      );
    }
    
    setSearchResults(filteredResults);
    setSearchStats({ ...searchStats, nbHits: filteredResults.length });
    setShowFilters(false);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({ ecoScore: '', zone: '', confidence: '' });
<<<<<<< HEAD
    setSearchResults(originalResults);
    setSearchStats({ ...searchStats, nbHits: originalResults.length });
  };

  return (
    <div className="min-h-screen flex flex-col">
=======
    setSearchResults(paginateResults(originalResults, currentPage));
    setSearchStats({ ...searchStats, nbHits: originalResults.length });
  };

  const hasActiveFilters = filters.ecoScore || filters.zone || filters.confidence;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={currentQuery 
          ? `"${currentQuery}" - Produits éco-responsables | Ecolojia`
          : undefined}
        description={currentQuery
          ? `Découvrez ${searchStats.nbHits} produits éco-responsables pour "${currentQuery}". Scores écologiques vérifiés par IA.`
          : undefined}
        keywords={currentQuery
          ? `${currentQuery}, produits écologiques, bio, éthique`
          : undefined}
      />

>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
      {/* Section Hero */}
      <section className="bg-eco-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Leaf className="h-16 w-16 text-eco-leaf animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-text mb-6">
<<<<<<< HEAD
            <span dangerouslySetInnerHTML={{ 
              __html: t('homepage.hero.title', { 
                interpolation: { escapeValue: false } 
              }).replace('<highlight>', '<span class="text-eco-leaf">').replace('</highlight>', '</span>')
            }} />
          </h1>
          
          <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
            {t('homepage.hero.subtitle')}
          </p>

          {/* Barre de recherche optimisée */}
=======
            <span className="text-eco-leaf">Trouvez</span> des produits <span className="text-eco-leaf">éco-responsables</span>
          </h1>
          
          <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
            Découvrez des milliers de produits éthiques et durables pour un mode de vie plus respectueux de la planète.
          </p>

          {/* Barre de recherche */}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
<<<<<<< HEAD
                value={query}
                onChange={handleInputChange}
                placeholder={t('common.searchPlaceholder')}
=======
                value={currentQuery}
                onChange={handleInputChange}
                placeholder="Rechercher shampoing bio, jean éthique, miel local..."
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                className="w-full py-4 px-12 pr-16 border-2 border-eco-text/10 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50 transition-all text-eco-text placeholder-eco-text/50 bg-white/95 backdrop-blur"
                autoComplete="off"
              />
              
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-text/50" />
              
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin"></div>
                </div>
              )}
              
<<<<<<< HEAD
              {query && !isSearching && (
=======
              {currentQuery && !isSearching && (
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-eco-text/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-eco-text/50 hover:text-eco-text" />
                </button>
              )}
            </div>

<<<<<<< HEAD
            {/* Indicateurs de recherche */}
            {query && query.length >= 2 && (
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 text-sm text-eco-leaf bg-eco-leaf/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-eco-leaf rounded-full animate-pulse"></div>
                  {t('common.searchingAlgolia')}
=======
            {/* Indicateurs de recherche - CORRIGÉ */}
            {currentQuery && currentQuery.length >= 2 && (
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 text-sm text-eco-leaf bg-eco-leaf/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-eco-leaf rounded-full animate-pulse"></div>
                  {t('common.searchingAlgolia') || 'Recherche en cours...'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                </div>
              </div>
            )}
            
<<<<<<< HEAD
            {!hasSearched && query.length === 0 && (
=======
            {!hasSearched && currentQuery.length === 0 && (
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
              <div className="mt-6">
                <button
                  type="button"
                  onClick={scrollToResults}
                  className="inline-flex items-center gap-2 text-eco-text/70 hover:text-eco-text transition-all group hover:scale-105"
                >
<<<<<<< HEAD
                  <span>{t('common.discoverProducts')}</span>
=======
                  <span>{t('common.discoverProducts') || 'Découvrir nos produits'}</span>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            )}
          </form>

<<<<<<< HEAD
          {/* Stats de recherche */}
          {hasSearched && searchStats.nbHits > 0 && (
            <div className="text-eco-text/60 text-sm">
              {t('common.resultsFoundMs', { 
                count: searchStats.nbHits, 
                time: searchStats.processingTimeMS 
              })}
=======
          {/* Stats de recherche - CORRIGÉ */}
          {hasSearched && searchStats.nbHits > 0 && (
            <div className="text-eco-text/60 text-sm">
              {searchStats.nbHits === 1 
                ? `1 résultat trouvé en ${searchStats.processingTimeMS}ms`
                : `${searchStats.nbHits} résultats trouvés en ${searchStats.processingTimeMS}ms`
              }
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
            </div>
          )}
        </div>
      </section>

      {/* Section Résultats */}
      <section id="results-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
<<<<<<< HEAD
          {/* Header des résultats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-eco-text mb-2">
                {query ? t('common.searchResults', { query }) : t('common.ecoProducts')}
              </h2>
              <p className="text-eco-text/70">
                {searchResults.length === 1 ? 
                  t('common.productsFound_one', { count: searchResults.length }) :
                  t('common.productsFound_other', { count: searchResults.length })
                }
                {hasSearched ? ` ${t('common.correspondingSearch')}` : ` ${t('common.available')}`}
                {(filters.ecoScore || filters.zone || filters.confidence) && (
                  <span className="text-eco-leaf"> ({searchResults.length > 1 ? t('common.filtered_plural') : t('common.filtered')})</span>
=======
          {/* Header des résultats - CORRIGÉ */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-eco-text mb-2">
                {currentQuery ? `Résultats pour "${currentQuery}"` : 'Produits éco-responsables'}
              </h2>
              <p className="text-eco-text/70">
                {searchStats.nbHits === 1 ? 
                  `1 produit trouvé` :
                  `${searchStats.nbHits} produits trouvés`
                }
                {hasSearched ? ` correspondant à votre recherche` : ` disponibles`}
                {hasActiveFilters && (
                  <span className="text-eco-leaf"> ({searchStats.nbHits > 1 ? 'filtrés' : 'filtré'})</span>
                )}
                {totalPages > 1 && (
                  <span className="text-eco-text/50"> • Page {currentPage + 1} sur {totalPages}</span>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                )}
              </p>
            </div>

            {/* Contrôles d'affichage */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
<<<<<<< HEAD
                  (filters.ecoScore || filters.zone || filters.confidence) 
=======
                  hasActiveFilters 
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                    ? 'border-eco-leaf bg-eco-leaf/10 text-eco-leaf' 
                    : 'border-eco-leaf/20 hover:bg-eco-leaf/10'
                }`}
              >
                <Filter className="h-4 w-4" />
<<<<<<< HEAD
                {t('common.filters')}
                {(filters.ecoScore || filters.zone || filters.confidence) && (
=======
                {t('common.filters') || 'Filtres'}
                {hasActiveFilters && (
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  <span className="bg-eco-leaf text-white text-xs px-1.5 py-0.5 rounded-full">
                    {[filters.ecoScore, filters.zone, filters.confidence].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              <div className="flex items-center border border-eco-leaf/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-eco-leaf text-white' : 'hover:bg-eco-leaf/10'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-eco-leaf text-white' : 'hover:bg-eco-leaf/10'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-eco-leaf/10 animate-fade-in">
<<<<<<< HEAD
              <h3 className="text-lg font-semibold text-eco-text mb-4">{t('common.filterResults')}</h3>
=======
              <h3 className="text-lg font-semibold text-eco-text mb-4">{t('common.filterResults') || 'Filtrer les résultats'}</h3>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Filtre par score écologique */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
<<<<<<< HEAD
                    {t('common.ecoScoreMin')}
=======
                    {t('common.ecoScoreMin') || 'Score écologique minimum'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </label>
                  <select 
                    value={filters.ecoScore}
                    onChange={(e) => setFilters({...filters, ecoScore: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
<<<<<<< HEAD
                    <option value="">{t('common.allScores')}</option>
                    <option value="0.8">{t('common.excellent')}</option>
                    <option value="0.6">{t('common.veryGood')}</option>
                    <option value="0.4">{t('common.good')}</option>
=======
                    <option value="">{t('common.allScores') || 'Tous les scores'}</option>
                    <option value="0.8">{t('common.excellent') || 'Excellent (80%+)'}</option>
                    <option value="0.6">{t('common.veryGood') || 'Très bon (60%+)'}</option>
                    <option value="0.4">{t('common.good') || 'Bon (40%+)'}</option>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </select>
                </div>

                {/* Filtre par zone */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
<<<<<<< HEAD
                    {t('common.availabilityZone')}
=======
                    {t('common.availabilityZone') || 'Zone de disponibilité'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </label>
                  <select 
                    value={filters.zone}
                    onChange={(e) => setFilters({...filters, zone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
<<<<<<< HEAD
                    <option value="">{t('common.allZones')}</option>
                    <option value="FR">{t('common.france')}</option>
                    <option value="EU">{t('common.europe')}</option>
                    <option value="US">{t('common.usa')}</option>
=======
                    <option value="">{t('common.allZones') || 'Toutes les zones'}</option>
                    <option value="FR">{t('common.france') || 'France'}</option>
                    <option value="EU">{t('common.europe') || 'Europe'}</option>
                    <option value="US">{t('common.usa') || 'États-Unis'}</option>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </select>
                </div>

                {/* Filtre par confiance IA */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
<<<<<<< HEAD
                    {t('common.aiConfidence')}
=======
                    {t('common.aiConfidence') || 'Confiance IA'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </label>
                  <select 
                    value={filters.confidence}
                    onChange={(e) => setFilters({...filters, confidence: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
<<<<<<< HEAD
                    <option value="">{t('common.allLevels')}</option>
                    <option value="0.8">{t('common.certified')}</option>
                    <option value="0.6">{t('common.validated')}</option>
                    <option value="0.4">{t('common.analyzing')}</option>
=======
                    <option value="">{t('common.allLevels') || 'Tous les niveaux'}</option>
                    <option value="0.8">{t('common.certified') || 'Certifié (80%+)'}</option>
                    <option value="0.6">{t('common.validated') || 'Validé (60%+)'}</option>
                    <option value="0.4">{t('common.analyzing') || 'En analyse (40%+)'}</option>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </select>
                </div>
              </div>
              
              {/* Boutons d'action des filtres */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
<<<<<<< HEAD
                  {t('common.hideFilters')}
=======
                  {t('common.hideFilters') || 'Masquer les filtres'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                </button>
                <div className="space-x-3">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
<<<<<<< HEAD
                    {t('common.reset')}
=======
                    {t('common.reset') || 'Réinitialiser'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-4 py-2 bg-eco-leaf text-white rounded-lg hover:bg-eco-leaf/90 transition-colors"
                  >
<<<<<<< HEAD
                    {t('common.apply')}
=======
                    {t('common.apply') || 'Appliquer'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          {isSearching && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin mx-auto mb-4"></div>
<<<<<<< HEAD
              <p className="text-eco-text/60">{t('common.searchInProgress')}</p>
=======
              <p className="text-eco-text/60">{t('common.searchInProgress') || 'Recherche en cours...'}</p>
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
            </div>
          ) : searchResults.length > 0 ? (
            <>
              {/* Grille de produits */}
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
<<<<<<< HEAD
                {searchResults.map((hit, index) => (
                  <div 
                    key={hit.objectID || index}
                    className="animate-fade-in-up cursor-pointer"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => handleProductClick(hit)}
                  >
                    <ProductHit hit={hit} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && !filters.ecoScore && !filters.zone && !filters.confidence && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    {t('common.previous')}
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = currentPage <= 2 ? i : currentPage - 2 + i;
                      if (pageNum >= totalPages) return null;
=======
                {searchResults.map((product, index) => {
                  // Adapter Product vers le format attendu par ProductHit
                  const adaptedHit = {
                    objectID: product.id,
                    title: product.nameKey,
                    description: product.descriptionKey,
                    slug: product.slug,
                    images: [product.image],
                    eco_score: product.ethicalScore / 5, // Convertir vers 0-1
                    ai_confidence: product.aiConfidence,
                    confidence_pct: product.confidencePct,
                    confidence_color: product.confidenceColor,
                    tags: product.tagsKeys,
                    zones_dispo: product.zonesDisponibles,
                    verified_status: product.verifiedStatus,
                    brand: product.brandKey,
                    price: product.price
                  };

                  return (
                    <div 
                      key={product.id || index}
                      className="animate-fade-in-up"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <ProductHit hit={adaptedHit} />
                    </div>
                  );
                })}
              </div>

              {/* Pagination simplifiée et corrigée */}
              {totalPages > 1 && !hasActiveFilters && (
                <div className="flex justify-center items-center mt-12 gap-3">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    {t('common.previous') || 'Précédent'}
                  </button>
                  
                  {/* Numéros de page */}
                  <div className="flex gap-2">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNum = currentPage <= 2 ? i : currentPage - 2 + i;
                      if (pageNum >= totalPages || pageNum < 0) return null;
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
<<<<<<< HEAD
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-eco-leaf text-white'
                              : 'border border-eco-leaf/20 hover:bg-eco-leaf/10'
=======
                          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                            currentPage === pageNum
                              ? 'bg-eco-leaf text-white shadow-lg'
                              : 'border border-eco-leaf/20 hover:bg-eco-leaf/10 text-gray-700'
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
<<<<<<< HEAD
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    {t('common.next')}
=======
                  {/* Bouton Suivant */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    {t('common.next') || 'Suivant'}
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
                  </button>
                </div>
              )}
            </>
          ) : hasSearched ? (
            <NoResultsFound 
<<<<<<< HEAD
              query={query} 
=======
              query={currentQuery} 
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
              onEnrichRequest={handleEnrichRequest}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default HomePage;