"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Mail, Globe, Star, ArrowLeft, Instagram, Facebook } from 'lucide-react';
import { getProperImageUrl } from '@/lib/image-url';

interface Studio {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Artist {
  id: string;
  name: string;
  slug: string;
  studio_id: string;
  styles: string[];
  image_url?: string;
}

const StudioDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [studio, setStudio] = useState<Studio | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStudioData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        // Fetch studio details
        const studiosResponse = await fetch('/api/studios');
        if (studiosResponse.ok) {
          const studiosData = await studiosResponse.json();
          const foundStudio = studiosData.find((s: Studio) => s.slug === slug);
          
          if (foundStudio) {
            setStudio(foundStudio);
            
            // Fetch artists for this studio (if you have an artists API endpoint)
            // const artistsResponse = await fetch(`/api/artists?studio_id=${foundStudio.id}`);
            // if (artistsResponse.ok) {
            //   const artistsData = await artistsResponse.json();
            //   setArtists(artistsData);
            // }
          } else {
            setError('Studio not found');
          }
        } else {
          setError('Failed to load studio data');
        }
      } catch (error) {
        console.error('Error fetching studio details:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudioData();
  }, [slug]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 bg-black text-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !studio) {
    return (
      <div className="container mx-auto px-4 py-6 bg-black text-white min-h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-400 mb-6">{error || 'Studio not found'}</p>
        <Link href="/directory">
          <Button>Back to Directory</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 bg-black text-white min-h-screen">
      {/* Back button */}
      <Link href="/directory" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Directory
      </Link>
      
      {/* Studio header */}
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <img 
          src={getProperImageUrl(studio.image_url || '/images/sample/default.jpg')} 
          alt={studio.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/sample/default.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-2">{studio.name}</h1>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{studio.address}, {studio.city}</span>
            </div>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 ml-2">(42 Reviews)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Studio content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Studio info */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="bg-gray-900 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About {studio.name}</h2>
                <p className="text-gray-300 mb-6">
                  {studio.name} is a premier tattoo studio located in {studio.city}. 
                  We specialize in various tattoo styles and provide a clean, professional environment for our clients.
                  Our team of talented artists is dedicated to bringing your vision to life with exceptional craftsmanship and attention to detail.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Studio Highlights</h3>
                <ul className="list-disc list-inside text-gray-300 mb-6">
                  <li>Professional and experienced artists</li>
                  <li>Clean and sterile environment</li>
                  <li>Custom tattoo designs</li>
                  <li>Walk-ins welcome</li>
                  <li>Private tattooing rooms</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-3">Studio Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                  <div>Monday - Friday</div>
                  <div>10:00 AM - 8:00 PM</div>
                  <div>Saturday</div>
                  <div>11:00 AM - 7:00 PM</div>
                  <div>Sunday</div>
                  <div>Closed</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="artists">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Our Artists</h2>
                {artists.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {artists.map(artist => (
                      <div key={artist.id} className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                          <img 
                            src={getProperImageUrl(artist.image_url || '/images/sample/default.jpg')} 
                            alt={artist.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/sample/default.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{artist.name}</h3>
                          <p className="text-gray-400 text-sm">Tattoo Artist</p>
                          <Link href={`/directory/artist/${artist.slug}`}>
                            <Button variant="link" className="p-0 h-auto text-blue-400">View Profile</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No artists information available at the moment.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="gallery">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Gallery</h2>
                <p className="text-gray-400">No gallery images available at the moment.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <p className="text-gray-400">No reviews available at the moment.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Contact info & booking */}
        <div>
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <ul className="space-y-4">
              {studio.phone && (
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-400" />
                  <a href={`tel:${studio.phone}`} className="text-gray-300 hover:text-white">
                    {studio.phone}
                  </a>
                </li>
              )}
              {studio.email && (
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  <a href={`mailto:${studio.email}`} className="text-gray-300 hover:text-white">
                    {studio.email}
                  </a>
                </li>
              )}
              {studio.website && (
                <li className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-gray-400" />
                  <a href={studio.website} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                    {studio.website.replace(/^https?:\/\//, '')}
                  </a>
                </li>
              )}
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-gray-300">{studio.address}, {studio.city}</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Social Media</h3>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            <p className="text-gray-300 mb-4">
              Ready to get inked? Book an appointment with one of our talented artists.
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">Book Appointment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetailPage;
