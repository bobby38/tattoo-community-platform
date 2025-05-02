"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Instagram, MapPin, Star, Calendar, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useStore from '@/store/useStore';
import { Artist, Studio, Post, TattooStyle } from '@/types';
import { motion } from 'framer-motion';

const ArtistDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { artists, studios, styles, posts } = useStore();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [artistStyles, setArtistStyles] = useState<TattooStyle[]>([]);
  const [artistPosts, setArtistPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (params.id) {
      const artistId = parseInt(params.id as string);
      const foundArtist = artists.find(a => a.id === artistId);
      
      if (foundArtist) {
        setArtist(foundArtist);
        
        // Find the studio
        const foundStudio = studios.find(s => s.id === foundArtist.studio_id);
        if (foundStudio) {
          setStudio(foundStudio);
        }
        
        // Find the styles
        const foundStyles = styles.filter(s => foundArtist.styles.includes(s.id));
        setArtistStyles(foundStyles);
        
        // Find posts by this artist
        const foundPosts = posts.filter(p => p.artist_id === artistId);
        setArtistPosts(foundPosts);
      }
    }
  }, [params.id, artists, studios, styles, posts]);

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <h1 className="text-2xl font-bold">Artist not found</h1>
        <p className="mt-4">The artist you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => router.push('/directory')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push('/directory')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Directory
      </Button>

      {/* Artist Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Artist Image */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-lg overflow-hidden border shadow-md"
          >
            <Image
              src={artist.avatar_url || '/images/placeholder-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </motion.div>
        </div>

        {/* Artist Info */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
            
            {studio && (
              <Link href={`/directory/studios/${studio.id}`} className="flex items-center text-muted-foreground hover:text-primary mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{studio.name}, {studio.city}</span>
              </Link>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {artistStyles.map(style => (
                <span
                  key={style.id}
                  className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                >
                  {style.name}
                </span>
              ))}
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500/30" />
                <span className="text-sm ml-1">(24 reviews)</span>
              </div>
              
              {artist.contact_info?.instagram && (
                <a
                  href={`https://instagram.com/${artist.contact_info.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-4 w-4 mr-1" />
                  <span>{artist.contact_info.instagram}</span>
                </a>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">{artist.bio}</p>
            
            <div className="flex flex-wrap gap-3">
              <Button>Book Appointment</Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="portfolio" className="mt-10">
        <TabsList className="mb-6">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>
        
        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <h2 className="text-2xl font-bold mb-6">Recent Work</h2>
          
          {artistPosts.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No portfolio items yet</h3>
              <p className="text-muted-foreground">
                This artist hasn't uploaded any work samples yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artistPosts.map(post => (
                <div key={post.id} className="group relative aspect-square rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
                  <Image
                    src={post.image_url}
                    alt={post.caption || 'Tattoo artwork'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center mr-3">
                          <Heart className="h-4 w-4 text-white mr-1" />
                          <span className="text-white text-xs">0</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 text-white mr-1" />
                          <span className="text-white text-xs">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to leave a review for this artist.
            </p>
            <Button className="mt-6">Write a Review</Button>
          </div>
        </TabsContent>
        
        {/* Info Tab */}
        <TabsContent value="info">
          <h2 className="text-2xl font-bold mb-6">Artist Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Experience & Specialties</h3>
              <p className="mb-4">{artist.bio}</p>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Styles</h4>
                <div className="flex flex-wrap gap-2">
                  {artistStyles.map(style => (
                    <span
                      key={style.id}
                      className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                    >
                      {style.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Experience</h4>
                <p>{artist.years_experience ? `${artist.years_experience} years` : 'Experience information not available'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
              <p className="mb-4">{artist.booking_info || 'Contact the artist or studio for booking details.'}</p>
              
              {studio && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Primary Studio</h4>
                  <Link href={`/directory/studios/${studio.id}`} className="flex items-center text-primary hover:underline">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{studio.name}, {studio.city}</span>
                  </Link>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                {artist.contact_info?.email && (
                  <p className="mb-2">Email: {artist.contact_info.email}</p>
                )}
                {artist.contact_info?.instagram && (
                  <a
                    href={`https://instagram.com/${artist.contact_info.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline mb-2"
                  >
                    <Instagram className="h-4 w-4 mr-1" />
                    <span>{artist.contact_info.instagram}</span>
                  </a>
                )}
                {artist.contact_info?.website && (
                  <a
                    href={artist.contact_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDetailPage;
