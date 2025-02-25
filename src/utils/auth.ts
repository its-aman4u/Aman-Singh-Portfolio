export const verifyToken = (token: string, secret: string): boolean => {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    // Decode payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    // In production, you should properly verify the signature
    // This is a simplified check for testing
    const expectedSignature = Array.from(secret)
      .map(char => char.charCodeAt(0).toString(16))
      .join('');
    
    const actualSignature = atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'));
    
    return actualSignature.includes(expectedSignature);
  } catch {
    return false;
  }
};
