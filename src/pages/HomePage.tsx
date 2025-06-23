// /src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, Search, X, ChevronDown, Filter, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import des composants existants
import ProductHit from '../components/ProductHit';
import { fetchRealProducts } from '../api/realApi';
import { Product } from '../types';
import { SEOHead } from '../components/SEOHead';
import { useSEO } from '../hooks/useSEO';
import { usePerformanceMonitoring } from '../utils/performance';

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

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recordSearch } = usePerformanceMonitoring();
  
  // États de recherche
  const [allResults, setAllResults] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [originalResults, setOriginalResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'));
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

  const currentQuery = searchParams.get('q') || '';

<<<<<<< HEAD
<<<<<<< HEAD
  // 🛡️ FONCTION ULTRA-SÉCURISÉE: Génération de slug JAMAIS undefined
  const generateUltraSecureSlug = useCallback((product: any): string | null => {
    // ÉTAPE 1: Validation stricte du produit
    if (!product || typeof product !== 'object') {
      return null;
    }

    // ÉTAPE 2: Vérifier slug existant ET valide
=======
  // 🔧 FONCTION CRITIQUE: Génération et validation de slug ultra-sécurisée
  const generateUltraSecureSlug = useCallback((product: any): string => {
    console.log('🔧 HomePage - Génération slug ultra-sécurisée pour:', {
      id: product.id,
      slug: product.slug,
      title: product.nameKey || product.title,
      type: typeof product.slug,
      timestamp: new Date().toISOString()
    });
    
    // 1. Vérifier slug existant avec validation ultra-stricte
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
=======
  // 🔧 FONCTION: Génération de slug sécurisée (sans logs debug)
  const generateSecureSlug = useCallback((product: any): string => {
    // 1. Vérifier slug existant
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
    if (product.slug && 
        typeof product.slug === 'string' && 
        product.slug.trim() !== '' && 
        product.slug !== 'undefined' && 
<<<<<<< HEAD
<<<<<<< HEAD
        product.slug !== 'null' &&
        !product.slug.includes('undefined') &&
        product.slug.length > 0) {
      return product.slug.trim();
    }
    
    // ÉTAPE 3: Générer depuis le titre
    const title = product.nameKey || product.title || product.name || '';
    if (title && typeof title === 'string' && title.trim() !== '' && title !== 'undefined') {
=======
        product.slug !== 'null' && 
        product.slug.toLowerCase() !== 'undefined' &&
        product.slug.toLowerCase() !== 'null') {
      
      const cleanSlug = product.slug.trim();
      console.log('✅ HomePage - Slug existant validé:', cleanSlug);
      return cleanSlug;
=======
        product.slug !== 'null') {
      return product.slug.trim();
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
    }
    
    // 2. Générer depuis le titre
    const title = product.nameKey || product.title || '';
    if (title && typeof title === 'string' && title.trim() !== '') {
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
        .replace(/[^a-z0-9\s-]/g, '')   // Garder alphanumériques
        .replace(/\s+/g, '-')           // Espaces → tirets
        .replace(/-+/g, '-')            // Tirets multiples → simple
        .replace(/^-|-$/g, '');         // Supprimer tirets début/fin
      
<<<<<<< HEAD
<<<<<<< HEAD
      if (generatedSlug && generatedSlug !== 'undefined' && generatedSlug.length > 2) {
=======
      if (generatedSlug && 
          generatedSlug !== 'undefined' && 
          generatedSlug !== '' && 
          generatedSlug.length > 0) {
        console.log('✅ HomePage - Slug généré depuis titre:', generatedSlug);
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
=======
      if (generatedSlug && generatedSlug !== 'undefined' && generatedSlug.length > 0) {
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
        return generatedSlug;
      }
    }
    
<<<<<<< HEAD
    // ÉTAPE 4: Utiliser l'ID valide
    const id = product.id || product.objectID || product._id || '';
    if (id && typeof id === 'string' && id !== 'undefined' && id.trim() !== '' && id.length > 0) {
      return `product-${id.replace(/[^a-z0-9]/gi, '-')}`;
    }
    
    // ÉTAPE 5: Si TOUT échoue, retourner null (ne pas rendre le produit)
    return null;
=======
    // 3. Utiliser l'ID comme fallback
    const id = product.id || product.objectID || '';
    if (id && typeof id === 'string' && id !== 'undefined' && id.trim() !== '') {
      return `product-${id}`;
    }
    
    // 4. Fallback ultime d'urgence
<<<<<<< HEAD
    const emergencySlug = `emergency-product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.error('🚨 HomePage - Slug d\'urgence généré:', emergencySlug);
    return emergencySlug;
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
=======
    return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
  }, []);

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

      recordSearch('', results.length, processingTime);
    } catch (error) {
      console.error('Erreur chargement initial:', error);
      setAllResults([]);
      setSearchResults([]);
      setOriginalResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction de recherche
  const performSearch = async (searchQuery: string, page: number = 0) => {
    if (searchQuery.length === 0) {
      loadInitialProducts();
      return;
    }

    if (searchQuery.length < 2) return;

    try {
      setIsSearching(true);
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

      recordSearch(searchQuery, results.length, processingTime);
      
    } catch (error) {
      console.error('Erreur recherche:', error);
      setAllResults([]);
      setSearchResults([]);
      setOriginalResults([]);
      setSearchStats({ nbHits: 0, processingTimeMS: 0 });
    } finally {
      setIsSearching(false);
    }
  };

  // Navigation fluide vers les résultats
  const scrollToResults = () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Gestion des événements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchParams({});
    setFilters({ ecoScore: '', zone: '', confidence: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuery = searchParams.get('q') || '';
    if (currentQuery.trim()) {
      setTimeout(scrollToResults, 100);
    }
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    setFilters({ ecoScore: '', zone: '', confidence: '' });
    const paginatedResults = paginateResults(allResults, newPage);
    setSearchResults(paginatedResults);
    setCurrentPage(newPage);
    setTimeout(scrollToResults, 100);
  };

  // Fonction pour enrichir la base de données
  const handleEnrichRequest = async (searchQuery: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suggest`, {
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
      filteredResults = filteredResults.filter(product => 
        product.ethicalScore && product.ethicalScore >= parseFloat(filters.ecoScore)
      );
    }
    
    if (filters.zone) {
      filteredResults = filteredResults.filter(product => 
        product.zonesDisponibles && product.zonesDisponibles.includes(filters.zone)
      );
    }
    
    if (filters.confidence) {
      filteredResults = filteredResults.filter(product => 
        product.confidencePct && product.confidencePct >= parseFloat(filters.confidence)
      );
    }
    
    setSearchResults(filteredResults);
    setSearchStats({ ...searchStats, nbHits: filteredResults.length });
    setShowFilters(false);
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({ ecoScore: '', zone: '', confidence: '' });
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

      {/* Section Hero */}
      <section className="bg-eco-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Leaf className="h-16 w-16 text-eco-leaf animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-text mb-6">
            {t('homepage.hero.title') === 'Find <highlight>eco-friendly</highlight> products' ? (
              <>Find <span className="text-eco-leaf">eco-friendly</span> products</>
            ) : (
              <><span className="text-eco-leaf">Trouvez</span> des produits <span className="text-eco-leaf">éco-responsables</span></>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
            {t('homepage.hero.subtitle')}
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={currentQuery}
                onChange={handleInputChange}
                placeholder={t('common.searchPlaceholder') || 'Rechercher shampoing bio, jean éthique, miel local...'}
                className="w-full py-4 px-12 pr-16 border-2 border-eco-text/10 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30 focus:border-eco-leaf/50 transition-all text-eco-text placeholder-eco-text/50 bg-white/95 backdrop-blur"
                autoComplete="off"
              />
              
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-eco-text/50" />
              
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin"></div>
                </div>
              )}
              
              {currentQuery && !isSearching && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-eco-text/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-eco-text/50 hover:text-eco-text" />
                </button>
              )}
            </div>

            {/* Indicateurs de recherche */}
            {currentQuery && currentQuery.length >= 2 && (
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 text-sm text-eco-leaf bg-eco-leaf/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-eco-leaf rounded-full animate-pulse"></div>
                  {t('common.searchingAlgolia') || 'Recherche en cours...'}
                </div>
              </div>
            )}
            
            {!hasSearched && currentQuery.length === 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={scrollToResults}
                  className="inline-flex items-center gap-2 text-eco-text/70 hover:text-eco-text transition-all group hover:scale-105"
                >
                  <span>{t('common.discoverProducts') || 'Découvrir nos produits'}</span>
                  <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            )}
          </form>

          {/* Stats de recherche */}
          {hasSearched && searchStats.nbHits > 0 && (
            <div className="text-eco-text/60 text-sm">
              {searchStats.nbHits === 1 
                ? `1 résultat trouvé en ${searchStats.processingTimeMS}ms`
                : `${searchStats.nbHits} résultats trouvés en ${searchStats.processingTimeMS}ms`
              }
            </div>
          )}
        </div>
      </section>

      {/* Section Résultats */}
      <section id="results-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header des résultats */}
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
                )}
              </p>
            </div>

            {/* Contrôles d'affichage */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  hasActiveFilters 
                    ? 'border-eco-leaf bg-eco-leaf/10 text-eco-leaf' 
                    : 'border-eco-leaf/20 hover:bg-eco-leaf/10'
                }`}
              >
                <Filter className="h-4 w-4" />
                {t('common.filters') || 'Filtres'}
                {hasActiveFilters && (
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
              <h3 className="text-lg font-semibold text-eco-text mb-4">{t('common.filterResults') || 'Filtrer les résultats'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Filtre par score écologique */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
                    {t('common.ecoScoreMin') || 'Score écologique minimum'}
                  </label>
                  <select 
                    value={filters.ecoScore}
                    onChange={(e) => setFilters({...filters, ecoScore: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
                    <option value="">{t('common.allScores') || 'Tous les scores'}</option>
                    <option value="0.8">{t('common.excellent') || 'Excellent (80%+)'}</option>
                    <option value="0.6">{t('common.veryGood') || 'Très bon (60%+)'}</option>
                    <option value="0.4">{t('common.good') || 'Bon (40%+)'}</option>
                  </select>
                </div>

                {/* Filtre par zone */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
                    {t('common.availabilityZone') || 'Zone de disponibilité'}
                  </label>
                  <select 
                    value={filters.zone}
                    onChange={(e) => setFilters({...filters, zone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
                    <option value="">{t('common.allZones') || 'Toutes les zones'}</option>
                    <option value="FR">{t('common.france') || 'France'}</option>
                    <option value="EU">{t('common.europe') || 'Europe'}</option>
                    <option value="US">{t('common.usa') || 'États-Unis'}</option>
                  </select>
                </div>

                {/* Filtre par confiance IA */}
                <div>
                  <label className="block text-sm font-medium text-eco-text mb-2">
                    {t('common.aiConfidence') || 'Confiance IA'}
                  </label>
                  <select 
                    value={filters.confidence}
                    onChange={(e) => setFilters({...filters, confidence: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-leaf/30"
                  >
                    <option value="">{t('common.allLevels') || 'Tous les niveaux'}</option>
                    <option value="0.8">{t('common.certified') || 'Certifié (80%+)'}</option>
                    <option value="0.6">{t('common.validated') || 'Validé (60%+)'}</option>
                    <option value="0.4">{t('common.analyzing') || 'En analyse (40%+)'}</option>
                  </select>
                </div>
              </div>
              
              {/* Boutons d'action des filtres */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t('common.hideFilters') || 'Masquer les filtres'}
                </button>
                <div className="space-x-3">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('common.reset') || 'Réinitialiser'}
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="px-4 py-2 bg-eco-leaf text-white rounded-lg hover:bg-eco-leaf/90 transition-colors"
                  >
                    {t('common.apply') || 'Appliquer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          {isSearching && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-eco-text/60">{t('common.searchInProgress') || 'Recherche en cours...'}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              {/* Grille de produits */}
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {searchResults.map((product, index) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                  // 🚨 VALIDATION ULTRA-STRICTE - NE JAMAIS RENDRE SI PROBLÉMATIQUE
                  if (!product || !product.id) {
                    return null; // Skip complètement
                  }

                  // 🛡️ Générer slug ultra-sécurisé
                  const secureSlug = generateUltraSecureSlug(product);
                  
                  // 🚨 SI LE SLUG EST NULL/UNDEFINED, NE PAS RENDRE LE PRODUIT
                  if (!secureSlug || secureSlug.includes('undefined')) {
                    return null; // Skip ce produit
                  }
                  
                  return (
                    <ProductHit
                      key={`${product.id}-${index}`}
                      hit={{
                        objectID: product.id,
                        title: product.title || 'Produit sans titre',
                        description: product.description || '',
                        brand: product.brand || '',
                        category: product.category || '',
                        image_url: product.image_url || '',
                        eco_score: product.eco_score || 0,
                        slug: secureSlug, // SLUG GARANTI VALIDE
                        tags: product.tags || [],
                        zones_dispo: product.zones_dispo || [],
                        verified_status: product.verified_status || 'manual_review'
                      }}
                      viewMode={viewMode}
                      onProductClick={(slug: string) => {
                        // 🚨 VALIDATION FINALE AVANT NAVIGATION
                        if (!slug || slug === 'undefined' || slug.includes('undefined') || slug.trim() === '') {
                          console.error('🚨 Navigation bloquée - slug invalide final:', slug);
                          return; // BLOQUER la navigation
                        }
                        navigate(`/product/${slug}`);
                      }}
                    />
                  );
                }).filter(Boolean)} {/* Supprimer les nulls */}
=======
                // 🔧 FIX CRITIQUE: Validation stricte des données produit
                if (!product || !product.id) {
                  console.warn('⚠️ Produit invalide ignoré:', product);
                  return null;
                }
=======
                  // 🔧 FIX CRITIQUE: Validation stricte des données produit
=======
                  // 🔧 FIX CRITIQUE: Validation stricte des données produit avec logs ultra-détaillés
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
=======
                  // Validation stricte des données produit
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
                  if (!product || !product.id) {
                    if (import.meta.env.DEV) {
                      console.warn('Produit invalide ignoré:', product);
                    }
                    return null;
                  }
>>>>>>> 6fa9476 (🔧 fix: Ultra-secure slug validation to prevent undefined URLs)

<<<<<<< HEAD
                  // 🚨 GÉNÉRATION DE SLUG ULTRA-SÉCURISÉE
                  const secureSlug = generateUltraSecureSlug(product);

                  // Adapter Product vers le format attendu par ProductHit avec validation ultra-stricte
                  const adaptedHit = {
                    objectID: product.id,
                    title: product.nameKey || product.title || 'Produit éco-responsable',
                    description: product.descriptionKey || product.description || '',
                    
                    // 🚨 SLUG ULTRA-SÉCURISÉ AVEC VALIDATION FINALE
                    slug: secureSlug,
                    
                    images: Array.isArray(product.images) ? product.images : 
                             (product.image ? [product.image] : []),
                    eco_score: typeof product.ethicalScore === 'number' ? 
                              Math.min(Math.max(product.ethicalScore / 5, 0), 1) : 0, // Normaliser 0-1
                    ai_confidence: typeof product.aiConfidence === 'number' ? 
                                  Math.min(Math.max(product.aiConfidence, 0), 1) : 0,
                    confidence_pct: typeof product.confidencePct === 'number' ? 
                                   Math.min(Math.max(product.confidencePct, 0), 100) : 0,
                    confidence_color: product.confidenceColor || 'gray',
                    tags: Array.isArray(product.tagsKeys) ? product.tagsKeys : 
                          Array.isArray(product.tags) ? product.tags : [],
                    zones_dispo: Array.isArray(product.zonesDisponibles) ? product.zonesDisponibles : [],
                    verified_status: product.verifiedStatus || 'unknown',
                    brand: product.brandKey || product.brand || '',
                    price: typeof product.price === 'number' ? product.price : 15.99
                  };

                  // 🔧 LOGS DE DEBUG COMPLETS AVEC TOUTES LES DONNÉES
                  console.log('🔧 HomePage - Produit adapté avec debug complet:', {
                    index,
                    productId: product.id,
                    originalSlug: product.slug,
                    generatedSlug: secureSlug,
                    finalSlug: adaptedHit.slug,
                    productTitle: adaptedHit.title,
                    timestamp: new Date().toISOString(),
                    originalProduct: product,
                    adaptedHit: adaptedHit
                  });

                  // 🚨 VALIDATION FINALE AVANT AFFICHAGE
                  if (!adaptedHit.title || 
                      !adaptedHit.slug || 
                      adaptedHit.slug === 'undefined' || 
                      adaptedHit.slug === 'null' ||
                      adaptedHit.slug.includes('undefined')) {
                    
                    console.error('🚨 HomePage - ALERTE CRITIQUE: Produit avec slug invalide bloqué!', {
                      title: adaptedHit.title,
                      slug: adaptedHit.slug,
                      originalProduct: product,
                      adaptedHit: adaptedHit
                    });
                    
                    // Forcer un slug de secours d'urgence
                    adaptedHit.slug = `emergency-product-${product.id}-${Date.now()}`;
                    console.warn('🔧 HomePage - Slug de secours d\'urgence appliqué:', adaptedHit.slug);
                  }

<<<<<<< HEAD
<<<<<<< HEAD
                return (
                  <div 
                    key={`product-${product.id}-${index}`}
                    className="animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ProductHit hit={adaptedHit} />
                  </div>
                );
              }).filter(Boolean)}
>>>>>>> ef19aef (🔧 fix: Secure product mapping to prevent undefined slugs in production)
=======
                  console.log('✅ Produit adapté avec succès:', {
=======
                  // Validation finale de sécurité
                  if (adaptedHit.slug.includes('undefined')) {
                    console.error('🚨 ERREUR CRITIQUE: Slug contient encore undefined après tous les correctifs!', adaptedHit);
                    return null; // Ne pas afficher ce produit
                  }

                  console.log('✅ HomePage - Produit validé pour affichage:', {
>>>>>>> 1208232 (🔧 fix: ULTIMATE slug validation - prevent all undefined URLs with triple validation)
                    id: adaptedHit.objectID,
                    title: adaptedHit.title,
                    finalSlug: adaptedHit.slug
                  });

=======
                  // Générer slug sécurisé
                  const secureSlug = generateSecureSlug(product);
                  
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
                  return (
                    <ProductHit
                      key={`${product.id}-${index}`}
                      hit={{
                        objectID: product.id,
                        title: product.title || 'Produit sans titre',
                        description: product.description || '',
                        brand: product.brand || '',
                        category: product.category || '',
                        image_url: product.image_url || '',
                        eco_score: product.eco_score || 0,
                        slug: secureSlug,
                        tags: product.tags || [],
                        zones_dispo: product.zones_dispo || [],
                        verified_status: product.verified_status || 'manual_review'
                      }}
                      viewMode={viewMode}
                      onProductClick={(slug: string) => {
                        // Validation finale avant navigation
                        if (slug && slug !== 'undefined' && slug.trim() !== '') {
                          if (import.meta.env.DEV) {
                            console.log('Navigation vers:', `/product/${slug}`);
                          }
                          navigate(`/product/${slug}`);
                        } else {
                          console.error('Navigation bloquée - slug invalide:', slug);
                        }
                      }}
                    />
                  );
<<<<<<< HEAD
                }).filter(Boolean)}
>>>>>>> 6fa9476 (🔧 fix: Ultra-secure slug validation to prevent undefined URLs)
=======
                })}
>>>>>>> 9ffe943 (🔧 fix: Correction erreur syntaxe HomePage ligne 574 - version production prête)
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    Précédent
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? 'bg-eco-leaf text-white'
                              : 'border border-eco-leaf/20 hover:bg-eco-leaf/10'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-eco-leaf/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-leaf/10 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : hasSearched ? (
            <NoResultsFound query={currentQuery} onEnrichRequest={handleEnrichRequest} />
          ) : (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-eco-leaf/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-eco-text mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-eco-text/70">
                Revenez plus tard pour découvrir nos produits éco-responsables
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;