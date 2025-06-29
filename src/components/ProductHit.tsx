import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import EcoScoreBadge from './EcoScoreBadge';

/** Représentation d’un hit Algolia */
interface HitProps {
  hit: {
    id: string;
    title: string;
    slug?: string;
    brand?: string;
    /** Champ “image_url” ou tableau “images” selon l’index */
    image_url?: string;
    images?: string[];
    eco_score?: number;
    confidence_pct?: number;
    confidence_color?: 'green' | 'yellow' | 'red';
    verified_status?: string;
    category?: string;
  };
}

/* Image générique locale (placée dans /public) */
const fallbackImage = '/fallback.png';

/* Fallbacks spécifiques par grande catégorie */
const categoryFallbacks: Record<string, string> = {
  Alimentation: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
  Cosmétiques:  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
  Maison:       'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
};

const ProductHit: React.FC<HitProps> = ({ hit }) => {
  const navigate = useNavigate();

  /** Retourne la meilleure image disponible pour le hit */
  const getHitImage = (): string => {
    /* 1) Champ image_url explicite */
    if (hit.image_url?.trim() && !hit.image_url.includes('fallback')) {
      return hit.image_url.trim();
    }

    /* 2) Première image du tableau “images” */
    if (hit.images?.length) {
      const first = hit.images[0]?.trim();
      if (first && !first.includes('fallback')) return first;
    }

    /* 3) Fallback par catégorie */
    if (hit.category && categoryFallbacks[hit.category]) {
      return categoryFallbacks[hit.category];
    }

    /* 4) Image générique locale */
    return fallbackImage;
  };

  const handleClick = () => {
    if (hit.slug) navigate(`/product/${hit.slug}`);
    else console.warn('Produit sans slug détecté', hit);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-4 flex flex-col gap-3"
    >
      {/* Image produit ------------------------------------------------ */}
      <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden border">
        <img
          src={getHitImage()}
          alt={hit.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== fallbackImage) target.src = fallbackImage;
          }}
        />
      </div>

      {/* Infos -------------------------------------------------------- */}
      <div className="flex flex-col gap-1">
        {hit.brand && <p className="text-xs text-gray-500 uppercase">{hit.brand}</p>}

        <h3 className="text-sm font-semibold text-eco-text line-clamp-2">{hit.title}</h3>

        <EcoScoreBadge score={hit.eco_score ?? 0} confidenceColor={hit.confidence_color} />

        {hit.verified_status === 'verified' && (
          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
            <Shield className="w-4 h-4" />
            Vérifié
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHit;
