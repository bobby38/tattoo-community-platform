/**
 * Utility function to ensure all image URLs use the custom domain
 * This helps with consistent image URL handling across the application
 */

// Old R2 domain to replace
const OLD_R2_DOMAIN = 'pub-7de639d71ac205cf86c59c89880753fa.r2.dev';
// Custom domain to use instead
const CUSTOM_DOMAIN = 'imagetat.getrezult.com';
// Default placeholder image
const DEFAULT_PLACEHOLDER = '/placeholder-image.jpg';

/**
 * Convert any R2 URL to use the custom domain
 * @param url The image URL to transform
 * @param fallbackImage Optional fallback image to use if URL is invalid
 * @returns The transformed URL using the custom domain
 */
export function getProperImageUrl(url: string | null | undefined, fallbackImage: string = DEFAULT_PLACEHOLDER): string {
  // Handle null, undefined, or empty URLs
  if (!url || url.trim() === '') {
    console.log('Empty image URL, using fallback:', fallbackImage);
    return fallbackImage;
  }
  
  try {
    // If it's already using the custom domain, return as is
    if (url.includes(CUSTOM_DOMAIN)) {
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
    
    // Handle local paths - ALWAYS convert to custom domain in production for consistency
    if (url.startsWith('/uploads/')) {
      // Extract the path and filename
      const pathParts = url.split('/uploads/');
      if (pathParts.length > 1) {
        const pathAndFilename = pathParts[1].replace(/^\/+/, ''); // Remove leading slashes
        
        // In production, always use the custom domain
        if (process.env.NODE_ENV === 'production') {
          return `https://${CUSTOM_DOMAIN}/${pathAndFilename}`;
        }
        
        // In development, keep the local path
        return url;
      }
    }
    
    // Handle full URLs with http/https
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // If it's not from our domains, return as is
      return url;
    }
    
    // Handle relative paths that don't start with /uploads
    if (url.startsWith('/')) {
      // These are local assets, keep them as is
      return url;
    }
    
    // If we get here and it's not a valid URL format, use the fallback
    if (!/^[a-z0-9\/\-_.]+$/i.test(url)) {
      console.warn('Invalid image URL format:', url);
      return fallbackImage;
    }
    
    // For any other format, assume it's a relative path in the R2 bucket
    return `https://${CUSTOM_DOMAIN}/${url}`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return fallbackImage;
  }
}
