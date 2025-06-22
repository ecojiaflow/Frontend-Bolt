// /src/components/SEOHead.tsx
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: string;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  category?: string;
  brand?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Ecolojia - Produits éco-responsables et durables',
  description = 'Découvrez des milliers de produits éthiques et durables avec des scores écologiques vérifiés par IA.',
  keywords = 'produits écologiques, développement durable, éthique, bio, responsable',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  price,
  currency = 'EUR',
  availability = 'in_stock',
  category,
  brand
}) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta tags de base
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Ecolojia');

    // Open Graph
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'Ecolojia', 'property');
    updateMetaTag('og:locale', 'fr_FR', 'property');

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');
    updateMetaTag('twitter:site', '@ecolojia', 'name');

    // Product specific Schema.org
    if (type === 'product' && price) {
      updateMetaTag('product:price:amount', price, 'property');
      updateMetaTag('product:price:currency', currency, 'property');
      updateMetaTag('product:availability', availability, 'property');
      
      if (category) {
        updateMetaTag('product:category', category, 'property');
      }
      
      if (brand) {
        updateMetaTag('product:brand', brand, 'property');
      }
    }

    // Schema.org JSON-LD
    updateStructuredData(type, {
      title,
      description,
      image,
      url,
      price,
      currency,
      availability,
      category,
      brand
    });

  }, [title, description, keywords, image, url, type, price, currency, availability, category, brand]);

  return null;
};

// Fonction utilitaire pour mettre à jour les meta tags
const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

// Fonction pour gérer les données structurées
const updateStructuredData = (type: string, data: any) => {
  // Supprimer l'ancien script JSON-LD s'il existe
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  let structuredData;

  if (type === 'product') {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.title,
      "description": data.description,
      "image": data.image,
      "url": data.url,
      "brand": data.brand ? {
        "@type": "Brand",
        "name": data.brand
      } : undefined,
      "category": data.category,
      "offers": data.price ? {
        "@type": "Offer",
        "price": data.price,
        "priceCurrency": data.currency,
        "availability": `https://schema.org/${data.availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
        "url": data.url
      } : undefined
    };
  } else {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ecolojia",
      "url": "https://ecolojia.com",
      "description": "Plateforme de découverte de produits éco-responsables",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ecolojia.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  }

  // Ajouter le nouveau script JSON-LD
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};