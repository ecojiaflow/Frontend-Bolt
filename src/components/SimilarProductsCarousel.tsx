<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import { useSimilarProducts } from "../hooks/useSimilarProducts";
=======
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
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)

interface Props {
  productId: string;
}

const SimilarProductsCarousel: React.FC<Props> = ({ productId }) => {
<<<<<<< HEAD
  const { similar, loading } = useSimilarProducts(productId);
=======
  const [similar, setSimilar] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const loadSimilarProducts = async () => {
      try {
        setLoading(true);
        
        const allProducts = await fetchRealProducts();
        
        const similarProducts = allProducts
          .filter(product => product.id !== productId)
          .slice(0, 6)
          .map(product => ({
            id: product.id,
            title: product.nameKey,
            slug: product.slug || product.id,
            image_url: product.image,
            eco_score: product.ethicalScore / 5
          }));

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
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)

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
        {similar.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="min-w-[180px] flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow p-3 hover:shadow-md transition"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-32 object-cover rounded"
<<<<<<< HEAD
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                Pas d’image
              </div>
            )}
            <p className="mt-2 font-medium text-sm">{product.title}</p>
=======
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
>>>>>>> 3ae457d (🎉 initial: Ecolojia frontend with SEO and bug fixes)
            <p className="text-green-600 text-xs">
              Éco-score : {Math.round(product.eco_score * 100)}%
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SimilarProductsCarousel;
