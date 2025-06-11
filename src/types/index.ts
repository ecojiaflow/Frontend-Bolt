export interface Product {
  id: string;
  nameKey: string;
  brandKey: string;
  descriptionKey: string;
  ethicalScore: number;
  category: string;
  price: number;
  currency: string;
  image: string;
  tagsKeys: string[];
  verified: boolean;
  affiliateLink: string;
  certificationsKeys: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface SearchFilters {
  category?: string;
  minEthicalScore?: number;
  brand?: string;
}