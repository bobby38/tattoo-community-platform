"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Artist, Studio, TattooStyle } from '@/types';

interface ArtistCardProps {
  artist: Artist;
  studio?: Studio;
  styles: TattooStyle[];
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, studio, styles }) => {
  // Find the styles this artist specializes in
  const artistStyles = styles.filter(style => 
    artist.styles?.map(String).includes(String(style.id))
  );

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image Section with Placeholder Fallback */}
      <Link href={`/directory/artists/${artist.id}`} className="block relative h-64 overflow-hidden">
        {artist.avatar_url ? (
          <Image
            src={artist.avatar_url} // Now guaranteed to be a string here
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw" // Adjust sizes as needed
          />
        ) : (
          // Placeholder if no avatar URL
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
            {/* Or use your PlaceholderImage component if available */}
            {/* <PlaceholderImage className="w-full h-full" /> */}
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {artistStyles.map(style => (
            <span 
              key={style.id}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
            >
              {style.name}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{artist.bio}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500/30" />
            <span className="text-sm ml-1">(24)</span>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            {/* Conditionally render Instagram link if available */}
            {artist.contact_info?.instagram && (
              <a 
                href={`https://instagram.com/${artist.contact_info.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 flex gap-2">
        <Button variant="default" size="sm" className="flex-1">
          Book Now
        </Button>
        <Link href={`/directory/artists/${artist.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ArtistCard;
