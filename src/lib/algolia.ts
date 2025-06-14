import algoliasearch from 'algoliasearch';

// Configuration Algolia
const searchClient = algoliasearch(
  'A2KJGZ2811',
  '085aeee2b3ec8efa66dabb7691a01b67'
);

export const ALGOLIA_INDEX_NAME = 'products';
export default searchClient;