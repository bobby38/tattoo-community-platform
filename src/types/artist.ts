/**
 * Type definitions for Artist data
 */

export interface Artist {
  id: string;
  name: string;
  slug?: string;
  studio_id: string;
  country?: string;
  city?: string;
  bio?: string;
  image_url?: string;
  styles?: string[];
  instagram?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArtistWithStudio extends Artist {
  studio_name?: string;
  studio_city?: string;
}
