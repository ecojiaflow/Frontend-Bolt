import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom';

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

/* ------------------------------------------------------------------ */
/* 🔍 RedirectChecker : coupe net les URL invalides sans reload       */
/* ------------------------------------------------------------------ */
const RedirectChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase();

    const isInvalid =
      pathname.includes('/undefined') ||
      pathname.includes('/null') ||
      pathname === '/product/undefined' ||
      pathname === '/product/null';

    if (isInvalid) {
      console.error('🚨 URL invalide détectée – redirection vers l’accueil :', pathname);
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
};

/* ------------------------------------------------------------------ */
/* 🛡️ SafeProductPage : valide proprement le paramètre :slug          */
/* ------------------------------------------------------------------ */
const SafeProductPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();

  if (!slug || slug === 'undefined' || slug === 'null') {
    console.error('🚨 SafeProductPage : slug invalide détecté :', slug);
    return <Navigate to="/" replace />;
  }

  return <ProductPage />;
};

/* ------------------------------------------------------------------ */
/* 🌳 App root                                                        */
/* ------------------------------------------------------------------ */
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

                {/* Route sécurisée pour chaque produit */}
                <Route path="/product/:slug" element={<SafeProductPage />} />

                {/* Fallbacks explicites – restent inoffensifs */}
                <Route path="/product/undefined" element={<Navigate to="/" replace />} />
                <Route path="/product/null" element={<Navigate to="/" replace />} />

                <Route path="/stats" element={<StatsPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />

                {/* Catch-all */}
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
