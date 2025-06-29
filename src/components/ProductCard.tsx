import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Tag, Shield, MapPin, Package } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import ConfidenceBadge from "../components/ConfidenceBadge";

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const scoreColor = () => {
    const score = product.ethicalScore || 0;
    if (score >= 0.8) return 'bg-eco-leaf';
    if (score >= 0.6) return 'bg-eco-glow';
    if (score >= 0.4) return 'bg-yellow-400';
    if (score >= 0.2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const productName = product.nameKey ? t(product.nameKey) : product.nameKey || t('common.unavailable');
  const productBrand = product.brandKey ? t(product.brandKey) : product.brandKey || t('common.unavailable');
  const productDescription = product.descriptionKey ? t(product.descriptionKey) : product.descriptionKey || t('common.noDescription');
  const translatedTags = Array.isArray(product.tagsKeys) 
    ? product.tagsKeys.map(tagKey => t(tagKey) || tagKey || t('common.unknownTag'))
    : [];

  // Gestion intelligente des images SANS fallback.png
  const getImageUrl = () => {
    // 1. Essayer l'image principale (et éviter fallback.png)
    if (product.image_url?.trim() && !product.image_url.includes('fallback')) {
      return product.image_url.trim();
    }
    
    // 2. Essayer la première image du tableau
    if (product.images?.[0] && !product.images[0].includes('fallback')) {
      return product.images[0];
    }
    
    // 3. Fallback par catégorie avec Unsplash UNIQUEMENT
    const categoryFallbacks: Record<string, string> = {
      'Alimentation': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
      'Cosmétiques': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
      'Maison': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
      'Mode': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80',
      'Électronique': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80',
      'Sport': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80',
      'Mobilité': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80'
    };
    
    return categoryFallbacks[product.category || ''] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80';
  };

  const imageUrl = getImageUrl();

  const linkId = product.partnerLinks?.[0]?.id;
  const trackingUrl = linkId 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/track/${linkId}` 
    : null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image failed for ${productName}: ${imageUrl}`);
    setImageError(true);
    setImageLoading(false);
    
    // ❌ SUPPRIMÉ: Plus de référence à fallback.png
    // Fallback vers Unsplash seulement
    const target = e.target as HTMLImageElement;
    if (!target.src.includes('unsplash.com')) {
      target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80';
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div 
      className="bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full border border-eco-text/5"
      onClick={() => onClick(product.id)}
      onKeyPress={(e) => e.key === 'Enter' && onClick(product.id)}
      tabIndex={0}
      role="button"
      aria-label={t('accessibility.openProductDetails', { name: productName })}
    >
      <div className="relative h-48 overflow-hidden">
        {/* Loading State */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Image principale ou fallback Unsplash */}
        {!imageError ? (
          <img 
            src={imageUrl}
            alt={t('accessibility.productImage', { name: productName })}
            className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          // Fallback élégant avec couleurs éco
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <div className="text-center text-green-600">
              <Package className="mx-auto h-12 w-12 mb-2" />
              <p className="text-sm font-medium">Produit éco</p>
              <p className="text-xs">{product.category || 'Écologique'}</p>
            </div>
          </div>
        )}

        {/* Badge vérifié */}
        {product.verified && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md" aria-label={t('common.verified')}>
            <CheckCircle size={20} className="text-eco-leaf" />
          </div>
        )}

        {/* Badge confiance */}
        {product.confidence_pct !== undefined && product.confidence_color && (
          <div className="absolute top-3 left-3">
            <ConfidenceBadge pct={product.confidence_pct} color={product.confidence_color} />
          </div>
        )}

        {/* Score éthique */}
        <div className={`absolute bottom-3 left-3 ${scoreColor()} text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm`}>
          {(product.ethicalScore || 0).toFixed(1)}
        </div>

        {/* Analyse IA en cours */}
        {!product.verified && !product.aiConfidence && (
          <div className="absolute bottom-3 right-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
            Analyse IA en cours...
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-eco-text line-clamp-1">{productName}</h3>
            <p className="text-sm text-eco-text/70">{productBrand}</p>
          </div>
          <span className="text-lg font-medium text-eco-text">
            {product.price?.toFixed(2) || '0.00'} {product.currency || 'EUR'}
          </span>
        </div>

        <p className="mt-3 text-eco-text/80 text-sm line-clamp-2">{productDescription}</p>

        {/* Zones disponibles */}
        {product.zonesDisponibles && product.zonesDisponibles.length > 0 && (
          <div className="mt-2 flex items-center text-xs text-eco-text/60">
            <MapPin size={12} className="mr-1" />
            Disponible en: {product.zonesDisponibles.join(', ')}
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {translatedTags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center bg-eco-glow/10 text-eco-olive text-xs px-3 py-1.5 rounded-full">
              <Tag size={12} className="mr-1.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Lien partenaire - ✅ SYNTAXE CORRIGÉE */}
      <div className="px-6 pb-6 pt-0 mt-auto">
        {trackingUrl ? (
          
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-eco-leaf hover:text-eco-text font-medium flex items-center transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={t('common.seeProduct')}
            title={t('affiliate.disclaimer')}
          >
            {t('common.seeProduct')}
            <ExternalLink size={14} className="ml-1.5" />
          </a>
        ) : (
          <span className="text-sm text-eco-text/40 flex items-center">
            Lien non disponible
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;