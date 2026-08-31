const configurationKeys = ['size', 'material', 'pressureRating', 'standard', 'connection', 'operation', 'application', 'projectService', 'deliveryLocation', 'requiredDate', 'notes'];

export const emptyCustomer = {
  contactPerson: '', company: '', email: '', phone: '', country: '', deliveryLocation: '',
  projectName: '', projectReference: '', requiredDeliveryDate: '', notes: '', preferredContact: 'Either'
};

export const cleanConfiguration = (configuration = {}) => Object.fromEntries(
  configurationKeys.map(key => [key, String(configuration[key] || '').trim()])
);

export const configurationFingerprint = (productId, configuration = {}) => `${productId}:${JSON.stringify(
  Object.fromEntries(Object.entries(cleanConfiguration(configuration)).map(([key, value]) => [key, value.toLowerCase()]))
)}`;

export const makeItemKey = () => `rfq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createRFQReference = () => {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const nonce = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 5)}`.toUpperCase();
  return `IG-RFQ-${stamp}-${nonce}`;
};

export const displayValue = value => value || 'To be confirmed by IKINOVAC';

export const configurationStatus = item => {
  const populated = Object.values(cleanConfiguration(item.configuration)).filter(Boolean).length;
  if (populated >= 4) return 'Customer specified';
  if (populated) return 'Partial';
  return 'To confirm';
};

export const normaliseQuantity = value => Math.max(1, Math.floor(Number(value) || 1));
