import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import ProductDetail from '../components/ProductDetail';
import { Leaf } from 'lucide-react';
import { Product, SearchFilters } from '../types';
import { products, categories } from '../data/mockData';
import { useTranslation, Trans } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          t(product.nameKey).toLowerCase().includes(query) ||
          t(product.descriptionKey).toLowerCase().includes(query) ||
          t(product.brandKey).toLowerCase().includes(query) ||
          product.tagsKeys.some(tagKey => t(tagKey).toLowerCase().includes(query))
      );
    }
    
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, filters, t]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string | undefined) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleProductClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
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
          </div>
        </section>
        
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryFilter 
              categories={categories}
              selectedCategory={filters.category}
              onSelectCategory={handleCategorySelect}
            />
            
            {filteredProducts.length > 0 ? (
              <>
                <div className="mt-8 mb-10">
                  <h2 className="text-2xl font-semibold text-eco-text">
                    {searchQuery 
                      ? t('common.searchResults', { query: searchQuery })
                      : t('common.ecoProducts')}
                  </h2>
                  <p className="text-eco-text/70 mt-2">
                    {t('common.productsFound', { count: filteredProducts.length })}
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
                  {t('common.noResults')}
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
                title={t('homepage.whyUs.features.verified.title')}
                description={t('homepage.whyUs.features.verified.description')}
              />
              <FeatureCard 
                title={t('homepage.whyUs.features.rating.title')}
                description={t('homepage.whyUs.features.rating.description')}
              />
              <FeatureCard 
                title={t('homepage.whyUs.features.search.title')}
                description={t('homepage.whyUs.features.search.description')}
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