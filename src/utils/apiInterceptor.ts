// /src/utils/apiInterceptor.ts
export class APIInterceptor {
  private static instance: APIInterceptor;
  private originalFetch: typeof fetch;

  private constructor() {
    this.originalFetch = window.fetch;
    this.setupInterceptor();
  }

  public static getInstance(): APIInterceptor {
    if (!APIInterceptor.instance) {
      APIInterceptor.instance = new APIInterceptor();
    }
    return APIInterceptor.instance;
  }

  private setupInterceptor() {
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();
      
<<<<<<< HEAD
      // 🚨 TRAQUER TOUTES LES REQUÊTES UNDEFINED
      const hasUndefined = url.includes('/undefined') || 
                          url.includes('undefined') || 
                          url.endsWith('/undefined') ||
                          url.includes('/products/undefined') ||
                          url.match(/\/products\/undefined($|\?)/);
      
      if (hasUndefined) {
        // 🔍 LOG DÉTAILLÉ POUR IDENTIFIER LA SOURCE
        console.error('🚨 UNDEFINED REQUEST DETECTED:', {
          url: url,
          timestamp: new Date().toISOString(),
          stack: new Error().stack,
          location: window.location.href,
          userAgent: navigator.userAgent
        });
        
        // Rediriger immédiatement vers l'accueil
        if (window.location.pathname.includes('undefined')) {
          console.error('🚨 REDIRECTING FROM UNDEFINED PATH');
          window.location.replace('/');
        }
        
        // Retourner une erreur 400 propre
        return Promise.resolve(new Response(
          JSON.stringify({ 
            error: 'Invalid product identifier',
            message: 'Product not found',
=======
      // 🚨 BLOQUER TOUTES LES REQUÊTES AVEC 'undefined' (SÉCURITÉ CRITIQUE)
      if (url.includes('/products/undefined') || url.includes('undefined')) {
        // Log d'erreur critique en production
        console.error('🚨 SECURITY: Blocked undefined URL request:', {
          url,
          timestamp: new Date().toISOString()
        });
        
        // Rediriger vers l'accueil pour éviter les erreurs
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        
        // Retourner une réponse d'erreur propre
        return new Response(
          JSON.stringify({ 
            error: 'Invalid URL parameter',
>>>>>>> bbcae51aff3a32786affc8ec31d4b27d38700afc
            redirect: true
          }),
          { 
            status: 400, 
            statusText: 'Bad Request',
            headers: { 'Content-Type': 'application/json' }
          }
<<<<<<< HEAD
        ));
      }

      // Log de toutes les requêtes API pour debug
      if (url.includes('/api/')) {
        console.log('📡 API Request:', {
          endpoint: url.split('/').slice(-2).join('/'),
          method: init?.method || 'GET',
          timestamp: Date.now()
=======
        );
      }

      // 🔍 Log minimal des requêtes API en développement uniquement
      if (import.meta.env.DEV && url.includes('/api/')) {
        console.log('📡 API Request:', {
          url: url.split('/').pop(), // Juste le endpoint
          method: init?.method || 'GET'
>>>>>>> bbcae51aff3a32786affc8ec31d4b27d38700afc
        });
      }

      // Continuer avec la requête normale
      return this.originalFetch.call(window, input, init);
    };
  }

  public restore() {
    window.fetch = this.originalFetch;
  }
}