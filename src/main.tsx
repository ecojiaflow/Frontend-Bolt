import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';

// 🚨 INTERCEPTEUR GLOBAL ULTIME - TRAQUER TOUTES LES SOURCES D'UNDEFINED
(function setupUltimateDebug() {
  console.log('🔍 ULTIMATE DEBUG ACTIVATED - Tracking all undefined sources');

  // 1. Intercepter TOUS les fetch
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input.toString();
    
    if (url.includes('undefined') || url.includes('/undefined')) {
      console.error('🚨 FETCH UNDEFINED DETECTED:', {
        url: url,
        timestamp: new Date().toISOString(),
        stack: new Error().stack
      });
      
      // Stopper le fetch
      return Promise.reject(new Error('BLOCKED: undefined URL'));
    }
    
    return originalFetch.call(this, input, init);
  };

  // 2. Intercepter tous les changements d'URL
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(state, title, url) {
    if (url && (url.includes('undefined') || url === 'undefined')) {
      console.error('🚨 PUSHSTATE UNDEFINED:', { url, state, title, stack: new Error().stack });
      return originalPushState.call(this, state, title, '/');
    }
    return originalPushState.call(this, state, title, url);
  };

  history.replaceState = function(state, title, url) {
    if (url && (url.includes('undefined') || url === 'undefined')) {
      console.error('🚨 REPLACESTATE UNDEFINED:', { url, state, title, stack: new Error().stack });
      return originalReplaceState.call(this, state, title, '/');
    }
    return originalReplaceState.call(this, state, title, url);
  };

  // 3. Intercepter tous les clics sur les liens
  document.addEventListener('click', function(e) {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      if (link.href.includes('undefined')) {
        console.error('🚨 LINK CLICK UNDEFINED:', {
          href: link.href,
          element: link,
          innerHTML: link.innerHTML,
          stack: new Error().stack
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, true);

  // 4. Intercepter React Router navigate (si possible)
  window.addEventListener('popstate', function(e) {
    if (location.pathname.includes('undefined')) {
      console.error('🚨 POPSTATE UNDEFINED:', {
        pathname: location.pathname,
        state: e.state,
        stack: new Error().stack
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  });

  // 5. Observer tous les changements DOM pour détecter les liens undefined
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          const element = node as Element;
          
          // Vérifier les liens
          const links = element.querySelectorAll ? element.querySelectorAll('a[href*="undefined"]') : [];
          if (links.length > 0) {
            console.error('🚨 DOM UNDEFINED LINKS DETECTED:', {
              count: links.length,
              links: Array.from(links).map(link => ({
                href: (link as HTMLAnchorElement).href,
                text: link.textContent,
                element: link
              })),
              stack: new Error().stack
            });
          }

          // Vérifier si l'élément lui-même est un lien undefined
          if (element.tagName === 'A' && (element as HTMLAnchorElement).href.includes('undefined')) {
            console.error('🚨 DOM UNDEFINED LINK:', {
              href: (element as HTMLAnchorElement).href,
              text: element.textContent,
              element: element,
              stack: new Error().stack
            });
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('🛡️ Ultimate debug setup complete - All undefined sources will be logged');
})();

// 🛡️ Intercepteur API pour la sécurité (garder en production)
import { APIInterceptor } from './utils/apiInterceptor';

// Activer l'intercepteur de sécurité
APIInterceptor.getInstance();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);