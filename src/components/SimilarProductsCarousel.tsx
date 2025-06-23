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
    // 🚨 VALIDATION ULTRA-STRICTE - BLOQUER TOUT SI PRODUCTID INVALIDE
    if (!productId || 
        productId === 'undefined' || 
        productId === 'null' ||
        productId.toString().includes('undefined') ||
        productId.trim() === '' ||
        typeof productId !== 'string') {
      
      console.warn('⚠️ SimilarProductsCarousel: productId invalide, composant désactivé:', productId);
      setLoading(false);
      setSimilar([]);
      return; // ARRÊT TOTAL
    }

    const loadSimilarProducts = async () => {
      try {
        setLoading(true);
        
        // 🛡️ APPEL SÉCURISÉ - avec query vide pour éviter undefined
        const allProducts = await fetchRealProducts('');
        
        if (!Array.isArray(allProducts) || allProducts.length === 0) {
          setSimilar([]);
          return;
        }
        
        const similarProducts = allProducts
          .filter(product => 
            product && 
            product.id && 
            product.id !== productId &&
            product.id !== 'undefined'
          )
          .slice(0, 6)
          .map(product => {
            // 🛡️ GÉNÉRATION DE SLUG SÉCURISÉE
            let safeSlug = product.slug;
            
            // Validation et nettoyage du slug
            if (!safeSlug || 
                safeSlug === 'undefined' || 
                safeSlug === 'null' || 
                safeSlug.includes('undefined') ||
                safeSlug.trim() === '') {
              
              // Essayer de générer depuis le titre
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
              
              // Fallback avec l'ID
              if (!safeSlug || safeSlug === 'undefined' || safeSlug.length < 2) {
                safeSlug = `product-${product.id}`;
              }
            }
            
            return {
              id: product.id,
              title: product.nameKey || 'Produit sans titre',
              slug: safeSlug,
              image_url: product.image || null,
              eco_score: (product.ethicalScore || 0) / 5
            };
          })
          // 🚨 FILTRAGE FINAL - SUPPRIMER TOUS LES PRODUITS PROBLÉMATIQUES
          .filter(product => 
            product && 
            product.id &&
            product.slug && 
            product.slug !== 'undefined' && 
            !product.slug.includes('undefined') &&
            product.slug.trim() !== '' &&
            product.slug.length > 2
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

  // Ne pas rendre si pas de productId valide
  if (!productId || productId === 'undefined' || productId.includes('undefined')) {
    return null;
  }

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
          // 🚨 VALIDATION FINALE AVANT CHAQUE RENDU
          if (!product || 
              !product.id ||
              !product.slug || 
              product.slug === 'undefined' || 
              product.slug.includes('undefined') ||
              product.slug.trim() === '') {
            return null;
          }

          return (
            <Link
              key={`similar-${product.id}`}
              to={`/product/${product.slug}`}
              className="min-w-[180px] flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow p-3 hover:shadow-md transition"
              onClick={(e) => {
                // 🚨 VALIDATION ULTIME AVANT NAVIGATION
                if (!product.slug || 
                    product.slug === 'undefined' || 
                    product.slug.includes('undefined') ||
                    product.slug.trim() === '') {
                  e.preventDefault();
                  e.stopPropagation();
                  console.error('🚨 Navigation SimilarProducts bloquée:', product.slug);
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
                Éco-score : {Math.round((product.eco_score || 0) * 100)}%
              </p>
            </Link>
          );
        }).filter(Boolean)}
      </div>
    </section>
  );
};

export default SimilarProductsCarousel;