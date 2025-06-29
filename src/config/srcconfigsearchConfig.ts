// src/config/searchConfig.ts
export const SEARCH_CONFIG = {
  // ❌ DISABLE temporairement pour tester
  USE_ALGOLIA: false,
  USE_MOCK_DATA: true,
  
  // Garde les configs pour plus tard
  ALGOLIA_APP_ID: import.meta.env.VITE_ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY: import.meta.env.VITE_ALGOLIA_SEARCH_KEY,
  ALGOLIA_INDEX: import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'products'
};