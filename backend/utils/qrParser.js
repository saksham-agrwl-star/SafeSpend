/**
 * Parses raw QR string into a transaction object if needed. 
 * For simplicity, we mostly assume frontend parses it and sends JSON, 
 * but this utility serves as the logic layer.
 */
const parseUPIQRCode = (qrString) => {
  try {
    const url = new URL(qrString);
    if (url.protocol !== 'upi:') return null;
    
    // Parse parameters
    const upiId = url.searchParams.get('pa');
    const merchant = url.searchParams.get('pn');
    let amount = url.searchParams.get('am');
    
    if (amount) amount = parseFloat(amount);
    
    return { upiId, merchant, amount };
  } catch (error) {
    return null;
  }
};

module.exports = { parseUPIQRCode };
