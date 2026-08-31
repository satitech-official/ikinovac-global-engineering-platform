import { getImageAlt, getImagePath } from './imagery';

// The sole public catalogue source. The approved line-card families are kept
// deliberately configuration-neutral until manufacturer data is supplied.
const legacyImagery = {
  valves: '/assets/industry/valves.jpg',
  automation: '/assets/industry/instrumentation.jpg',
  'pipe-fittings-flanges': '/assets/industry/refining.jpg',
  instrumentation: '/assets/industry/instrumentation.jpg',
  equipment: '/assets/industry/equipment.jpg',
  'sealing-items': '/assets/industry/valves.jpg',
  'mining-machinery': '/assets/industry/equipment.jpg',
  motors: '/assets/industry/equipment.jpg',
  welding: '/assets/industry/refining.jpg',
  safety: '/assets/industry/oil-gas.jpg',
  // Changed from the previously reviewed process image.
  'process-utility': '/assets/industry/power.jpg',
  filtration: '/assets/industry/procurement.jpg'
};

const imagery = Object.fromEntries(Object.entries(legacyImagery).map(([slug, fallback]) => [
  slug,
  getImagePath(slug, fallback)
]));

const slugify = value => value
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const family = (name, group) => ({ name, family: group });

const rawCategories = [
  {
    slug: 'valves', name: 'Valves', summary: 'Flow-control product families for critical industrial connections.',
    items: ['Ball Valves', 'Gate Valves', 'Globe Valves', 'Check Valves', 'Butterfly Valves', 'Control Valves'].map(name => family(name, 'VALVES')),
    related: ['automation', 'pipe-fittings-flanges', 'sealing-items']
  },
  {
    slug: 'automation', name: 'Actuation & Automation', summary: 'Actuation and control components for specified valve systems.',
    items: [family('Pneumatic Actuators', 'ACTUATORS'), family('Electric Actuators', 'ACTUATORS'), family('Positioners', 'CONTROL DEVICES'), family('Solenoid Valves', 'CONTROL DEVICES'), family('Limit Switches', 'CONTROL DEVICES'), family('Valve Automation Solutions', 'VALVE AUTOMATION')],
    related: ['valves', 'instrumentation']
  },
  {
    slug: 'pipe-fittings-flanges', name: 'Pipe & Fittings / Flanges', summary: 'Pipe, fitting and flange families for industrial project connections.',
    items: [family('Pipes (Seamless & Welded)', 'PIPE'), family('Pipe Fittings', 'PIPE FITTINGS'), family('Flanges', 'FLANGES'), family('Forged Fittings', 'SPECIAL CONNECTIONS'), family('Stub Ends', 'PIPE FITTINGS'), family('Expansion Joints', 'SPECIAL CONNECTIONS'), family('Weld Neck Flanges', 'FLANGES'), family('Slip-On Flanges', 'FLANGES'), family('Blind Flanges', 'FLANGES'), family('Socket Weld Fittings', 'SPECIAL CONNECTIONS'), family('Elbows', 'PIPE FITTINGS'), family('Tees', 'PIPE FITTINGS'), family('Reducers', 'PIPE FITTINGS'), family('Unions', 'SPECIAL CONNECTIONS')],
    related: ['valves', 'sealing-items', 'equipment']
  },
  {
    slug: 'instrumentation', name: 'Instrumentation', summary: 'Measurement and analytical product families for process visibility.',
    items: [family('Pressure Instruments', 'PRESSURE'), family('Temperature Instruments', 'TEMPERATURE'), family('Flow Measurement', 'FLOW'), family('Analytical Instruments', 'ANALYTICAL')],
    related: ['automation', 'equipment', 'process-utility']
  },
  {
    slug: 'equipment', name: 'Industrial Equipment', summary: 'Process equipment for specified industrial requirements.',
    items: ['Pumps', 'Heat Exchangers', 'Filters', 'Strainers', 'Vessels & Tanks', 'Industrial Hoses'].map(name => family(name, 'PROCESS EQUIPMENT')),
    related: ['process-utility', 'filtration', 'pipe-fittings-flanges']
  },
  {
    slug: 'sealing-items', name: 'Sealing Items', summary: 'Sealing, fastening and maintenance product families for industrial connections.',
    items: [family('Fasteners', 'FASTENERS'), family('Gaskets', 'GASKETS'), family('Seals', 'SEALS'), family('Bearings', 'BEARINGS'), family('Lubricants', 'LUBRICATION'), family('Bolts', 'FASTENERS'), family('Nuts', 'FASTENERS'), family('Washers', 'FASTENERS'), family('Stud Bolts', 'FASTENERS'), family('Anchor Fasteners', 'FASTENERS'), family('Threaded Rods', 'FASTENERS'), family('U-Bolts', 'FASTENERS'), family('Screws', 'FASTENERS'), family('Spiral Wound Gaskets', 'GASKETS'), family('Ring Joint Gaskets', 'GASKETS'), family('O-Rings', 'SEALS'), family('Oil Seals', 'SEALS'), family('Mechanical Seals', 'SEALS'), family('Gland Packing', 'PACKING'), family('Sheet Gaskets', 'GASKETS')],
    related: ['valves', 'pipe-fittings-flanges', 'mining-machinery']
  },
  {
    slug: 'mining-machinery', name: 'Mining & Machinery', summary: 'Bearing and mechanical transmission families for industrial machinery.',
    items: [family('Ball Bearings', 'BEARINGS'), family('Roller Bearings', 'BEARINGS'), family('Pillow Blocks', 'BEARINGS'), family('Couplings', 'POWER TRANSMISSION'), family('Chains', 'POWER TRANSMISSION'), family('Sprockets', 'POWER TRANSMISSION'), family('Belts', 'POWER TRANSMISSION'), family('Bushings', 'POWER TRANSMISSION')],
    related: ['motors', 'equipment', 'sealing-items']
  },
  {
    slug: 'motors', name: 'Motors, Gearboxes & Compressors', summary: 'Rotating equipment and associated product families.',
    items: ['Electric Motors', 'Gear Motors', 'Gearboxes', 'Air Compressors', 'Vacuum Pumps', 'Blowers', 'Pumpsets'].map(name => family(name, 'ROTATING EQUIPMENT')),
    related: ['mining-machinery', 'equipment', 'process-utility']
  },
  {
    slug: 'welding', name: 'Welding & Fabrication', summary: 'Welding and fabrication product families for industrial work.',
    items: ['Welding Electrodes', 'Filler Wires', 'Welding Machines', 'Cutting Torches', 'Fabrication Consumables', 'Industrial Clamps', 'Structural Components'].map(name => family(name, 'WELDING & FABRICATION')),
    related: ['equipment', 'safety']
  },
  {
    slug: 'safety', name: 'Safety & PPE', summary: 'Safety and personal protective equipment for industrial work sites.',
    items: ['Safety Helmets', 'Gloves', 'Goggles', 'Coveralls', 'Safety Shoes', 'Ear Protection', 'Respirators', 'Safety Harnesses'].map(name => family(name, 'SAFETY & PPE')),
    related: ['welding', 'equipment']
  },
  {
    slug: 'process-utility', name: 'Process & Utility Equipment', summary: 'Process and utility equipment product families for engineered facilities.',
    items: ['Boilers', 'Chillers', 'Dryers', 'Skid Packages', 'Cooling Towers', 'Air Receivers', 'Utility Systems'].map(name => family(name, 'UTILITY SYSTEMS')),
    related: ['equipment', 'filtration', 'instrumentation']
  },
  {
    slug: 'filtration', name: 'Filtration & Separation', summary: 'Filtration and separation families for process requirements.',
    items: ['Bag Filters', 'Cartridge Filters', 'Strainers', 'Separators', 'Coalescers', 'Filter Housings', 'Water Treatment Filters'].map(name => family(name, 'FILTRATION & SEPARATION')),
    related: ['equipment', 'process-utility', 'pipe-fittings-flanges']
  }
];

