"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Studio, Artist } from '@/store/useStore';

interface StudioCardProps {
  studio: Studio;
  artists: Artist[];
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, artists }) => {
  // Find artists working at this studio
  const studioArtists = artists.filter(artist => artist.studioId === studio.id);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/directory/studios/${studio.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={studio.imageUrl}
            alt={studio.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <div key={artist.id} className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-background">
                  <Image
                    src={artist.avatarUrl}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
              {studioArtists.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{studioArtists.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Globe className="h-4 w-4 mr-1" />
            <a 
              href={studio.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Visit Website
            </a>
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
