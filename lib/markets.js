export const globalMarkets = [
  {
    slug: 'usa',
    name: 'United States',
    region: 'North America',
    title: 'Industrial Equipment & Engineering Procurement Supplier in the USA',
    description: 'IKINOVAC GLOBAL supports United States industrial buyers with global sourcing, engineering procurement, valves, automation, piping, instrumentation, MRO and project supply coordination.',
    keywords: ['industrial equipment supplier USA','engineering procurement USA','industrial valves supplier USA','global sourcing USA','MRO supplier USA'],
    industries: ['Oil & Gas','Power Generation','Chemical & Petrochemical','Manufacturing','Mining & Machinery']
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    region: 'Western Europe',
    title: 'Industrial Supply & Engineering Procurement for the United Kingdom',
    description: 'IKINOVAC GLOBAL supports UK industrial requirements with engineering-led sourcing, valves, automation, piping, instrumentation, rotating equipment and project procurement.',
    keywords: ['industrial supplier UK','engineering procurement UK','industrial valves UK','global sourcing UK','project supply UK'],
    industries: ['Energy','Chemical & Petrochemical','Manufacturing','Utilities','Industrial Maintenance']
  },
  {
    slug: 'uae',
    name: 'United Arab Emirates',
    region: 'Middle East',
    title: 'Industrial Equipment, Oil & Gas Supply and Procurement in the UAE',
    description: 'IKINOVAC GLOBAL supports UAE projects with industrial sourcing, oil and gas equipment, valves, automation, piping, instrumentation, MRO and engineering procurement.',
    keywords: ['industrial supplier UAE','oil and gas supplier UAE','engineering procurement UAE','valves supplier UAE','industrial equipment Dubai'],
    industries: ['Oil & Gas','Petrochemical','LNG','Power & Utilities','Infrastructure']
  },
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    region: 'Middle East',
    title: 'Industrial Supply & Engineering Procurement in Saudi Arabia',
    description: 'IKINOVAC GLOBAL supports Saudi industrial and energy projects with global sourcing, valves, automation, piping, instrumentation, rotating equipment and project supply.',
    keywords: ['industrial supplier Saudi Arabia','oil and gas supplier Saudi Arabia','engineering procurement Saudi Arabia','valves supplier Saudi Arabia','MRO supplier Saudi Arabia'],
    industries: ['Oil & Gas','Petrochemical','Refining','Power Generation','Industrial Projects']
  },
  {
    slug: 'south-africa',
    name: 'South Africa',
    region: 'Africa',
    title: 'Industrial Equipment & Engineering Supply for South Africa',
    description: 'IKINOVAC GLOBAL supports South African industrial buyers with sourcing, valves, pumps, automation, piping, mining and machinery products, MRO and project procurement.',
    keywords: ['industrial equipment supplier South Africa','mining equipment supplier South Africa','engineering procurement South Africa','valves supplier South Africa','MRO supplier South Africa'],
    industries: ['Mining & Minerals','Power Generation','Oil & Gas','Manufacturing','Water & Utilities']
  },
  {
    slug: 'nigeria',
    name: 'Nigeria',
    region: 'Africa',
    title: 'Industrial Equipment, Oil & Gas Supply and Procurement in Nigeria',
    description: 'IKINOVAC GLOBAL supports Nigerian industrial and energy requirements with global sourcing, valves, piping, instrumentation, pumps, MRO and engineering procurement.',
    keywords: ['industrial equipment supplier Nigeria','oil and gas supplier Nigeria','engineering procurement Nigeria','valves supplier Nigeria','MRO supplier Nigeria'],
    industries: ['Oil & Gas','Power Generation','Petrochemical','Manufacturing','Infrastructure']
  }
];

export const getGlobalMarket = slug => globalMarkets.find(market => market.slug === slug);
