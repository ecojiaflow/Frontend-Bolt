import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Star } from 'lucide-react';
import ConfidenceBadge from '../components/ConfidenceBadge';

type Product = {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  eco_score: number;
  confidence_pct: number;
  confidence_color: 'green' | 'yellow' | 'red';
  zones_dispo: string[];
  affiliate_url: string;
  resume_fr?: string;
  criteria_score?: Record<string, number>;
  verified_status?: string;
};

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/slug/${slug}`);
        if (!res.ok) throw new Error('Produit introuvable');
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  const renderEcoStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-leaf mx-auto mb-4"></div>
          <p className="text-eco-text">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-eco-text mb-2">Produit introuvable</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Ce produit n\'existe pas ou n\'est plus disponible.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-eco-leaf text-white px-6 py-2 rounded-lg hover:bg-eco-leaf/90 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-eco-leaf hover:text-eco-text transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-eco-leaf/10">
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.title}
                className="w-full h-80 object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} ${index + 2}`}
                    className="h-20 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-eco-leaf/10">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-eco-text pr-4">
                  {product.title}
                </h1>
                <ConfidenceBadge 
                  pct={product.confidence_pct} 
                  color={product.confidence_color}
                />
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {product.resume_fr && (
                <div className="bg-eco-leaf/5 border-l-4 border-eco-leaf p-4 rounded-r-lg mb-6">
                  <h3 className="font-semibold text-eco-text mb-2 flex items-center gap-2">
                    🤖 Analyse IA
                  </h3>
                  <p className="text-sm text-eco-text/80 leading-relaxed">
                    {product.resume_fr}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-eco-text">Score écologique :</span>
                  <div className="flex items-center gap-1">
                    {renderEcoStars(product.eco_score)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.eco_score}/5
                  </span>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-eco-text mb-3">🏷️ Caractéristiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-eco-leaf/10 text-eco-text text-sm px-3 py-1 rounded-full border border-eco-leaf/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.zones_dispo && product.zones_dispo.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-eco-leaf" />
                    <span className="font-semibold text-eco-text">Zones disponibles :</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.zones_dispo.map((zone, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded border border-blue-200"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.verified_status && (
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                    product.verified_status === 'verified' 
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {product.verified_status === 'verified' ? '✅ Vérifié' : '⏳ En cours de vérification'}
                  </span>
                </div>
              )}

              {product.affiliate_url && (
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={product.affiliate_url}
                    className="inline-flex items-center gap-2 w-full justify-center bg-eco-leaf text-white px-6 py-3 rounded-xl hover:bg-eco-leaf/90 transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acheter ce produit
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Lien vers un partenaire écoresponsable
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {product.criteria_score && Object.keys(product.criteria_score).length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-eco-leaf/10">
            <h2 className="text-xl font-bold text-eco-text mb-4">📊 Détail des critères écologiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(product.criteria_score).map(([criteria, score]) => (
                <div key={criteria} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-eco-text capitalize">
                      {criteria.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-eco-leaf">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-eco-leaf h-2 rounded-full transition-all duration-300"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;