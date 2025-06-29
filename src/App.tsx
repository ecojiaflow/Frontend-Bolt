import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';      // petit helper (voir plus bas)
import Navbar from './components/Navbar';
import CategoryNavigation from './components/CategoryNavigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

/* Lazy-load des pages ---------------------------------------------------- */
const HomePage     = lazy(() => import('./pages/HomePage'));
const AboutPage    = lazy(() => import('./pages/AboutPage'));
const PrivacyPage  = lazy(() => import('./pages/PrivacyPage'));
const TermsPage    = lazy(() => import('./pages/TermsPage'));
const LegalPage    = lazy(() => import('./pages/LegalPage'));
const ProductPage  = lazy(() => import('./pages/ProductPage'));
const StatsPage    = lazy(() => import('./pages/StatsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage')); // crée une page 404 simple

/* Fallback pendant le chargement des chunks */
const PageLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-6 h-6 border-4 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ScrollToTop />   {/* remonte la page à chaque navigation */}
      <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-white flex flex-col">
        <Navbar />
        <CategoryNavigation />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                 element={<HomePage />} />
              <Route path="/about"            element={<AboutPage />} />
              <Route path="/privacy"          element={<PrivacyPage />} />
              <Route path="/terms"            element={<TermsPage />} />
              <Route path="/legal"            element={<LegalPage />} />
              <Route path="/product/:slug"    element={<ProductPage />} />
              <Route path="/stats"            element={<StatsPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
