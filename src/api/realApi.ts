// /src/api/realApi.ts
import { Product } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://ecolojia-backendv1.onrender.com';

// Cache simple et non-intrusif
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const getCachedRequest = (url: string) => {
  const cached = requestCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedRequest = (url: string, data: any) => {
  requestCache.set(url, { data, timestamp: Date.now() });
};

interface BackendProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  eco_score: string;
  ai_confidence: string;
  confidence_pct: number;
  confidence_color: string;
  verified_status: string;
  tags: string[];
  zones_dispo: string[];
  description?: string;
  brand?: string;
  image_url?: string;
  affiliate_links?: any[];
  resume_fr?: string;
}

function adaptBackendToFrontend(backendProduct: BackendProduct): Product {
  if (!backendProduct.id) {
    console.error('❌ Produit sans ID:', backendProduct);
    return null;
  }

  const ecoScore = parseFloat(backendProduct.eco_score) || 0;
  const aiConfidence = parseFloat(backendProduct.ai_confidence) || 0;

  return {
    id: backendProduct.id,
    nameKey: backendProduct.title || 'Produit sans nom',
    brandKey: backendProduct.brand || 'Marque écoresponsable',
    descriptionKey: backendProduct.description || backendProduct.resume_fr || 'Description non disponible',
    ethicalScore: Math.min(5, Math.max(0, ecoScore * 5)),
    category: backendProduct.category || 'alimentaire',
    price: 15.99,
    currency: 'EUR',
    image: backendProduct.image_url || 'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg',
    tagsKeys: backendProduct.tags || [],
    verified: backendProduct.verified_status === 'verified' || backendProduct.verified_status === 'ai_verified',
    affiliateLink: backendProduct.affiliate_links?.[0]?.url || '',
    certificationsKeys: [],
    aiConfidence: Math.min(1, Math.max(0, aiConfidence)),
    zonesDisponibles: backendProduct.zones_dispo || ['FR', 'EU'],
    slug: backendProduct.slug || backendProduct.id,
    resumeFr: backendProduct.resume_fr,
    confidencePct: backendProduct.confidence_pct,
    confidenceColor: backendProduct.confidence_color,
    verifiedStatus: backendProduct.verified_status
  };
}

export async function fetchRealProducts(searchQuery: string = ''): Promise<Product[]> {
  try {
    const url = searchQuery 
      ? `${API_BASE}/api/products/search?q=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/api/products`;
    
    // Cache check - NON BLOQUANT
    const cached = getCachedRequest(url);
    if (cached) {
      console.log('🚀 Cache hit');
      return cached;
    }
    
    console.log('🔍 Requête API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Données reçues:', data);
    
    // Gérer les différents formats de réponse API
    let backendProducts: BackendProduct[] = [];
    
    if (Array.isArray(data)) {
      // Format direct : [product1, product2, ...]
      backendProducts = data;
    } else if (data.products && Array.isArray(data.products)) {
      // Format avec wrapper : { products: [product1, product2, ...] }
      backendProducts = data.products;
    } else if (data.data && Array.isArray(data.data)) {
      // Format avec data : { data: [product1, product2, ...] }
      backendProducts = data.data;
    } else if (data.results && Array.isArray(data.results)) {
      // Format avec results : { results: [product1, product2, ...] }
      backendProducts = data.results;
    } else {
      console.warn('Format de données API inattendu:', data);
      backendProducts = [];
    }
    
    console.log('📦 Produits trouvés:', backendProducts.length);
    
    const adaptedProducts = backendProducts
      .map(product => adaptBackendToFrontend(product))
      .filter(Boolean) as Product[];
    
    console.log('✅ Produits adaptés:', adaptedProducts.length);
    
    // Cache save - NON BLOQUANT
    setCachedRequest(url, adaptedProducts);
    
    return adaptedProducts;
    
  } catch (error) {
    console.error('❌ Erreur API:', error);
    
    try {
      const { products } = await import('../data/mockData');
      console.log('✅ Données mock chargées:', products.length);
      return products;
    } catch (mockError) {
      console.error('❌ Erreur mock data:', mockError);
      return [];
    }
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug || slug === 'undefined') {
    console.error('❌ Slug invalide:', slug);
    return null;
  }

  try {
    const url = `${API_BASE}/api/products/${slug}`;
    
    // Cache check
    const cached = getCachedRequest(url);
    if (cached) return cached;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data = await response.json();
    const adapted = adaptBackendToFrontend(data);
    
    // Cache save
    setCachedRequest(url, adapted);
    
    return adapted;
    
  } catch (error) {
    console.error('❌ Erreur récupération produit:', error);
    return null;
  }
}

export async function fetchSuggestions(query: string): Promise<string[]> {
  const fallbackSuggestions = [
    'shampoing bio',
    'vêtements éthiques', 
    'cosmétiques naturels',
    'alimentation bio',
    'produits zéro déchet'
  ];
  
  return fallbackSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  );
}

export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    return response.ok;
  } catch (error) {
    return false;
  }
}