"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MapPin, Instagram, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Define the ContactInfo type according to the updated structure
interface ContactInfo {
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
}

// Define the Member type with nested contact_info
interface Member {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  location: string;
  contact_info: ContactInfo | null;
  role: string;
}

// Define the Tribe type
interface Tribe {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  cover_image_url: string;
  founded: string;
  location: string;
  member_count: number;
  focus_areas: string[];
  members: Member[];
}

// Mock tribes data
const TRIBES_DATA: Tribe[] = [
  {
    id: '1',
    name: 'Blackwork Collective',
    slug: 'blackwork-collective',
    description: 'A community of artists dedicated to the art of blackwork tattooing, exploring patterns, dotwork, and solid black designs.',
    image_url: 'https://images.unsplash.com/photo-1542727365-19732a80dcfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2018',
    location: 'Berlin, Germany',
    member_count: 42,
    focus_areas: ['Blackwork', 'Dotwork', 'Geometric', 'Tribal'],
    members: [
      {
        id: 'm1',
        name: 'Marcus Black',
        slug: 'marcus-black',
        bio: 'Pioneering blackwork artist pushing the boundaries of negative space and pattern work.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'London, UK',
        contact_info: {
          instagram: 'marcus_blackwork',
          website: 'https://marcusblack.ink'
        },
        role: 'Founder'
      },
      {
        id: 'm2',
        name: 'Lena Schmidt',
        slug: 'lena-schmidt',
        bio: 'Specializing in intricate dotwork and geometric blackwork designs.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Berlin, Germany',
        contact_info: {
          instagram: 'lena_dots',
          email: 'lena@blackworkcollective.com'
        },
        role: 'Lead Artist'
      }
    ]
  },
  {
    id: '2',
    name: 'Neo-Traditional Guild',
    slug: 'neo-traditional-guild',
    description: 'A group of artists dedicated to pushing the boundaries of traditional tattooing with bold colors and innovative designs.',
    image_url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2015',
    location: 'Portland, OR',
    member_count: 37,
    focus_areas: ['Neo-Traditional', 'American Traditional', 'Japanese Influence'],
    members: [
      {
        id: 'm3',
        name: 'Alexandra Davis',
        slug: 'alexandra-davis',
        bio: 'Renowned for her colorful neo-traditional designs with a feminine touch.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Portland, OR',
        contact_info: {
          instagram: 'alex_neotrad',
          website: 'https://alexandradavis.art'
        },
        role: 'Founder'
      }
    ]
  },
  {
    id: '3',
    name: 'Irezumi Masters',
    slug: 'irezumi-masters',
    description: 'A collective of artists dedicated to preserving and evolving the traditional Japanese tattoo art form of Irezumi.',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2010',
    location: 'Tokyo, Japan',
    member_count: 28,
    focus_areas: ['Japanese Irezumi', 'Tebori', 'Traditional Japanese'],
    members: [
      {
        id: 'm4',
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
        },
        role: 'Founder'
      }
    ]
  },
  {
    id: '4',
    name: 'Minimalist Ink Society',
    slug: 'minimalist-ink-society',
    description: 'A community focused on the beauty of simplicity in tattoo art, celebrating clean lines and negative space.',
    image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1590246815117-be18528e6a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2017',
    location: 'Stockholm, Sweden',
    member_count: 31,
    focus_areas: ['Minimalist', 'Fine Line', 'Single Needle'],
    members: [
      {
        id: 'm5',
        name: 'Nina White',
        slug: 'nina-white',
        bio: 'Specializing in delicate, minimal designs that speak volumes with few lines.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Stockholm, Sweden',
        contact_info: {
          instagram: 'nina_minimal',
          email: 'nina@minimalink.se'
        },
        role: 'Founder'
      }
    ]
  },
  {
    id: '5',
    name: 'Watercolor Collective',
    slug: 'watercolor-collective',
    description: 'Artists exploring the fluid, vibrant world of watercolor tattooing, pushing the boundaries of color and technique.',
    image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2014',
    location: 'Barcelona, Spain',
    member_count: 35,
    focus_areas: ['Watercolor', 'Abstract', 'Painterly'],
    members: [
      {
        id: 'm6',
        name: 'Sofia Martinez',
        slug: 'sofia-martinez',
        bio: 'Award-winning watercolor tattoo artist known for vibrant, painterly designs.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Barcelona, Spain',
        contact_info: {
          instagram: 'sofia_watercolor',
          email: 'sofia@watercolortattoos.com'
        },
        role: 'Founder'
      }
    ]
  },
  {
    id: '6',
    name: 'Geometric Art Collective',
    slug: 'geometric-art-collective',
    description: 'A tribe of artists focused on the precision and beauty of geometric tattoo designs and sacred geometry.',
    image_url: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1597217270402-b5a73eba9d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    founded: '2016',
    location: 'Berlin, Germany',
    member_count: 29,
    focus_areas: ['Geometric', 'Sacred Geometry', 'Dotwork', 'Mandalas'],
    members: [
      {
        id: 'm7',
        name: 'Emma Clarke',
        slug: 'emma-clarke',
        bio: 'Specializing in intricate geometric designs and sacred geometry.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Berlin, Germany',
        contact_info: {
          instagram: 'emma_geometric',
          website: 'https://emmaclarketattoo.com'
        },
        role: 'Founder'
      },
      {
        id: 'm8',
        name: 'David Chen',
        slug: 'david-chen',
        bio: 'Mathematician turned tattoo artist, creating complex geometric patterns inspired by mathematical principles.',
        avatar_url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        location: 'Munich, Germany',
        contact_info: null,
        role: 'Lead Artist'
      }
    ]
  }
];

