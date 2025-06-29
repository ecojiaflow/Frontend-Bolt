import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Search, X, ChevronDown, Filter, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ProductHit from '../components/ProductHit';
import NoResultsFound from '../components/NoResultsFound';
import searchClient, { ALGOLIA_INDEX_NAME } from '../lib/algolia';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ---------- États ---------- */
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [originalResults, setOriginalResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState({ nbHits: 0, processingTimeMS: 0 });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hitsPerPage] = useState(12);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ ecoScore: '', zone: '', confidence: '' });

  /* ---------- Chargement initial ---------- */
  useEffect(() => { loadInitialProducts(); }, []);

  const loadInitialProducts = async () => {
    try {
      setIsSearching(true);
      const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
      const res = await index.search('', { hitsPerPage, page: 0 });
      setSearchResults(res.hits);
      setOriginalResults(res.hits);
      setTotalPages(res.nbPages);
      setStats({ nbHits: res.nbHits, processingTimeMS: res.processingTimeMS });
    } finally { setIsSearching(false); }
  };

  /* ---------- Recherche ---------- */
  const performSearch = useCallback(
    async (q: string, page = 0) => {
      if (!q) { loadInitialProducts(); setHasSearched(false); setCurrentPage(0); return; }
      if (q.length < 2) return;
      try {
        setIsSearching(true);
        const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
        const res = await index.search(q, { hitsPerPage, page });
        setSearchResults(res.hits);
        setOriginalResults(res.hits);
        setTotalPages(res.nbPages);
        setCurrentPage(page);
        setStats({ nbHits: res.nbHits, processingTimeMS: res.processingTimeMS });
        setHasSearched(true);
      } finally { setIsSearching(false); }
    },
    [hitsPerPage],
  );

  /* debounce */
  useEffect(() => { const id = setTimeout(() => performSearch(query, 0), 300); return () => clearTimeout(id); },
    [query, performSearch]);

  /* ---------- Helpers ---------- */
  const scrollToResults = () =>
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });

  const clearSearch = () => {
    setQuery(''); setHasSearched(false);
    setFilters({ ecoScore:'', zone:'', confidence:'' });
  };

  const handlePageChange = (p:number) => { performSearch(query, p); scrollToResults(); };

  const handleProductClick = (hit:any) => navigate(`/product/${hit.slug || hit.objectID}`);

  /* ---------- Filtres locaux ---------- */
  const applyFilters = () => {
    let res = [...originalResults];
    if (filters.ecoScore)   res = res.filter(h => h.eco_score   >= +filters.ecoScore);
    if (filters.zone)       res = res.filter(h => h.zones_dispo?.includes(filters.zone));
    if (filters.confidence) res = res.filter(h => h.ai_confidence >= +filters.confidence);
    setSearchResults(res); setStats({ ...stats, nbHits: res.length }); setShowFilters(false);
  };
  const resetFilters = () => {
    setFilters({ ecoScore:'', zone:'', confidence:'' });
    setSearchResults(originalResults);
    setStats({ ...stats, nbHits: originalResults.length });
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO ------------------------------------------------ */}
      <section className="bg-eco-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8"><Leaf className="h-16 w-16 text-eco-leaf animate-pulse" /></div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-text mb-6"
            dangerouslySetInnerHTML={{
              __html: t('homepage.hero.title',{interpolation:{escapeValue:false}})
                .replace('<highlight>','<span class="text-eco-leaf">')
                .replace('</highlight>','</span>')
            }} />

          <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
            {t('homepage.hero.subtitle')}
          </p>

          {/* Champ de recherche (unique) */}
          <form onSubmit={e=>{e.preventDefault(); scrollToResults();}}
                className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input value={query} onChange={e=>setQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                autoComplete="off"
                className="w-full py-4 px-12 pr-16 border-2 border-eco-text/10 rounded-full shadow-lg
                           focus:ring-2 focus:ring-eco-leaf/30 text-eco-text placeholder-eco-text/50 bg-white/95" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-eco-text/50" />
              {query && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-eco-text/10 rounded-full">
                  <X className="h-4 w-4 text-eco-text/50 hover:text-eco-text" />
                </button>
              )}
            </div>
            {!hasSearched && !query && (
              <div className="mt-6">
                <button type="button" onClick={scrollToResults}
                  className="inline-flex items-center gap-2 text-eco-text/70 hover:text-eco-text group">
                  {t('common.discoverProducts')}
                  <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            )}
          </form>

          {hasSearched && !isSearching && stats.nbHits > 0 && (
            <div className="text-eco-text/60 text-sm">
              {`${stats.nbHits} résultat${stats.nbHits>1?'s':''} trouvé${stats.nbHits>1?'s':''} en ${stats.processingTimeMS} ms`}
            </div>
          )}
        </div>
      </section>

      {/* RÉSULTATS ------------------------------------------ */}
      <section id="results-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header résultats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-eco-text mb-2">
                {query ? t('common.searchResults',{query}) : t('common.ecoProducts')}
              </h2>
              <p className="text-eco-text/70">
                {stats.nbHits} {t('common.product', {count: stats.nbHits})}
                {hasSearched ? ` ${t('common.correspondingSearch')}` : ` ${t('common.available')}`}
              </p>
            </div>

            {/* Boutons vue + filtre */}
            <div className="flex items-center gap-4">
              <button onClick={()=>setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-eco-leaf/20 rounded-lg hover:bg-eco-leaf/10">
                <Filter className="h-4 w-4"/>{t('common.filters')}
              </button>
              <div className="flex border border-eco-leaf/20 rounded-lg overflow-hidden">
                <button onClick={()=>setViewMode('grid')}
                  className={`p-2 ${viewMode==='grid'?'bg-eco-leaf text-white':'hover:bg-eco-leaf/10'}`}>
                  <Grid className="h-4 w-4"/>
                </button>
                <button onClick={()=>setViewMode('list')}
                  className={`p-2 ${viewMode==='list'?'bg-eco-leaf text-white':'hover:bg-eco-leaf/10'}`}>
                  <List className="h-4 w-4"/>
                </button>
              </div>
            </div>
          </div>

          {/* (Optionnel) panneau de filtres -> conserve ton code précédent ici */}

          {/* Affichage des produits */}
          {isSearching && searchResults.length===0 ? (
            <p className="text-center text-eco-text/60">{t('common.searchInProgress')}</p>
          ) : searchResults.length>0 ? (
            <div className={viewMode==='grid'
                ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                :'space-y-4'}>
              {searchResults.map((hit) => (
                <div key={hit.objectID||hit.id} onClick={()=>handleProductClick(hit)}
                     className="cursor-pointer animate-fade-in-up">
                  <ProductHit hit={hit}/>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <NoResultsFound query={query}/>
          ) : null}

          {/* Pagination -> remets ton composant si besoin */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
