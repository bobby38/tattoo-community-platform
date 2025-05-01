"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Filter } from 'lucide-react';

// Mock gallery data
const GALLERY_ITEMS = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Japanese Dragon Sleeve',
    artist: 'Takeshi Yamada',
    style: 'Japanese Irezumi',
    likes: 245,
    comments: 32
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Geometric Wolf',
    artist: 'Emma Clarke',
    style: 'Geometric',
    likes: 187,
    comments: 24
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Watercolor Flowers',
    artist: 'Sofia Martinez',
    style: 'Watercolor',
    likes: 312,
    comments: 41
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Blackwork Mandala',
    artist: 'Marcus Black',
    style: 'Blackwork',
    likes: 276,
    comments: 38
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Sacred Geometry',
    artist: 'Liam Johnson',
    style: 'Geometric',
    likes: 198,
    comments: 27
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Traditional Koi Fish',
    artist: 'Hiroshi Tanaka',
    style: 'Japanese Irezumi',
    likes: 254,
    comments: 35
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Neo-Traditional Rose',
    artist: 'Alexandra Davis',
    style: 'Neo-Traditional',
    likes: 221,
    comments: 29
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Minimalist Line Work',
    artist: 'Nina White',
    style: 'Minimalist',
    likes: 167,
    comments: 19
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1607461194891-3b208b8f47ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    title: 'Dotwork Skull',
    artist: 'Thomas Gray',
    style: 'Dotwork',
    likes: 234,
    comments: 31
  }
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get unique styles for filter
  const styles = Array.from(new Set(GALLERY_ITEMS.map(item => item.style)));
  
  // Filter gallery items
  const filteredItems = activeFilter 
    ? GALLERY_ITEMS.filter(item => item.style === activeFilter)
    : GALLERY_ITEMS;
  
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
      
      {/* Gallery Grid */}
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
                src={item.imageUrl} 
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
                  <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
