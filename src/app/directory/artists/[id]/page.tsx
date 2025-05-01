"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Instagram, MapPin, Star, Calendar, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useStore from '@/store/useStore';
import { Artist, Studio, Post, TattooStyle } from '@/store/useStore';
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
        const foundStudio = studios.find(s => s.id === foundArtist.studioId);
        if (foundStudio) {
          setStudio(foundStudio);
        }
        
        // Find the styles
        const foundStyles = styles.filter(s => foundArtist.styles.includes(s.id));
        setArtistStyles(foundStyles);
        
        // Find posts by this artist
        const foundPosts = posts.filter(p => p.artistId === artistId);
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
              src={artist.avatarUrl}
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
              
              <a
                href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-4 w-4 mr-1" />
                <span>{artist.instagram}</span>
              </a>
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
                    src={post.imageUrl}
                    alt={post.caption}
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
                          <span className="text-white text-xs">{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 text-white mr-1" />
                          <span className="text-white text-xs">12</span>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Client Reviews</h2>
            <Button variant="outline" size="sm">
              Write a Review
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Sample Reviews */}
            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg"
                      alt="Reviewer"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Emily R.</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 months ago</span>
              </div>
              <p className="text-muted-foreground">
                Amazing experience! {artist.name} was professional, talented, and made me feel completely comfortable. The tattoo came out better than I could have imagined. Highly recommend!
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_1280.jpg"
                      alt="Reviewer"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Jason K.</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500/30" />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">3 months ago</span>
              </div>
              <p className="text-muted-foreground">
                Great artist with a unique style. The design process was collaborative and {artist.name} really listened to what I wanted. The only reason for 4 stars is that the appointment ran a bit late, but the result was worth the wait.
              </p>
            </div>
          </div>
        </TabsContent>
        
        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">About {artist.name}</h2>
              <p className="text-muted-foreground mb-4">{artist.bio}</p>
              <p className="text-muted-foreground mb-6">
                With years of experience and a passion for creating unique, personalized tattoos, {artist.name} specializes in {artistStyles.map(s => s.name).join(', ')} styles. Each piece is carefully designed to reflect the client's vision and personality.
              </p>
              
              <h3 className="text-xl font-bold mb-3">Specialties</h3>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                {artistStyles.map(style => (
                  <li key={style.id}>{style.name} - {style.description}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Booking Information</h2>
              
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Studio Location</h3>
                {studio && (
                  <>
                    <p className="font-medium">{studio.name}</p>
                    <p className="text-muted-foreground">{studio.address}</p>
                    <p className="text-muted-foreground mb-4">{studio.city}</p>
                    <Link href={`/directory/studios/${studio.id}`}>
                      <Button variant="outline" size="sm">
                        View Studio
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">Availability</h3>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>Currently booking 2-3 weeks in advance</span>
                </div>
                <Button className="w-full">Check Available Dates</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDetailPage;
