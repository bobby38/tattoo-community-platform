/**
 * Map data utilities for Ink2Tattoo platform
 * Provides functions to work with studio and artist location data
 */

// Import types directly to avoid TypeScript errors
interface Studio {
  id: string;
  name: string;
  slug?: string;
  address?: string;
  city?: string;
  country?: string;
  lat?: number | string;
  lng?: number | string;
  website?: string;
  image_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Artist {
  id: string;
  name: string;
  slug?: string;
  studio_id: string;
  city?: string;
  country?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the location data structure
export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'studio' | 'artist' | 'event';
  address: string;
  city: string;
  country: string;
  imageUrl?: string;
  slug?: string;
}

// Default center coordinates for the map (Singapore)
export const DEFAULT_CENTER: { lat: number; lng: number } = { lat: 1.3521, lng: 103.8198 };

// Default zoom level for the map
export const DEFAULT_ZOOM: number = 11;

// City center coordinates
export const CITY_CENTERS: { [key: string]: { lat: number; lng: number } } = {
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Kuala Lumpur': { lat: 3.1390, lng: 101.6869 },
  'Penang': { lat: 5.4141, lng: 100.3288 },
  'Jakarta': { lat: -6.2088, lng: 106.8456 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Ho Chi Minh City': { lat: 10.8231, lng: 106.6297 },
  'Manila': { lat: 14.5995, lng: 120.9842 },
  'Denpasar': { lat: -8.6705, lng: 115.2126 },
  'Kuching': { lat: 1.5497, lng: 110.3654 }
};

/**
 * Convert studio data to location data for the map
 * @param studios Array of studio objects
 * @returns Array of location data objects
 */
export function convertStudiosToLocationData(studios: Studio[]): LocationData[] {
  return studios
    .filter(studio => studio.lat && studio.lng) // Only include studios with coordinates
    .map(studio => ({
      id: studio.id,
      name: studio.name,
      type: 'studio' as const,
      country: studio.country || '',
      city: studio.city || '',
      address: studio.address || '',
      lat: parseFloat(studio.lat!.toString()),
      lng: parseFloat(studio.lng!.toString()),
      slug: studio.slug,
      imageUrl: studio.image_url
    }));
}

/**
 * Convert artist data to location data for the map
 * @param artists Array of artist objects
 * @param studios Array of studio objects (to get location data)
 * @returns Array of location data objects
 */
export function convertArtistsToLocationData(artists: Artist[], studios: Studio[]): LocationData[] {
  // Create a map of studio IDs to studio objects for quick lookup
  const studioMap: Map<string, Studio> = new Map<string, Studio>();
  studios.forEach(studio => {
    studioMap.set(studio.id, studio);
  });
  
  return artists
    .filter(artist => {
      // Only include artists with a valid studio that has coordinates
      const studio = studioMap.get(artist.studio_id);
      return studio && studio.lat && studio.lng;
    })
    .map(artist => {
      const studio = studioMap.get(artist.studio_id)!;
      return {
        id: artist.id,
        name: artist.name,
        type: 'artist' as const,
        country: artist.country || studio.country || '',
        city: artist.city || studio.city || '',
        address: studio.address || '',
        lat: parseFloat(studio.lat!.toString()),
        lng: parseFloat(studio.lng!.toString()),
        slug: artist.slug,
        imageUrl: artist.image_url
      };
    });
}

/**
 * Convert event data to location data for the map
 * @param events Array of event objects
 * @returns Array of location data objects
 */
export function convertEventsToLocationData(events: any[]): LocationData[] {
  return events
    .filter(event => event.lat && event.lng) // Only include events with coordinates
    .map(event => ({
      id: event.id.toString(),
      name: event.name,
      type: 'event' as const,
      country: event.country || '',
      city: event.city || '',
      address: event.venue ? `${event.venue}, ${event.address}` : event.address || '',
      lat: typeof event.lat === 'string' ? parseFloat(event.lat) : event.lat,
      lng: typeof event.lng === 'string' ? parseFloat(event.lng) : event.lng,
      slug: event.id.toString(),
      imageUrl: event.image_url
    }));
}

/**
 * Get map center coordinates based on selected city
 * @param city Selected city name
 * @returns Coordinates for the map center
 */
export function getMapCenter(city?: string): { lat: number; lng: number } {
  if (city && CITY_CENTERS[city as keyof typeof CITY_CENTERS]) {
    return CITY_CENTERS[city as keyof typeof CITY_CENTERS];
  }
  return DEFAULT_CENTER;
}

/**
 * Filter location data by city
 * @param locations Array of location data objects
 * @param city City to filter by
 * @returns Filtered array of location data objects
 */
export function filterLocationsByCity(locations: LocationData[], city?: string): LocationData[] {
  if (!city) return locations;
  return locations.filter(location => location.city === city);
}
