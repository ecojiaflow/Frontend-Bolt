// /src/components/ProductHit.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, CheckCircle, Leaf } from 'lucide-react';

interface ProductHitProps {
  hit: {
    objectID: string;
    title: string;
    description?: string;
    brand?: string;
    category?: string;
    image_url?: string;
    eco_score?: number;
    slug: string;
    tags?: string[];
    zones_dispo?: string[];
    verified_status?: 'verified' | 'manual_review' | 'rejected';
  };
  viewMode?: 'grid' | 'list';
  onProductClick?: (slug: string) => void;
}

const ProductHit: React.FC<ProductHitProps> = ({ hit, viewMode = 'grid', onProductClick }) => {
  // 🛡️ VALIDATION CRITIQUE DU SLUG AVANT TOUT RENDU
  const safeSlug = React.useMemo(() => {
    if (!hit.slug || 
        hit.slug === 'undefined' || 
        hit.slug === 'null' || 
        hit.slug.trim() === '' ||
        hit.slug.includes('undefined')) {
      
      // Générer un slug d'urgence depuis le titre ou l'ID
      const title = hit.title || '';
      if (title && title.trim() !== '') {
        const generatedSlug = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        if (generatedSlug && generatedSlug.length > 0) {
          return generatedSlug;
        }
      }
      
      // Fallback avec l'ID
      return `product-${hit.objectID || Date.now()}`;
    }
    
    return hit.slug;
  }, [hit.slug, hit.title, hit.objectID]);

  // 🚨 Si le slug est encore problématique, ne pas rendre le composant
  if (!safeSlug || safeSlug === 'undefined' || safeSlug.includes('undefined')) {
    if (import.meta.env.DEV) {
      console.error('🚨 ProductHit: Slug dangereux détecté, composant ignoré:', { 
        originalSlug: hit.slug, 
        safeSlug, 
        title: hit.title 
      });
    }
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    // Validation finale avant navigation
    if (!safeSlug || safeSlug === 'undefined' || safeSlug.includes('undefined')) {
      e.preventDefault();
      console.error('🚨 Navigation bloquée - slug invalide');
      return;
    }

    if (onProductClick) {
      e.preventDefault();
      onProductClick(safeSlug);
    }
  };

  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dy='0.3em'%3EProduit%3C/text%3E%3C/svg%3E";
  
  const scoreLevel = hit.eco_score 
    ? hit.eco_score >= 0.8 ? 'Excellent' 
    : hit.eco_score >= 0.6 ? 'Très bon' 
    : hit.eco_score >= 0.4 ? 'Bon' 
    : 'Correct'
    : 'Non évalué';

  const scoreColor = hit.eco_score 
    ? hit.eco_score >= 0.8 ? 'text-green-600' 
    : hit.eco_score >= 0.6 ? 'text-yellow-600' 
    : hit.eco_score >= 0.4 ? 'text-orange-600' 
    : 'text-red-600'
    : 'text-gray-500';

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${safeSlug}`}
        onClick={handleClick}
        className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 p-4"
      >
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={hit.image_url || fallbackImage}
              alt={hit.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {hit.brand && (
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{hit.brand}</p>
                )}
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2">
                  {hit.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {hit.description}
                </p>
              </div>
              
              {typeof hit.eco_score === 'number' && (
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-eco-leaf">
                    {(hit.eco_score * 100).toFixed(0)}%
                  </div>
                  <div className={`text-xs font-medium ${scoreColor}`}>
                    {scoreLevel}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {hit.verified_status === 'verified' && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Vérifié</span>
                </div>
              )}
              
              {hit.zones_dispo && hit.zones_dispo.length > 0 && (
                <span className="text-xs text-gray-500">
                  {hit.zones_dispo.slice(0, 2).join(', ')}
                  {hit.zones_dispo.length > 2 && ` +${hit.zones_dispo.length - 2}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/product/${safeSlug}`}
      onClick={handleClick}
      className="group block bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden product-card"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={hit.image_url || fallbackImage}
          alt={hit.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImage;
          }}
        />
        
        {hit.verified_status === 'verified' && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Vérifié</span>
          </div>
        )}
        
        {typeof hit.eco_score === 'number' && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-eco-leaf" />
              <span className="text-xs font-bold text-eco-leaf">
                {(hit.eco_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {hit.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{hit.brand}</p>
        )}
        
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-eco-leaf transition-colors">
          {hit.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {hit.description}
        </p>
        
        <div className="flex items-center justify-between">
          {typeof hit.eco_score === 'number' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {(hit.eco_score * 5).toFixed(1)}
                </span>
              </div>
              <span className={`text-xs font-medium ${scoreColor}`}>
                {scoreLevel}
              </span>
            </div>
          )}
          
          {hit.zones_dispo && hit.zones_dispo.length > 0 && (
            <span className="text-xs text-gray-500">
              {hit.zones_dispo[0]}
              {hit.zones_dispo.length > 1 && ` +${hit.zones_dispo.length - 1}`}
            </span>
          )}
        </div>
        
        {hit.tags && hit.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hit.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-eco-leaf/10 text-eco-leaf text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {hit.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{hit.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductHit;