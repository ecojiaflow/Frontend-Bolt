// /src/components/ProductHit.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, CheckCircle, Leaf } from 'lucide-react';

interface ProductHitProps {
  hit: {
    objectID: string;
    title: string;
    description?: string;
    slug?: string;
    images?: string[];
    eco_score?: number;
    ai_confidence?: number;
    confidence_pct?: number;
    confidence_color?: string;
    tags?: string[];
    zones_dispo?: string[];
    verified_status?: string;
    brand?: string;
    price?: number;
    _highlightResult?: any;
  };
}

const ProductHit: React.FC<ProductHitProps> = ({ hit }) => {
  // 🔧 FIX: Sécuriser le slug avec fallback robuste
  const productSlug = hit.slug && hit.slug !== 'undefined' && hit.slug.trim() !== '' 
    ? hit.slug 
    : hit.objectID || 'product-' + Date.now();
  
  console.log('🔍 ProductHit Debug:', {
    objectID: hit.objectID,
    slug: hit.slug,
    finalSlug: productSlug,
    title: hit.title
  });
  
  const imageUrl = hit.images?.[0] || 'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg';
  
  // Calcul du score avec couleurs
  const getScoreColor = (score?: number) => {
    if (!score) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'N/A' };
    const percentage = score * 100;
    if (percentage >= 80) return { bg: 'bg-green-100', text: 'text-green-800', label: `${percentage.toFixed(0)}%` };
    if (percentage >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: `${percentage.toFixed(0)}%` };
    if (percentage >= 40) return { bg: 'bg-orange-100', text: 'text-orange-800', label: `${percentage.toFixed(0)}%` };
    return { bg: 'bg-red-100', text: 'text-red-800', label: `${percentage.toFixed(0)}%` };
  };

  // Confiance IA avec couleurs
  const getConfidenceColor = (confidence?: number, color?: string) => {
    if (color === 'green') return 'bg-green-100 text-green-800';
    if (color === 'yellow') return 'bg-yellow-100 text-yellow-800';
    if (color === 'red') return 'bg-red-100 text-red-800';
    
    // Fallback basé sur le pourcentage
    if (!confidence) return 'bg-gray-100 text-gray-600';
    const pct = typeof confidence === 'number' ? confidence * 100 : confidence;
    if (pct >= 80) return 'bg-green-100 text-green-800';
    if (pct >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const scoreData = getScoreColor(hit.eco_score);
  const confidenceClass = getConfidenceColor(hit.ai_confidence, hit.confidence_color);
  
  // Prix par défaut
  const price = hit.price || 15.99;

  // 🔧 FIX: Vérifier que le slug est valide avant navigation
  if (!productSlug || productSlug === 'undefined' || productSlug.trim() === '') {
    console.error('❌ ProductHit: Slug invalide pour produit', hit);
    return (
      <div className="block bg-red-50 border-2 border-red-200 rounded-xl p-4">
        <p className="text-red-600 text-sm font-medium">
          ⚠️ Produit avec données incomplètes
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ID: {hit.objectID} | Titre: {hit.title}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Slug: "{hit.slug}" | Final: "{productSlug}"
        </p>
      </div>
    );
  }

  return (
    <Link 
      to={`/product/${encodeURIComponent(productSlug)}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image avec overlay */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={hit.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg';
          }}
        />
        
        {/* Badge vérifié */}
        {hit.verified_status === 'verified' && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Vérifié</span>
          </div>
        )}

        {/* Score en overlay */}
        <div className="absolute bottom-3 left-3">
          <div className={`${scoreData.bg} ${scoreData.text} px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1`}>
            <Leaf className="h-4 w-4" />
            <span>{scoreData.label}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Marque */}
        {hit.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">{hit.brand}</p>
        )}

        {/* Titre avec highlight */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
          {hit._highlightResult?.title ? (
            <span dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }} />
          ) : (
            hit.title
          )}
        </h3>

        {/* Description courte */}
        {hit.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {hit._highlightResult?.description ? (
              <span dangerouslySetInnerHTML={{ __html: hit._highlightResult.description.value }} />
            ) : (
              hit.description.length > 80 ? `${hit.description.substring(0, 80)}...` : hit.description
            )}
          </p>
        )}

        {/* Tags */}
        {hit.tags && hit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hit.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {hit.tags.length > 3 && (
              <span className="text-gray-400 text-xs self-center">
                +{hit.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer avec confiance et prix */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {/* Badge confiance IA */}
            <div className={`${confidenceClass} px-2 py-1 rounded text-xs font-medium flex items-center space-x-1`}>
              <Shield className="h-3 w-3" />
              <span>
                {hit.confidence_pct ? `${hit.confidence_pct}%` : 
                 hit.ai_confidence ? `${(hit.ai_confidence * 100).toFixed(0)}%` : 'IA'}
              </span>
            </div>

            {/* Zone de disponibilité */}
            {hit.zones_dispo && hit.zones_dispo.includes('FR') && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                🇫🇷 FR
              </span>
            )}
          </div>

          {/* Prix */}
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">{price}€</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductHit;