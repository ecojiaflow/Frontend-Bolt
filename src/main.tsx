import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
import App from './App'; // ❗️ Pas .tsx ici

import './i18n'; // ✅ Assure-toi que ce fichier existe
=======
import App from './App.tsx';
import './i18n';
>>>>>>> bbcae51aff3a32786affc8ec31d4b27d38700afc
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
