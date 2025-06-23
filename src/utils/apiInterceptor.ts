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
            redirect: true
          }),
          { 
            status: 400, 
            statusText: 'Bad Request',
            headers: { 'Content-Type': 'application/json' }
          }
        ));
      }

      // Log de toutes les requêtes API pour debug
      if (url.includes('/api/')) {
        console.log('📡 API Request:', {
          endpoint: url.split('/').slice(-2).join('/'),
          method: init?.method || 'GET',
          timestamp: Date.now()
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