/**
 * Utility function to ensure all image URLs use the custom domain
 * This helps with consistent image URL handling across the application
 */

// Old R2 domain to replace
const OLD_R2_DOMAIN = 'pub-7de639d71ac205cf86c59c89880753fa.r2.dev';
// Custom domain to use instead
const CUSTOM_DOMAIN = 'imagetat.getrezult.com';

/**
 * Convert any R2 URL to use the custom domain
 * @param url The image URL to transform
 * @returns The transformed URL using the custom domain
 */
export function getProperImageUrl(url: string | null): string {
  if (!url) return '/placeholder-image.jpg';
  
  // If it's already using the custom domain or is a local URL, return as is
  if (url.includes(CUSTOM_DOMAIN) || url.startsWith('/')) {
    return url;
  }
  
  // If it's using the old R2 domain, convert it to the custom domain
  if (url.includes(OLD_R2_DOMAIN)) {
    const urlParts = url.split('/');
    // The path is everything after the domain part (which is at index 2)
    const pathAndFilename = urlParts.slice(3).join('/');
    
    // Use the custom domain
    return `https://${CUSTOM_DOMAIN}/${pathAndFilename}`;
  }
  
  // Otherwise, return the URL as is
  return url;
}
