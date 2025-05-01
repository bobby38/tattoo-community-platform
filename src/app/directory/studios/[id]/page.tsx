"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Globe, ArrowLeft, Share2, Phone, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useStore from '@/store/useStore';
import { Studio, Artist, TattooStyle } from '@/store/useStore';
import { motion } from 'framer-motion';

const StudioDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { studios, artists, styles } = useStore();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [studioArtists, setStudioArtists] = useState<Artist[]>([]);
  const [studioStyles, setStudioStyles] = useState<TattooStyle[]>([]);

  useEffect(() => {
    if (params.id) {
      const studioId = parseInt(params.id as string);
      const foundStudio = studios.find(s => s.id === studioId);
      
      if (foundStudio) {
        setStudio(foundStudio);
        
        // Find artists working at this studio
        const foundArtists = artists.filter(a => a.studioId === studioId);
        setStudioArtists(foundArtists);
        
        // Find all unique styles offered by the studio's artists
        const styleIds = new Set<number>();
        foundArtists.forEach(artist => {
          artist.styles.forEach(styleId => styleIds.add(styleId));
        });
        
        const foundStyles = styles.filter(s => Array.from(styleIds).includes(s.id));
        setStudioStyles(foundStyles);
      }
    }
  }, [params.id, studios, artists, styles]);

  if (!studio) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <p className="mt-4">The studio you're looking for doesn't exist or has been removed.</p>
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

      {/* Studio Header */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <Image
          src={studio.imageUrl}
          alt={studio.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{studio.name}</h1>
            <div className="flex items-center text-white/90 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{studio.address}, {studio.city}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500/30" />
                <span className="text-sm text-white/90 ml-1">(42 reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-card rounded-lg border p-4 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Opening Hours</h3>
            <p className="text-sm text-muted-foreground">Mon-Sat: 11:00 AM - 8:00 PM</p>
            <p className="text-sm text-muted-foreground">Sun: Closed</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Contact</h3>
            <p className="text-sm text-muted-foreground">(555) 123-4567</p>
            <p className="text-sm text-muted-foreground">info@{studio.name.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Online</h3>
            <a 
              href={studio.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Visit Website
            </a>
            <p className="text-sm text-muted-foreground">@{studio.name.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
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

      {/* Tabs Section */}
      <Tabs defaultValue="artists" className="mt-10">
        <TabsList className="mb-6">
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>
        
        {/* Artists Tab */}
        <TabsContent value="artists">
          <h2 className="text-2xl font-bold mb-6">Our Artists</h2>
          
          {studioArtists.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No artists found</h3>
              <p className="text-muted-foreground">
                This studio doesn't have any artists listed yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studioArtists.map(artist => {
                const artistStyles = styles.filter(style => artist.styles.includes(style.id));
                
                return (
                  <Link 
                    key={artist.id} 
                    href={`/directory/artists/${artist.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden border shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={artist.avatarUrl}
                          alt={artist.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artistStyles.slice(0, 3).map(style => (
                            <span 
                              key={style.id}
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                            >
                              {style.name}
                            </span>
                          ))}
                          {artistStyles.length > 3 && (
                            <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              +{artistStyles.length - 3} more
                            </span>
                          )}
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
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Styles Tab */}
        <TabsContent value="styles">
          <h2 className="text-2xl font-bold mb-6">Tattoo Styles We Offer</h2>
          
          {studioStyles.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No styles found</h3>
              <p className="text-muted-foreground">
                This studio doesn't have any styles listed yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studioStyles.map(style => {
                const styleArtists = studioArtists.filter(artist => 
                  artist.styles.includes(style.id)
                );
                
                return (
                  <div key={style.id} className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={style.imageUrl}
                        alt={style.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="text-xl font-bold text-white">{style.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">{style.description}</p>
                      
                      <h4 className="font-medium text-sm mb-2">Artists specializing in this style:</h4>
                      <div className="flex flex-wrap gap-2">
                        {styleArtists.map(artist => (
                          <Link 
                            key={artist.id} 
                            href={`/directory/artists/${artist.id}`}
                            className="flex items-center bg-muted/30 hover:bg-muted/50 px-2 py-1 rounded-full text-xs transition-colors"
                          >
                            <div className="relative w-4 h-4 rounded-full overflow-hidden mr-1">
                              <Image
                                src={artist.avatarUrl}
                                alt={artist.name}
                                fill
                                className="object-cover"
                                sizes="16px"
                              />
                            </div>
                            {artist.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                Amazing studio with a great atmosphere! The staff was friendly and professional. I got a tattoo from Alex and couldn't be happier with the result. The place is clean and they follow all safety protocols. Highly recommend!
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
                Great studio with talented artists. The booking process was easy and they were accommodating with my schedule. The only reason for 4 stars is that the waiting area was a bit small and crowded when I visited. The tattoo itself turned out perfect though!
              </p>
            </div>
          </div>
        </TabsContent>
        
        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">About {studio.name}</h2>
              <p className="text-muted-foreground mb-4">
                {studio.name} is a premier tattoo studio located in the heart of {studio.city}. We pride ourselves on creating a welcoming environment where clients can collaborate with our talented artists to bring their tattoo visions to life.
              </p>
              <p className="text-muted-foreground mb-6">
                Our studio features state-of-the-art equipment and follows the highest standards of cleanliness and safety. Each of our artists specializes in different styles, ensuring that we can accommodate a wide range of tattoo preferences.
              </p>
              
              <h3 className="text-xl font-bold mb-3">Studio Amenities</h3>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                <li>Private tattoo rooms</li>
                <li>Sterilized equipment</li>
                <li>Comfortable waiting area</li>
                <li>Free consultation</li>
                <li>Aftercare products available</li>
                <li>Wi-Fi access</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Location & Hours</h2>
              
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Address</h3>
                <p className="text-muted-foreground">{studio.address}</p>
                <p className="text-muted-foreground mb-4">{studio.city}</p>
                
                <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                  {/* This would be a map in a real application */}
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Map view would appear here</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">Hours of Operation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday</span>
                    <span>11:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tuesday</span>
                    <span>11:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wednesday</span>
                    <span>11:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thursday</span>
                    <span>11:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span>11:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>11:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudioDetailPage;
