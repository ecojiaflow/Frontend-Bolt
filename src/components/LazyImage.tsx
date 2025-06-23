// /src/components/LazyImage.tsx
import React, { useState, useRef, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%23999" text-anchor="middle" dy="0.3em"%3EChargement...%3C/text%3E%3C/svg%3E',
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy="0.3em"%3EImage non disponible%3C/text%3E%3C/svg%3E',
  onLoad,
  onError,
  loading = 'lazy',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer pour lazy loading
  const handleIntersection = useCallback((isIntersecting: boolean) => {
    if (isIntersecting && !isLoaded && !hasError && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [src, isLoaded, hasError, imageSrc, placeholder]);

  // Hook pour observer l'intersection (seulement si pas prioritaire)
  useIntersectionObserver(
    imgRef,
    handleIntersection,
    {
      threshold: 0.1,
      rootMargin: '50px'
    },
    !priority // Désactiver l'observer si prioritaire
  );

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  }, [fallback, onError]);

  // Optimisation du srcset pour différentes tailles
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || baseSrc.startsWith('data:')) return undefined;
    
    // Si c'est une URL Pexels, on peut générer différentes tailles
    if (baseSrc.includes('pexels.com')) {
      const baseUrl = baseSrc.split('?')[0];
      return `
        ${baseUrl}?w=400&h=300&fit=crop&auto=compress 400w,
        ${baseUrl}?w=600&h=450&fit=crop&auto=compress 600w,
        ${baseUrl}?w=800&h=600&fit=crop&auto=compress 800w
      `.trim();
    }
    
    return undefined;
  };

  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        srcSet={generateSrcSet(imageSrc)}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-all duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${hasError ? 'opacity-100' : ''}
        `}
        decoding="async"
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-eco-leaf/30 border-t-eco-leaf rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Blur placeholder effect (optionnel) */}
      {!isLoaded && !hasError && imageSrc !== placeholder && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyImage;