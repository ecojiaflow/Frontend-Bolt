import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchRealProducts } from '../api/realApi';

interface SimilarProduct {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  eco_score: number;
}

interface Props {
  productId: string;
}

const SimilarProductsCarousel: React.FC<Props> = ({ productId }) => {
  const [similar, setSimilar] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚨 VALIDATION CRITIQUE - NE PAS CHARGER SI productId INVALIDE
    if (!productId || productId === 'undefined' || productId.trim() === '') {
      console.error('🚨 SimilarProductsCarousel: productId invalide:', productId);
      setLoading(false);
      setSimilar([]);
      return;
    }

    const loadSimilarProducts = async () => {
      try {
        setLoading(true);
        
        const allProducts = await fetchRealProducts();
        
        const similarProducts = allProducts
          .filter(product => product.id !== productId)
          .slice(0, 6)
          .map(product => {
            // 🛡️ GÉNÉRATION DE SLUG ULTRA-SÉCURISÉE
            let safeSlug = product.slug;
            
            // Si le slug est invalide, générer depuis le titre
            if (!safeSlug || 
                safeSlug === 'undefined' || 
                safeSlug === 'null' || 
                safeSlug.includes('undefined') ||
                safeSlug.trim() === '') {
              
              const title = product.nameKey || product.title || '';
              if (title && title.trim() !== '' && title !== 'undefined') {
                safeSlug = title
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
              }
              
              // Si encore invalide, utiliser l'ID
              if (!safeSlug || safeSlug === 'undefined' || safeSlug.length < 2) {
                safeSlug = `product-${product.id}`;
              }
            }
            
            return {
              id: product.id,
              title: product.nameKey || 'Produit sans titre',
              slug: safeSlug,
              image_url: product.image,
              eco_score: (product.ethicalScore || 0) / 5
            };
          })
          // 🚨 FILTRER LES PRODUITS AVEC SLUG ENCORE PROBLÉMATIQUE
          .filter(product => 
            product.slug && 
            product.slug !== 'undefined' && 
            !product.slug.includes('undefined') &&
            product.slug.trim() !== ''
          );

        setSimilar(similarProducts);
        
      } catch (err) {
        console.error("❌ Erreur suggestions :", err);
        setSimilar([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilarProducts();
  }, [productId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Chargement des suggestions...</p>;
  }

  if (!similar.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-eco-text mb-3">Produits similaires</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {similar.map((product) => {
          // 🚨 VALIDATION FINALE AVANT RENDU
          if (!product.slug || 
              product.slug === 'undefined' || 
              product.slug.includes('undefined') ||
              product.slug.trim() === '') {
            return null; // Skip ce produit
          }

          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="min-w-[180px] flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow p-3 hover:shadow-md transition"
              onClick={(e) => {
                // 🚨 VALIDATION AVANT NAVIGATION
                if (!product.slug || 
                    product.slug === 'undefined' || 
                    product.slug.includes('undefined')) {
                  e.preventDefault();
                  console.error('🚨 Navigation bloquée dans SimilarProducts:', product.slug);
                  return false;
                }
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg';
                  }}
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                  Pas d'image
                </div>
              )}
              <p className="mt-2 font-medium text-sm line-clamp-2">{product.title}</p>
              <p className="text-green-600 text-xs">
                Éco-score : {Math.round(product.eco_score * 100)}%
              </p>
            </Link>
          );
        }).filter(Boolean)} {/* Supprimer les nulls */}
      </div>
    </section>
  );
};

export default SimilarProductsCarousel;