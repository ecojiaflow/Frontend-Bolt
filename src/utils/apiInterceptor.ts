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
            redirect: true
          }),
          { 
            status: 400, 
            statusText: 'Bad Request',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // 🔍 Log minimal des requêtes API en développement uniquement
      if (import.meta.env.DEV && url.includes('/api/')) {
        console.log('📡 API Request:', {
          url: url.split('/').pop(), // Juste le endpoint
          method: init?.method || 'GET'
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