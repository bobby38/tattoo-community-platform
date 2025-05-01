// src/types/index.ts

export interface RatingInfo {
  average: number;
  count: number;
}

export interface Review {
  user_id: number; // Or string depending on your user ID type
  rating: number;
  comment: string;
  review_date?: string; // Optional: Add date of review
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string; // Optional: Instagram username or URL
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Studio {
  id: number; // Or string
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  profile_image_url?: string;
  gallery_image_urls?: string[];
  styles: string[];
  tribes?: string[];
  specialties?: string[];
  ink_brands?: string[];
  equipment?: string[]; // Could be more structured if needed
  amenities?: string[];
  artist_ids: number[]; // Or string[]
  opening_hours?: OpeningHours;
  contact_info?: ContactInfo;
  accepting_walk_ins?: boolean;
  ratings?: RatingInfo;
  reviews?: Review[];
}

export interface EquipmentInfo {
  machine?: string;
  power_supply?: string;
  needles?: string[];
}

export interface Artist {
  id: number; // Or string
  studio_id?: number; // Or string - Primary studio? Can be optional if artist is independent/guesting
  contact_info?: ContactInfo; // Add contact info for artist
  name: string;
  avatar_url?: string;
  bio?: string;
  styles: string[];
  tribes?: string[];
  years_experience?: number;
  inspiration_sources?: string[];
  equipment?: EquipmentInfo;
  favorite_inks?: string[];
  portfolio?: string[];
  hourly_rate_range?: string;
  booking_info?: string;
  is_guest_artist?: boolean;
  ratings?: RatingInfo;
  reviews?: Review[];
}

export interface TasteProfile {
  favorite_styles?: string[];
  favorite_tribes?: string[];
}

export interface TattooRecord {
  id: number | string; // ID for the specific tattoo entry
  description: string;
  style?: string;
  artist_id?: number; // Or string
  studio_id?: number; // Or string
  date?: string; // ISO date string preferably
  image_url?: string;
  body_part?: string; // Optional
}

export interface UserReviewReference {
  target_type: 'studio' | 'artist';
  target_id: number; // Or string
  rating: number;
  comment: string;
}

export interface PrivacySettings {
  profile_visibility?: 'public' | 'followers_only' | 'private';
  show_location?: boolean;
  show_collection?: boolean;
}

export interface User {
  id: number; // Or string
  username: string;
  name?: string; // Optional real name
  email: string; // Ensure GDPR/privacy compliance if stored/displayed
  avatar_url?: string;
  location?: string;
  taste_profile?: TasteProfile;
  liked_posts?: (number | string)[]; // Assuming posts have IDs
  bookmarked_studios?: (number | string)[];
  following_artists?: (number | string)[];
  tattoo_collection?: TattooRecord[];
  reviews_written?: UserReviewReference[];
  privacy_settings?: PrivacySettings;
  join_date?: string; // Optional
}

// Represents a user-submitted post (e.g., uploaded tattoo image)
export interface Post {
  id: number | string; // Use string if using UUIDs
  user_id: number | string;
  artist_id?: number | string; // Optional: Link to artist who did the work
  studio_id?: number | string; // Optional: Link to studio where it was done
  image_url: string;
  caption?: string;
  style_ids?: (number | string)[]; // Link to relevant styles
  // Add other relevant fields like likes, comments, created_at, etc.
}

// Represents an event (e.g., convention, guest spot)
export interface Event {
  id: number | string;
  title: string;
  description?: string;
  venue?: string; // Or could be a Studio ID
  address?: string; // If venue is not a known studio
  start_datetime: string; // ISO 8601 format recommended
  end_datetime?: string; // Optional
  image_url?: string;
  website?: string; // Link for tickets/more info
}

// You might also want a type for Tattoo Styles
export interface TattooStyle {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string; // For display in sections like featured styles
  created_at: string;
  updated_at: string;
}

// And maybe Tribes
export interface Tribe {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}
