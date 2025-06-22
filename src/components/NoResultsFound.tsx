import React, { useState } from 'react';
import { Search, Loader, ExternalLink } from 'lucide-react';

interface NoResultsFoundProps {
  query: string;
  onEnrichRequest: (query: string) => void;
}

const NoResultsFound: React.FC<NoResultsFoundProps> = ({ query, onEnrichRequest }) => {
  const [isEnriching, setIsEnriching] = useState(false);

  const handleEnrichClick = async () => {
    setIsEnriching(true);
    try {
      await onEnrichRequest(query);
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="text-center py-16 bg-white/90 backdrop-blur rounded-2xl shadow-sm">
      <div className="max-w-md mx-auto">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        
        <h3 className="text-xl font-semibold text-eco-text mb-4">
          Aucun résultat trouvé
        </h3>
        
        {query && (
          <p className="text-eco-text/70 mb-6">
            Votre recherche <strong>"{query}"</strong> n'a donné aucun résultat dans notre base de produits écoresponsables.
          </p>
        )}
        
        <div className="space-y-4">
          <p className="text-sm text-eco-text/60">
            💡 Nous pouvons enrichir notre base de données en recherchant ce produit sur le web
          </p>
          
          <button
            onClick={handleEnrichClick}
            disabled={isEnriching}
            className="inline-flex items-center px-6 py-3 bg-eco-leaf hover:bg-eco-leaf/90 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {isEnriching ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Recherche en cours...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Rechercher sur le web
              </>
            )}
          </button>
          
          {isEnriching && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                🤖 Notre IA analyse le web pour trouver des produits écoresponsables correspondant à votre recherche...
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Suggestions : Essayez des termes plus généraux ou vérifiez l'orthographe
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoResultsFound;