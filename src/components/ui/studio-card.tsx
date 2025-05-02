"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Studio, Artist } from '@/types';

interface StudioCardProps {
  studio: Studio;
  artists: Artist[];
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, artists }) => {
  // Find artists working at this studio
  const studioArtists = artists.filter(artist => artist.studio_id === studio.id);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/directory/studios/${studio.id}`}>
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={studio.profile_image_url || '/images/placeholder-studio.jpg'}
            alt={studio.name}
            width={400}
            height={200}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-xl font-bold text-white">{studio.name}</h3>
            <div className="flex items-center text-white/80 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{studio.address}, {studio.city}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Star className="h-4 w-4 text-yellow-500/30" />
            <span className="text-sm ml-1">(42)</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{studioArtists.length} Artists</span>
          </div>
        </div>
        
        {/* Artists preview */}
        {studioArtists.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Featured Artists:</h4>
            <div className="flex -space-x-2">
              {studioArtists.slice(0, 4).map(artist => (
                <div key={artist.id} className="relative w-6 h-6 rounded-full overflow-hidden mr-1 border-2 border-background">
                  <Image
                    src={artist.avatar_url || '/images/placeholder-artist.jpg'}
                    alt={artist.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {studioArtists.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{studioArtists.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            {studio.contact_info?.website && (
              <a 
                href={studio.contact_info.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline flex items-center"
              >
                <Globe className="h-3 w-3 mr-1" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 flex gap-2">
        <Button variant="default" size="sm" className="flex-1">
          Book Appointment
        </Button>
        <Link href={`/directory/studios/${studio.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Studio
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default StudioCard;
