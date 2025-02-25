export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getImageUrl(image: { url: string; fallback?: string }): Promise<string> {
  if (!image.url.startsWith('http')) {
    return image.url; // Return local path as is
  }

  try {
    const exists = await checkImageExists(image.url);
    return exists ? image.url : (image.fallback || '/images/placeholder.jpg');
  } catch {
    return image.fallback || '/images/placeholder.jpg';
  }
}
