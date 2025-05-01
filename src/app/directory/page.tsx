"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FilterSidebar from '@/components/ui/filter-sidebar';
import ArtistCard from '@/components/ui/artist-card';
import StudioCard from '@/components/ui/studio-card';
import { Button } from '@/components/ui/button';
import { Grid, List, MapPin, SlidersHorizontal } from 'lucide-react';
import useStore from '@/store/useStore';
import { motion } from 'framer-motion';

const DirectoryPage = () => {
  const [activeTab, setActiveTab] = useState<'artists' | 'studios'>('artists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    artists, 
    studios, 
    styles, 
    selectedStyles, 
    selectedTribes, 
    locationFilter 
  } = useStore();

  // Filter artists based on selected filters
  const filteredArtists = artists.filter(artist => {
    // Filter by style
    if (selectedStyles.length > 0 && !artist.styles.some(styleId => selectedStyles.includes(styleId))) {
      return false;
    }
    
    // Filter by location (studio's city)
    if (locationFilter) {
      const artistStudio = studios.find(studio => studio.id === artist.studioId);
      if (!artistStudio || !artistStudio.city.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  // Filter studios based on selected filters
  const filteredStudios = studios.filter(studio => {
    // Filter by location
    if (locationFilter && !studio.city.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    
    // Filter by style (if any artist in the studio has the selected style)
    if (selectedStyles.length > 0) {
      const studioArtists = artists.filter(artist => artist.studioId === studio.id);
      const hasMatchingStyle = studioArtists.some(artist => 
        artist.styles.some(styleId => selectedStyles.includes(styleId))
      );
      
      if (!hasMatchingStyle) {
        return false;
      }
    }
    
    return true;
  });

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Close filters when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tattoo Directory</h1>
          <p className="text-muted-foreground max-w-2xl">
            Find talented tattoo artists and studios near you. Filter by style, location, and more to find the perfect match for your next tattoo.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={toggleFilters}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="border rounded-md p-1 flex">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <motion.div
          className={`md:w-1/4 ${
            showFilters ? 'block' : 'hidden'
          } md:block fixed md:relative inset-0 z-40 md:z-0 bg-background/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full md:h-auto overflow-auto p-4 md:p-0">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 md:hidden"
              onClick={toggleFilters}
            >
              Close
            </Button>
            <FilterSidebar type={activeTab} className="sticky top-24" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Tabs
            defaultValue="artists"
            onValueChange={(value) => setActiveTab(value as 'artists' | 'studios')}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="artists" className="flex-1">Artists</TabsTrigger>
              <TabsTrigger value="studios" className="flex-1">Studios</TabsTrigger>
            </TabsList>

            {/* Artists Tab */}
            <TabsContent value="artists">
              {filteredArtists.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No artists found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find more results.
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredArtists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      studio={studios.find((studio) => studio.id === artist.studioId)}
                      styles={styles}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Studios Tab */}
            <TabsContent value="studios">
              {filteredStudios.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No studios found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find more results.
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio}
                      artists={artists.filter(
                        (artist) => artist.studioId === studio.id
                      )}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
