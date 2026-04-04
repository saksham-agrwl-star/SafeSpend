/**
 * UPI Service for generating mocked link intents or handling UPI related actions.
 */
const generateUPILink = (upiId, amount, merchant) => {
  // If no upiId is provided, generate a fallback
  const targetUpi = upiId || 'default@merchant';
  const targetAmount = amount || 0;
  const targetMerchant = merchant ? encodeURIComponent(merchant) : 'Merchant';
  
  return `upi://pay?pa=${targetUpi}&pn=${targetMerchant}&am=${targetAmount}&cu=INR`;
};

module.exports = { generateUPILink };
