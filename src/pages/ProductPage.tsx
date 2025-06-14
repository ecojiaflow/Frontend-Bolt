import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Product = {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  eco_score: number;
  confidence_pct: number;
  confidence_color: string;
  zones_dispo: string[];
  affiliate_url: string;
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

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error || !product) return <div className="p-8 text-red-600">Erreur : {error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-eco-leaf hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.title}
              className="w-full h-64 object-cover rounded mb-4"
            />

            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex flex-wrap gap-2 my-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mb-1">
              <strong>Score écologique :</strong> {product.eco_score} / 5
            </p>
            <p className="mb-1">
              <strong>Confiance IA :</strong> {product.confidence_pct}% ({product.confidence_color})
            </p>
            <p className="mb-4">
              <strong>Zones disponibles :</strong> {product.zones_dispo.join(', ')}
            </p>

            {product.affiliate_url && (
              <a
                href={product.affiliate_url}
                className="inline-block mt-4 bg-eco-leaf text-white px-6 py-2 rounded hover:bg-green-700 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acheter ce produit
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
