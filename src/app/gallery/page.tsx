"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Filter } from 'lucide-react';

// Define the GalleryItem type
interface GalleryItem {
  id: string;
  image: string;
  title: string;
  artist: string;
  style: string;
  likes: number;
  comments: number;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch gallery items from the API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/gallery');
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items');
        }
        
        const data = await response.json();
        setGalleryItems(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGallery();
  }, []);
  
  // Get unique styles for filter
  const styles = Array.from(new Set(galleryItems.map(item => item.style)));
  
  // Filter gallery items
  const filteredItems = activeFilter 
    ? galleryItems.filter(item => item.style === activeFilter)
    : galleryItems;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Explore stunning tattoo artwork from talented artists around the world. Find inspiration for your next piece.
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Filter by Style</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === null ? "default" : "outline"} 
            onClick={() => setActiveFilter(null)}
            className="mb-2"
          >
            All Styles
          </Button>
          
          {styles.map(style => (
            <Button 
              key={style} 
              variant={activeFilter === style ? "default" : "outline"}
              onClick={() => setActiveFilter(style)}
              className="mb-2"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading gallery items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No gallery items found.</p>
        </div>
      ) : (
        /* Gallery Grid */
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <div className="group relative overflow-hidden rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-white/80 mb-2">Artist: {item.artist}</p>
                  <p className="text-white/80 mb-4">Style: {item.style}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-white/80">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center text-white/80">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
