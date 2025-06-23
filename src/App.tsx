import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import CategoryNavigation from './components/CategoryNavigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import ProductPage from './pages/ProductPage';
import StatsPage from './pages/StatsPage';
import CategoryPage from './pages/CategoryPage';

import './index.css';

// Composant pour gérer les redirections undefined
const RedirectChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // 🚨 REDIRECTION AUTOMATIQUE SI URL CONTIENT UNDEFINED
    if (location.pathname.includes('undefined') || 
        location.pathname.includes('/undefined') ||
        location.pathname === '/product/undefined' ||
        location.pathname === '/product/null') {
      
      console.error('🚨 URL undefined détectée, redirection vers accueil:', location.pathname);
      window.location.replace('/');
      return;
    }
  }, [location]);

  return <>{children}</>;
};

// Composant wrapper pour ProductPage avec validation
const SafeProductPage: React.FC = () => {
  const location = useLocation();
  
  // 🚨 Bloquer le rendu si le slug est undefined
  const slug = location.pathname.split('/product/')[1];
  
  if (!slug || slug === 'undefined' || slug === 'null' || slug.includes('undefined')) {
    console.error('🚨 SafeProductPage: Slug invalide détecté:', slug);
    return <Navigate to="/" replace />;
  }
  
  return <ProductPage />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RedirectChecker>
          <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-white flex flex-col">
            <Navbar />
            <CategoryNavigation />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/legal" element={<LegalPage />} />
                
                {/* Route sécurisée pour les produits */}
                <Route path="/product/:slug" element={<SafeProductPage />} />
                
                {/* Redirections explicites pour les cas undefined */}
                <Route path="/product/undefined" element={<Navigate to="/" replace />} />
                <Route path="/product/null" element={<Navigate to="/" replace />} />
                
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                
                {/* Catch-all pour les routes inexistantes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <CookieBanner />
          </div>
        </RedirectChecker>
      </Router>
    </ErrorBoundary>
  );
}

export default App;