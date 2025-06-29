// /src/utils/performance.ts

// Types pour les métriques de performance
interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay  
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface SearchPerformance {
  query: string;
  resultCount: number;
  responseTime: number;
  timestamp: number;
}

// Classe pour monitorer les performances
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  };

  private searchMetrics: SearchPerformance[] = [];

  constructor() {
    this.initWebVitals();
  }

  // Initialiser le monitoring des Web Vitals
  private initWebVitals() {
    // LCP - Largest Contentful Paint
    this.observeLCP();
    
    // FID - First Input Delay
    this.observeFID();
    
    // CLS - Cumulative Layout Shift
    this.observeCLS();
    
    // FCP - First Contentful Paint
    this.observeFCP();
    
    // TTFB - Time to First Byte
    this.observeTTFB();
  }

  // Observer LCP
  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Observer FID
  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // Observer CLS
  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.reportMetric('CLS', clsValue);
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Observer FCP
  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  // Observer TTFB
  private observeTTFB() {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing as any;
      const ttfb = timing.responseStart - timing.navigationStart;
      this.metrics.ttfb = ttfb;
      this.reportMetric('TTFB', ttfb);
    }
  }

  // Reporter une métrique
  private reportMetric(name: string, value: number) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, `${value.toFixed(2)}ms`);
    }

    // En production, envoyer à un service d'analytics
    // this.sendToAnalytics(name, value);
  }

  // Enregistrer les performances de recherche
  public recordSearchPerformance(query: string, resultCount: number, responseTime: number) {
    const searchMetric: SearchPerformance = {
      query,
      resultCount,
      responseTime,
      timestamp: Date.now()
    };

    this.searchMetrics.push(searchMetric);

    // Garder seulement les 100 dernières recherches
    if (this.searchMetrics.length > 100) {
      this.searchMetrics = this.searchMetrics.slice(-100);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Search Performance:', searchMetric);
    }
  }

  // Obtenir les métriques moyennes de recherche
  public getAverageSearchMetrics() {
    if (this.searchMetrics.length === 0) return null;

    const avgResponseTime = this.searchMetrics.reduce((sum, metric) => sum + metric.responseTime, 0) / this.searchMetrics.length;
    const avgResultCount = this.searchMetrics.reduce((sum, metric) => sum + metric.resultCount, 0) / this.searchMetrics.length;

    return {
      averageResponseTime: avgResponseTime,
      averageResultCount: avgResultCount,
      totalSearches: this.searchMetrics.length
    };
  }

  // Obtenir toutes les métriques
  public getMetrics(): PerformanceMetrics & { search?: ReturnType<typeof this.getAverageSearchMetrics> } {
    return {
      ...this.metrics,
      search: this.getAverageSearchMetrics()
    };
  }

  // Détecter la connexion lente
  public isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return false;

    // Considérer comme lent si < 1.5 Mbps ou si type de connexion lent
    return connection.downlink < 1.5 || 
           ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
  }

  // Précharger des ressources critiques
  public preloadCriticalResources() {
    const criticalImages = [
      '/og-image.jpg',
      'https://images.pexels.com/photos/4820813/pexels-photo-4820813.jpeg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Instance globale
export const performanceMonitor = new PerformanceMonitor();

// Hook React pour utiliser le monitoring
export const usePerformanceMonitoring = () => {
  return {
    recordSearch: performanceMonitor.recordSearchPerformance.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    isSlowConnection: performanceMonitor.isSlowConnection.bind(performanceMonitor)
  };
};

// Utilitaires de performance
export const performanceUtils = {
  // Debounce pour éviter trop d'appels
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle pour limiter la fréquence
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Mesurer le temps d'exécution
  measureTime: async <T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }
};