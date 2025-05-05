/**
 * Hybrid image utility for Ink2Tattoo platform
 * Provides a way to handle images that will transition from static data to Supabase/R2 URLs
 */

import { getProperImageUrl } from './image-url';

// Sample images for studios and artists - these will be used as fallbacks
const SAMPLE_STUDIO_IMAGES = [
  '/images/sample/studio-1.jpg',
  '/images/sample/studio-2.jpg',
  '/images/sample/studio-3.jpg',
  '/images/sample/studio-4.jpg',
  '/images/sample/studio-5.jpg',
];

const SAMPLE_ARTIST_IMAGES = [
  '/images/sample/artist-1.jpg',
  '/images/sample/artist-2.jpg',
  '/images/sample/artist-3.jpg',
  '/images/sample/artist-4.jpg',
  '/images/sample/artist-5.jpg',
];

const SAMPLE_EVENT_IMAGES = [
  '/images/sample/event-1.jpg',
  '/images/sample/event-2.jpg',
  '/images/sample/event-3.jpg',
  '/images/sample/event-4.jpg',
  '/images/sample/event-5.jpg',
];

// Default placeholders if even sample images aren't available
const DEFAULT_STUDIO_PLACEHOLDER = '/images/sample/default-studio.jpg';
const DEFAULT_ARTIST_PLACEHOLDER = '/images/sample/default-artist.jpg';
const DEFAULT_EVENT_PLACEHOLDER = '/images/sample/default-event.jpg';

/**
 * Get the hybrid image URL, either from the provided URL or a fallback
 * @param imageUrl The image URL (may be null or undefined)
 * @param type The type of entity (studio, artist, etc.)
 * @param id The entity ID
 * @returns The resolved image URL
 */
export function getHybridImageUrl(
  imageUrl: string | null | undefined, 
  type: 'studio' | 'artist' | 'event', 
  id: string | number
): string {
  // If we have a valid URL from the database, process it with our existing utility
  if (imageUrl && imageUrl.trim() !== '') {
    return getProperImageUrl(imageUrl);
  }
  
  // No valid URL, use a sample image based on the ID
  // This ensures the same entity always gets the same sample image
  const idNumber = typeof id === 'string' ? parseInt(id.replace(/[^0-9]/g, '0')) || 0 : id;
  
  if (type === 'studio') {
    // Get a sample studio image based on the ID
    const sampleIndex = idNumber % SAMPLE_STUDIO_IMAGES.length;
    return SAMPLE_STUDIO_IMAGES[sampleIndex] || DEFAULT_STUDIO_PLACEHOLDER;
  } else if (type === 'artist') {
    // Get a sample artist image based on the ID
    const sampleIndex = idNumber % SAMPLE_ARTIST_IMAGES.length;
    return SAMPLE_ARTIST_IMAGES[sampleIndex] || DEFAULT_ARTIST_PLACEHOLDER;
  } else {
    // Get a sample event image based on the ID
    const sampleIndex = idNumber % SAMPLE_EVENT_IMAGES.length;
    return SAMPLE_EVENT_IMAGES[sampleIndex] || DEFAULT_EVENT_PLACEHOLDER;
  }
}

/**
 * Check if an image exists at the given path
 * @param url The URL to check
 * @returns Promise that resolves to true if the image exists, false otherwise
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    // For external URLs, try to fetch the image
    if (url.startsWith('http')) {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    } 
    // For local URLs, assume they exist (we'll handle errors in the component)
    else {
      resolve(true);
    }
  });
}
