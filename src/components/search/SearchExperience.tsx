import React from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  Stats,
  RefinementList,
  Configure,
  connectStateResults,
} from 'react-instantsearch-dom';

import ProductHit from '../ProductHit';
import NoResultsFound from '../NoResultsFound';
import searchClient, { ALGOLIA_INDEX_NAME } from '../../lib/algolia';

/**
 * Permet de masquer le SearchBox quand le composant est embarqué
 * sous un autre champ de recherche (ex. : Hero de la HomePage).
 */
interface SearchExperienceProps {
  /** Masquer le champ de recherche ? (défaut : false) */
  hideSearchBox?: boolean;
}

const ResultsWrapper = connectStateResults(({ searchResults, children }) => {
  if (searchResults && searchResults.nbHits === 0) {
    return <NoResultsFound query={searchResults?.query ?? ''} />;
  }
  return children;
});

const SearchExperience: React.FC<SearchExperienceProps> = ({ hideSearchBox = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
      <InstantSearch indexName={ALGOLIA_INDEX_NAME} searchClient={searchClient}>
        {/* SearchBox visible seulement si hideSearchBox === false */}
        {!hideSearchBox && (
          <div className="mb-6">
            <SearchBox
              translations={{ placeholder: 'Rechercher un produit éthique…' }}
              className="ais-SearchBox w-full"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtres */}
          <aside className="md:w-72">
            <h2 className="font-semibold text-gray-700 mb-2">🎯 Filtres</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Catégorie</p>
                <RefinementList attribute="category" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Zone</p>
                <RefinementList attribute="zones_dispo" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Couleur de confiance</p>
                <RefinementList attribute="confidence_color" />
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <main className="flex-1">
            <Stats className="mb-4" />
            <ResultsWrapper>
              <Hits hitComponent={ProductHit} />
              <div className="mt-6">
                <Pagination />
              </div>
            </ResultsWrapper>
          </main>
        </div>

        {/* Configuration globale : 12 résultats / page */}
        <Configure hitsPerPage={12} />
      </InstantSearch>
    </div>
  );
};

export default SearchExperience;
