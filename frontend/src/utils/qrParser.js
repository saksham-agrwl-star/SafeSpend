/**
 * Parses a standard UPI QR code string.
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR
 */
export const parseUPIQRCode = (qrString) => {
  try {
    if (!qrString || !qrString.startsWith('upi://pay')) {
      return null;
    }

    const url = new URL(qrString);
    const params = new URLSearchParams(url.search);

    return {
      upiId: params.get('pa') || '',
      name: params.get('pn') || '',
      amount: params.get('am') || '',
      currency: params.get('cu') || 'INR',
      merchantCode: params.get('mc') || '',
      transactionId: params.get('tr') || '',
      transactionRef: params.get('tr') || '',
      note: params.get('tn') || '',
      originalString: qrString
    };
  } catch (error) {
    console.error('Failed to parse UPI QR:', error);
    return null;
  }
};

/**
 * Validates a parsed UPI object.
 */
export const isValidUPI = (parsedUPI) => {
  if (!parsedUPI) return false;
  return Boolean(parsedUPI.upiId);
};