export const catalogueCategories = rawCategories.map((category, index) => ({
  ...category,
  number: String(index + 1).padStart(2, '0'),
  image: imagery[category.slug],
  imageAlt: getImageAlt(category.slug, `${category.name} industrial equipment`)
}));

const baseProducts = catalogueCategories.flatMap(category => category.items.map((item, index) => {
  const id = `${category.slug}-${slugify(item.name)}`;
  const suppliedImage = getImagePath(id, category.image);
  const imageAlt = getImageAlt(id, `Industrial ${item.name.toLowerCase()}`);
  return {
    id,
    slug: slugify(item.name),
    category: category.name,
    categorySlug: category.slug,
    categoryNumber: category.number,
    family: item.family,
    name: item.name,
    code: null,
    description: `${item.name} options for industrial requirements. Technical configuration is available on request.`,
    images: [suppliedImage],
    cardImage: suppliedImage,
    cardImagePosition: 'center',
    cardImageSize: 'cover',
    imageAlt,
    applications: [],
    variants: [],
    accessoryIds: [],
    documents: [],
    order: index + 1
  };
}));

// Directory relationships only: they never claim product compatibility.
const manualRelated = {
  'valves-ball-valves': [
    'automation-pneumatic-actuators', 'automation-positioners', 'automation-solenoid-valves',
    'pipe-fittings-flanges-flanges', 'sealing-items-gaskets', 'sealing-items-fasteners'
  ]
};
const categoryRelatedIds = category => category.related
  .map(relatedSlug => baseProducts.find(product => product.categorySlug === relatedSlug)?.id)
  .filter(Boolean);
const existingIds = new Set(baseProducts.map(product => product.id));

export const catalogueProducts = baseProducts.map(product => ({
  ...product,
  relatedProductIds: (manualRelated[product.id] || categoryRelatedIds(catalogueCategories.find(category => category.slug === product.categorySlug)))
    .filter(id => existingIds.has(id))
}));

export const getCategory = slug => catalogueCategories.find(category => category.slug === slug);
export const getProductsForCategory = slug => catalogueProducts.filter(product => product.categorySlug === slug);
export const getProduct = (categorySlug, productSlug) => catalogueProducts.find(product => product.categorySlug === categorySlug && product.slug === productSlug);
export const getRelatedCategories = category => category.related.map(getCategory).filter(Boolean);
export const getRelatedProducts = product => product.relatedProductIds.map(id => catalogueProducts.find(item => item.id === id)).filter(Boolean);
export const productHref = product => `/products/${product.categorySlug}/${slugify(product.family)}/${product.slug}`;

export { slugify };
