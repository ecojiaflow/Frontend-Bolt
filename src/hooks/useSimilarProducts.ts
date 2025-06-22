import { useEffect, useState } from "react";
import { fetchRealProducts } from '../api/realApi';

export interface SimilarProduct {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  eco_score: number;
}

export function useSimilarProducts(productId: string) {
  const [similar, setSimilar] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const loadSimilarProducts = async () => {
      try {
        setLoading(true);
        
        // ✅ UTILISER L'API EXISTANTE QUI FONCTIONNE
        const allProducts = await fetchRealProducts();
        
        // ✅ LOGIQUE SIMPLE DE SIMILARITÉ
        const similarProducts = allProducts
          .filter(product => product.id !== productId) // Exclure le produit actuel
          .slice(0, 6) // Prendre les 6 premiers
          .map(product => ({
            id: product.id,
            title: product.nameKey,
            slug: product.slug || product.id,
            image_url: product.image,
            eco_score: product.ethicalScore / 5 // Convertir 0-5 vers 0-1
          }));

        setSimilar(similarProducts);
        
      } catch (err) {
        console.error("❌ Erreur suggestions :", err);
        setSimilar([]); // fallback vide
      } finally {
        setLoading(false);
      }
    };

    loadSimilarProducts();
  }, [productId]);

  return { similar, loading };
}
}