export default function TribesPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get unique focus areas for filter
  const allFocusAreas = TRIBES_DATA.flatMap(tribe => tribe.focus_areas);
  const uniqueFocusAreas = Array.from(new Set(allFocusAreas)).sort();
  
  // Filter tribes
  const filteredTribes = activeFilter 
    ? TRIBES_DATA.filter(tribe => tribe.focus_areas.includes(activeFilter))
    : TRIBES_DATA;
  
  // Sort tribes by member count (largest first)
  const sortedTribes = [...filteredTribes].sort((a, b) => b.member_count - a.member_count);
  
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Tribes</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Discover communities of tattoo artists and enthusiasts united by shared styles, techniques, and philosophies.
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Focus Area</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === null ? "default" : "outline"} 
            onClick={() => setActiveFilter(null)}
            className="mb-2"
          >
            All Tribes
          </Button>
          
          {uniqueFocusAreas.map(area => (
            <Button 
              key={area} 
              variant={activeFilter === area ? "default" : "outline"}
              onClick={() => setActiveFilter(area)}
              className="mb-2"
            >
              {area}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Tribes List */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedTribes.map((tribe) => (
          <motion.div key={tribe.id} variants={itemVariants}>
            <Link href={`/tribes/${tribe.slug}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <img 
                    src={tribe.cover_image_url} 
                    alt={tribe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-white text-2xl font-bold">{tribe.name}</h3>
                      <div className="flex items-center text-white/80 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{tribe.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{tribe.member_count} members</span>
                    <span className="mx-2">•</span>
                    <span>Founded {tribe.founded}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">{tribe.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tribe.focus_areas.map(area => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                  
                  {tribe.members.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Key Members</h4>
                      
                      <div className="space-y-3">
                        {tribe.members.slice(0, 2).map((member) => (
                          <div key={member.id} className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={member.avatar_url} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{member.name}</p>
                                <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {member.role}
                                </span>
                              </div>
                              
                              {/* Social links using the updated contact_info structure */}
                              <div className="flex mt-1 space-x-2">
                                {member.contact_info?.instagram && (
                                  <a 
                                    href={`https://instagram.com/${member.contact_info.instagram}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Instagram className="h-3 w-3" />
                                  </a>
                                )}
                                
                                {member.contact_info?.website && (
                                  <a 
                                    href={member.contact_info.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Globe className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="px-6 py-4 border-t">
                  <Button className="w-full">View Tribe</Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
