"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Star, Grid as GridIcon, List, Map, SlidersHorizontal } from 'lucide-react';
import useStore from '@/store/useStore';
import { motion } from 'framer-motion';
import { getProperImageUrl } from '@/lib/image-url';
import { getHybridImageUrl } from '@/lib/hybrid-image';
import dynamic from 'next/dynamic';
import { LocationData, convertStudiosToLocationData, convertArtistsToLocationData, filterLocationsByCity } from '@/lib/map-data';

// Import the map component dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/map/map-view'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-800 rounded-lg flex items-center justify-center">Loading map...</div>
});

// Create a client-only component for the map section
const MapSection = dynamic(() => Promise.resolve(({ 
  activeTab, 
  mapLocations, 
  selectedCity, 
  selectedLocation, 
  setSelectedLocation,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  centerMapOnLocation
}: {
  activeTab: 'artists' | 'studios';
  mapLocations: LocationData[];
  selectedCity?: string;
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  centerMapOnLocation: (location: LocationData) => void;
}) => {
  const filteredLocations = mapLocations.filter(loc => 
    activeTab === 'studios' ? loc.type === 'studio' : loc.type === 'artist'
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column with map and selected location details */}
        <div className="lg:w-2/3 space-y-4">
          {/* Map component */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <MapView 
              locations={filteredLocations}
              selectedCity={selectedCity}
              selectedLocation={selectedLocation}
              onMarkerClick={(location) => setSelectedLocation(location)}
            />
          </div>
          
          {/* Selected location details below map */}
          {selectedLocation && (
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block relative w-20 h-20 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={getHybridImageUrl(selectedLocation.imageUrl || '', selectedLocation.type, selectedLocation.id)}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    <MapPin className="inline-block mr-1" size={14} />
                    {selectedLocation.address || `${selectedLocation.city}, ${selectedLocation.country}`}
                  </p>
                  <Link 
                    href={`/directory/${selectedLocation.type}/${selectedLocation.slug || selectedLocation.id}`}
                    passHref
                  >
                    <Button size="sm" className="mt-2">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Scrollable list of locations */}
        <div className="lg:w-1/3 bg-gray-900 rounded-lg p-4">
          <div>
            <h3 className="font-medium text-lg mb-2">
              {activeTab === 'studios' ? 'All Studios' : 'All Artists'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Click on a {activeTab === 'studios' ? 'studio' : 'artist'} to see details
            </p>
            
            {/* List container with fixed height and scrolling */}
            <div className="h-[600px] overflow-y-auto pr-2 space-y-2">
              {filteredLocations
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((location) => (
                  <div 
                    key={`${location.type}-${location.id}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLocation && selectedLocation.id === location.id && selectedLocation.type === location.type
                        ? 'bg-gray-700'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3" onClick={() => setSelectedLocation(location)}>
                      <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                        {location.imageUrl ? (
                          <img 
                            src={getHybridImageUrl(location.imageUrl, location.type, location.id)}
                            alt={location.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {location.type === 'studio' ? '🔥' : '💀'}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-sm truncate">{location.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{location.city}, {location.country}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs flex items-center gap-1 text-blue-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              centerMapOnLocation(location);
                            }}
                          >
                            <Map size={12} />
                            Show on Map
                          </Button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${location.type === 'studio' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Pagination controls */}
            {filteredLocations.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {Math.ceil(filteredLocations.length / itemsPerPage)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredLocations.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredLocations.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Studios
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Artists
        </div>
      </div>
    </div>
  );
}), { ssr: false });

// Define interfaces for data types
interface Studio {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  lat: string | number;
  lng: string | number;
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
  bio?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const DirectoryPage = () => {
  const [activeTab, setActiveTab] = useState<'artists' | 'studios'>('studios');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [mapLocations, setMapLocations] = useState<LocationData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const itemsPerPage = 10;

  const { 
    styles, 
    selectedStyles, 
    selectedTribes, 
    locationFilter,
    setStudios: setStoreStudios
  } = useStore();

  // Fetch studios and artists data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch studios
        const studiosResponse = await fetch('/api/studios');
        if (studiosResponse.ok) {
          const studiosData = await studiosResponse.json();
          setStudios(studiosData);
          setStoreStudios(studiosData);
        } else {
          console.error('Failed to fetch studios:', studiosResponse.status);
        }
        
        // Fetch artists
        const artistsResponse = await fetch('/api/artists');
        if (artistsResponse.ok) {
          const artistsData = await artistsResponse.json();
          setArtists(artistsData);
        } else {
          console.error('Failed to fetch artists:', artistsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching directory data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [setStoreStudios]);

  // Filter studios based on search term and selected city
  const filteredStudios = studios.filter(studio => {
    const matchesSearch = searchTerm === '' || 
      studio.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = !selectedCity || studio.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  // Filter artists based on search term and selected city
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = searchTerm === '' || 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Find the studio this artist belongs to
    const artistStudio = studios.find(studio => studio.id === artist.studio_id);
    const matchesCity = !selectedCity || (artistStudio && artistStudio.city === selectedCity);
    
    return matchesSearch && matchesCity;
  });

  // Update map locations when studios, artists, or selected city changes
  useEffect(() => {
    if (studios.length > 0 || artists.length > 0) {
      const studioLocations = convertStudiosToLocationData(studios);
      const artistLocations = convertArtistsToLocationData(artists, studios);
      
      // Combine and filter locations
      const allLocations = [...studioLocations, ...artistLocations];
      const filteredLocations = filterLocationsByCity(allLocations, selectedCity);
      
      setMapLocations(filteredLocations);
    }
  }, [studios, artists, selectedCity]);

  // Function to center the map on a specific location
  const centerMapOnLocation = (location: LocationData) => {
    setSelectedLocation(location);
    // The MapView component will handle centering on this location
  };

  // Toggle filters sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto pb-12">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Tattoo Directory</h1>
        <p className="text-gray-400 mb-6">
          Find talented tattoo artists and studios near you. Filter by style, location, and more to find the perfect match for your next tattoo.
        </p>
        
        {/* View mode and search controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                placeholder="Search by name..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('map')}
              className="h-8 w-8"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            className="md:hidden flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Filters
          </Button>
        </div>
        
        {/* Location filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCity === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCity(undefined)}
            className="text-xs"
          >
            All Locations
          </Button>
          <Button
            variant={selectedCity === 'Singapore' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCity('Singapore')}
            className="text-xs"
          >
            Singapore
          </Button>
          <Button
            variant={selectedCity === 'Kuala Lumpur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCity('Kuala Lumpur')}
            className="text-xs"
          >
            Kuala Lumpur
          </Button>
          <Button
            variant={selectedCity === 'Penang' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCity('Penang')}
            className="text-xs"
          >
            Penang
          </Button>
        </div>
        
        {/* Main content area with filters sidebar and results */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile unless toggled */}
          <div className={`md:w-64 bg-gray-900 p-4 rounded-lg ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Filters</h2>
              <Button variant="link" className="text-xs p-0 h-auto" onClick={() => {}}>
                Clear All
              </Button>
            </div>
            
            {/* Filter components would go here */}
            <div className="space-y-4">
              {/* Location filter */}
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Location
                </h3>
                <Input
                  placeholder="City or zip code"
                  className="bg-gray-800 border-gray-700 mb-2"
                />
                <div className="space-y-1">
                  <Button
                    variant={selectedCity === 'Singapore' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCity('Singapore')}
                    className="w-full justify-start text-sm h-8"
                  >
                    Singapore
                  </Button>
                  <Button
                    variant={selectedCity === 'Kuala Lumpur' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCity('Kuala Lumpur')}
                    className="w-full justify-start text-sm h-8"
                  >
                    Kuala Lumpur
                  </Button>
                  <Button
                    variant={selectedCity === 'Penang' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCity('Penang')}
                    className="w-full justify-start text-sm h-8"
                  >
                    Penang
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-grow">
            {/* Map View */}
            {viewMode === 'map' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {activeTab === 'studios' ? 'Studio Locations' : 'Artist Locations'}
                  </h2>
                  
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'artists' | 'studios')}>
                    <TabsList className="bg-gray-800">
                      <TabsTrigger value="studios">Studios</TabsTrigger>
                      <TabsTrigger value="artists">Artists</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {isLoading ? (
                  <div className="w-full h-[600px] bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Loading map data...</p>
                    </div>
                  </div>
                ) : (
                  <MapSection 
                    activeTab={activeTab}
                    mapLocations={mapLocations}
                    selectedCity={selectedCity}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    centerMapOnLocation={centerMapOnLocation}
                  />
                )}
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'artists' | 'studios')}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="studios">Studios</TabsTrigger>
                    <TabsTrigger value="artists">Artists</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="studios">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-0">
                            <div className="h-48 bg-gray-700 animate-pulse"></div>
                            <div className="p-4">
                              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3 mb-4"></div>
                              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredStudios.map((studio) => (
                        <motion.div
                          key={studio.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="relative h-48 bg-gray-800">
                              {/* Always use placeholder approach instead of conditional rendering */}
                              <div className="w-full h-full flex items-center justify-center bg-gray-800 absolute">
                                <div className="text-gray-600 text-center p-4">
                                  <div className="text-3xl mb-2">🔥</div>
                                  <div>{studio.name}</div>
                                </div>
                              </div>
                              
                              {/* Use hybrid image approach */}
                              <img 
                                src={getHybridImageUrl(studio.image_url, 'studio', studio.id)}
                                alt={studio.name}
                                className="w-full h-full object-cover absolute z-10"
                                onError={(e) => {
                                  const target =e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none'; // Hide the image on error
                                }}
                              />
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                              <h3 className="text-xl font-bold mb-1">{studio.name}</h3>
                              <p className="text-gray-400 text-sm mb-2">
                                <MapPin className="inline-block mr-1" size={14} />
                                {studio.city || 'Location not specified'}
                              </p>
                              <div className="flex items-center mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={14}
                                    className={`${
                                      star <= 4 ? 'text-yellow-400' : 'text-gray-600'
                                    }`}
                                    fill={star <= 4 ? 'currentColor' : 'none'}
                                  />
                                ))}
                                <span className="text-gray-400 text-xs ml-2">(42)</span>
                              </div>
                              <div className="mt-auto">
                                <Link href={`/directory/studio/${studio.slug || studio.id}`}>
                                  <Button className="w-full" size="sm">
                                    View Profile
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredStudios.map((studio) => (
                        <motion.div
                          key={studio.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 relative h-48 md:h-auto bg-gray-800">
                              {/* Placeholder */}
                              <div className="w-full h-full flex items-center justify-center bg-gray-800 absolute">
                                <div className="text-gray-600 text-center p-4">
                                  <div className="text-3xl mb-2">🔥</div>
                                  <div>{studio.name}</div>
                                </div>
                              </div>
                              
                              {/* Image */}
                              <img 
                                src={getHybridImageUrl(studio.image_url, 'studio', studio.id)}
                                alt={studio.name}
                                className="w-full h-full object-cover absolute z-10"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="p-4 md:p-6 flex-grow">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-bold mb-1">{studio.name}</h3>
                                  <p className="text-gray-400 text-sm mb-2">
                                    <MapPin className="inline-block mr-1" size={14} />
                                    {studio.city || 'Location not specified'}
                                  </p>
                                  <div className="flex items-center mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={14}
                                        className={`${
                                          star <= 4 ? 'text-yellow-400' : 'text-gray-600'
                                        }`}
                                        fill={star <= 4 ? 'currentColor' : 'none'}
                                      />
                                    ))}
                                    <span className="text-gray-400 text-xs ml-2">(42)</span>
                                  </div>
                                </div>
                                <div className="md:text-right">
                                  <Link href={`/directory/studio/${studio.slug || studio.id}`}>
                                    <Button size="sm">View Profile</Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="artists">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-0">
                            <div className="h-48 bg-gray-700 animate-pulse"></div>
                            <div className="p-4">
                              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3 mb-4"></div>
                              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArtists.map((artist) => (
                        <motion.div
                          key={artist.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="relative h-48 bg-gray-800">
                              {/* Always use placeholder approach instead of conditional rendering */}
                              <div className="w-full h-full flex items-center justify-center bg-gray-800 absolute">
                                <div className="text-gray-600 text-center p-4">
                                  <div className="text-3xl mb-2">💀</div>
                                  <div>{artist.name}</div>
                                </div>
                              </div>
                              
                              {/* Use hybrid image approach */}
                              <img 
                                src={getHybridImageUrl(artist.image_url, 'artist', artist.id)}
                                alt={artist.name}
                                className="w-full h-full object-cover absolute z-10"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none'; // Hide the image on error
                                }}
                              />
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                              <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                              <p className="text-gray-400 text-sm mb-2">
                                {studios.find(s => s.id === artist.studio_id)?.name || 'Independent Artist'}
                              </p>
                              <p className="text-gray-400 text-sm mb-4">
                                <MapPin className="inline-block mr-1" size={14} />
                                {studios.find(s => s.id === artist.studio_id)?.city || 'Location not specified'}
                              </p>
                              <div className="mt-auto">
                                <Link href={`/directory/artist/${artist.slug || artist.id}`}>
                                  <Button className="w-full" size="sm">
                                    View Profile
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredArtists.map((artist) => (
                        <motion.div
                          key={artist.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 relative h-48 md:h-auto bg-gray-800">
                              {/* Placeholder */}
                              <div className="w-full h-full flex items-center justify-center bg-gray-800 absolute">
                                <div className="text-gray-600 text-center p-4">
                                  <div className="text-3xl mb-2">💀</div>
                                  <div>{artist.name}</div>
                                </div>
                              </div>
                              
                              {/* Image */}
                              <img 
                                src={getHybridImageUrl(artist.image_url, 'artist', artist.id)}
                                alt={artist.name}
                                className="w-full h-full object-cover absolute z-10"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="p-4 md:p-6 flex-grow">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                                  <p className="text-gray-400 text-sm mb-2">
                                    {studios.find(s => s.id === artist.studio_id)?.name || 'Independent Artist'}
                                  </p>
                                  <p className="text-gray-400 text-sm mb-4">
                                    <MapPin className="inline-block mr-1" size={14} />
                                    {studios.find(s => s.id === artist.studio_id)?.city || 'Location not specified'}
                                  </p>
                                </div>
                                <div className="md:text-right">
                                  <Link href={`/directory/artist/${artist.slug || artist.id}`}>
                                    <Button size="sm">View Profile</Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
