/**
 * Type definitions for Studio data
 */

export interface Studio {
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

export interface StudioWithArtists extends Studio {
  artists?: string[];
  artist_count?: number;
}
