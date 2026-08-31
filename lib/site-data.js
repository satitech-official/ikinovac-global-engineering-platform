import { catalogueCategories } from './catalogue';

// The operations preview reads the public catalogue source rather than a
// second, stale list of product systems.
export const productSystems = catalogueCategories.map(category => ({
  id: category.slug,
  number: category.number,
  name: category.name,
  title: category.summary,
  description: category.summary,
  image: category.image,
  types: category.items.map(item => item.name)
}));
