const base64UrlEncode = (str: string): string => {
  const base64 = btoa(str);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateToken = (
  payload: Record<string, any>,
  secret: string
): string => {
  // Create JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature (in production, use a proper HMAC implementation)
  // This is a simplified version for testing purposes
  const signature = base64UrlEncode(
    Array.from(secret)
      .map(char => char.charCodeAt(0).toString(16))
      .join('')
  );

  // Combine all parts
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
