// src/data/mockData.ts
import { Product } from '../utils/imageUtils';

export const MOCK_PRODUCTS: Product[] = [
  // Produits avec vraies images de marques
  {
    id: "la-boulangere-tartines-quinoa",
    name: "Tartines Bio quinoa & graines 450g",
    brand: "LA BOULANGÈRE BIO",
    category: "Alimentation",
    subcategory: "Pains & Biscottes",
    price: 3.49,
    eco_score: 55,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
    labels: ["Bio AB", "Riche en fibres"],
    rating: 4.2,
    reviews_count: 89
  },
  
  {
    id: "yeo-valley-strawberry-yogurt", 
    name: "Strawberry Bio Live Yoghurt",
    brand: "YEO VALLEY",
    category: "Alimentation",
    subcategory: "Produits laitiers",
    price: 2.89,
    eco_score: 60,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Live Cultures", "Organic"],
    rating: 4.5,
    reviews_count: 156
  },

  {
    id: "bjorg-soja-nature",
    name: "Boisson Soja Nature Sans Sucres",
    brand: "BJORG",
    category: "Alimentation", 
    subcategory: "Boissons végétales",
    price: 2.15,
    eco_score: 58,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Sans sucres", "Source protéines"],
    rating: 4.1,
    reviews_count: 203
  },

  {
    id: "savon-solide-bio-lavande",
    name: "Savon solide bio lavande",
    brand: "Les Savons de Joya",
    category: "Cosmétiques",
    subcategory: "Soins corps",
    price: 4.90,
    eco_score: 60,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Vegan", "Zéro déchet"],
    rating: 4.6,
    reviews_count: 342
  },

  {
    id: "savon-bio-marseille",
    name: "Savon Bio de Marseille",
    brand: "Marius Fabre",
    category: "Cosmétiques",
    subcategory: "Savons",
    price: 3.20,
    eco_score: 66,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Marseille", "Traditionnel"],
    rating: 4.4,
    reviews_count: 287
  },

  {
    id: "savon-alep-artisanal",
    name: "Savon d'Alep artisanal",
    brand: "Alepia",
    category: "Cosmétiques", 
    subcategory: "Savons",
    price: 5.80,
    eco_score: 55,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80",
    labels: ["Artisanal", "Huile olive", "Laurier"],
    rating: 4.3,
    reviews_count: 198
  },

  {
    id: "pur-jus-citron",
    name: "Pur jus de citron",
    brand: "Jardin BiO étic",
    category: "Alimentation",
    subcategory: "Jus de fruits",
    price: 2.45,
    eco_score: 58,
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Pur jus", "Sans additifs"],
    rating: 4.0,
    reviews_count: 156
  },

  {
    id: "huile-olive-bio-provence",
    name: "Huile d'olive extra vierge AOP Provence",
    brand: "Terres du Sud",
    category: "Alimentation",
    subcategory: "Huiles & Condiments",
    price: 12.99,
    eco_score: 87,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80",
    labels: ["Bio AB", "AOP", "Local", "Fair Trade"],
    rating: 4.7,
    reviews_count: 1247
  },

  {
    id: "shampoing-weleda",
    name: "Shampoing au millet usage fréquent",
    brand: "Weleda", 
    category: "Cosmétiques",
    subcategory: "Soins cheveux",
    price: 8.90,
    eco_score: 72,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Naturel", "Millet"],
    rating: 4.3,
    reviews_count: 456
  },

  {
    id: "dentifrice-naturel",
    name: "Dentifrice naturel menthe",
    brand: "Cattier",
    category: "Cosmétiques",
    subcategory: "Hygiène bucco-dentaire",
    price: 4.50,
    eco_score: 68,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Sans fluor", "Menthe"],
    rating: 4.2,
    reviews_count: 234
  },

  {
    id: "lessive-ecologique",
    name: "Lessive écologique concentrée",
    brand: "L'Arbre Vert",
    category: "Maison",
    subcategory: "Entretien linge",
    price: 6.80,
    eco_score: 64,
    image: "https://images.unsplash.com/photo-1583947581924-860ac58726bf?w=400&h=400&fit=crop&q=80",
    labels: ["Écologique", "Concentrée", "Peaux sensibles"],
    rating: 4.1,
    reviews_count: 567
  },

  {
    id: "miel-acacia-local",
    name: "Miel d'acacia français",
    brand: "Miellerie du Gâtinais",
    category: "Alimentation",
    subcategory: "Miels & Confitures",
    price: 8.50,
    eco_score: 82,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&q=80",
    labels: ["Local", "Acacia", "Artisanal"],
    rating: 4.8,
    reviews_count: 289
  },

  {
    id: "chocolat-equitable",
    name: "Chocolat noir 70% équitable",
    brand: "Alter Eco",
    category: "Alimentation",
    subcategory: "Chocolat & Confiserie",
    price: 3.20,
    eco_score: 71,
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&q=80",
    labels: ["Équitable", "Bio", "70% cacao"],
    rating: 4.6,
    reviews_count: 445
  },

  {
    id: "quinoa-bio-france",
    name: "Quinoa bio français",
    brand: "Markal",
    category: "Alimentation",
    subcategory: "Céréales & Légumineuses",
    price: 7.80,
    eco_score: 76,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Français", "Protéines"],
    rating: 4.4,
    reviews_count: 178
  },

  {
    id: "the-vert-bio",
    name: "Thé vert bio Sencha",
    brand: "Thés de la Pagode",
    category: "Alimentation",
    subcategory: "Thés & Infusions",
    price: 5.90,
    eco_score: 69,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Sencha", "Antioxydants"],
    rating: 4.5,
    reviews_count: 334
  },

  {
    id: "t-shirt-bio-coton",
    name: "T-shirt bio coton équitable",
    brand: "Thinking Mu",
    category: "Mode",
    subcategory: "Vêtements homme",
    price: 29.90,
    eco_score: 73,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Équitable", "GOTS"],
    rating: 4.3,
    reviews_count: 89
  },

  {
    id: "produit-vaisselle-eco",
    name: "Liquide vaisselle écologique",
    brand: "Ecover",
    category: "Maison",
    subcategory: "Entretien cuisine",
    price: 3.80,
    eco_score: 67,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&q=80",
    labels: ["Écologique", "Biodégradable", "Efficace"],
    rating: 4.2,
    reviews_count: 445
  },

  {
    id: "creme-visage-naturelle",
    name: "Crème visage naturelle hydratante",
    brand: "Melvita",
    category: "Cosmétiques",
    subcategory: "Soins visage",
    price: 16.90,
    eco_score: 74,
    image: "https://images.unsplash.com/photo-1556228578-dd6e5ce9a331?w=400&h=400&fit=crop&q=80",
    labels: ["Bio", "Naturel", "Hydratant"],
    rating: 4.4,
    reviews_count: 267
  },

  {
    id: "baskets-recyclees",
    name: "Baskets recyclées écologiques",
    brand: "Veja",
    category: "Mode",
    subcategory: "Chaussures",
    price: 89.90,
    eco_score: 78,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80",
    labels: ["Recyclé", "Écologique", "Équitable"],
    rating: 4.6,
    reviews_count: 156
  },

  {
    id: "smartphone-reconditionne",
    name: "Smartphone reconditionné iPhone",
    brand: "BackMarket",
    category: "Électronique",
    subcategory: "Téléphones",
    price: 299.90,
    eco_score: 65,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&q=80",
    labels: ["Reconditionné", "Garantie", "Durable"],
    rating: 4.2,
    reviews_count: 789
  }
];

export const CATEGORIES = [
  { 
    id: "toutes", 
    name: "Toutes", 
    icon: "Grid3x3",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.length 
  },
  { 
    id: "alimentaire", 
    name: "Alimentaire", 
    icon: "Apple",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Alimentation").length 
  },
  { 
    id: "cosmetiques", 
    name: "Cosmétiques", 
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Cosmétiques").length 
  },
  { 
    id: "mode", 
    name: "Mode", 
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Mode").length 
  },
  { 
    id: "maison", 
    name: "Maison", 
    icon: "Home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Maison").length 
  },
  { 
    id: "electronique", 
    name: "Électronique", 
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Électronique").length 
  },
  { 
    id: "sport", 
    name: "Sport", 
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Sport").length 
  },
  { 
    id: "mobilite", 
    name: "Mobilité", 
    icon: "Car",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80",
    count: MOCK_PRODUCTS.filter(p => p.category === "Mobilité").length 
  }
];

export const POPULAR_SEARCHES = [
  "huile olive bio",
  "shampoing sans sulfate", 
  "chocolat équitable",
  "lessive écologique",
  "miel local",
  "dentifrice naturel"
];