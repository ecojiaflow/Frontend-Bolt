import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import ProductDetail from '../components/ProductDetail';
import { Leaf, Loader2, AlertCircle } from 'lucide-react';
import { Product, SearchFilters } from '../types';
import { categories } from '../data/mockData';
import { fetchRealProducts } from '../api/realApi';
import { useTranslation, Trans } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial des produits
  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrage des produits
  useEffect(() => {
    let result = allProducts;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => {
          const name = (product.nameKey || '').toLowerCase();
          const description = (product.descriptionKey || '').toLowerCase();
          const brand = (product.brandKey || '').toLowerCase();
          const tags = product.tagsKeys?.join(' ').toLowerCase() || '';
          
          return name.includes(query) || 
                 description.includes(query) || 
                 brand.includes(query) || 
                 tags.includes(query);
        }
      );
    }
    
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    if (filters.minEthicalScore) {
      result = result.filter(product => product.ethicalScore >= filters.minEthicalScore!);
    }

    if (filters.minAiConfidence) {
      result = result.filter(product => 
        product.aiConfidence && product.aiConfidence >= filters.minAiConfidence!
      );
    }
    
    setFilteredProducts(result);
  }, [searchQuery, filters, allProducts]);

  const loadProducts = async (query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des produits...', query || 'tous');
      const products = await fetchRealProducts(query);
      
      console.log('✅ Produits chargés:', products.length);
      setAllProducts(products);
      
      if (products.length === 0) {
        setError('Aucun produit trouvé. Utilisation des données de démonstration.');
      }
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError('Impossible de charger les produits. Utilisation des données de démonstration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Optionnel: recharger depuis l'API pour une recherche plus précise
    // loadProducts(query);
  };

  const handleCategorySelect = (categoryId: string | undefined) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleProductClick = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const retryLoad = () => {
    loadProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-eco-gradient">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-eco-gradient py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <Leaf className="h-16 w-16 text-eco-leaf" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eco-text mb-6">
              <Trans
                i18nKey="homepage.hero.title"
                components={{
                  highlight: <span className="text-eco-leaf" />
                }}
              />
            </h1>
            <p className="text-lg md:text-xl text-eco-text/80 max-w-3xl mx-auto mb-12">
              <Trans i18nKey="homepage.hero.subtitle" />
            </p>
            
            <SearchBar onSearch={handleSearch} />

            {/* Indicateur de connexion API */}
            <div className="mt-6 flex justify-center">
              {loading ? (
                <div className="flex items-center text-eco-text/60 text-sm">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion à l'API Ecolojia...
                </div>
              ) : error ? (
                <div className="flex items-center text-orange-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                  <button 
                    onClick={retryLoad}
                    className="ml-2 text-eco-leaf hover:text-eco-text underline"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <div className="text-green-600 text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Connecté à l'API • {allProducts.length} produits chargés
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryFilter 
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={handleCategorySelect}
            />
            
            {loading ? (
              <div className="mt-16 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-eco-leaf mb-4" />
                <p className="text-eco-text/70">Chargement des produits écoresponsables...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="mt-8 mb-10">
                  <h2 className="text-2xl font-semibold text-eco-text">
                    {searchQuery 
                      ? `Résultats pour "${searchQuery}"`
                      : t('common.ecoProducts')}
                  </h2>
                  <p className="text-eco-text/70 mt-2">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                    {allProducts.length > 0 && (
                      <span className="ml-2 text-xs bg-eco-leaf/10 text-eco-leaf px-2 py-1 rounded-full">
                        API connectée
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-eco-text/70 text-lg">
                  {searchQuery ? 'Aucun résultat trouvé' : 'Aucun produit disponible'}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  className="mt-4 text-eco-leaf hover:text-eco-text font-medium transition-colors"
                >
                  {t('common.resetFilters')}
                </button>
                {error && (
                  <button 
                    onClick={retryLoad}
                    className="ml-4 bg-eco-leaf text-white px-4 py-2 rounded-lg hover:bg-eco-text transition-colors"
                  >
                    Recharger les produits
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
        
        <section className="py-16 bg-eco-gradient/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-eco-text">
                <Trans i18nKey="homepage.whyUs.title" />
              </h2>
              <p className="mt-4 text-lg text-eco-text/80 max-w-3xl mx-auto">
                <Trans i18nKey="homepage.whyUs.subtitle" />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Produits Vérifiés"
                description="Tous nos produits sont soigneusement sélectionnés et vérifiés selon des critères éthiques et écologiques stricts."
              />
              <FeatureCard 
                title="Notation Transparente"
                description="Notre système de notation évalue chaque produit selon son impact environnemental, social et éthique."
              />
              <FeatureCard 
                title="Recherche Intelligente"
                description="Notre moteur de recherche vous aide à trouver rapidement des alternatives durables à vos produits habituels."
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          onClose={closeProductDetail}
        />
      )}
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-eco-text mb-4">{title}</h3>
      <p className="text-eco-text/70">{description}</p>
    </div>
  );
};

export default HomePage;