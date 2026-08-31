import { getImageAlt, getImagePath } from './imagery';

export const industries = [
  ['oil-gas', 'Oil & Gas', 'Flow control, piping and project supply requirements.'],
  ['petrochemical', 'Petrochemical', 'Industrial product and procurement coordination.'],
  ['refining', 'Refining', 'Process-focused product families and project support.'],
  ['chemical', 'Chemical', 'Requirements-led industrial supply coordination.'],
  ['power-generation', 'Power Generation', 'Technical product systems for power environments.'],
  ['lng-cryogenics', 'LNG & Cryogenics', 'Industrial requirements supported through technical review.'],
  ['marine-offshore', 'Marine & Offshore', 'Global project coordination for demanding operating contexts.'],
  ['water-wastewater', 'Water & Wastewater', 'Piping, flow control and process equipment options.'],
  ['mining-minerals', 'Mining & Minerals', 'Industrial equipment and maintenance product families.'],
  ['renewable-energy', 'Renewable Energy', 'Electrical, control and project supply support.'],
  ['steel-metals', 'Steel & Metals', 'Materials, fabrication and industrial supply options.'],
  ['cement', 'Cement', 'Process equipment and maintenance-oriented product families.'],
  ['pharmaceutical', 'Pharmaceutical', 'Technical sourcing support for specified requirements.'],
  ['food-beverage', 'Food & Beverage', 'Process, piping and instrumentation product families.'],
  ['infrastructure', 'Infrastructure', 'Project procurement and industrial hardware support.']
].map(([id, name, description], index) => ({
  id,
  number: String(index + 1).padStart(2, '0'),
  name,
  description,
  image: getImagePath(id, '/assets/industry/oil-gas.jpg'),
  imageAlt: getImageAlt(id, `${name} industrial infrastructure`)
}));

export const solutionServices = [
  ['Engineering Support', 'Bring product, application and documentation requirements into a clearer technical brief.'],
  ['Global Sourcing', 'Coordinate sourcing options around the actual product and delivery context.'],
  ['Project Procurement', 'Create a dependable route from requirement through supply coordination.'],
  ['Material Management', 'Keep material requirements, priorities and information visibly aligned.'],
  ['Expediting & Inspection', 'Coordinate status and quality requirements where they are part of the supplied scope.'],
  ['Logistics & Delivery', 'Connect packing, destination and delivery context to the project workflow.'],
  ['Custom Fabrication', 'Explore custom fabrication requirements through a technical conversation.'],
  ['After Sales Support', 'Keep an accessible route for support after the supplied requirement.']
].map(([title, description], index) => ({ number: String(index + 1).padStart(2, '0'), title, description }));

export const processSteps = ['Requirement', 'Technical Review', 'Sourcing', 'Commercial Alignment', 'Quality Coordination', 'Documentation', 'Logistics', 'Delivery'];

export const resources = [
  ['Company Profile', 'A concise introduction to IKINOVAC Global and the way we work.', 'Request document'],
  ['IKINOVAC Line Card', 'Product categories and industrial supply scope.', 'Request line card'],
  ['Product Catalogues', 'Request relevant catalogue information for your product family.', 'Request catalogue'],
  ['Technical Datasheets', 'Request available product technical documentation.', 'Request document'],
  ['Brochures', 'Request available product-family brochures and catalogues.', 'Request brochure'],
  ['Quality Documents', 'Request quality documentation where it is available for the requirement.', 'Request document'],
  ['Engineering Resources', 'Bring a product-selection or procurement question to the project desk.', 'Start a request']
].map(([title, description, action], index) => ({ number: String(index + 1).padStart(2, '0'), title, description, action }));

export const businessVerticals = [
  ['Flow control', 'Valves & Automation', 'Flow-control families and associated automation components.', ['valves', 'automation']],
  ['Process connection', 'Pipe, Fittings & Flanges', 'Connection-focused product groups for project piping requirements.', ['pipe-fittings-flanges', 'sealing-items']],
  ['Measurement', 'Instrumentation', 'Measurement and analytical product groups for the industrial brief.', ['instrumentation', 'process-utility']],
  ['Motion & control', 'Automation & Motors', 'Automation, rotating equipment and machinery product groups.', ['automation', 'motors', 'mining-machinery']],
  ['Process equipment', 'Pumps & Utility Equipment', 'Equipment, filtration and utility-system product groups.', ['equipment', 'process-utility', 'filtration']],
  ['Maintenance', 'Sealing & Site Support', 'Sealing, bearing, welding and safety product groups.', ['sealing-items', 'mining-machinery', 'welding', 'safety']]
].map(([name, title, description, categorySlugs], index) => ({ number: String(index + 1).padStart(2, '0'), name, title, description, categorySlugs }));

export const insights = [
  ['valve-selection', 'Valve Selection', 'Start a valve enquiry with the product, application and configuration questions that matter.', 'CMS-ready educational overview; technical selection remains subject to review.'],
  ['material-selection', 'Material Selection', 'Structure a material-related sourcing conversation around documented project requirements.', 'CMS-ready educational overview; no material recommendation is made here.'],
  ['procurement', 'Procurement', 'Bring technical, commercial and delivery context into one clearer industrial RFQ.', 'CMS-ready workflow overview for project teams.']
].map(([slug, category, title, description]) => ({ slug, category, title, description }));
