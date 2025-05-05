"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Award, 
  Users,
  Filter,
  Calendar,
  Trophy,
  Star,
  MapPin
} from 'lucide-react';

// Define Award interface
interface Award {
  id: number;
  name: string;
  organizer: string;
  criteria: string;
  prestige_level: string;
  frequency: string;
  past_winners: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Define NotableFigure interface
interface NotableFigure {
  id: number;
  name: string;
  region: string;
  specialty: string;
  contributions: string;
  awards: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Client-only component to avoid hydration issues
const AwardsContent = () => {
  const [activeTab, setActiveTab] = useState<'awards' | 'figures'>('awards');
  const [awards, setAwards] = useState<Award[]>([]);
  const [notableFigures, setNotableFigures] = useState<NotableFigure[]>([]);
  const [isLoadingAwards, setIsLoadingAwards] = useState(true);
  const [isLoadingFigures, setIsLoadingFigures] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePrestigeLevel, setActivePrestigeLevel] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  // Fetch awards data
  useEffect(() => {
    async function fetchAwards() {
      try {
        setIsLoadingAwards(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (activePrestigeLevel) params.append('prestige_level', activePrestigeLevel);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/awards?${params.toString()}`);
        const data = await response.json();
        
        if (data.awards) {
          setAwards(data.awards);
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
      } finally {
        setIsLoadingAwards(false);
      }
    }
    
    fetchAwards();
  }, [activePrestigeLevel, searchTerm]);
  
  // Fetch notable figures data
  useEffect(() => {
    async function fetchNotableFigures() {
      try {
        setIsLoadingFigures(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (activeRegion) params.append('region', activeRegion);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/notable-figures?${params.toString()}`);
        const data = await response.json();
        
        if (data.notable_figures) {
          setNotableFigures(data.notable_figures);
        }
      } catch (error) {
        console.error('Error fetching notable figures:', error);
      } finally {
        setIsLoadingFigures(false);
      }
    }
    
    fetchNotableFigures();
  }, [activeRegion, searchTerm]);
  
  // Get unique prestige levels and regions for filters
  const prestigeLevels = Array.from(new Set(awards.map(award => award.prestige_level))).sort();
  const regions = Array.from(new Set(notableFigures.map(figure => figure.region))).sort();
  
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
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        
        <h1 className="text-4xl font-bold mb-4">Tattoo Awards & Notable Figures</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Explore prestigious tattoo awards and learn about influential figures who have shaped the tattoo industry and art form throughout history.
        </p>
      </div>
      
      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'awards' | 'figures')}
        className="mb-8"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="awards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Awards
          </TabsTrigger>
          <TabsTrigger value="figures" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Notable Figures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="awards" className="mt-6">
          {/* Search and Filters for Awards */}
          <div className="mb-8 space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search awards..." 
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            {/* Prestige Level Filter */}
            <div>
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Filter by Prestige Level</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activePrestigeLevel === null ? "default" : "outline"} 
                  onClick={() => setActivePrestigeLevel(null)}
                  className="mb-2"
                >
                  All Levels
                </Button>
                
                {prestigeLevels.map(level => (
                  <Button 
                    key={level} 
                    variant={activePrestigeLevel === level ? "default" : "outline"}
                    onClick={() => setActivePrestigeLevel(level)}
                    className="mb-2"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Awards List */}
          {isLoadingAwards ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {awards.length > 0 ? (
                awards.map((award) => (
                  <motion.div key={award.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold">{award.name}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {award.frequency}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Trophy className="h-4 w-4 mr-1" />
                          <span>{award.organizer}</span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-1">Criteria:</h4>
                          <p className="text-sm text-muted-foreground">{award.criteria}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-1">Prestige Level:</h4>
                          <p className="text-sm text-muted-foreground">{award.prestige_level}</p>
                        </div>
                        
                        {award.past_winners && award.past_winners.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-1">Past Winners:</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {award.past_winners.map((winner, index) => (
                                <li key={index}>{winner}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No awards found</h3>
                  <p className="text-muted-foreground">
                    Try changing your search terms or filters.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="figures" className="mt-6">
          {/* Search and Filters for Notable Figures */}
          <div className="mb-8 space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notable figures..." 
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            {/* Region Filter */}
            <div>
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Filter by Region</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeRegion === null ? "default" : "outline"} 
                  onClick={() => setActiveRegion(null)}
                  className="mb-2"
                >
                  All Regions
                </Button>
                
                {regions.map(region => (
                  <Button 
                    key={region} 
                    variant={activeRegion === region ? "default" : "outline"}
                    onClick={() => setActiveRegion(region)}
                    className="mb-2"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Notable Figures List */}
          {isLoadingFigures ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {notableFigures.length > 0 ? (
                notableFigures.map((figure) => (
                  <motion.div key={figure.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold">{figure.name}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {figure.specialty}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{figure.region}</span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-1">Contributions:</h4>
                          <p className="text-sm text-muted-foreground">{figure.contributions}</p>
                        </div>
                        
                        {figure.awards && figure.awards.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-1">Awards:</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {figure.awards.map((award, index) => (
                                <li key={index}>{award}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No notable figures found</h3>
                  <p className="text-muted-foreground">
                    Try changing your search terms or filters.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main component that uses client-side only rendering
export default function AwardsPage() {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
        <AwardsContent />
      )}
    </div>
  );
}
