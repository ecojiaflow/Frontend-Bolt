import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Leaf, 
  Users, 
  Shield,
  Share2,
  Heart,
  Star,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import ConfidenceBadge from "../components/ConfidenceBadge";
import PartnerLinks from "../components/PartnerLinks";
import SimilarProductsCarousel from "../components/SimilarProductsCarousel";
import { CATEGORIES, CategoryType } from '../types/categories';

interface Partner {
  id: string;
  name: string;
  website?: string;
  commission_rate: number;
  ethical_score: number;
}

interface PartnerLink {
  id: string;
  url: string;
  tracking_id?: string;
  commission_rate: number;
  clicks: number;
  partner: Partner;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand?: string;
  category?: string;
  tags: string[];
  image_url?: string;
  eco_score?: number;
  ai_confidence?: number;
  confidence_pct?: number;
  confidence_color?: "green" | "yellow" | "red";
  verified_status: "verified" | "manual_review" | "rejected";
  resume_fr?: string;
  partnerLinks: PartnerLink[];
  enriched_at?: string;
  zones_dispo?: string[];
}

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23999' text-anchor='middle' dy='0.3em'%3EProduit%3C/text%3E%3C/svg%3E";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ecolojia-backendv1.onrender.com";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ NOUVEAUX ÉTATS
  const [activeTab, setActiveTab] = useState<'overview' | 'score' | 'analysis'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    // 🚨 VALIDATION ULTRA-STRICTE DU SLUG EN PREMIER
    console.log('🔍 ProductPage - Raw params:', { slug });
    
    if (!slug) {
      console.error('🚨 ERREUR: Aucun slug fourni');
      setError("Slug manquant");
      setLoading(false);
      return;
    }

    // 🚨 VALIDATION CRITIQUE: Vérifier les valeurs invalides
    if (slug === 'undefined' || slug === 'null' || slug.trim() === '') {
      console.error('🚨 ERREUR: Slug invalide détecté:', slug);
      setError('Produit introuvable - identifiant invalide');
      setLoading(false);
      return;
    }

    // 🚨 REDIRECTION IMMÉDIATE SI SLUG CONTIENT 'undefined'
    if (slug.includes('undefined') || slug === 'not-found') {
      console.error('🚨 Redirection: Slug contient undefined, retour accueil');
      navigate('/', { replace: true });
      return;
    }

    console.log('✅ ProductPage - Slug valide, chargement:', slug);

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        // 🔧 CONSTRUCTION SÉCURISÉE DE L'URL
        const finalUrl = `${API_BASE_URL}/api/products/${encodeURIComponent(slug)}`;
        console.log('🔍 URL finale construite:', finalUrl);
        
        const response = await fetch(finalUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Produit non trouvé" : "Erreur serveur");
        }

        const data: Product | { product: Product } = await response.json();
        const rawProduct = (data as any).product ?? data;

        const normalized: Product = {
          ...rawProduct,
          eco_score: typeof rawProduct.eco_score === "string" ? parseFloat(rawProduct.eco_score) : rawProduct.eco_score,
          ai_confidence: typeof rawProduct.ai_confidence === "string" ? parseFloat(rawProduct.ai_confidence) : rawProduct.ai_confidence
        };

        console.log('✅ Produit chargé avec succès:', normalized.title);
        setProduct(normalized);
        
        // ✅ Vérifier favoris
        const favorites = JSON.parse(localStorage.getItem('ecolojia_favorites') || '[]');
        setIsFavorite(favorites.includes(normalized.id));
        
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error('❌ Erreur chargement produit:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [slug, navigate]);

  // ✅ NOUVELLES FONCTIONS
  const toggleFavorite = () => {
    if (!product) return;
    
    const favorites = JSON.parse(localStorage.getItem('ecolojia_favorites') || '[]');
    const newFavorites = isFavorite 
      ? favorites.filter((id: string) => id !== product.id)
      : [...favorites, product.id];
    
    localStorage.setItem('ecolojia_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const shareProduct = async () => {
    if (!product) return;
    
    const shareData = {
      title: `${product.title} - Ecolojia`,
      text: `Découvrez ce produit éco-responsable : ${product.title}`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage('Lien copié !');
        setTimeout(() => setShareMessage(''), 2000);
      }
    } catch (err) {
      console.error('Erreur partage:', err);
    }
  };

  const getCategoryConfig = () => {
    if (!product?.category) return null;
    return CATEGORIES[product.category as CategoryType];
  };

  const getScoreLevel = (score?: number) => {
    if (!score) return { label: 'Non évalué', color: 'gray' };
    if (score >= 0.8) return { label: 'Excellent', color: 'green' };
    if (score >= 0.6) return { label: 'Très bon', color: 'yellow' };
    if (score >= 0.4) return { label: 'Bon', color: 'orange' };
    return { label: 'À améliorer', color: 'red' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-eco-leaf rounded-full border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Erreur</h1>
        <p className="text-gray-600 mb-6">{error ?? "Produit introuvable"}</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-eco-leaf text-white rounded-lg hover:bg-eco-leaf/90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const categoryConfig = getCategoryConfig();
  const scoreLevel = getScoreLevel(product.eco_score);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ✅ HEADER AMÉLIORÉ */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-eco-text/60 hover:text-eco-leaf transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        
        <div className="flex items-center space-x-3">
          {shareMessage && (
            <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              {shareMessage}
            </span>
          )}
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={shareProduct}
            className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ✅ BREADCRUMB */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-eco-leaf">Accueil</button>
          <span>/</span>
          {categoryConfig && (
            <>
              <button 
                onClick={() => navigate(`/category/${product.category}`)}
                className="hover:text-eco-leaf"
              >
                {categoryConfig.name}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* ✅ IMAGE AMÉLIORÉE */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-eco-leaf/20 relative">
            <img
              src={product.image_url || fallbackImage}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImage;
              }}
            />
            {product.verified_status === "verified" && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Vérifié</span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ INFORMATIONS ENRICHIES */}
        <div className="space-y-6">
          <div>
            {/* Catégorie */}
            {categoryConfig && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">{categoryConfig.icon}</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryConfig.name}
                </span>
              </div>
            )}

            {/* Marque */}
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.brand}</p>
            )}

            {/* Titre */}
            <h1 className="text-3xl font-bold text-eco-text mb-4">{product.title}</h1>

            {/* Score principal amélioré */}
            {typeof product.eco_score === "number" && (
              <div className="bg-gradient-to-r from-eco-leaf/10 to-green-100 p-6 rounded-xl border border-eco-leaf/20 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-6 w-6 text-eco-leaf" />
                    <span className="text-lg font-semibold text-eco-text">Score écologique</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-eco-leaf">
                      {(product.eco_score * 100).toFixed(0)}%
                    </div>
                    <div className={`text-sm font-medium text-${scoreLevel.color}-600`}>
                      {scoreLevel.label}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white/50 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-eco-leaf to-green-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${product.eco_score * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Badges statut */}
            <div className="flex items-center gap-4 mb-6">
              <ConfidenceBadge
                pct={product.confidence_pct ?? 0}
                color={product.confidence_color ?? "yellow"}
                className=""
              />
              {product.verified_status === "verified" && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Vérifié</span>
                </div>
              )}
            </div>

            {/* Tags améliorés */}
            {product.tags?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-eco-leaf/10 border border-eco-leaf/20 text-sm rounded-full text-eco-text font-medium hover:bg-eco-leaf/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Zones de disponibilité */}
            {product.zones_dispo && product.zones_dispo.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Disponible : {product.zones_dispo.join(', ')}
                </span>
              </div>
            )}

            {/* Date d'enrichissement */}
            {product.enriched_at && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Analysé le {new Date(product.enriched_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ ONGLETS DÉTAILS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-12">
        {/* Navigation onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Description', icon: Leaf },
              { id: 'score', label: 'Analyse du score', icon: TrendingUp },
              { id: 'analysis', label: 'Analyse IA', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-eco-leaf text-eco-leaf'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu onglets */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description du produit</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
              
              {categoryConfig && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Critères {categoryConfig.name.toLowerCase()}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categoryConfig.criteria.map(criterion => (
                      <div
                        key={criterion}
                        className="bg-eco-leaf/10 text-eco-leaf px-3 py-2 rounded-lg text-sm font-medium text-center border border-eco-leaf/20"
                      >
                        {criterion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'score' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Détail du scoring</h3>
              
              {typeof product.eco_score === "number" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Score global</span>
                      <span className="text-2xl font-bold text-eco-leaf">
                        {(product.eco_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-eco-leaf h-3 rounded-full transition-all duration-500"
                        style={{ width: `${product.eco_score * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Breakdown par dimensions */}
                  {categoryConfig?.weights && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Répartition par dimension</h4>
                      <div className="space-y-3">
                        {Object.entries(categoryConfig.weights).map(([dimension, weight]) => {
                          const dimensionScore = (product.eco_score || 0) * 100 * (weight || 0);
                          return (
                            <div key={dimension} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium capitalize">
                                  {dimension === 'health' ? 'Santé' :
                                   dimension === 'environmental' ? 'Environnement' :
                                   dimension === 'social' ? 'Social' :
                                   dimension === 'durability' ? 'Durabilité' : dimension}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (poids: {((weight || 0) * 100).toFixed(0)}%)
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {dimensionScore.toFixed(0)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Analyse par intelligence artificielle</h3>
              
              {product.resume_fr ? (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Résumé de l'analyse</h4>
                      <p className="text-blue-800 leading-relaxed">{product.resume_fr}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Analyse IA en cours de traitement pour ce produit</p>
                </div>
              )}

              {/* Métriques de confiance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Métriques de confiance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Confiance IA</span>
                    <div className="text-lg font-bold">
                      {typeof product.ai_confidence === 'number' ? (product.ai_confidence * 100).toFixed(0) : product.confidence_pct}%
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Statut</span>
                    <div className={`text-lg font-bold ${
                      product.verified_status === 'verified' ? 'text-green-600' :
                      product.verified_status === 'manual_review' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {product.verified_status === 'verified' ? 'Vérifié' :
                       product.verified_status === 'manual_review' ? 'En révision' :
                       'Rejeté'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ LIENS PARTENAIRES (inchangé) */}
      <div className="border-t pt-6 mb-12">
        <PartnerLinks partnerLinks={product.partnerLinks} productTitle={product.title} />
      </div>

      {/* ✅ SUGGESTIONS SIMILAIRES (inchangé) */}
      <div className="border-t pt-6">
        <SimilarProductsCarousel productId={product.id} />
      </div>
    </div>
  );
};

export default ProductPage;