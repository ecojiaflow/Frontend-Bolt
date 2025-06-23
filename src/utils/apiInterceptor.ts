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
      
      // 🚨 BLOQUER TOUS LES UNDEFINED
      const hasUndefined = url.includes('/undefined') || 
                          url.includes('undefined') || 
                          url.endsWith('/undefined') ||
                          url.includes('/products/undefined') ||
                          url.match(/\/products\/undefined($|\?)/);
      
      if (hasUndefined) {
        // Rediriger immédiatement vers l'accueil
        if (window.location.pathname.includes('undefined')) {
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

      // Continuer avec la requête normale
      return this.originalFetch.call(window, input, init);
    };
  }

  public restore() {
    window.fetch = this.originalFetch;
  }
}