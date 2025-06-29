// src/utils/imageUtils.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  image?: string;
  eco_score: number;
  price: number;
  labels: string[];
  rating: number;
  reviews_count: number;
}

export const getProductImage = (product: Product): string => {
  // 1. Si image fournie et valide, l'utiliser (éviter fallback local)
  if (product.image && product.image.trim() !== '' && !product.image.includes('fallback')) {
    // Vérifier si c'est une URL Unsplash valide
    if (product.image.includes('unsplash.com')) {
      return product.image;
    }
    
    // Vérifier si c'est une URL e-commerce valide
    if (product.image.includes('http') && (
      product.image.includes('course-u.com') ||
      product.image.includes('monoprix.fr') ||
      product.image.includes('tesco.com') ||
      product.image.includes('carrefour.fr') ||
      product.image.includes('leclercdrive.fr')
    )) {
      return product.image;
    }
  }
  
  // 2. Fallback par catégorie avec Unsplash cohérent
  const categoryFallbacks: Record<string, string> = {
    'Alimentation': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
    'Cosmétiques': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80',
    'Maison': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
    'Mode': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80',
    'Électronique': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80',
    'Sport': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80',
    'Mobilité': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80'
  };
  
  return categoryFallbacks[product.category] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80';
};

// ❌ SUPPRIMÉ: return '/fallback.png';
export const getFallbackImage = (): string => {
  return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80';
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = event.currentTarget;
  // ❌ SUPPRIMÉ: if (img.src !== '/fallback.png') { img.src = '/fallback.png'; }
  
  // ✅ NOUVEAU: Fallback Unsplash uniquement
  if (!img.src.includes('unsplash.com')) {
    img.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80';
  }
};