// src/api/realApi.ts
import { Product } from '../types';

const API_BASE = 'https://ecolojia-backend.onrender.com';
const SUGGEST_WEBHOOK = 'https://ecolojia.app.n8n.cloud/webhook/suggest';

// Format de votre backend
interface BackendProduct {
  id: string;
  title: string;
  description: string;
  eco_score: number | string;
  ai_confidence: number | string;
  confidence_pct?: number;
  confidence_color?: string;
  tags: string[];
  zones_dispo: string[];
  affiliate_url: string;
  verified_status: 'verified' | 'manual_review';
  category?: string;
  brand?: string;
  images?: string[];
  slug?: string;
  prices?: any;
  resume_fr?: string;
  resume_en?: string;
}

// Convertit les données backend vers le format frontend
function adaptBackendToFrontend(backendProduct: BackendProduct): Product {
  console.log('🔄 Adaptation produit:', backendProduct.title || backendProduct.id);
  
  // Conversion sécurisée des nombres
  const ecoScore = typeof backendProduct.eco_score === 'string' 
    ? parseFloat(backendProduct.eco_score) 
    : Number(backendProduct.eco_score) || 4.0;
    
  const aiConfidence = typeof backendProduct.ai_confidence === 'string'
    ? parseFloat(backendProduct.ai_confidence)
    : Number(backendProduct.ai_confidence) || 0.8;

  // Assurer que les scores sont dans les bonnes plages
  const normalizedEcoScore = Math.min(5, Math.max(0, ecoScore));
  const normalizedAiConfidence = Math.min(1, Math.max(0, aiConfidence));

  return {
    id: backendProduct.id || `product_${Date.now()}`,
    nameKey: backendProduct.title || 'Produit écoresponsable',
    brandKey: backendProduct.brand || 'Marque écoresponsable',
    descriptionKey: backendProduct.description || 'Description non disponible',
    ethicalScore: normalizedEcoScore,
    category: backendProduct.category || '1', // Alimentaire par défaut
    price: 15.99, // Prix par défaut - à adapter selon vos besoins
    currency: 'EUR',
    image: (backendProduct.images && backendProduct.images.length > 0) 
      ? backendProduct.images[0] 
      : 'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg',
    tagsKeys: Array.isArray(backendProduct.tags) ? backendProduct.tags : [],
    verified: backendProduct.verified_status === 'verified',
    affiliateLink: backendProduct.affiliate_url || '',
    certificationsKeys: [], // À compléter selon vos besoins
    // Champs supplémentaires pour l'IA
    aiConfidence: normalizedAiConfidence,
    zonesDisponibles: Array.isArray(backendProduct.zones_dispo) 
      ? backendProduct.zones_dispo 
      : ['FR', 'EU']
  };
}

// Récupère les produits depuis votre backend
export async function fetchRealProducts(searchQuery: string = ''): Promise<Product[]> {
  try {
    const url = searchQuery 
      ? `${API_BASE}/api/prisma/products?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/api/prisma/products`;
    
    console.log('🔍 Recherche API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Timeout de 10 secondes
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Données brutes reçues:', data);
    
    // Gestion de différents formats de réponse
    let backendProducts: BackendProduct[] = [];
    
    if (Array.isArray(data)) {
      backendProducts = data;
    } else if (data.products && Array.isArray(data.products)) {
      backendProducts = data.products;
    } else if (data.data && Array.isArray(data.data)) {
      backendProducts = data.data;
    } else {
      console.warn('⚠️ Format de réponse inattendu:', data);
      return [];
    }
    
    console.log('📦 Produits backend trouvés:', backendProducts.length);
    
    if (backendProducts.length === 0) {
      console.log('ℹ️ Aucun produit trouvé dans la réponse API');
      return [];
    }
    
    // Conversion des produits
    const adaptedProducts = backendProducts.map((product, index) => {
      try {
        return adaptBackendToFrontend(product);
      } catch (error) {
        console.error(`❌ Erreur adaptation produit ${index}:`, error, product);
        return null;
      }
    }).filter(Boolean) as Product[];
    
    console.log('✅ Produits adaptés:', adaptedProducts.length);
    return adaptedProducts;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des produits:', error);
    
    // En cas d'erreur, retourner des données de démonstration
    console.log('🔄 Chargement des données de démonstration...');
    
    try {
      const { products } = await import('../data/mockData');
      console.log('✅ Données mock chargées:', products.length);
      return products;
    } catch (mockError) {
      console.error('❌ Erreur chargement mock data:', mockError);
      return [];
    }
  }
}

// Suggestions IA
export async function fetchSuggestions(query: string): Promise<string[]> {
  try {
    console.log('🤖 Requête suggestions IA pour:', query);
    
    const response = await fetch(SUGGEST_WEBHOOK, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        zone: 'FR',
        lang: 'fr'
      }),
      // Timeout de 5 secondes pour les suggestions
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur suggestions: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🎯 Suggestions reçues:', data);
    
    const suggestions = data.suggestions || data.data || [];
    return Array.isArray(suggestions) ? suggestions : [];
    
  } catch (error) {
    console.error('❌ Erreur suggestions IA:', error);
    
    // Suggestions de fallback
    const fallbackSuggestions = [
      'shampoing bio',
      'vêtements éthiques',
      'cosmétiques naturels',
      'alimentation bio',
      'produits zéro déchet'
    ];
    
    // Filtrer selon la requête
    return fallbackSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Test de connexion API
export async function testApiConnection(): Promise<boolean> {
  try {
    console.log('🔗 Test connexion API...');
    
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    const isConnected = response.ok;
    console.log(isConnected ? '✅ API connectée' : '❌ API non disponible');
    
    return isConnected;
  } catch (error) {
    console.log('❌ API non accessible:', error);
    return false;
  }
}