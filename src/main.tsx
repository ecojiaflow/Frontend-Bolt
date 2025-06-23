import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';

// 🛡️ Intercepteur API pour la sécurité (garder en production)
import { APIInterceptor } from './utils/apiInterceptor';

// Activer l'intercepteur de sécurité
APIInterceptor.getInstance();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);