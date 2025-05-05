"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Star, Grid as GridIcon, List } from 'lucide-react';
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

const StudiosPage = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/studios');
        
        if (!response.ok) {
          throw new Error(`Error fetching studios: ${response.status}`);
        }
        
        const data = await response.json();
        setStudios(data);
        setFilteredStudios(data);
      } catch (err) {
        console.error('Failed to fetch studios:', err);
        setError('Failed to load tattoo studios. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudios();
  }, []);
  
  // Filter studios based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudios(studios);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = studios.filter(studio => 
      studio.name.toLowerCase().includes(term) || 
      studio.city.toLowerCase().includes(term) || 
      (studio.address && studio.address.toLowerCase().includes(term))
    );
    
    setFilteredStudios(filtered);
  }, [searchTerm, studios]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Tattoo Directory</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 bg-black text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tattoo Directory</h1>
        <p className="text-gray-400">
          Find talented tattoo artists and studios near you. Filter by style, location, and more to 
          find the perfect match for your next tattoo.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Filters</h2>
            <Button variant="link" className="text-sm text-blue-400 p-0">Clear All</Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              placeholder="Search studios..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="border-t border-gray-800 py-4">
            <h3 className="font-medium mb-2 flex justify-between items-center">
              <span>Location</span>
              <span className="text-xs">▼</span>
            </h3>
            <Input 
              placeholder="City or zip code" 
              className="mb-3 bg-gray-800 border-gray-700"
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="bg-gray-800 text-xs">New York</Button>
              <Button size="sm" variant="outline" className="bg-gray-800 text-xs">LA</Button>
              <Button size="sm" variant="outline" className="bg-gray-800 text-xs">Chicago</Button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 py-4">
            <h3 className="font-medium mb-2 flex justify-between items-center">
              <span>Styles</span>
              <span className="text-xs">▼</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="style1" className="mr-2" />
                <label htmlFor="style1">Traditional</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="style2" className="mr-2" />
                <label htmlFor="style2">Neo-Traditional</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="style3" className="mr-2" />
                <label htmlFor="style3">Realism</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="style4" className="mr-2" />
                <label htmlFor="style4">Watercolor</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="style5" className="mr-2" />
                <label htmlFor="style5">Blackwork</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="style6" className="mr-2" />
                <label htmlFor="style6">Japanese</label>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 py-4">
            <h3 className="font-medium mb-2 flex justify-between items-center">
              <span>Tribes</span>
              <span className="text-xs">▼</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="tribe1" className="mr-2" />
                <label htmlFor="tribe1">Traditional Enthusiasts</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="tribe2" className="mr-2" />
                <label htmlFor="tribe2">Polynesian Collective</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="tribe3" className="mr-2" />
                <label htmlFor="tribe3">Minimalist Ink</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="tribe4" className="mr-2" />
                <label htmlFor="tribe4">Color Explosion</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="mb-4">
            <Tabs defaultValue="studios">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-gray-900">
                  <TabsTrigger value="artists">Artists</TabsTrigger>
                  <TabsTrigger value="studios">Studios</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <GridIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="studios">
                {filteredStudios.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">No studios found</h2>
                    <p className="text-gray-400 mb-6">Try changing your search term or check back later.</p>
                    <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudios.map((studio) => (
                      <Card key={studio.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                        <div className="relative h-48">
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
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-xl font-bold mb-1">{studio.name}</h3>
                          <div className="flex items-center text-gray-400 text-sm mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{studio.address}, {studio.city}</span>
                          </div>
                          <div className="flex items-center mb-3">
                            {[1, 2, 3, 4].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-gray-400 text-xs ml-2">(42)</span>
                            <span className="text-gray-400 text-xs ml-2">• 2 Artists</span>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-1">Featured Artists:</p>
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                            </div>
                          </div>
                          <div className="flex items-center mb-4">
                            <a href={studio.website} target="_blank" rel="noopener noreferrer" className="text-orange-500 text-sm flex items-center">
                              <span className="mr-1">•</span> Website
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Book Appointment</Button>
                            <Link href={`/studios/${studio.slug}`} passHref>
                              <Button variant="outline" className="flex-1">View Studio</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="artists">
                <div className="text-center py-12">
                  <p className="text-gray-400">Switch to the Studios tab to view tattoo studios.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudiosPage;
