export const createRFQReference = () => {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const nonce = `${Date.now().toString(36).slice(-5)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `IG-RFQ-${stamp}-${nonce}`;
};
