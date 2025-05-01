"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Search, Instagram, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define the ContactInfo type according to the updated structure
interface ContactInfo {
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
}

// Define the Artist type with nested contact_info
interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  location: string;
  contact_info: ContactInfo | null;
}

// Define the Style type
interface Style {
  id: string;
  name: string;
  slug: string;
  description: string;
  history: string;
  characteristics: string;
  image_url: string;
  popularity: number;
  featured_artists: Artist[];
}

// Mock styles data
const STYLES_DATA: Style[] = [
  {
    id: '1',
    name: 'Japanese Irezumi',
    slug: 'japanese-irezumi',
    description: 'Traditional Japanese tattooing with bold outlines, vibrant colors, and mythological themes.',
    history: 'Japanese tattooing dates back to the Jomon Period (10,000 BCE). The modern Irezumi style developed during the Edo period and was associated with the yakuza.',
    characteristics: 'Bold outlines, vibrant colors, water motifs, mythological creatures like dragons and koi fish, cherry blossoms, and full-body compositions.',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    popularity: 92,
    featured_artists: [
      {
        id: 'a1',
        name: 'Takeshi Yamada',
        slug: 'takeshi-yamada',
        bio: 'Master of traditional Japanese tattooing with 25 years of experience.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Tokyo, Japan',
        contact_info: {
          instagram: 'takeshi_irezumi',
          website: 'https://takeshi-tattoo.jp',
          email: 'contact@takeshi-tattoo.jp',
          phone: '+81-3-1234-5678'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Geometric',
    slug: 'geometric',
    description: 'Modern style focusing on precise geometric shapes, patterns, and sacred geometry.',
    history: 'While geometric patterns have been used in tattooing across many cultures, the modern geometric style emerged in the early 2000s with the rise of minimalism.',
    characteristics: 'Precise lines, geometric shapes, mandalas, sacred geometry, dot work, and blackwork elements.',
    image_url: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    popularity: 87,
    featured_artists: [
      {
        id: 'a2',
        name: 'Emma Clarke',
        slug: 'emma-clarke',
        bio: 'Specializing in intricate geometric designs and sacred geometry.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Berlin, Germany',
        contact_info: {
          instagram: 'emma_geometric',
          website: 'https://emmaclarketattoo.com'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Watercolor',
    slug: 'watercolor',
    description: 'Contemporary style mimicking the fluid, colorful appearance of watercolor paintings.',
    history: 'Watercolor tattooing emerged in the early 2010s as artists began experimenting with techniques to mimic the appearance of watercolor paintings.',
    characteristics: 'Vibrant colors, fluid appearance, minimal outlines, splashes and drips, soft color blending.',
    image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    popularity: 85,
    featured_artists: [
      {
        id: 'a3',
        name: 'Sofia Martinez',
        slug: 'sofia-martinez',
        bio: 'Award-winning watercolor tattoo artist known for vibrant, painterly designs.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Barcelona, Spain',
        contact_info: {
          instagram: 'sofia_watercolor',
          email: 'sofia@watercolortattoos.com'
        }
      }
    ]
  },
  {
    id: '4',
    name: 'Blackwork',
    slug: 'blackwork',
    description: 'Bold, black ink tattoos ranging from simple designs to intricate patterns and solid black areas.',
    history: 'Blackwork has roots in tribal tattooing but evolved into a contemporary style in the late 20th century, gaining popularity for its bold, graphic aesthetic.',
    characteristics: 'Solid black ink, high contrast, geometric patterns, dot work, tribal influences, and negative space.',
    image_url: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    popularity: 83,
    featured_artists: [
      {
        id: 'a4',
        name: 'Marcus Black',
        slug: 'marcus-black',
        bio: 'Pioneering blackwork artist pushing the boundaries of negative space and pattern work.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'London, UK',
        contact_info: null
      }
    ]
  },
  {
    id: '5',
    name: 'Neo-Traditional',
    slug: 'neo-traditional',
    description: 'Modern take on traditional American tattooing with bolder colors and more detailed imagery.',
    history: 'Neo-traditional emerged in the 1980s as artists began expanding on the American traditional style with more complex designs and a broader color palette.',
    characteristics: 'Bold lines, vibrant colors, detailed shading, illustrative elements, and a mix of traditional and modern imagery.',
    image_url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    popularity: 89,
    featured_artists: [
      {
        id: 'a5',
        name: 'Alexandra Davis',
        slug: 'alexandra-davis',
        bio: 'Renowned for her colorful neo-traditional designs with a feminine touch.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Portland, OR',
        contact_info: {
          instagram: 'alex_neotrad',
          website: 'https://alexandradavis.art'
        }
      }
    ]
  },
  {
    id: '6',
    name: 'Minimalist',
    slug: 'minimalist',
    description: 'Simple, clean designs with fine lines and minimal detail, focusing on negative space.',
    history: 'Minimalist tattooing gained popularity in the 2010s as part of the broader minimalist design movement, emphasizing simplicity and restraint.',
    characteristics: 'Fine lines, simple designs, minimal shading, small scale, negative space, and symbolic imagery.',
    image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    popularity: 80,
    featured_artists: [
      {
        id: 'a6',
        name: 'Nina White',
        slug: 'nina-white',
        bio: 'Specializing in delicate, minimal designs that speak volumes with few lines.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Stockholm, Sweden',
        contact_info: {
          instagram: 'nina_minimal',
          email: 'nina@minimalink.se'
        }
      }
    ]
  }
];

export default function StylesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter styles based on search query
  const filteredStyles = searchQuery 
    ? STYLES_DATA.filter(style => 
        style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : STYLES_DATA;
  
  // Sort styles by popularity
  const sortedStyles = [...filteredStyles].sort((a, b) => b.popularity - a.popularity);
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Styles</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Explore different tattoo styles from traditional to contemporary. Find the perfect aesthetic for your next ink.
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Styles Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedStyles.map((style) => (
          <motion.div key={style.id} variants={itemVariants}>
            <Link href={`/styles/${style.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={style.image_url} 
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-white text-xl font-bold">{style.name}</h3>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 line-clamp-3">{style.description}</p>
                  
                  {style.featured_artists.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Featured Artist</h4>
                      
                      {style.featured_artists.slice(0, 1).map((artist) => (
                        <div key={artist.id} className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={artist.avatar_url} alt={artist.name} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <p className="font-medium">{artist.name}</p>
                            <p className="text-xs text-muted-foreground">{artist.location}</p>
                            
                            {/* Social links using the updated contact_info structure */}
                            <div className="flex mt-1 space-x-2">
                              {artist.contact_info?.instagram && (
                                <a 
                                  href={`https://instagram.com/${artist.contact_info.instagram}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Instagram className="h-3 w-3" />
                                </a>
                              )}
                              
                              {artist.contact_info?.website && (
                                <a 
                                  href={artist.contact_info.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Globe className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
